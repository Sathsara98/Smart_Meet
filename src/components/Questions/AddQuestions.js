import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import "./Question.css";

function AddQuestions({ onAdd, disabled }) {
  const [area, setArea] = useState("");
  const [challenge, setChallenge] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!area || !challenge.trim()) {
      setError("Please select an area and enter a challenge!");
      return;
    }
    onAdd({ area, challenge });
    setArea("");
    setChallenge("");
    setError("");
  };

  if (disabled) {
    return null;
  }

  return (
    <Form className="form-challenge">
      <Row className="">

        {/* Development Area */}
        <Col md={3}>
          <Form.Group controlId="formArea" className="dev-area-dropdown">
            <Form.Label>Development Area</Form.Label>
            <Form.Control
              as="select"
              value={area}
              onChange={(e) => setArea(e.target.value)}

            >
              <option value="">Select...</option>
              <option>Policy</option>
              <option>R&D</option>
              <option>Technology</option>
              <option>Workforce</option>
              <option>Productivity</option>
              <option>Marketing</option>
            </Form.Control>
          </Form.Group>
        </Col>

        {/* Challenge */}
        <Col md={6}>
          <Form.Group controlId="formChallenge">
            <Form.Label>Challenge</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}

            />
          </Form.Group>
        </Col>

        {/* Add Button */}
        <Col md={3} className="add-col-btn-wrapper">
          <Button
            variant=""
            className="btn  btn-primary"
            onClick={handleSubmit}
          >
            Add
          </Button>
        </Col>

      </Row>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </Form>

  );
}

export default AddQuestions;