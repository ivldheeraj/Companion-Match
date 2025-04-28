import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ViewEvents from "./ViewEvents";
import AdminDashboard from "./AdminAddEvent";
import DashImage from "../Assets/dash.png"; // Ensure correct path

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

const Home = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userType");
    navigate("/login");
  }, [navigate]);

  // Set user info on load
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const userType = localStorage.getItem("userType");

    if (!email) {
      navigate("/login");
    } else {
      setUserEmail(email);
      setIsAdmin(userType === "admin");
    }
  }, [navigate]);

  // Inactivity timer logic
  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        alert("You have been logged out due to inactivity.");
        handleLogout();
      }, INACTIVITY_TIMEOUT);
    };

    const activityEvents = [
      "mousemove",
      "keydown",
      "mousedown",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // Start timer on load

    return () => {
      clearTimeout(timer);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [handleLogout]);

  return (
    <div className="container mt-4 position-relative">
      {/* Logout Button */}
      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-danger me-3" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Welcome Section */}
      <div className="row align-items-center mt-5">
        <div className="col-md-6">
          <h1 className="fw-bold display-4">
            Hello{" "}
            {userEmail.charAt(0).toUpperCase() +
              userEmail.split("@")[0].slice(1)}
            !
          </h1>{" "}
          <h2 className="display-6">
            {/* Welcome to the Companion Match Platform */}
          </h2>
          <p className="lead">
            {isAdmin
              ? "You're logged in as an Admin. Manage events with full control."
              : "You're logged in as a Student. View and attend amazing events!"}
          </p>
        </div>
        <div className="col-md-6 text-center">
          <img src={DashImage} alt="Event" className="img-fluid rounded" />
        </div>
      </div>

      {/* Admin vs Student Content */}
      {isAdmin ? (
        <>
          <AdminDashboard userEmail={userEmail} />
        </>
      ) : (
        <>
          <br />
          <h3 className="text-center display-4">Welcome to Companion Match</h3>
          <br />
          <ViewEvents />
        </>
      )}

      {/* Footer */}
      <footer className="bg-dark text-white text-center p-4 mt-5">
        <p className="mb-1">
          © {new Date().getFullYear()} Find Your Companion App. All Rights
          Reserved.
        </p>
        <p className="mb-0">Made with ❤️ by Team 3</p>
      </footer>
    </div>
  );
};

export default Home;
