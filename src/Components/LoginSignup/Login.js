import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../Assets/Login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const loggedInUser = localStorage.getItem("userEmail");
    if (loggedInUser) {
      navigate("/"); // Redirect if already logged in
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem("userEmail", email);
    localStorage.setItem("isAdmin", email === "admin@gmail.com" ? "true" : "false");
    navigate("/");
  };


  return (
    <div className="addUser container mt-5">
      <h3>Sign in</h3>
      <form className={`addUserForm needs-validation ${validated ? "was-validated" : ""}`} noValidate onSubmit={handleSubmit}>
        <div className="mb-3">
          <b><label htmlFor="email" className="form-label">Email</label></b>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            autoComplete="off"
            placeholder="Enter your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="invalid-feedback">Please enter a valid email.</div>
        </div>
        <div className="mb-3">
          <b><label htmlFor="password" className="form-label">Password</label></b>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            autoComplete="off"
            placeholder="Enter your Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="invalid-feedback">Password is required.</div>
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <div className="login mt-3">
        <p>Don't have an account?</p>
        <Link to="/signup" className="btn btn-success">Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
