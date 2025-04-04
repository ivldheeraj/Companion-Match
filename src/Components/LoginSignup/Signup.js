import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./../Assets/Signup.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [validated, setValidated] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      localStorage.setItem("user", JSON.stringify(formData));
      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    }
    setValidated(true);
  };

  return (
    <div className="addUser">
      <h3>Register</h3>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <form
        className={`addUserForm needs-validation ${validated ? "was-validated" : ""}`}
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="inputGroup">
          <b><label htmlFor="name">Name</label></b>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="off"
            placeholder="Enter your name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">Please enter your name.</div>

          <b><label htmlFor="email">Email</label></b>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            placeholder="Enter your Email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">Please enter a valid email address.</div>

          <b><label htmlFor="password">Password</label></b>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            placeholder="Enter Password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
          <div className="invalid-feedback">Password must be at least 6 characters long.</div>

          <button type="submit" className="btn btn-success mt-3">
            Sign Up
          </button>
        </div>
      </form>
      <div className="login mt-3">
        <p>Already have an Account?</p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
