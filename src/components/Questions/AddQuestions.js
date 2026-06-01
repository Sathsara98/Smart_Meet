// Import React and useState hook.
// useState is used to store values that can change in the component.
import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import "./Question.css";


// AddQuestions component.
// Purpose:
// This component allows the user to add one challenge
// under a selected development area.
function AddQuestions({ onAdd, disabled }) {

  // Store selected development area.
  // Example: Policy, R&D, Technology, etc.
  const [area, setArea] = useState("");

  // Store challenge text typed by the user.
  const [challenge, setChallenge] = useState("");

  // Store validation error message.
  const [error, setError] = useState("");


  // This function runs when user clicks Add button.
  const handleSubmit = (e) => {
    // Prevent default form submit behavior.
    // WHY: Without this, page may refresh.
    e.preventDefault();

    // Validation:
    // User must select development area and enter challenge text.
    if (!area || !challenge.trim()) {
      setError("Please select development area and enter a challenge!");
      return;
    }

    // Send selected area and challenge to parent component.
    // WHY: This component only collects data.
    // Parent component stores the challenge list.
    onAdd({ area, challenge });

    // Clear selected development area after adding.
    setArea("");

    // Clear challenge text after adding.
    setChallenge("");

    // Clear error message.
    setError("");
  };


  // If disabled is true, hide this component completely.
  // WHY: In view mode or completed submissions,
  // user should not add new challenges.
  if (disabled) {
    return null;
  }


  return (
    // Main form wrapper for adding challenges.
    <Form className="form-challenge">

      {/* Row is used to arrange dropdown, textarea, and button horizontally */}
      <Row className="">

        {/* Development Area dropdown section */}
        <Col md={3} className="pl-0">
          <Form.Group controlId="formArea" className="dev-area-dropdown">

            {/* Label for dropdown */}
            <Form.Label>Development Area</Form.Label>

            {/* Dropdown to select development area */}
            <Form.Control
              as="select"

              // Current selected development area.
              value={area}

              // Update area state when user selects an option.
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


        {/* Challenge text area section */}
        <Col md={6}>
          <Form.Group controlId="formChallenge">

            {/* Label for challenge input */}
            <Form.Label>Challenge</Form.Label>

            {/* Textarea for typing challenge */}
            <Form.Control
              as="textarea"
              rows={2}

              // Current challenge value.
              value={challenge}

              // Update challenge state when user types.
              onChange={(e) => setChallenge(e.target.value)}
            />
          </Form.Group>
        </Col>


        {/* Add button section */}
        <Col md={3} className="add-col-btn-wrapper">
          <Button
            variant=""
            className="btn  btn-primary"

            // When clicked, validate and add challenge.
            onClick={handleSubmit}
          >
            Add
          </Button>
        </Col>

      </Row>


      {/* Show error message only if error has value */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Form>
  );
}

export default AddQuestions;

