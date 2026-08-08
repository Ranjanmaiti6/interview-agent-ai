import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/login";

import Landing from "./pages/Landing/Landing";

import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeeDashboard";

import Candidate from "./pages/Candidate/Candidate";
import Interview from "./pages/interview/Interview";
import Report from "./pages/Report/Report";
import CandidateDashboard from "./pages/CandidateDashboard/CandidateDashboard";

import Meetings from "./pages/meetings/Meetings";
import CreateMeeting from "./pages/meetings/CreateMeeting";
import MeetingRoom from "./pages/meetings/MeetingRoom";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================= */}
        {/* Public */}
        {/* ================================= */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ================================= */}
        {/* Admin */}
        {/* ================================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================================= */}
        {/* Employee */}
        {/* ================================= */}

        <Route
          path="/employee"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================================= */}
        {/* Existing pages */}
        {/* ================================= */}

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

        {/* ================================= */}
        {/* Meetings */}
        {/* ================================= */}

        <Route
          path="/meetings"
          element={
            <ProtectedRoute>
              <Meetings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meetings/create"
          element={
            <ProtectedRoute role="admin">
              <CreateMeeting />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meetings/:id"
          element={
            <ProtectedRoute>
              <MeetingRoom />
            </ProtectedRoute>
          }
        />

        {/* ================================= */}
        {/* Fallback */}
        {/* ================================= */}

        <Route
          path="*"
          element={<Landing />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;