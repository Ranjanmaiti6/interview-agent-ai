import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Users,
} from "lucide-react";

const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

console.log("SOCKET URL:", SOCKET_URL);


export default function MeetingRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const socketRef = useRef(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const [meetingStatus, setMeetingStatus] =
    useState("connecting");

  const [participantCount, setParticipantCount] =
    useState(0);

  const [micEnabled, setMicEnabled] =
    useState(true);

  const [cameraEnabled, setCameraEnabled] =
    useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // Start camera and microphone
  // ==========================================

  useEffect(() => {
    let mounted = true;

   const startMedia = async () => {
  let stream = null;

  // Try camera + microphone
  try {
    stream =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

    localStreamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject =
        stream;
    }

    setCameraEnabled(true);
    setMicEnabled(true);

    console.log(
      "Camera and microphone available."
    );

    return;
  } catch (error) {
    console.warn(
      "Camera + microphone unavailable:",
      error
    );
  }


  // Try microphone only
  try {
    stream =
      await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

    localStreamRef.current = stream;

    setCameraEnabled(false);
    setMicEnabled(true);

    console.log(
      "Microphone available. Camera unavailable."
    );

    return;
  } catch (error) {
    console.warn(
      "Microphone unavailable:",
      error
    );
  }


  // No camera or microphone
  localStreamRef.current = null;

  setCameraEnabled(false);
  setMicEnabled(false);

  console.log(
    "No camera or microphone available. Continuing without media."
  );
};

    startMedia();

    return () => {
      mounted = false;

      if (localStreamRef.current) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        localStreamRef.current = null;
      }
    };
  }, []);


  // ==========================================
  // Create WebRTC peer connection
  // ==========================================

  const createPeerConnection = () => {
    if (peerConnectionRef.current) {
      return peerConnectionRef.current;
    }

    const socket = socketRef.current;

    if (!socket) {
      return null;
    }

    const peer =
      new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });


    // Add local camera and microphone
    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => {
          peer.addTrack(
            track,
            localStreamRef.current
          );
        });
    }


    // Receive remote stream
    peer.ontrack = (event) => {
      console.log(
        "Remote stream received"
      );

      if (
        remoteVideoRef.current &&
        event.streams[0]
      ) {
        remoteVideoRef.current.srcObject =
          event.streams[0];

        remoteVideoRef.current
          .play()
          .catch(() => {});
      }
    };


    // Send ICE candidates
    peer.onicecandidate = (event) => {
      if (!event.candidate) {
        return;
      }

      socket.emit(
        "ice-candidate",
        {
          meetingId: id,
          candidate: event.candidate,
        }
      );
    };


    peer.onconnectionstatechange = () => {
      console.log(
        "WebRTC state:",
        peer.connectionState
      );

      if (
        peer.connectionState ===
          "failed" ||
        peer.connectionState ===
          "closed"
      ) {
        if (
          remoteVideoRef.current
        ) {
          remoteVideoRef.current.srcObject =
            null;
        }
      }
    };


    peerConnectionRef.current =
      peer;

    return peer;
  };


  // ==========================================
  // Socket connection
  // ==========================================

  useEffect(() => {
    if (!id) {
      setError("Meeting ID is missing.");
      return;
    }

    const socket = io(SOCKET_URL);

    socketRef.current = socket;


    // ========================================
    // Connected
    // ========================================

    socket.on("connect", () => {
      console.log(
        "Socket connected:",
        socket.id
      );

      socket.emit(
        "join-meeting",
        id
      );
    });


    // ========================================
    // Meeting status
    // ========================================

    socket.on(
      "meeting-status",
      (data) => {
        if (!data) {
          return;
        }

        if (
          data.status === "waiting"
        ) {
          setMeetingStatus(
            "waiting"
          );

          setParticipantCount(1);
        }

        if (
          data.status ===
          "in-progress"
        ) {
          setMeetingStatus(
            "in-progress"
          );

          setParticipantCount(2);
        }
      }
    );


    // ========================================
    // Another participant joined
    // ========================================

    socket.on(
      "user-joined",
      async () => {
        console.log(
          "Another participant joined."
        );

        setMeetingStatus(
          "in-progress"
        );

        setParticipantCount(2);

        try {
          const peer =
            createPeerConnection();

          if (!peer) {
            return;
          }

          const offer =
            await peer.createOffer();

          await peer.setLocalDescription(
            offer
          );

          socket.emit(
            "offer",
            {
              meetingId: id,
              offer,
            }
          );
        } catch (err) {
          console.error(
            "Offer error:",
            err
          );
        }
      }
    );


    // ========================================
    // Receive offer
    // ========================================

    socket.on(
      "offer",
      async ({ offer }) => {
        try {
          const peer =
            createPeerConnection();

          if (!peer) {
            return;
          }

          await peer.setRemoteDescription(
            new RTCSessionDescription(
              offer
            )
          );

          const answer =
            await peer.createAnswer();

          await peer.setLocalDescription(
            answer
          );

          socket.emit(
            "answer",
            {
              meetingId: id,
              answer,
            }
          );
        } catch (err) {
          console.error(
            "Answer error:",
            err
          );
        }
      }
    );


    // ========================================
    // Receive answer
    // ========================================

    socket.on(
      "answer",
      async ({ answer }) => {
        try {
          const peer =
            peerConnectionRef.current;

          if (!peer) {
            return;
          }

          await peer.setRemoteDescription(
            new RTCSessionDescription(
              answer
            )
          );
        } catch (err) {
          console.error(
            "Remote description error:",
            err
          );
        }
      }
    );


    // ========================================
    // Receive ICE candidate
    // ========================================

    socket.on(
      "ice-candidate",
      async ({ candidate }) => {
        try {
          const peer =
            peerConnectionRef.current;

          if (!peer) {
            return;
          }

          await peer.addIceCandidate(
            new RTCIceCandidate(
              candidate
            )
          );
        } catch (err) {
          console.error(
            "ICE candidate error:",
            err
          );
        }
      }
    );


    // ========================================
    // Participant left
    // ========================================

    socket.on(
      "user-left",
      () => {
        console.log(
          "Participant left."
        );

        setMeetingStatus(
          "waiting"
        );

        setParticipantCount(1);

        if (
          remoteVideoRef.current
        ) {
          remoteVideoRef.current.srcObject =
            null;
        }

        if (
          peerConnectionRef.current
        ) {
          peerConnectionRef.current.close();

          peerConnectionRef.current =
            null;
        }
      }
    );


    // ========================================
    // Socket error
    // ========================================

    socket.on(
      "connect_error",
      (err) => {
        console.error(
          "Socket connection error:",
          err
        );

        setError(
          "Unable to connect to the meeting server."
        );
      }
    );


    // ========================================
    // Cleanup
    // ========================================

    return () => {
      socket.emit(
        "leave-meeting",
        id
      );

      socket.disconnect();

      if (
        peerConnectionRef.current
      ) {
        peerConnectionRef.current.close();

        peerConnectionRef.current =
          null;
      }

      socketRef.current = null;
    };
  }, [id]);


  // ==========================================
  // Toggle microphone
  // ==========================================

  const toggleMic = () => {
    const stream =
      localStreamRef.current;

    if (!stream) {
      return;
    }

    const audioTrack =
      stream.getAudioTracks()[0];

    if (!audioTrack) {
      return;
    }

    audioTrack.enabled =
      !audioTrack.enabled;

    setMicEnabled(
      audioTrack.enabled
    );
  };


  // ==========================================
  // Toggle camera
  // ==========================================

  const toggleCamera = () => {
    const stream =
      localStreamRef.current;

    if (!stream) {
      return;
    }

    const videoTrack =
      stream.getVideoTracks()[0];

    if (!videoTrack) {
      return;
    }

    videoTrack.enabled =
      !videoTrack.enabled;

    setCameraEnabled(
      videoTrack.enabled
    );
  };


  // ==========================================
  // End meeting
  // ==========================================

  const endMeeting = () => {
    console.log(
      "Ending meeting..."
    );


    // Tell other participant
    if (socketRef.current) {
      socketRef.current.emit(
        "leave-meeting",
        id
      );

      socketRef.current.disconnect();

      socketRef.current = null;
    }


    // Close WebRTC
    if (
      peerConnectionRef.current
    ) {
      peerConnectionRef.current.close();

      peerConnectionRef.current =
        null;
    }


    // Stop camera + microphone
    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      localStreamRef.current = null;
    }


    // Clear video
    if (localVideoRef.current) {
      localVideoRef.current.srcObject =
        null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject =
        null;
    }


    navigate("/meetings");
  };


  // ==========================================
  // Status text
  // ==========================================

  const getStatusText = () => {
    if (
      meetingStatus === "waiting"
    ) {
      return "Waiting for participant";
    }

    if (
      meetingStatus ===
      "in-progress"
    ) {
      return "Meeting in progress";
    }

    return "Connecting...";
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* Header */}

      <header className="border-b border-slate-800 bg-slate-900">

        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-purple-400 text-sm uppercase tracking-wider font-semibold">
                Video Meeting
              </p>

              <h1 className="text-2xl font-bold mt-1">
                Meeting Room
              </h1>

            </div>

            <div className="flex items-center gap-3 text-slate-300">

              <Users size={18} />

              {participantCount} participant
              {participantCount === 1
                ? ""
                : "s"}

            </div>

          </div>

        </div>

      </header>


      {/* Main */}

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">

        {/* Status */}

        <div className="flex justify-center mb-8">

          <div
            className={`px-5 py-2 rounded-full font-semibold ${
              meetingStatus ===
              "in-progress"
                ? "bg-green-500/10 text-green-400"
                : meetingStatus ===
                  "waiting"
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            {getStatusText()}
          </div>

        </div>


        {/* Error */}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-center">
            {error}
          </div>
        )}


        {/* Video Grid */}

        <div className="grid md:grid-cols-2 gap-6">


          {/* Your Video */}

          <div className="aspect-video bg-black border border-slate-800 rounded-2xl overflow-hidden relative">

            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${
                cameraEnabled
                  ? ""
                  : "hidden"
              }`}
            />

            {!cameraEnabled && (
              <div className="absolute inset-0 flex items-center justify-center">

                <div className="text-center">

                  <VideoOff
                    size={48}
                    className="mx-auto text-slate-500"
                  />

                  <p className="text-slate-400 mt-3">
                    Camera is off
                  </p>

                </div>

              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 rounded-lg text-sm">
              You
            </div>

          </div>


          {/* Participant Video */}

          <div className="aspect-video bg-black border border-slate-800 rounded-2xl overflow-hidden relative">

            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {meetingStatus !==
              "in-progress" && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">

                <div className="text-center">

                  <Users
                    size={48}
                    className="mx-auto text-slate-600"
                  />

                  <p className="text-slate-400 mt-4">
                    Waiting for participant
                  </p>

                </div>

              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 rounded-lg text-sm">
              Participant
            </div>

          </div>

        </div>

      </main>


      {/* Controls */}

      <div className="border-t border-slate-800 bg-slate-900">

        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex justify-center items-center gap-4">


            {/* Microphone */}

            <button
              onClick={toggleMic}
              title={
                micEnabled
                  ? "Mute microphone"
                  : "Unmute microphone"
              }
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                micEnabled
                  ? "bg-slate-800 hover:bg-slate-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >

              {micEnabled ? (
                <Mic size={20} />
              ) : (
                <MicOff size={20} />
              )}

            </button>


            {/* Camera */}

            <button
              onClick={toggleCamera}
              title={
                cameraEnabled
                  ? "Turn camera off"
                  : "Turn camera on"
              }
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                cameraEnabled
                  ? "bg-slate-800 hover:bg-slate-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >

              {cameraEnabled ? (
                <Video size={20} />
              ) : (
                <VideoOff size={20} />
              )}

            </button>


            {/* End Meeting */}

            <button
              onClick={endMeeting}
              title="End meeting"
              className="w-14 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
            >

              <PhoneOff size={20} />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}