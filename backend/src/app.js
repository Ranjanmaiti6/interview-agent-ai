import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";

// If you have additional views like dashboard or interview room, import them here:
// import Dashboard from "./pages/Dashboard";
// import InterviewRoom from "./pages/InterviewRoom";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* Add more dynamic routes as you build out your hackathon app */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/interview" element={<InterviewRoom />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;