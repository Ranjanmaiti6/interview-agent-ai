import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Candidate from "./pages/Candidate/Candidate";
import Interview from "./pages/Interview/Interview";
import Report from "./pages/Report/Report";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/candidate" element={<Candidate />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;