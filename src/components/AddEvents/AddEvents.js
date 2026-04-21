import React, { useRef, useEffect, useState, Component } from "react";
import {
  BreadCrum,
  SideBar,
  Navbar,
  AdminCard,
  MapWithAMarker,
} from "../../components";
import profile from "../../assets/profile.png";
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
import "./AddEvent.css";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Auth from "../../authentication/Auth";
import { Day } from "react-big-calendar";
import MeetingMember from "../MeetingMember";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyCDNwCv-VFlb6sKsDpbt8ptidHZOS_ETuI");
Geocode.setLanguage("en");
Geocode.setRegion("lk");

class AddEvents extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      lat: 6.817796083692221,
      lng: 79.89032876923123,
      camZoom: { lat: 6.817796083692221, lng: 79.89032876923123, zoom: 15 },
      usersNat: null,
      loading: false,
      timeSlot: null,
      date: null,
      day: null,
      loadingDevArea: false,
      devArea: null,
      meetingMembers: [],
      error: "",
      showError: false,
      questions: [],
    };
    // If navigation provided a submissionState (from Questions submit), prefill questions/devArea
    if (props && props.submissionState) {
      try {
        const s = props.submissionState;
        console.log("AddEvents received submissionState:", s);
        if (s.questions && Array.isArray(s.questions) && s.questions.length > 0) {
          this.state.questions = s.questions.map((q, i) => ({
            _id: q._id || `pre-${i}`,
            body: q.body || q,
            dArea: q.dArea || q.dArea,
            disabled: false,
          }));
          console.log("AddEvents prefilled questions:", this.state.questions);
        }
        if (s.maxArea) {
          this.state.devArea = s.maxArea;
          console.log("AddEvents prefilled devArea:", s.maxArea);

          setTimeout(() => {
            this.calculateBestTime();
          }, 0);
        }
      } catch (e) {
        console.warn("Could not apply submissionState to AddEvents:", e);
      }
    }
    // this.handleClick = this.handleClick.bind(this);
    this.fetchQuestions = this.fetchQuestions.bind(this);
  }

  membersToAdd = [];
  arr2d = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  minIndex = 0;

  fetchUsers = async () => {
    console.log("fetchUsers: Starting fetch...");
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/usersnat/`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
        token: Auth.getToken(),
      }),
    })
      .then((res) => {
        console.log("fetchUsers: Received response status:", res.status);
        return res.json();
      })
      .then((response) => {
        console.log("fetchUsers: Response data:", response);
        if (response) {
          this.setState(
            {
              usersNat: response,
              loading: false,
            },
            () => {
              // ✅ NOW compute best slot + members
              console.log("fetchUsers: State set, calculating array...");
              this.calculateNatArray();
            }
          );
        } else {
          console.log("fetchUsers: No response data");
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        console.error("fetchUsers: Error occurred:", error);
        this.setState({ loading: false });
      });
  };


  calculateNatArray = () => {
    console.log("calculateNatArray: Starting...");
    // ✅ reset
    this.arr2d = new Array(40).fill(0);
    this.minIndex = 0;

    this.state.usersNat.forEach((arr) => {
      const nats = arr.nat;
      for (let i = 0; i < 40; i++) {
        this.arr2d[i] = nats[i] + this.arr2d[i];
      }
    });

    this.minIndex = this.arr2d.reduce((best, el, idx, array) => {
      return el > array[best] ? idx : best;
    }, 0);

    console.log("calculateNatArray: minIndex=", this.minIndex, "arr2d=", this.arr2d);
    this.getSlotFromIndex(this.minIndex);
  };


  getSlotFromIndex = (x) => {
    console.log("getSlotFromIndex: x=", x, "devArea=", this.state.devArea);
    var slot;
    if (x < 5) {
      slot = "08:30 - 09:15  ";
      slot = slot + this.getDayFromIndex(x + 1);
    } else if (x < 10) {
      slot = "09:15 - 10:00  ";
      slot = slot + this.getDayFromIndex(x + 1 - 5);
    } else if (x < 15) {
      slot = "10:00 - 10:45  ";
      slot = slot + this.getDayFromIndex(x + 1 - 10);
    } else if (x < 20) {
      slot = "10:45 - 11:30  ";
      slot = slot + this.getDayFromIndex(x + 1 - 15);
    } else if (x < 25) {
      slot = "11:30 - 12:15  ";
      slot = slot + this.getDayFromIndex(x + 1 - 20);
    } else if (x < 30) {
      slot = "12:15 - 13:00   ";
      slot = slot + this.getDayFromIndex(x + 1 - 25);
    } else if (x < 35) {
      slot = "14:30 - 15:15  ";
      slot = slot + this.getDayFromIndex(x + 1 - 30);
    } else if (x < 40) {
      slot = "15:15 - 16:00  ";
      slot = slot + this.getDayFromIndex(x + 1 - 35);
    }
    console.log("getSlotFromIndex: timeSlot=", slot);
    this.setState({ timeSlot: slot });
    console.log("getSlotFromIndex: Calling getMembers with slot=", x);
    this.getMembers(x, this.state.devArea);
  };
  getDayFromIndex(x) {
    this.setState({ day: x });
    console.log("get day called" + x);
    var day = "npda";
    if (x == 1) {
      day = "Monday";
    } else if (x == 2) {
      day = "Tuesday";
    } else if (x == 3) {
      day = "Wendsday";
    } else if (x == 4) {
      day = "Thursday";
    } else if (x == 5) {
      day = "Friday";
    }
    return day;
  }
  //fetchUsers ->  getSlotFromIndex -> getMembers
  getMembers = (slot, da) => {
    console.log("getMembers: slot=", slot, "devArea=", da);
    this.membersToAdd = [];
    // var members = [];
    var publicS = 0;
    var privateS = 0;
    var associate = 0;
    var academic = 0;
    var availableMembers = [];
    availableMembers[0] = this.state.usersNat.filter(function (el) {
      return el.sector == "Private" && el.nat[slot] == 1;
    });
    availableMembers[1] = this.state.usersNat.filter(function (el) {
      return el.sector == "Public" && el.nat[slot] == 1;
    });
    availableMembers[2] = this.state.usersNat.filter(function (el) {
      return el.sector == "Academic" && el.nat[slot] == 1;
    });
    availableMembers[3] = this.state.usersNat.filter(function (el) {
      return el.sector == "Association" && el.nat[slot] == 1;
    });
    console.log(availableMembers);
    if (da == "Policy") {
      publicS = 9;
      privateS = 7;
      academic = 3;
      associate = 1;
    } else if (da == "R&D") {
      publicS = 3;
      privateS = 7;
      academic = 9;
      associate = 1;
    } else if (da == "Technology") {
      publicS = 3;
      privateS = 9;
      academic = 7;
      associate = 1;
    } else if (da == "Work force") {
      publicS = 7;
      privateS = 9;
      academic = 3;
      associate = 1;
    } else if (da == "Productivity") {
      publicS = 8;
      privateS = 9;
      academic = 3;
      associate = 1;
    } else if (da == "Marketing") {
      publicS = 9;
      privateS = 7;
      academic = 3;
      associate = 1;
    }

    for (var x = 0; x < 4; x++) {
      for (var i = 0; i < availableMembers[x].length; i++) {
        if (x == 0 && i == privateS) {
          break;
        }
        if (x == 1) {
          this.loadPublicMembers(publicS, slot);
          break;
        }
        if (x == 2 && i == academic) {
          break;
        }
        if (x == 3 && i == associate) {
          break;
        }
        this.membersToAdd.push(availableMembers[x][i]);
      }
    }

    console.log("getMembers: Final membersToAdd=", this.membersToAdd);
    this.setState({ meetingMembers: this.membersToAdd, loading: false }, () => {
      console.log("getMembers: setState callback - loading should be false now, state.loading=", this.state.loading);
    });
  };

  loadPublicMembers = (count, slot) => {
    console.log("loadPublicMembers: count=", count, "slot=", slot);
    var secMembers = this.state.usersNat.filter(function (el) {
      return (
        el.sector == "Public" &&
        el.nat[slot] == 1 &&
        el.utype == "Committee Secretary"
      );
    });

    var otherMembers = this.state.usersNat.filter(function (el) {
      return el.sector == "Public" && el.nat[slot] == 1;
    });

    console.log("loadPublicMembers: secMembers found=", secMembers.length, "otherMembers found=", otherMembers.length);

    // Add secretary if available
    if (secMembers.length > 0) {
      console.log("loadPublicMembers: Adding secretary");
      this.membersToAdd.push(secMembers[0]);
      count = count - 1;
    } else {
      console.log("loadPublicMembers: No Secretaries available");
    }

    // Always add other public members
    console.log("loadPublicMembers: Adding", Math.min(count, otherMembers.length), "other public members");
    for (var i = 0; i < otherMembers.length; i++) {
      if (count > i) {
        this.membersToAdd.push(otherMembers[i]);
      }
    }
  };
  calculateBestTime = () => {
    this.setState({ loading: true }, this.fetchUsers);
  };
  fetchQuestions = async () => {
    let self = this;
    this.setState({ loadingDevArea: true });
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/questions`)
        .then(function (response) {
          return response.json();
        })
        .then((res) => {
          self.setState({ questions: res });
          let promise = res.map(async (que) => {
            const requestOptions = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: que.body,
              }),
            };
            // const res1 = await fetch(
            //   `${process.env.REACT_APP_BACKEND_URL}/admin/developing-area`,
            //   requestOptions
            // );
            // const data1 = await res1.json();
            return {
              _id: que._id,
              body: que.body,
              dArea: que.dArea,
              disabled: false,
            };
          });
          return Promise.all(promise);
        })
        .then((res) => {
          this.findMax(res);
        });
    } catch (e) {
      //if failed to communicate with api this code block will run
      console.log(e);
    }
  };

  findMax = (data_new) => {
    console.log(data_new);
    let policy = 0;
    let randd = 0;
    let technology = 0;
    let workforce = 0;
    let productivity = 0;
    let marketing = 0;

    if (data_new != null) {
      for (let index = 0; index < data_new.length; index++) {
        const element = data_new[index];
      }
      const saman = data_new;
      data_new.forEach((element) => {
        if (element.dArea == "Policy") {
          policy++;
        } else if (element.dArea == "R&D") {
          randd++;
        } else if (element.dArea == "Technology") {
          technology++;
        } else if (element.dArea == "Work force") {
          workforce++;
        } else if (element.dArea == "Productivity") {
          productivity++;
        } else if (element.dArea == "Marketing") {
          marketing++;
        }
      });

      let dAreaArr = [
        policy,
        productivity,
        randd,
        technology,
        marketing,
        workforce,
      ];
      console.log(dAreaArr);
      let max = dAreaArr[0];
      dAreaArr.forEach((element) => {
        if (max < element) {
          max = element;
        }
      });
      if (max == policy) {
        this.setState({ devArea: "Policy" });
      } else if (max == randd) {
        this.setState({ devArea: "R&D" });
      } else if (max == productivity) {
        this.setState({ devArea: "Productivity" });
      } else if (max == technology) {
        this.setState({ devArea: "Technology" });
      } else if (max == marketing) {
        this.setState({ devArea: "Marketing" });
      } else if (max == workforce) {
        this.setState({ devArea: "Workforce" });
      }
    }
    this.setState({ loadingDevArea: false });
    this.calculateBestTime();
  };

  formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  componentDidMount() {
    if (!this.props.submissionState) {
      this.fetchQuestions();
    }
  }

  onMarkerDragEnd = (coord) => {
    console.log(coord.latLng.lat(), " ", coord.latLng.lng());
    this.setState({
      lat: coord.latLng.lat(),
      lng: coord.latLng.lng(),
    });
    const directionUrl =
      "https://www.google.com/maps?saddr=My+Location&daddr=" +
      coord.latLng.lat() +
      "," +
      coord.latLng.lng();
    console.log(directionUrl);
  };

  onAddressChanged = (e) => {
    if (e.target.value != null && e.target.value.trim().length != 0) {
      Geocode.fromAddress(e.target.value).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          this.setState({
            camZoom: {
              lat: lat,
              lng: lng,
              zoom: 18,
            },
            lat: lat,
            lng: lng,
          });
        },
        (error) => {
          this.setState({
            camZoom: {
              lat: 6.817796083692221,
              lng: 79.89032876923123,
              zoom: 15,
            },
            lat: 6.817796083692221,
            lng: 79.89032876923123,
          });
        }
      );
    }
  };

  checkDate = (date) => {
    // console.log(date.target.value);
    var dateObj = new Date(date.target.value);
    // console.log(dateObj.getDay());
    if (dateObj.getDay() != 1) {
      alert("Please Select The Monday of the Week");
    } else {
      if (this.state.day != null) {
        var meetingDate = new Date();
        meetingDate.setDate(dateObj.getDate() + (this.state.day - 1));
        console.log(this.formatDate(meetingDate));
        this.setState({ date: this.formatDate(meetingDate) });
      }
    }
  };

  render() {
    const schema = yup.object({
      name: yup.string().required("Name is required!"),
      date: yup.string().required("Week is required!"),
      venue: yup.string().required("Venue is required!"),
      location: yup.string().required("Location is required!"),
    });

    const addNewEvent = async (event) => {
      // event.preventDefault();
      console.log("addNewEvent called");
      console.log("Form values:", event);
      console.log("Current state questions:", this.state.questions);

      const directionUrl =
        "https://www.google.com/maps?saddr=My+Location&daddr=" +
        this.state.lat +
        "," +
        this.state.lng;
      try {
        const payload = {
          sector: this.state.devArea,
          name: event.name,
          venue: event.venue,
          location: directionUrl,
          time: this.state.timeSlot,
          members: this.state.meetingMembers,
          date: this.state.date,
          questions: this.state.questions,
        };
        console.log("Sending event payload:", payload);
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        };
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/events/new`,
          requestOptions
        );

        const data = await res.json();

        console.log("Event creation response:", data);
        if (data.hasOwnProperty("error")) {
          this.setState({ error: data.error, showError: true });
          // setError(data.error);
          // setShow(true);
        } else {
          // setError("");
          // setShow(true);
          this.setState({ error: "", showError: true });
        }
      } catch (e) {
        console.log(e);
      }
    };

    const pathToPage = ["Home", "Users", "ManageEvents"];
    return (
      <div>
        {/* <div>This is my other component.</div> */}
        <div className="content">
          <Formik
            validationSchema={schema}
            onSubmit={addNewEvent}
            initialValues={{
              name: "",
            }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              isValid,
              errors,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Development Area</Form.Label>
                    <br />
                    <span style={{ fontWeight: 600 }}>
                      {this.state.loadingDevArea ? (
                        <div className="loader ml-4 mb-4">
                          Analyisng Development Area ...
                        </div>
                      ) : (
                        this.state.devArea
                      )}
                    </span>
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      isValid={touched.name && !errors.name}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name};
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Venue</Form.Label>
                    <Form.Control
                      type="text"
                      name="venue"
                      placeholder="Enter the venue"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.venue}
                      isValid={touched.venue && !errors.venue}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.venue}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Venue Location</Form.Label>

                    <Form.Control
                      type="text"
                      name="location"
                      onBlur={handleBlur}
                      placeholder="Enter Address here"
                      onChange={(e) => {
                        this.onAddressChanged(e);
                        handleChange(e);
                      }}
                      isInvalid={!!errors.location}
                      isValid={touched.location && !errors.location}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.location};
                    </Form.Control.Feedback>
                    {/* <Col>
                        <button className="btn bg-secondary"> Search</button>
                      </Col> */}

                    <br />
                    <MapWithAMarker
                      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCDNwCv-VFlb6sKsDpbt8ptidHZOS_ETuI&v=3.exp&libraries=geometry,drawing,places"
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ height: `400px` }} />}
                      mapElement={<div style={{ height: `100%` }} />}
                      // markerRef={this.onMarkerMounted}
                      onDragged={this.onMarkerDragEnd}
                      lat={this.state.lat}
                      lng={this.state.lng}
                      camera={this.state.camZoom}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Date (Select First Day of the Week)</Form.Label>
                    <Form.Control
                      required
                      name="date"
                      type="date"
                      placeholder="Select First Day of the Week"
                      onChange={(e) => {
                        this.checkDate(e);
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      value={values.date}
                      isValid={touched.date && !errors.date}
                      isInvalid={!!errors.date}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.date};
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  {this.state.date && (
                    <>
                      {this.state.loading ? (
                        <div className="loader ml-4 mb-4">Loading...</div>
                      ) : (
                        <Form.Group as={Col}>
                          <Form.Label>Time</Form.Label>

                          <Form.Control
                            className="inputBackground "
                            name="question"
                            placeholder=""
                            disabled={true}
                            value={this.state.timeSlot}
                            required
                            style={{ backgroundColor: "#ffffff" }}
                          />
                        </Form.Group>
                      )}
                    </>
                  )}
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Members</Form.Label>
                    <div className="row col-12 m-auto p-0">
                      {this.state.meetingMembers != null &&
                        this.state.meetingMembers.length != 0 ? (
                        this.state.meetingMembers.map((e) => {
                          return (
                            <MeetingMember
                              name={e.name}
                              sector={e.sector}
                              obj={e}
                            />
                          );
                        })
                      ) : (
                        <div className="loader ml-4 mb-4">
                          Analysing Development Area ...
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Challenges</Form.Label>
                    <div className=" col-12 m-auto">
                      {this.state.questions.length > 0 ? (
                        this.state.questions.map((e) => {
                          return (
                            <p>
                              <i class="far fa-question-circle"></i> {e.body}
                            </p>
                          );
                        })
                      ) : (
                        <div className="loader ml-4 mb-4">
                          Fetching Challenges...
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Form.Row>

                <Alert
                  show={this.state.showError}
                  variant={this.state.error == "" ? "success" : "danger"}
                >
                  <Alert.Heading>
                    {this.state.error != "" ? (
                      this.state.error
                    ) : (
                      <>
                        Event added Successfully !
                        <p className="text-secondary">
                          Email containing event details will be send to the
                          members
                        </p>
                      </>
                    )}
                  </Alert.Heading>

                  <hr />
                  <div className="d-flex justify-content-end">
                    {this.state.error == "" ? (
                      <Button
                        onClick={() => this.setState({ showError: false })}
                        variant="info"
                        className="btnPrimary"
                        onClick={this.props.close}
                      >
                        Done
                      </Button>
                    ) : (
                      <Button
                        onClick={() => this.setState({ showError: false })}
                        variant="primary"
                        className="btnPrimary"
                      >
                        OK
                      </Button>
                    )}
                  </div>
                </Alert>

                <Form.Row
                  id="footer-modal-addMember"
                  className="d-flex justify-content-end"
                >

                  <Button
                    variant=""
                    onClick={this.props.close}
                    className="btn-secondary mr-3 btn btn"
                  >
                    Cancel
                  </Button>

                  <Button variant="" type="submit" className="btn  btn-primary btn btn">
                    Submit
                  </Button>
                </Form.Row>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

export default AddEvents;