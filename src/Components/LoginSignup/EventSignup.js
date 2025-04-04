import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterImage from "../Assets/Register.png";

const EventSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-75 shadow-lg p-5 rounded bg-white">
        {/* Form Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h1 className="text-center mb-4">Register</h1>
          <h5 className="text-center text-muted mb-4">Sign up to manage your events</h5>
          
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <form
            className={`needs-validation ${validated ? "was-validated" : ""}`}
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">First name is required.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Last name is required.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Enter a valid email address.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
              <div className="invalid-feedback">Password must be at least 6 characters long.</div>
            </div>

            {/* Buttons for Navigation */}
            <div className="d-flex justify-content-between gap-2">
              <Link to="/login" className="w-50">
                <button type="button" className="btn btn-outline-dark w-100">Back</button>
              </Link>
              <button type="submit" className="btn btn-dark w-50">Register</button>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="col-md-6 d-none d-md-block">
          <img src={RegisterImage} alt="Register" className="img-fluid rounded" />
        </div>
      </div>
    </div>
  );
};

export default EventSignup;
