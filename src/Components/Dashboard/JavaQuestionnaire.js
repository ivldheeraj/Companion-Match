import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const JavaQuestionnaire = () => {
  const [formData, setFormData] = useState({
    question1: "",
    question2: "",
    question3: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("questionnaire", JSON.stringify(formData));
    alert("Form submitted successfully!");
    navigate("/"); // Redirect back to home after submission
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6} className="d-flex flex-column justify-content-center">
          <h2>Event Questionnaire</h2>
          <p>We would love to hear about your experience!</p>
        </Col>
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>1. How comfortable are you with Java programming?</Form.Label>
              <Form.Control
                as="select"
                name="question1"
                value={formData.question1}
                onChange={handleChange}
                required
              >
                <option value="">Select your answer</option>
                <option value="Very Comfortable">Very Comfortable</option>
                <option value="Comfortable">Comfortable</option>
                <option value="Somewhat Comfortable">Somewhat Comfortable</option>
                <option value="Not Comfortable">Not Comfortable</option>
              </Form.Control>
            </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>2. What was your main focus during the Java Hackathon?</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="question2"
                  value={formData.question2}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>3. How would you rate your experience at the hackathon?</Form.Label>
              <Form.Control
                as="select"
                name="question3"
                value={formData.question3}
                onChange={handleChange}
                required
              >
                <option value="">Select your rating</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
              </Form.Control>
            </Form.Group>
              
            <Link to="/companionmatch">
              <Button variant="dark" type="submit" className="w-100">
                Submit
              </Button>
              </Link>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default JavaQuestionnaire;
