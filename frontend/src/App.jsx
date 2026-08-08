import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Candidate from "./pages/Candidate/Candidate";
import Interview from "./pages/interview/Interview";
import Report from "./pages/Report/Report";
import CandidateDashboard from "./pages/CandidateDashboard/CandidateDashboard";

import Meetings from "./pages/meetings/Meetings";
import CreateMeeting from "./pages/meetings/CreateMeeting";
import MeetingRoom from "./pages/meetings/MeetingRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Main pages */}
        <Route path="/" element={<Landing />} />

        <Route
          path="/candidate"
          element={<Candidate />}
        />

        <Route
          path="/interview"
          element={<Interview />}
        />

        <Route
          path="/report"
          element={<Report />}
        />

        <Route
          path="/candidate/:id"
          element={<CandidateDashboard />}
        />

        {/* Meetings */}
        <Route
          path="/meetings"
          element={<Meetings />}
        />

        <Route
          path="/meetings/create"
          element={<CreateMeeting />}
        />

        <Route
          path="/meetings/:id"
          element={<MeetingRoom />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;