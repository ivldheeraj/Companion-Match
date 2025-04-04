import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DefaultEventImage from "../Assets/EventDefault.png";

const AdminAddEvent = ({ userEmail }) => {
  const [eventData, setEventData] = useState({
    name: "",
    venue: "",
    description: "",
    date: "",
    image: null,
  });
  
  const [events, setEvents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  const saveToLocalStorage = (updatedEvents) => {
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEventData({ ...eventData, image: imageUrl });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedEvents;

    if (editingIndex !== null) {
      updatedEvents = events.map((event, index) =>
        index === editingIndex ? eventData : event
      );
      setEditingIndex(null);
    } else {
      updatedEvents = [...events, eventData];
    }

    setEvents(updatedEvents);
    saveToLocalStorage(updatedEvents);
    setEventData({ name: "", venue: "", description: "", date: "", image: null });
  };

  const handleEdit = (index) => {
    setEventData(events[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
    saveToLocalStorage(updatedEvents);
  };

  return (
    <Container className="mt-5">
      {/* <h1 className="text-center display-5">Welcome to Find Your Companion App</h1>
      <p className="text-center"> Manage your events efficently</p> */}
      <div className="d-flex justify-content-end">
        {/* <h3>Hello, {userEmail}</h3> */}
        
        <button className="btn btn-dark " data-bs-toggle="collapse" data-bs-target="#createEventForm">Create Event</button>
      </div>
      <hr />
      <div id="createEventForm" className="collapse">
        <h4 className="text-center">{editingIndex !== null ? "Edit Event" : "Create Event"}</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Event Name</Form.Label>
            <Form.Control type="text" name="name" value={eventData.name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Venue</Form.Label>
            <Form.Control type="text" name="venue" value={eventData.venue} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" rows={3} value={eventData.description} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="date" value={eventData.date} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
          </Form.Group>
          {eventData.image && <img src={eventData.image} alt="Event" className="img-fluid mt-2" style={{ maxHeight: "200px" }} />}
          <Button variant="success" type="submit" className="w-100 mt-3">
            {editingIndex !== null ? "Update Event" : "Add Event"}
          </Button>
        </Form>
      </div>

      <h2 className=" text-center display-6 mt-5">Featured Events</h2>
      <p className=" text-center "> Explore upcoming events</p>

      <div className="d-flex flex-wrap gap-3">
        {events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          events.map((event, index) => (
            <Card key={index} style={{ width: "18rem" }}>
              {event.image && <Card.Img variant="top" src={event.image || DefaultEventImage} alt={event.name} style={{ height: "150px", objectFit: "cover" }} />}
              <Card.Body>
                <Card.Title>{event.name}</Card.Title>
                <Card.Text>
                  <strong>Location:</strong> {event.venue}<br />
                  <strong>Date:</strong> {event.date}
                </Card.Text>
                <button type="button" className="btn btn-outline-warning me-2" onClick={() => handleEdit(index)} 
                // className="me-2"
                data-bs-toggle="collapse" data-bs-target="#createEventForm">Edit</button>
                <button  className="btn btn-outline-danger me-2" onClick={() => handleDelete(index)}>Delete</button>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </Container>
  );
};

export default AdminAddEvent;
