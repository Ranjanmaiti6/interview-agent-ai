import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/login";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeeDashboard";

import Landing from "./pages/Landing/Landing";
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

        {/* ============================== */}
        {/* Public */}
        {/* ============================== */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ============================== */}
        {/* Admin */}
        {/* ============================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/meetings"
  element={
    <ProtectedRoute role="admin">
      <Meetings />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reports"
  element={
    <ProtectedRoute role="admin">
      <Report />
    </ProtectedRoute>
  }
/>

        {/* ============================== */}
        {/* Employee */}
        {/* ============================== */}

        <Route
          path="/employee"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* ============================== */}
        {/* Existing pages */}
        {/* ============================== */}

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

        {/* ============================== */}
        {/* Meetings */}
        {/* ============================== */}

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