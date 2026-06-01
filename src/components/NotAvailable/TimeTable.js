// Import React hooks.
// useState is used to store values that can change.
// useEffect is used to run code when the component loads.
// H1 is imported here, but it is not used in this file.
import React, { useState, useEffect, H1 } from "react";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import "./TimeTable.css";
import Auth from "../../authentication/Auth";


// TimeTable component.
// Purpose:
// This page allows a user/member to select weekly availability.
// The selected availability is saved as an array of 40 values.
// 5 days x 8 time slots = 40 cells.
function TimeTable() {

  // days stores availability for all timetable cells.
  // 0 means not available.
  // 1 means available.
  const [days, setdays] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  // page state is used in useEffect dependency.
  // When page changes, availability data will reload.
  // Currently page is not changed anywhere in this file.
  const [page, setPage] = useState(1);

  // Controls success popup visibility.
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);


  // Load logged-in user's saved availability when component loads.
  // Logic:
  // 1. Get logged-in user ID from Auth.
  // 2. Fetch user details from backend.
  // 3. If user already has availability array, set it to days state.
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/register/` + Auth.getUserId(), {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",

        // Send token for authorization.
        token: Auth.getToken(),
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        // If backend has saved availability, load it into timetable.
        if (response.nat) setdays(response.nat);

        console.log(response);
      })
      .catch((error) => console.log(error));
  }, [page]);


  // CenText is a small component used inside each timetable cell.
  // It shows "Available" only if that cell value is 1.
  const CenText = (props) => {
    if (props.availability > 0) {
      return (
        <h5 className="m-auto text-white" cell={props.cell}>
          Available
        </h5>
      );
    } else {
      return (
        <h5 className="m-auto" cell={props.cell}>

        </h5>
      );
    }
  };


  // Save availability to backend.
  const saveNat = async (event) => {
    // event.preventDefault();

    console.log(event);

    try {
      // Prepare PUT request.
      // PUT is used because we update existing user's availability.
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },

        // Send user ID and selected availability array.
        body: JSON.stringify({
          id: Auth.getUserId(),
          nat: days,
        }),
      };

      // Send selected availability to backend.
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/nat`,
        requestOptions
      );

      // Convert response into JSON.
      const data = await res.json();

      console.log(data);

      // Show success dialog after saving.
      setShowSuccessDialog(true);
    } catch (e) {
      console.log(e);
    }
  };


  // This function runs when user clicks a timetable cell.
  // Logic:
  // If current value is 0, change it to 1.
  // If current value is 1, change it to 0.
  // This means user can select/unselect availability.
  function cellClick(props) {
    // Copy current days array.
    let items = [...days];

    // Get clicked cell number from cell attribute.
    // -1 is used because array index starts from 0,
    // but cell numbers start from 1.
    if (items[props.target.attributes.cell.value - 1] == 0) {
      // Mark selected cell as available.
      items[props.target.attributes.cell.value - 1] = 1;
    } else {
      // Mark selected cell as not available.
      items[props.target.attributes.cell.value - 1] = 0;
    }

    // Update state so UI changes.
    setdays(items);

    console.log(items);
  }

  // Empty function.
  // This is declared but not used.
  function name() { }

  return (
    <div className="">

      {/* Main timetable wrapper */}
      <div className="timetable w-100 ">

        {/* Week day names */}
        <div className="week-names">
          <div>
            <b>monday</b>
          </div>
          <div>
            <b>tuesday</b>
          </div>
          <div>
            <b>wednesday</b>
          </div>
          <div>
            <b>thursday</b>
          </div>
          <div>
            <b>friday</b>
          </div>
        </div>

        {/* Time interval labels */}
        <div className="time-interval">
          <div>
            <b>8:30 - 9:15</b>
          </div>
          <div>
            <b>9:15 - 10:00</b>
          </div>
          <div>
            <b>10:00 - 10:45</b>
          </div>
          <div>
            <b>10:45 - 11:30</b>
          </div>
          <div>
            <b>11:30 - 12:15</b>
          </div>
          <div>
            <b>12:15 - 13:00</b>
          </div>
          <div>
            <b>14:30 - 15:15</b>
          </div>
          <div>
            <b>15:15 - 16:00</b>
          </div>
        </div>

        {/* Timetable cells */}
        <div className="content">
          {days.map((item, keyy) => {
            return (
              <div key={keyy}>
                <div
                  // If item is 1, apply selected/available style.
                  // If item is 0, use normal cell style.
                  className={
                    item > 0
                      ? "accent-blue-gradient timetable-cell"
                      : "timetable-cell"
                  }

                  // Toggle availability when cell is clicked.
                  onClick={(params) => cellClick(params)}

                  // Day attribute is currently fixed as Monday.
                  // Actual layout depends on CSS grid.
                  day="Monday"

                  // Cell number starts from 1.
                  cell={keyy + 1}
                >
                  {/* Show Available text only if selected */}
                  <CenText
                    availability={item}
                    cell={keyy + 1}
                    onClick={(params) => cellClick(params)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save button */}
      <div className="d-flex justify-content-end mt-3">
        <Button className="btn-Primary " onClick={saveNat}>
          Save
        </Button>
      </div>

      {/* Success dialog after availability is saved */}
      <Modal show={showSuccessDialog} onHide={() => setShowSuccessDialog(false)}>
        <Modal.Body className="text-center p-4">

          {/* Green success circle */}
          <div
            style={{
              width: "85px",
              height: "85px",
              borderRadius: "50%",
              backgroundColor: "#006b1f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto",
            }}
          >
            {/* Check icon */}
            <i
              className="fa fa-check"
              aria-hidden="true"
              style={{
                color: "white",
                fontSize: "45px",
              }}
            ></i>
          </div>

          {/* Success title */}
          <h5 style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Availability Updated
          </h5>

          {/* Success message */}
          <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
            Your weekly availability has been updated successfully.
          </p>

          {/* OK button closes dialog */}
          <Button
            variant="primary"
            onClick={() => setShowSuccessDialog(false)}
            style={{
              padding: "6px 30px",
            }}
          >
            OK
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TimeTable;

