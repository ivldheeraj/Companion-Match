import React, { useState } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Badge,
} from "react-bootstrap";
import "../Assets/CompanionMatch.css"; // <-- custom styles
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const matchedUsers = [
  {
    id: 1,
    name: "Aarav Mehta",
    bio: "Java backend enthusiast who loves clean code and clean sweeps in cricket.",
    image: "https://randomuser.me/api/portraits/men/21.jpg",
    interests: ["Java", "Cricket"],
  },
  {
    id: 2,
    name: "Priya Sharma",
    bio: "Frontend wizard and football fanatic. Debugging + goal screaming = perfect combo!",
    image: "https://randomuser.me/api/portraits/women/47.jpg",
    interests: ["Java", "Football"],
  },
  {
    id: 3,
    name: "Rahul Verma",
    bio: "Full-stack developer with a passion for Java and Manchester United.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    interests: ["Full-Stack", "Football"],
  },
  {
    id: 4,
    name: "Sneha Iyer",
    bio: "Code by day, cricket commentary by night. Let’s pair up and cheer!",
    image: "https://randomuser.me/api/portraits/women/53.jpg",
    interests: ["Spring Boot", "Cricket"],
  },
  {
    id: 5,
    name: "Aditya Rao",
    bio: "Hackathon night owl and football tactics geek.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    interests: ["Hackathon", "Football"],
  },
];

const CompanionMatch = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);

  const isAccepted = (userId) => acceptedUsers.includes(userId);
  const isRejected = (userId) => rejectedUsers.includes(userId);

  const handleReject = (user) => {
    setRejectedUsers([...rejectedUsers, user.id]);
  };

  const handleAccept = (user) => {
    // Only allow acceptance if not already accepted
    if (!acceptedUsers.includes(user.id)) {
      setSelectedUser(user);
      setShowModal(true);
    }
  };

  const confirmAccept = () => {
    setAcceptedUsers([...acceptedUsers, selectedUser.id]);
    console.log(`Accepted match with ${selectedUser.name}`);
    setShowModal(false);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAdmin");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="matchmaking-bg py-5">
      <Navbar expand="lg" sticky="top">
        <Container>
          <Nav className="ms-auto">
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <h2 className="text-center text-white mb-5 display-5 fw-bold">
          Find Your Companion 💻 🏈 ⚽ 🏏 🎮
        </h2>
        <Row>
          {matchedUsers.map((user) => (
            <Col key={user.id} md={4} sm={6} className="mb-4">
              <Card className="shadow-lg match-card h-100">
                <Card.Body className="text-center">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="profile-img mb-3"
                  />
                  <Card.Title className="fw-bold">{user.name}</Card.Title>
                  <Card.Text>{user.bio}</Card.Text>
                  <div className="mb-3">
                    {user.interests.map((tag, index) => (
                      <Badge bg="info" className="me-1" key={index}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {isAccepted(user.id) ? (
                    <Button variant="success" disabled>
                      Accepted ✅
                    </Button>
                  ) : isRejected(user.id) ? (
                    <Button variant="secondary" disabled>
                      Rejected ❌
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        onClick={() => handleAccept(user)}
                        className="me-2"
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleReject(user)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Accept Match</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to accept{" "}
            <strong>{selectedUser?.name}</strong>'s request?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={confirmAccept}>
              Yes, Accept
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default CompanionMatch;
