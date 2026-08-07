import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Candidate from "./pages/Candidate/Candidate";
import Interview from "./pages/Interview/Interview";
import Report from "./pages/Report/Report";
import CandidateDashboard from "./pages/CandidateDashboard/CandidateDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/candidate" element={<Candidate />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/report" element={<Report />} />
        <Route path="/candidate/:id" element={<CandidateDashboard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;