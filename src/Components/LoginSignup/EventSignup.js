import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterImage from "../Assets/Register.png";

const EventSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    studentBio: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
  });
  const [validated, setValidated] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        const payload = {
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          student_bio: formData.studentBio,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipcode: formData.zipcode,
          },
        };

        const response = await axios.post("http://127.0.0.1:5000/register", payload);
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        setErrorMessage("Registration failed. Please try again.");
        console.error(error);
      }
    }

    setValidated(true);
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-75 shadow-lg p-5 rounded bg-white">
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h1 className="text-center mb-4">Register</h1>
          <h5 className="text-center text-muted mb-4">Sign up to manage your events</h5>

          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          <form
            className={`needs-validation ${validated ? "was-validated" : ""}`}
            noValidate
            onSubmit={handleSubmit}
          >
            {/* Basic Info */}
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
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
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
              <div className="invalid-feedback">Password must be at least 6 characters long.</div>
            </div>

            {/* Additional Fields */}
            <div className="mb-3">
              <label htmlFor="studentBio" className="form-label">Student Bio</label>
              <textarea
                className="form-control"
                id="studentBio"
                name="studentBio"
                value={formData.studentBio}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Student bio is required.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="street" className="form-label">Street</label>
              <input
                type="text"
                className="form-control"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Street is required.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="city" className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">City is required.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="state" className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">State is required.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="zipcode" className="form-label">Zipcode</label>
              <input
                type="text"
                className="form-control"
                id="zipcode"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Zipcode is required.</div>
            </div>

            {/* Buttons */}
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
