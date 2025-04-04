import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import LoginImage from "../Assets/Login.png"; // Ensure the correct path
import "./../Assets/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (localStorage.getItem("userEmail")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem("userEmail", email);
    localStorage.setItem(
      "isAdmin",
      email === "Admin" ? "true" : "false"
    );
    navigate("/");
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-75 shadow-lg p-5 rounded bg-white">
        {/* Left Side (Login Form) */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2 className="text-center display-6 mb-4">
            Welcome to Find Your Companion 
          </h2>
          <form className="needs-validation" noValidate onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                <b>Email</b>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your Email"
                autoComplete="off"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="invalid-feedback">
                Please enter a valid email.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                <b>Password</b>
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your Password"
                autoComplete="off"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="invalid-feedback">Password is required.</div>
            </div>

            {/* Buttons for Login and Create Account */}
            <div className="d-flex justify-content-between gap-2">
              <Link to="/signup" className="w-50">
                <button type="button" className="btn btn-outline-dark w-100">
                  Create Account
                </button>
              </Link>
              <button type="submit" className="btn btn-dark w-50">
                Login
              </button>
            </div>

            {/* Signup Link */}
            {/* <p className="text-center mt-3">
              Don't have an account? <Link to="/signup">Create one</Link>
            </p> */}
          </form>
        </div>

        {/* Right Side (Image) */}
        <div className="col-md-6 d-none d-md-block">
          <img src={LoginImage} alt="Event" className="img-fluid rounded" />
        </div>
      </div>
    </div>
  );
};

export default Login;
