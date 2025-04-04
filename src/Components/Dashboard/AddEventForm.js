import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card, Table } from "react-bootstrap";

const AdminEvents = () => {
  const [eventData, setEventData] = useState({
    name: "",
    venue: "",
    description: "",
    date: "",
  });

  const [events, setEvents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Load events from Local Storage when the component mounts
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  // Save events to Local Storage
  const saveToLocalStorage = (updatedEvents) => {
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  // Handle form input changes
  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Add or Update event)
  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedEvents;

    if (editingIndex !== null) {
      // Update existing event
      updatedEvents = events.map((event, index) =>
        index === editingIndex ? eventData : event
      );
      setEditingIndex(null);
    } else {
      // Add new event
      updatedEvents = [...events, eventData];
    }

    setEvents(updatedEvents);
    saveToLocalStorage(updatedEvents);
    setEventData({ name: "", venue: "", description: "", date: "" });
  };

  // Handle edit event
  const handleEdit = (index) => {
    setEventData(events[index]);
    setEditingIndex(index);
  };

  // Handle delete event
  const handleDelete = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
    saveToLocalStorage(updatedEvents);
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-sm">
        <h2 className="text-center mb-4">
          {editingIndex !== null ? "Edit Event" : "Add New Event"}
        </h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={eventData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Venue</Form.Label>
            <Form.Control
              type="text"
              name="venue"
              value={eventData.venue}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              value={eventData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            {editingIndex !== null ? "Update Event" : "Add Event"}
          </Button>
        </Form>
      </Card>

      <h3 className="mt-5">Event List</h3>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Venue</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{event.name}</td>
                <td>{event.venue}</td>
                <td>{event.description}</td>
                <td>{event.date}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(index)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminEvents;
