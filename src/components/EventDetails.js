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
function EventDetails(props) {
  return (
    <div>
      <div className="content">
        <Formik>
          {({ values, touched, isValid, errors }) => (
            <Form noValidate>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Event Sector</Form.Label>
                  <br />
                  <span style={{ fontSize: 22 }}>{props.event.sector}</span>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Event Name</Form.Label>
                  <Form.Control
                    required
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={props.event.name}
                    disabled={true}
                    style={{ backgroundColor: "#ffffff" }}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Venue</Form.Label>
                  <Form.Control
                    type="text"
                    name="venue"
                    placeholder="Enter the venue"
                    value={props.event.venue}
                    disabled={true}
                    style={{ backgroundColor: "#ffffff" }}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Venue Location</Form.Label>
                  <br />
                  <a
                    className="btn btnPrimary btn-secondary"
                    href={props.event.location}
                    target="new"
                  >
                    View On Map
                  </a>

                  <br />
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
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Time Slot</Form.Label>

                  <Form.Control
                    className="inputBackground "
                    name="question"
                    placeholder=""
                    disabled={true}
                    style={{ backgroundColor: "#ffffff" }}
                    value={props.event.time}
                    required
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Members</Form.Label>
                  <div className="row col-12 m-auto">
                    {props.event.members != null ? (
                      props.event.members.map((e) => {
                        return (
                          <MeetingMember name={e.name} sector={e.sector} obj={e} />
                        );
                      })
                    ) : (
                      <div className="loader ml-4 mb-4">
                        Analyisng Development Area ...
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Questions</Form.Label>
                    <div className=" col-12 m-auto">
                     {props.event.questions.length>0 ? (
                        props.event.questions.map((e) => {
                          return (
                             <p><i class="far fa-question-circle"></i> {e.body}</p>
                          );
                        })
                      ) : (
                        <div className=" ml-4 mb-4">
                          No questions...
                        </div>
                      )} 
                    </div>
                  </Form.Group>
                </Form.Row>
              <Form.Row
                id="footer-modal-addMember"
                className="d-flex justify-content-between"
              >
                <Button
                  variant="danger"
                  onClick={props.close}
                  className="btnPrimary"
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
