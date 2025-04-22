import React, { useState, useEffect } from "react";
import { Button, Card, Modal, Form, CardText } from "react-bootstrap";
import axios from "axios";
import DefaultEventImage from "../Assets/EventDefault.png";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, NotebookPen } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useHistory hook
import IncomingMatchRequests from "../Matching/IncomingRequests";

const ViewEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [answers, setAnswers] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("incoming"); // Options: incoming, accepted, rejected

  const fetchEvents = () => {
    axios
      .get("http://127.0.0.1:5000/events/active")
      .then((response) => {
        const today = new Date();
        const allEvents = response.data.map((e) => ({
          id: e.EventID,
          name: e.EventTitle,
          venue: e.EventLocation,
          description: e.Description,
          date: new Date(e.EventDate).toISOString().split("T")[0],
          time: e.EventTime,
          questionnaire_id: e.QuestionnaireID,
          image: null,
        }));

        const upcoming = allEvents.filter(
          (event) => new Date(event.date) >= today.setHours(2, 0, 0, 0)
        );

        setUpcomingEvents(upcoming);
      })
      .catch((error) => {
        console.error("Error fetching active events:", error);
      });

    // Fetch past events from the /inactive endpoint
    axios
      .get("http://127.0.0.1:5000/events/inactive")
      .then((response) => {
        const past = response.data.map((e) => ({
          id: e.EventID,
          name: e.EventTitle,
          venue: e.EventLocation,
          description: e.Description,
          date: new Date(e.EventDate).toISOString().split("T")[0],
          time: e.EventTime,
          questionnaire_id: e.QuestionnaireID,
          image: null,
        }));

        setPastEvents(past);
      })
      .catch((error) => {
        console.error("Error fetching past events:", error);
      });
  };

  const [nonRegisteredEvents, setNonRegisteredEvents] = useState([]);
  // Fetch non-registered events for the student
  const fetchNonRegisteredEvents = async () => {
    const studentId = localStorage.getItem("userId");
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/student/non-registered-events?student_id=${studentId}&active_only=true`
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize for date comparison

      const events = res.data.map((e) => ({
        id: e.EventID,
        name: e.EventTitle,
        venue: e.EventLocation,
        description: e.Description,
        date: new Date(e.EventDate).toISOString().split("T")[0],
        time: e.EventTime,
        questionnaire_id: e.QuestionnaireID,
        isRegistered: e.isStudentRegistered,
        image: null,
      }));

      console.log("All active events (with isRegistered):", events);

      const filteredEvents = events.filter(
        (event) =>
          !registeredEvents.some((e) => e.id === event.id) &&
          new Date(event.date) >= today // Only include future or today's events
      );

      const registered = events.filter((e) => e.isRegistered);

      setRegisteredEvents(registered);
      setNonRegisteredEvents(filteredEvents); // ✅ only future events shown

      console.log("Filtered non-registered events:", filteredEvents);
      console.log("Filtered registered events:", registered);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    const studentId = localStorage.getItem("userId");
    if (!studentId) {
      console.error("Student ID not found in localStorage.");
      return;
    }
    // Fetch registered events for the student
    fetchEvents();
    fetchNonRegisteredEvents();
  }, []);

  const handleRegister = async (event) => {
    if (registeredEvents.some((e) => e.id === event.id)) {
      //name
      alert("You already registered for this event.");
      return;
    }

    setSelectedEvent(event);

    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/questionnaires/${event.questionnaire_id}`
      );

      const questions = res.data.Questions || [];

      if (questions.length > 0) {
        setSelectedQuestionnaire(questions);
        setShowModal(true);
      }
    } catch (err) {
      console.error("Error fetching questionnaire:", err);
      alert("Failed to fetch questionnaire. Please try again later.");
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const submitAnswers = async () => {
    if (!selectedEvent || !selectedEvent.id) {
      alert("No event selected.");
      return;
    }

    const student_id = parseInt(localStorage.getItem("userId")); // Or however you're storing the student ID

    const event_id = selectedEvent.id;

    // Map selected answers to option_ids (you may need to adjust this logic based on your data)
    const responses = [];

    selectedQuestionnaire.forEach((q) => {
      const selectedText = answers[q.QuestionID];
      const matchedOption = q.Options.find(
        (opt) => opt.OptionText === selectedText
      );
      if (matchedOption) {
        responses.push({ option_id: matchedOption.OptionID });
      }
    });

    console.log("Submitting responses:", responses);
    console.log("Student ID:", student_id);
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/student/register-event",
        {
          student_id,
          event_id,
          responses,
        }
      );

      // ✅ Store event ID ONLY after successful registration
      localStorage.setItem("selectedEventId", event_id);

      // Update UI
      setRegisteredEvents((prev) => [...prev, selectedEvent]);
      setShowModal(false);
      alert("Successfully registered and questionnaire submitted!");
    } catch (error) {
      console.error("Error submitting registration:", error);
      alert("Registration failed. Please try again.");
    }
  };

  // Format time to be more readable
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const navigate = useNavigate(); // Initialize the navigate function
  const studentId = parseInt(localStorage.getItem("userId"));

  return (
    <div>
      <div>
        <div className="mb-4">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "incoming" ? "active" : ""
                }`}
                onClick={() => setActiveTab("incoming")}
              >
                Incoming Requests
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "accepted" ? "active" : ""
                }`}
                onClick={() => setActiveTab("accepted")}
              >
                Accepted Matches
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "rejected" ? "active" : ""
                }`}
                onClick={() => setActiveTab("rejected")}
              >
                Rejected Matches
              </button>
            </li>
          </ul>
        </div>

        {activeTab === "incoming" && (
          <div className="p-3">
           {/* <IncomingMatchRequests studentId={studentId} /> */}
           <p>Check your incoming match requests here.</p>
          <IncomingMatchRequests studentId={studentId} statusFilter={1} />
          </div>

        )}

        {activeTab === "accepted" && (
          <div className="p-3">
            {/* <h5>Accepted Matches</h5> */}
            <p>Accepted matches will be shown here.</p>

            {/* You can make a separate component like <AcceptedMatches /> */}
            <IncomingMatchRequests studentId={studentId} statusFilter={2} />
          </div>
        )}

        {activeTab === "rejected" && (
          <div className="p-3">
            {/* <h5>Rejected Matches</h5> */}
            {/* You can make a separate component like <RejectedMatches /> */}
            <p>Rejected matches will be shown here.</p>
            <IncomingMatchRequests studentId={studentId} statusFilter={3} />
          </div>
        )}

        <h3 className="mb-3">Upcoming Events</h3>
        <div className="d-flex flex-wrap gap-3 mb-5">
          {nonRegisteredEvents.length === 0 ? (
            <p>No upcoming events.</p>
          ) : (
            nonRegisteredEvents.map((event) => (
              <Card key={event.id} style={{ width: "20rem", padding: "1rem" }}>
                <Card.Img
                  variant="top"
                  src={event.image || DefaultEventImage}
                  alt={event.name}
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{event.name}</Card.Title>
                  <CardText>
                    <MapPin className="h-4 w-4 mr-2" />
                    <span> &nbsp;{event.venue}</span>
                    <br />
                    <NotebookPen className="h-4 w-4 mr-2" />
                    <span>&nbsp;{event.description}</span>
                    <br />
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>&nbsp;{event.date}</span>
                    <br />
                    <Clock className="h-4 w-4 mr-2" />
                    <span>&nbsp;{formatTime(event.time)}</span>
                  </CardText>

                  <div className="d-flex justify-content-between mt-3">
                    {event.isRegistered ? (
                      <>
                        <Button variant="success" disabled>
                          Registered
                        </Button>
                        <Link to={`/Matching`}>
                          <Button variant="info">View Matches</Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleRegister(event)}
                          variant="primary"
                        >
                          Register
                        </Button>
                        <Button variant="secondary" disabled>
                          Unavailable
                        </Button>
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </div>

        <h3 className="mb-3">Past Events</h3>
        <div className="d-flex flex-wrap gap-3">
          {pastEvents.length === 0 ? (
            <p>No past events.</p>
          ) : (
            pastEvents.map((event) => (
              <Card key={event.id} style={{ width: "20rem", padding: "1rem" }}>
                <Card.Img
                  variant="top"
                  src={event.image || DefaultEventImage}
                  alt={event.name}
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{event.name}</Card.Title>
                  <CardText>
                    <MapPin className="h-4 w-4 mr-2" />
                    <span> &nbsp;{event.venue}</span>
                    <br />

                    <NotebookPen className="h-4 w-4 mr-2" />
                    <span>&nbsp;{event.description}</span>
                    <br />

                    <Calendar className="h-4 w-4 mr-2" />
                    <span>&nbsp;{event.date}</span>
                    <br />
                    <Clock className="h-4 w-4 mr-2" />
                    <span>&nbsp;{formatTime(event.time)}</span>
                  </CardText>
                  <span className="badge bg-danger mt-2">Event Ended</span>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Event Questionnaire</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuestionnaire.length === 0 ? (
            <p>No questions available.</p>
          ) : (
            <Form>
              {selectedQuestionnaire.map((q, i) => (
                <Form.Group className="mb-3" key={q.QuestionID}>
                  <Form.Label>{q.Question || `Q${i + 1}`}</Form.Label>

                  {q.Options && q.Options.length > 0 ? (
                    <Form.Select
                      value={answers[q.QuestionID] || ""}
                      onChange={(e) =>
                        handleAnswerChange(q.QuestionID, e.target.value)
                      }
                      required
                    >
                      <option value="">-- Select an option --</option>
                      {q.Options.map((opt) => (
                        <option key={opt.OptionID} value={opt.OptionText}>
                          {opt.OptionText}
                        </option>
                      ))}
                    </Form.Select>
                  ) : (
                    <Form.Control
                      type="text"
                      value={answers[q.QuestionID] || ""}
                      onChange={(e) =>
                        handleAnswerChange(q.QuestionID, e.target.value)
                      }
                      required
                    />
                  )}
                </Form.Group>
              ))}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={() => {
              // Check if all questions have been answered
              const allAnswered = selectedQuestionnaire.every(
                (q) => answers[q.QuestionID] && answers[q.QuestionID] !== ""
              );

              if (allAnswered) {
                submitAnswers();
                // Use navigate to navigate programmatically
                navigate("/Matching");
              } else {
                alert("Please answer all questions before submitting.");
              }
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewEvents;
