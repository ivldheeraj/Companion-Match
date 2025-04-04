import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddEventForm from "./AddEventForm";
import ViewEvents from "./ViewEvents";
import AdminDashboard from "./AdminAddEvent";
import DashImage from "../Assets/dash.png"; // Ensure the correct path

const Home = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const adminStatus = localStorage.getItem("isAdmin") === "true";

    if (!email) {
      navigate("/login"); // Redirect if not logged in
    } else {
      setUserEmail(email);
      setIsAdmin(adminStatus);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAdmin");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="container mt-4 position-relative">
      <div className="d-flex justify-content-end mt-3">
        <button
          className="btn btn-danger me-3"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="row align-items-center mt-5">
        <div className="col-md-6">
          <h1 className="fw-bold display-3">
            Hello {userEmail}! <br />
          </h1>
          <h2 className="display-5">  Welcome to the Companion Match - Event Based Platform</h2>
          <p>Manage all your events efficiently</p>
        </div>

        <div className="col-md-6 text-center">
          <img src={DashImage} alt="Event" className="img-fluid rounded" />
        </div>
      </div>

      {/* If Admin, show Admin Dashboard */}
      {isAdmin ? (
        <AdminDashboard userEmail={userEmail} />
      ) : (
        <>
          <h2 className="text-center display-6 mt-4">Upcoming Events</h2>
          <ViewEvents />
        </>
      )}

      {/* Footer */}
      <footer className="bg-dark text-white text-center p-4 mt-5">
        <p className="mb-0">
          © {new Date().getFullYear()} Find Your Companion App. All Rights
          Reserved.
        </p>
        <p className="mb-0">Made with ❤️ by Team 3</p>
      </footer>
    </div>
  );
};

export default Home;
