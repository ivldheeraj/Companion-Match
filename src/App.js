import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Dashboard/Home"; // Ensure this file exists
import NotFound from "./Components/NotFound"; // Ensure this file exists
import EventLogin from "./Components/LoginSignup/EventLogin";
import EventSignup from "./Components/LoginSignup/EventSignup";
import AdminDashboard from "./Components/Dashboard/AdminAddEvent";
import CompanionMatch from "./Components/Matching/CompanionMatch";
import Questionnaire from "./Components/Dashboard/Questionnaire";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<EventLogin />} />
        <Route path="/signup" element={<EventSignup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} /> {/* Handle unknown routes */}
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/Matching/:eventId" element={<CompanionMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
