import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Row, Col } from "react-bootstrap";
import "../Assets/CompanionMatch.css";
import userImage from "../Assets/user.png";

const IncomingMatchRequests = ({ studentId, eventId, statusFilter }) => {
  const [allRequests, setAllRequests] = useState([]);
  const [eventData, setEventData] = useState([]); // Store event data

  const fetchEventData = async (eventId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/events/${eventId}`
      );
      setEventData(response.data); // Store event data
      //   console.log("Event Data:", response.data); // Log event data
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/student/match/requests`,
        {
          params: {
            requestor_id: studentId,
            event_id: eventId, // Include the event ID here
          },
        }
      );
      setAllRequests(response.data);
    } catch (error) {
      console.error("Error fetching match requests:", error);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventData(eventId);
    }
    fetchRequests();
  }, [studentId, eventId, fetchRequests]);
  

  const respondToRequest = async (matchId, StatusAcceptYN) => {
    try {
      await axios.post(`http://127.0.0.1:5000/student/match/respond`, {
        match_id: matchId,
        status: StatusAcceptYN,
        event_id: eventId, // Include the event ID here
      });
      await fetchRequests(); // refresh
    } catch (error) {
      console.error("Error responding to request:", error);
    }
  };

  const filteredRequests = allRequests.filter(
    (req) => req.StatusAcceptYN === statusFilter
  );

  return (
    <div className="mb-5">
      <h2 className="text-white fw-bold mb-4 text-center">
        {statusFilter === 1 && "Incoming Match Requests"}
        {statusFilter === 2 && "Accepted Matches"}
        {statusFilter === 3 && "Rejected Matches"}
      </h2>
      {filteredRequests.length === 0 ? (
        <p className="text-light text-center">No requests to show.</p>
      ) : (
        <Row>
          {filteredRequests.map((req) => (
            <Col key={req.MatchID} md={4} sm={6} className="mb-4">
              <Card className="shadow-lg match-card h-100">
                <Card.Body className="text-center">
                  <img
                    src={userImage}
                    alt={req.FirstName}
                    className="profile-img mb-3"
                  />
                  <Card.Title className="fw-bold">
                    {req.FirstName} {req.LastName}
                  </Card.Title>
                  {eventData && ( // Display event name if event data is available
                    <Card.Subtitle className="mb-2 text-muted">
                      Event: {eventData.EventTitle}{" "}
                      {/* Displaying the event title */}
                    </Card.Subtitle>
                  )}
                  <Card.Text className="mb-2">
                    Bio: <em>{req.StudentBio}</em>
                  </Card.Text>
                  <Card.Text>
                    <strong>Status:</strong>{" "}
                    {req.StatusAcceptYN === 0
                      ? "Pending"
                      : req.StatusAcceptYN === 1
                      ? "Requested"
                      : req.StatusAcceptYN === 2
                      ? "Accepted"
                      : req.StatusAcceptYN === 3
                      ? "Rejected"
                      : "Unknown"}
                  </Card.Text>

                  {req.StatusAcceptYN === 1 && (
                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        onClick={() => respondToRequest(req.MatchID, 2)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => respondToRequest(req.MatchID, 3)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default IncomingMatchRequests;
