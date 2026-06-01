import React from "react";
import {
  Container,
  Form,
  Col,
  Row,
  Button,
  Alert,
  Card,
} from "react-bootstrap";

import * as yup from "yup";

import { Formik } from "formik";

import MeetingMember from "./MeetingMember";

import Auth from "../authentication/Auth";

// Import useState hook.
// useState stores values that can change in this component.
import { useState } from "react";


function EventDetails(props) {

  // Debug logging to understand what event data is received from parent component.
  // WHY: Useful during development to check whether questions/members are coming correctly.
  React.useEffect(() => {
    console.log("EventDetails event:", props.event);
    console.log("EventDetails questions:", props.event?.questions);
    console.log("EventDetails questions type:", typeof props.event?.questions);
    console.log("EventDetails questions is array:", Array.isArray(props.event?.questions));
    console.log("EventDetails questions length:", props.event?.questions?.length);
  }, [props.event]);


  // Stores whether logged-in committee member checked "unable to attend".
  const [unableToAttend, setUnableToAttend] = useState(false);

  // Stores reason typed by user for being unable to attend.
  const [unableReason, setUnableReason] = useState("");

  // Stores whether user has already submitted excuse.
  // WHY: Prevents same user from submitting excuse again.
  const [alreadySubmittedExcuse, setAlreadySubmittedExcuse] = useState(false);


  // Stores logged-in user's role.
  // Example: Committee Member, Administrator, Committee Secretary.
  const [userRole, setUserRole] = useState(Auth.getUserLevel());


  // If event is missing, return nothing.
  // WHY: Prevents errors like trying to read props.event.name when props.event is null.
  if (!props.event) return null;


  // Submit unable-to-attend response.
  const submitUnableToAttend = async () => {

    // If already submitted, stop and show message.
    if (alreadySubmittedExcuse) {
      alert("You have already submitted an excuse for this meeting.");
      return;
    }

    // Reason is required before submitting.
    if (!unableReason.trim()) {
      alert("Please enter reason");
      return;
    }


    try {
      // Send unable-to-attend data to backend.
      // URL includes event ID and logged-in user ID.
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/events/unable-to-attend/${props.event._id}/${Auth.getUserId()}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",

            // Token is sent to verify logged-in user.
            token: Auth.getToken(),
          },
          body: JSON.stringify({
            reason: unableReason,
          }),
        }
      );


      // Convert backend response to JSON.
      const data = await response.json();


      // If backend returns error, show it.
      if (data.error) {
        alert(data.error);
      } else {
        // If success, inform user.
        alert("Response submitted successfully");

        // Hide reason field.
        setUnableToAttend(false);

        // Mark as already submitted.
        setAlreadySubmittedExcuse(true);

        // Clear reason textbox.
        setUnableReason("");
      }
    } catch (error) {
      // If request fails, show general error.
      console.log(error);
      alert("Something went wrong");
    }
  };


  // Get members who submitted unable-to-attend.
  // WHY: Administrator needs to see excused members and their reasons.
  const excusedMembers = props.event.members
    ? props.event.members.filter((member) => member.unableToAttend === true)
    : [];


  return (
    <div>
      <div className="content">

        {/* Formik wraps the form.
           Here it is used for form structure, not heavy validation. */}
        <Formik>
          {({ values, touched, isValid, errors }) => (
            <Form noValidate>

              {/* Development area section */}
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Development Area</Form.Label>
                  <br />

                  {/* Show event development area/sector */}
                  <span style={{ fontWeight: 600 }}>
                    {props.event.sector}
                  </span>
                </Form.Group>
              </Form.Row>


              {/* Meeting name section */}
              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Meeting Name</Form.Label>

                  <Form.Control
                    required
                    name="name"
                    type="text"
                    placeholder="Name"

                    // Display meeting name from selected event.
                    value={props.event.name}

                    // Disabled because this is view-only screen.
                    disabled={true}

                    // White background keeps disabled input readable.
                    style={{ backgroundColor: "#ffffff" }}
                  />
                </Form.Group>
              </Form.Row>


              {/* Venue map link section */}
              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Venue</Form.Label>
                  <br />

                  {/* Link opens Google Maps location */}
                  <a
                    className="btn btnPrimary btn-secondary"
                    href={props.event.location}
                    target="new"
                  >
                    View On Map
                  </a>

                  <br />

                  {/*
                   Old map component is commented.
                   WHY: Instead of showing map inside page, current UI shows "View On Map" button.
                 */}
                  {/* <MapWithAMarker
                     googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCDNwCv-VFlb6sKsDpbt8ptidHZOS_ETuI&v=3.exp&libraries=geometry,drawing,places"
                     loadingElement={<div style={{ height: `100%` }} />}
                     containerElement={<div style={{ height: `400px` }} />}
                     mapElement={<div style={{ height: `100%` }} />}
                     // markerRef={this.onMarkerMounted}
                     onDragged={this.onMarkerDragEnd}
                     lat={this.state.lat}
                     lng={this.state.lng}
                     camera={this.state.camZoom}
                   /> */}
                </Form.Group>
              </Form.Row>


              {/* Meeting location text section */}
              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Meeting Location</Form.Label>

                  <Form.Control
                    type="text"
                    name="venue"
                    placeholder="Enter the venue"

                    // Display venue from selected event.
                    value={props.event.venue}

                    // Disabled because user only views details here.
                    disabled={true}
                    style={{ backgroundColor: "#ffffff" }}
                  />
                </Form.Group>
              </Form.Row>


              {/* Meeting time section */}
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Time</Form.Label>

                  <Form.Control
                    className="inputBackground "
                    name="question"
                    placeholder=""
                    disabled={true}
                    style={{ backgroundColor: "#ffffff" }}

                    // Display meeting time.
                    value={props.event.time}
                    required
                  />
                </Form.Group>
              </Form.Row>


              {/* Meeting members section */}
              <Form.Row>
                <Form.Group
                  as={Col}
                  controlId="formGridEmail"
                  className="members-wrapper"
                >
                  <Form.Label>Members</Form.Label>

                  <div className="row col-12 m-auto p-0">
                    {props.event.members != null ? (
                      // Display each meeting member using MeetingMember component.
                      props.event.members.map((e) => {
                        return (
                          <MeetingMember
                            name={e.name}
                            sector={e.sector}
                            obj={e}
                          />
                        );
                      })
                    ) : (
                      // Show loading message if members are not available yet.
                      <div className="loader ml-4 mb-4">
                        Analyisng Development Area ...
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Form.Row>


              {/* Committee member unable-to-attend section */}
              {userRole === "Committee Member" && (
                <Form.Row className="flex-column mb-3">
                  <div className="">
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <input
                        type="checkbox"

                        // Checkbox stays checked after submitted.
                        checked={unableToAttend || alreadySubmittedExcuse}

                        // Disable checkbox after excuse is submitted.
                        disabled={alreadySubmittedExcuse}

                        onChange={(e) => {
                          // Update checkbox state.
                          setUnableToAttend(e.target.checked);

                          // If unchecked, clear reason.
                          if (!e.target.checked) {
                            setUnableReason("");
                          }
                        }}
                      />

                      I am unable to attend this meeting
                    </label>
                  </div>


                  <div className="d-flex justify-content-between">
                    {
                      // Show reason textbox only when checkbox is checked.
                      unableToAttend && (
                        <Form.Group className="reason mb-0">
                          <Form.Control
                            className="inputBackground "
                            name="unableReason"
                            placeholder="Enter reason for being unable to attend"

                            // Current reason text.
                            value={unableReason}

                            // Disable after submitting excuse.
                            disabled={alreadySubmittedExcuse}

                            // Update reason while typing.
                            onChange={(e) => setUnableReason(e.target.value)}
                          />
                        </Form.Group>
                      )
                    }

                    {
                      // Show submit button only when checkbox is checked.
                      unableToAttend && (
                        <Button
                          variant=""

                          // Submit excuse to backend.
                          onClick={submitUnableToAttend}

                          // Disable after already submitted.
                          disabled={alreadySubmittedExcuse}

                          className="btn btn-outline"
                        >
                          {alreadySubmittedExcuse ? "Already Submitted" : "Submit"}
                        </Button>
                      )
                    }
                  </div>

                </Form.Row>
              )}

              {/* Administrator excused members section */}
              {userRole === "Administrator" && (
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Excused Members</Form.Label>

                    {excusedMembers.length > 0 ? (
                      // Show excused member list in table.
                      <table className="table table-bordered table-sm">
                        <thead>
                          <tr>
                            <th>Member Name</th>
                            <th>Sector</th>
                            <th>Reason</th>
                          </tr>
                        </thead>

                        <tbody>
                          {excusedMembers.map((member, index) => (
                            <tr key={index}>
                              <td>{member.name}</td>
                              <td>{member.sector}</td>
                              <td>{member.unableReason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      // If no excused members.
                      <p>No excused members for this meeting.</p>
                    )}
                  </Form.Group>
                </Form.Row>
              )}


              {/* Challenges section */}
              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Challenges</Form.Label>

                  <div className=" col-12 m-auto">
                    {props.event &&
                      props.event.questions &&
                      Array.isArray(props.event.questions) &&
                      props.event.questions.length > 0 ? (
                      // Display challenges linked with this event.
                      props.event.questions.map((e, idx) => {
                        return (
                          <p key={idx}>
                            <i className="far fa-question-circle"></i>{" "}
                            <strong>{e.dArea}:</strong> {e.body}
                          </p>
                        );
                      })
                    ) : (
                      // If no challenges found.
                      <div className=" ml-4 mb-4">
                        No Challenges...
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Form.Row>


              {/* Footer close button */}
              <Form.Row
                id="footer-modal-addMember"
                className="d-flex justify-content-end"
              >
                <Button
                  variant=""

                  // Close details modal.
                  onClick={props.close}

                  className="btn btn-secondary"
                >
                  Close
                </Button>
              </Form.Row>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}


export default EventDetails;

