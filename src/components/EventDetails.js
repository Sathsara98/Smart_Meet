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
  // Debug logging to understand what we're receiving
  React.useEffect(() => {
    console.log("EventDetails event:", props.event);
    console.log("EventDetails questions:", props.event?.questions);
    console.log("EventDetails questions type:", typeof props.event?.questions);
    console.log("EventDetails questions is array:", Array.isArray(props.event?.questions));
    console.log("EventDetails questions length:", props.event?.questions?.length);
  }, [props.event]);

  // If there's no event (parent cleared it), render nothing to avoid accessing properties on null
  if (!props.event) return null;

  return (
    <div>
      <div className="content">
        <Formik>
          {({ values, touched, isValid, errors }) => (
            <Form noValidate>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Development Area</Form.Label>
                  <br />
                  <span style={{ fontWeight: 600 }}>{props.event.sector}</span>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Meeting Name</Form.Label>
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
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Meeting Location</Form.Label>
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
                <Form.Group as={Col}>
                  <Form.Label>Time</Form.Label>

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
                <Form.Group as={Col} controlId="formGridEmail" className="members-wrapper">
                  <Form.Label>Members</Form.Label>
                  <div className="row col-12 m-auto p-0">
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
                  <Form.Label>Challenges</Form.Label>
                  <div className=" col-12 m-auto">
                    {props.event && props.event.questions && Array.isArray(props.event.questions) && props.event.questions.length > 0 ? (
                      props.event.questions.map((e, idx) => {
                        return (
                          <p key={idx}><i className="far fa-question-circle"></i> <strong>{e.dArea}:</strong> {e.body}</p>
                        );
                      })
                    ) : (
                      <div className=" ml-4 mb-4">
                        No Challenges...
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Form.Row>
              <Form.Row
                id="footer-modal-addMember"
                className="d-flex justify-content-end"
              >
                <Button
                  variant=""
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