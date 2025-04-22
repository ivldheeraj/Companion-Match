import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Card, Container, Badge } from "react-bootstrap";

const MatchingPage = () => {
  const [matches, setMatches] = useState([]);
  const studentId = parseInt(localStorage.getItem("userId"));
  const eventId = parseInt(localStorage.getItem("selectedEventId")); // make sure to store this when navigating

  useEffect(() => {
    if (!studentId || !eventId) return;

    axios
      .get(`http://127.0.0.1:5000/student/matches`, {
        params: { student_id: studentId, event_id: eventId },
      })
      .then((res) => setMatches(res.data))
      .catch((err) => console.error("Error fetching matches:", err));
  }, [studentId, eventId]);

  const getStatusBadge = (status) => {
    if (status === 1) return <Badge bg="success">Accepted</Badge>;
    if (status === 0) return <Badge bg="danger">Rejected</Badge>;
    return <Badge bg="secondary">Not Responded</Badge>;
  };

  return (
    <div>
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4">Student Matches</h3>
        {matches.length === 0 ? (
          <p>No matches found for this event.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Bio</th>
                <th>Match Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((student, index) => (
                <tr key={student.UserID}>
                  <td>{index + 1}</td>
                  <td>{`${student.FirstName} ${student.LastName}`}</td>
                  <td>{student.Email}</td>
                  <td>{student.StudentBio}</td>
                  <td>{student.match_score}</td>
                  <td>{getStatusBadge(student.status_accept_yn)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>

   
</div>

  );
};

export default MatchingPage;
