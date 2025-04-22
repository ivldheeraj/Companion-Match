import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Badge,
  Navbar,
  Nav,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Assets/CompanionMatch.css";


const CompanionMatch = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestedUsers, setRequestedUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();
  const studentId = parseInt(localStorage.getItem("userId"));
  const eventId = parseInt(localStorage.getItem("selectedEventId"));

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/student/matches`,
          {
            params: { student_id: studentId, event_id: eventId },
          }
        );
        setMatchedUsers(response.data);
        console.log("Matched Users:", response.data);
        const sent = response.data
          .filter(
            (match) =>
              match.StatusAcceptYN === 3 && match.InitiatorID === studentId
          )
          .map((match) => match.UserID);
        setRequestedUsers(sent);
        console.log("Requested Users:", sent);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, [studentId, eventId]);

  const handleSendRequest = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const confirmSendRequest = async () => {

    const senderId = parseInt(studentId);
const requestorId = parseInt(selectedUser.UserID);


    if (!selectedUser || !selectedUser.UserID) {
      alert("No user selected");
      return;
    }

    try {
      console.log("Sending request to:", selectedUser.UserID);

      console.log("Payload being sent:", {
        sender_id: studentId,
        requestor_id: selectedUser.UserID,
      });

      const sentRequest = await axios.post("http://127.0.0.1:5000/student/match/send", {
        sender_id: senderId,
        requestor_id: requestorId,
      });
      console.log("Response from server:", sentRequest.data);

      console.log("Match request sent successfully");

      // Update matched users with the new status_accept_yn
      setMatchedUsers((prevMatches) =>
        prevMatches.map((user) =>
          user.UserID === selectedUser.UserID
            ? { ...user, StatusAcceptYN: 1 } // Mark the status as "Request Sent"
            : user
        )
      );

      setRequestedUsers((prev) => [...prev, selectedUser.UserID]); // Add to requested list
    } catch (error) {
      console.error("Error sending match request:", error);
      alert("Failed to send request.");
    } finally {
      setShowModal(false); // Close the modal
    }
  };

  const getStatusBadge = (status) => {
    if (status === 2) return <Badge bg="success">Accepted</Badge>;
    if (status === 3) return <Badge bg="danger">Rejected</Badge>;
    if (status === 1) return <Badge bg="warning">Request Sent</Badge>;
    if (status === 0) return <Badge bg="secondary">New</Badge>;
    return;
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const filteredUsers = matchedUsers.filter((user) => {
    if (statusFilter === "All") return true;
    return user.StatusAcceptYN === parseInt(statusFilter);
  });
  
  return (
    <div className="matchmaking-bg py-5">
      <Navbar expand="lg" sticky="top">
        <Container>
          <Nav className="ms-auto d-flex gap-2">
            <Button variant="secondary" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <h2 className="text-center  mb-5 display-5 fw-bold">
          Find Your Companion 💻 🏈 ⚽ 🏏 🎮
        </h2>

        {/* Incoming Requests (if user is the second one in match) */}
        {/* <IncomingMatchRequests studentId={studentId} /> */}

        <Row>
        <Nav
  variant="pills"
  defaultActiveKey="All"
  className="justify-content-center mb-4 gap-2"
  onSelect={(selectedKey) => setStatusFilter(selectedKey)}
>
  <Nav.Item>
    <Nav.Link eventKey="All">All</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link eventKey="1">Request Sent</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link eventKey="2">Accepted</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link eventKey="3">Rejected</Nav.Link>
  </Nav.Item>
</Nav>

          {matchedUsers
            .filter((user) => {
              if (statusFilter === "All") return true;
              return user.StatusAcceptYN === parseInt(statusFilter);
            })
            .map((user) => (
            <Col key={user.UserID} md={4} sm={6} className="mb-4">
              <Card className="shadow-lg match-card h-100">
                <Card.Body className="text-center">
                  <img
                    src={`https://randomuser.me/api/portraits/${
                      user.UserID % 2 === 0 ? "women" : "men"
                    }/${user.UserID % 100}.jpg`}
                    alt={user.FirstName}
                    className="profile-img mb-3"
                  />
                  <Card.Title className="fw-bold">
                    {user.FirstName} {user.LastName}
                  </Card.Title>
                  <Card.Text>{user.StudentBio}</Card.Text>
                  <Card.Text>
                    <strong>Match Score:</strong> {user.MatchScore}
                  </Card.Text>
                  <Card.Text>
                    Status {getStatusBadge(user.StatusAcceptYN)}
                  </Card.Text>

                  {user.StatusAcceptYN === 0 ? (
                    <Button
                      variant="primary"
                      onClick={() => {
                        console.log("Sending match request to:", user); // Debugging line
                        handleSendRequest(user);
                      }}
                    >
                      Send Request
                    </Button>
                  ) : user.StatusAcceptYN === 1 ? (
                    <Button variant="warning" disabled>
                      Request Sent
                    </Button>
                  ) : (
                    <Button variant="secondary" disabled>
                      Not Available
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Send Request Confirmation Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Send Match Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to send a match request to{" "}
            <strong>{selectedUser?.FirstName}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={confirmSendRequest}>
              Yes, Send
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default CompanionMatch;
