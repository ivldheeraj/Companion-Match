import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Dashboard/Home";  // Ensure this file exists
import NotFound from "./Components/NotFound";  // Ensure this file exists
import AdminPage from "./Components/Dashboard/AdminPage";
import Questionnaire from "./Components/Dashboard/Questionnaire";
import EventLogin from "./Components/LoginSignup/EventLogin";
import EventSignup from "./Components/LoginSignup/EventSignup";
import AdminDashboard from "./Components/Dashboard/AdminAddEvent";
import JavaQuestionnaire from "./Components/Dashboard/JavaQuestionnaire";
import MatchingPage from "./Components/Matching/Matching";
import CompanionMatch from "./Components/Matching/CompanionMatch";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/login" element={<EventLogin />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/signup" element={<EventSignup />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* <Route path="/admin" element={<AdminPage />} /> */}
        <Route path="*" element={<NotFound />} /> {/* Handle unknown routes */}
        <Route path="/questionnaire" element={<JavaQuestionnaire />} />
        {/* <Route path="/javaquestionnaire" element={<JavaQuestionnaire />} /> */}
        {/* <Route path="/CompanionMatch" element={<CompanionMatch />} /> */}
        <Route path="/Matching" element={< CompanionMatch/>} />


      </Routes>
    </Router>
  );

}

export default App;