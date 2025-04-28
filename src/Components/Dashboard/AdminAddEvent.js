import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import DefaultEventImage from "../Assets/EventDefault.png";

const AdminAddEvent = ({ userEmail }) => {
  const [eventData, setEventData] = useState({
    id: null, // will be set once created or when editing
    name: "",
    venue: "",
    description: "",
    date: "",
    time: "",
    image: null,
    questionnaire_id: "",
  });

  const [events, setEvents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const adminId = localStorage.getItem("userId"); // assuming user_id is stored after login

  const fetchEvents = () => {
    axios
      .get("http://127.0.0.1:5000/events/active")
      .then((response) => {
        const normalizedEvents = response.data.map((e) => ({
          id: e.EventID,
          name: e.EventTitle,
          venue: e.EventLocation,
          description: e.Description,
          date: new Date(e.EventDate).toISOString().split("T")[0],
          time: e.EventTime,
          questionnaire_id: e.QuestionnaireID,
          image: null,
        }));
        setEvents(normalizedEvents);
      })
      .catch((error) => {
        console.error("Error fetching active events:", error);
      });
  };

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      event_title: eventData.name,
      description: eventData.description,
      event_date: eventData.date,
      event_time: eventData.time,
      event_location: eventData.venue,
      questionnaire_id: parseInt(eventData.questionnaire_id, 10), // Ensure this is an integer
      // admin_id: parseInt(adminId),
      status_active_yn: eventData.status_active_yn ?? 1,
    };

    const payloadCreate = {
      event_title: eventData.name,
      description: eventData.description,
      event_date: eventData.date,
      event_time: eventData.time,
      event_location: eventData.venue,
      questionnaire_id: parseInt(eventData.questionnaire_id, 10), // Ensure this is an integer
      admin_id: parseInt(adminId),
    };

    console.log("Payload being sent:", payload); // Debugging

    try {
      if (eventData.id) {
        // Editing an existing event: Use PUT request
        const response = await axios.post(
          `http://127.0.0.1:5000/events/${eventData.id}`,
          payload
        );
        console.log("Event updated:", response.data);
        const updatedEvents = events.map((event) =>
          event.id === eventData.id ? { ...event, ...payload } : event
        );
        setEvents(updatedEvents);
      } else {
        // Creating a new event: Use POST request
        const response = await axios.post(
          "http://127.0.0.1:5000/events",
          payloadCreate
        );
        console.log("Event created:", response.data);
        const newEvent = { ...payloadCreate, id: response.data.id };
        setEvents([...events, newEvent]);
        // resetForm();
      }
      resetForm();
      fetchEvents();
      const formCollapse = document.getElementById("createEventForm");
      if (formCollapse && formCollapse.classList.contains("show")) {
        formCollapse.classList.remove("show");
      }
    } catch (error) {
      console.error("Error updating event:", error.response || error);
      alert("Failed to process the event. Check console for details.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = (index) => {
    setEventData(events[index]);
    setEditingIndex(index);
  };

  const resetForm = () => {
    setEventData({
      id: null,
      name: "",
      venue: "",
      description: "",
      date: "",
      time: "",
      image: null,
      questionnaire_id: "",
      status_active_yn: true, // default status for new events
    });
    setEditingIndex(null);
  };

  const handleDelete = async (index) => {
    const eventToDelete = events[index];
    console.log("Deleting event:", eventToDelete.id);
    if (!eventToDelete.id) {
      alert("Event ID not found.");
      return;
    }
    try {
      await axios.delete(`http://127.0.0.1:5000/events/${eventToDelete.id}`);
      const updatedEvents = events.filter((_, i) => i !== index);
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-dark"
          data-bs-toggle="collapse"
          data-bs-target="#createEventForm"
        >
          Create Event
        </button>
      </div>
      <hr />
      <div id="createEventForm" className="collapse">
        <h4 className="text-center">
          {editingIndex !== null ? "Edit Event" : "Create Event"}
        </h4>
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
          <Form.Group className="mb-3">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Event Category (Questionnaire)</Form.Label>
            <Form.Select
              name="questionnaire_id"
              value={eventData.questionnaire_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="1">Sports</option>
              <option value="2">Seminars</option>
              <option value="3">Health Related Events</option>
              <option value="4">Tech Workshops</option>
              <option value="5">Other Common Events</option>
            </Form.Select>
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 mt-3">
            {editingIndex !== null ? "Update Event" : "Add Event"}
          </Button>
        </Form>
      </div>
      <h2 className="text-center display-6 mt-5">Featured Events</h2>
      <p className="text-center">Explore upcoming events</p>

      <div className="d-flex flex-wrap gap-3">
        {events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          events.map((event, index) => (
            <Card key={event.id} style={{ width: "18rem" }}>
              <Card.Img
                variant="top"
                src={event.image || DefaultEventImage}
                alt={event.event_title}
                style={{ height: "150px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{event.name}</Card.Title>
                <Card.Text>
                  <strong>Venue:</strong> {event.venue}
                  <br />
                  <strong>Description:</strong> {event.description}
                  <br />
                  <strong>Date:</strong> {event.date}
                  <br />
                  <strong>Time:</strong> {event.time}
                </Card.Text>
                <Button
                  variant="outline-warning"
                  className="me-2"
                  onClick={() => handleEdit(index)}
                  data-bs-toggle="collapse"
                  data-bs-target="#createEventForm"
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </Container>
  );
};

export default AdminAddEvent;
