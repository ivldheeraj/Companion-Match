import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Card } from "react-bootstrap";

const Questionnaire = () => {
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
      <Card className="p-4 shadow-sm">
        <h2 className="text-center mb-4">Event Questionnaire</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Why are you attending this event?</Form.Label>
            <Form.Control as="textarea" name="question1" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>What are your expectations from this event?</Form.Label>
            <Form.Control as="textarea" name="question2" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Any additional comments?</Form.Label>
            <Form.Control as="textarea" name="question3" onChange={handleChange} />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Submit
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Questionnaire;
