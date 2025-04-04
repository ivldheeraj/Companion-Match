import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = () => {
      const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
      setEvents(storedEvents);

      const userEmail = localStorage.getItem("userEmail");
      const storedRegistrations = JSON.parse(localStorage.getItem("registrations")) || {};
      setRegisteredEvents(storedRegistrations[userEmail] || []);
    };

    fetchEvents();
    window.addEventListener("storage", fetchEvents);

    return () => {
      window.removeEventListener("storage", fetchEvents);
    };
  }, []);

  const handleRegister = (eventIndex) => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Please log in to register for an event.");
      return;
    }

    const event = events[eventIndex];
    const storedRegistrations = JSON.parse(localStorage.getItem("registrations")) || {};

    if (!storedRegistrations[userEmail]) {
      storedRegistrations[userEmail] = [];
    }

    if (storedRegistrations[userEmail].some((e) => e.name === event.name)) {
      alert("You have already registered for this event.");
      return;
    }

    storedRegistrations[userEmail].push(event);
    localStorage.setItem("registrations", JSON.stringify(storedRegistrations));

    setRegisteredEvents([...registeredEvents, event]);
    alert("Registration successful!");

    navigate("/questionnaire");
  };

  // 🧠 Helper to check if event is expired
  const isPastEvent = (dateString) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return eventDate < today;
  };

  const upcomingEvents = events.filter(event => !isPastEvent(event.date));
  const pastEvents = events.filter(event => isPastEvent(event.date));

  return (
    <div className="container mt-4">
      {/* ---------------- Upcoming Events ---------------- */}
      {upcomingEvents.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <div className="row">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="col-md-4 mb-4">
              <Card>
                {event.image && (
                  <Card.Img
                    variant="top"
                    src={event.image}
                    alt={event.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{event.name}</Card.Title>
                  <Card.Text>
                    <strong>Venue:</strong> {event.venue}
                    <br />
                    <strong>Date:</strong> {event.date}
                  </Card.Text>

                  {registeredEvents.some((e) => e.name === event.name) ? (
                    <p className="text-success fw-bold">Registered ✅</p>
                  ) : (
                    <Button variant="primary" onClick={() => handleRegister(events.indexOf(event))}>
                      Register
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
      {/* ---------------- Past Events ---------------- */}
      <h2 className="text-center display-6 mt-4 ">Past Events</h2>
      {pastEvents.length === 0 ? (
        <p>No past events.</p>
      ) : (
        <div className="row">
          {pastEvents.map((event, index) => (
            <div key={index} className="col-md-4 mb-4">
              <Card className="bg-light border-secondary">
                {event.image && (
                  <Card.Img
                    variant="top"
                    src={event.image}
                    alt={event.name}
                    style={{ height: "200px", objectFit: "cover", opacity: 0.7 }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{event.name}</Card.Title>
                  <Card.Text>
                    <strong>Venue:</strong> {event.venue}
                    <br />
                    <strong>Date:</strong> {event.date}
                  </Card.Text>
                  <p className="text-danger fw-bold">Event Ended ❌</p>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewEvents;
