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
      loadingDevArea: false,
      devArea: null,
      meetingMembers: null,
      error: "",
      showError: false,
    };
    // this.handleClick = this.handleClick.bind(this);
  }

  fetchUsers = async () => {
    fetch(`http://localhost:5000/users/usersnat/`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
        token: Auth.getToken(),
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response)
          this.setState(
            {
              usersNat: response,
              loading: false,
            },
            this.calculateNatArray
          );
        console.log(response);
      })

      .catch((error) => console.log(error));
  };

  calculateNatArray = () => {
    var arr2d = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    this.state.usersNat.map((arr, i) => {
      var nats = arr.nat;
      for (var i = 0; i < 40; i++) {
        arr2d[i] = nats[i] + arr2d[i];
      }
    });

    var minIndex = arr2d.reduce(function (highestIndex, element, index, array) {
      return element < array[highestIndex] ? index : highestIndex;
    }, 0);

    console.log(arr2d);
    console.log(minIndex);
    this.getSlotFromIndex(minIndex);
  };

  getSlotFromIndex = (x) => {
    console.log("slot : " + x);
    var slot;
    if (x < 5) {
      slot = "8:30 - 9:15 ";
      slot = slot + this.getDayFromIndex(x + 1);
    } else if (x < 10) {
      slot = "9:15 - 10:00 ";
      slot = slot + this.getDayFromIndex(x + 1 - 5);
    } else if (x < 15) {
      slot = "10:00 - 10:45 ";
      slot = slot + this.getDayFromIndex(x + 1 - 10);
    } else if (x < 20) {
      slot = "10:45 - 11:30 ";
      slot = slot + this.getDayFromIndex(x + 1 - 15);
    } else if (x < 25) {
      slot = "11:30 - 12:15  ";
      slot = slot + this.getDayFromIndex(x + 1 - 20);
    } else if (x < 30) {
      slot = "12:15 - 13:00 ";
      slot = slot + this.getDayFromIndex(x + 1 - 25);
    } else if (x < 35) {
      slot = "14:30 - 15:15";
      slot = slot + this.getDayFromIndex(x + 1 - 30);
    } else if (x < 40) {
      slot = "15:15 - 16:00 ";
      slot = slot + this.getDayFromIndex(x + 1 - 35);
    }
    this.setState({ timeSlot: slot });
    this.getMembers(x, this.state.devArea);
  };
  getDayFromIndex(x) {
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

  getMembers = (slot, da) => {
    var members = [];
    var publicS = 0;
    var privateS = 0;
    var associate = 0;
    var academic = 0;
    var availableMembers = [];
    availableMembers[0] = this.state.usersNat.filter(function (el) {
      return el.sector == "Private" && el.nat[slot] == 0;
    });
    availableMembers[1] = this.state.usersNat.filter(function (el) {
      return el.sector == "Public" && el.nat[slot] == 0;
    });
    availableMembers[2] = this.state.usersNat.filter(function (el) {
      return el.sector == "Academic" && el.nat[slot] == 0;
    });
    availableMembers[3] = this.state.usersNat.filter(function (el) {
      return el.sector == "Association" && el.nat[slot] == 0;
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
        if (x == 1 && i == publicS) {
          break;
        }
        if (x == 2 && i == academic) {
          break;
        }
        if (x == 3 && i == associate) {
          break;
        }
        members.push(availableMembers[x][i]);
      }
    }

    console.log(members);
    this.setState({ meetingMembers: members });
  };
  calculateBestTime = () => {
    this.setState({ loading: true }, this.fetchUsers);
  };
  fetchQuestions = async () => {
    this.setState({ loadingDevArea: true });
    try {
      const res = await fetch("http://localhost:5000/admin/questions")
        .then(function (response) {
          return response.json();
        })
        .then((res) => {
          console.log(res);
          let promise = res.map(async (que) => {
            const requestOptions = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: que.body,
              }),
            };

            const res1 = await fetch(
              "http://localhost:5000/admin/developing-area",
              requestOptions
            );
            const data1 = await res1.json();
            return {
              _id: que._id,
              body: que.body,
              dArea: data1.SVM,
              disabled: false,
            };
          });
          console.log(res);
          return Promise.all(promise);
        })
        .then((res) => {
          console.log(res);
          // setquestions(res);

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

  getMeetingDate() {}

  componentDidMount() {
    this.fetchQuestions();
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

  render() {
    const schema = yup.object({
      name: yup.string().required("Name is required!"),
      venue: yup.string().required("Venue is required!"),
      location: yup.string().required("Location is required!"),
    });

    const addNewEvent = async (event) => {
      // event.preventDefault();
      console.log("addevent called");
      console.log(event);

      const directionUrl =
        "https://www.google.com/maps?saddr=My+Location&daddr=" +
        this.state.lat +
        "," +
        this.state.lng;
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sector: this.state.devArea,
            name: event.name,
            venue: event.venue,
            location: directionUrl,
            time: this.state.timeSlot,
            members: this.state.meetingMembers,
          }),
        };
        const res = await fetch(
          "http://localhost:5000/events/new",
          requestOptions
        );

        const data = await res.json();

        console.log(data);
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
                    <Form.Label>Event Sector</Form.Label>
                    <br />
                    <span style={{ fontSize: 22 }}>
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
                    <Form.Label>Event Name</Form.Label>
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
                {/* <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      required
                      name="name"
                      type="date"
                      placeholder=""
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

                  <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Time</Form.Label>
                    <Form.Control
                      required
                      name="email"
                      type="time"
                      placeholder=""
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.email}
                      isValid={touched.email && !errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row> */}

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
                  <Col className={"col-7"}>
                    <Form.Label>
                      <span>
                        Time :{" "}
                        <span style={{ fontSize: 18 }}>
                          {this.state.timeSlot}
                        </span>
                        {this.state.loading ? (
                          <div className="loader ml-4 mb-4">Loading...</div>
                        ) : null}
                      </span>
                    </Form.Label>
                  </Col>
                  <Col>
                    {/* <Button
                      className="btnPrimary"
                      variant="info"
                      onClick={this.calculateBestTime}
                    >
                      Calculate Optimal Event Time
                    </Button> */}
                  </Col>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Members</Form.Label>
                    <div className="row col-12 m-auto">
                      {this.state.meetingMembers != null ? (
                        this.state.meetingMembers.map((e) => {
                          return (
                            <MeetingMember name={e.name} sector={e.sector} />
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
                          Email containing event details will be send to the members
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
                  className="d-flex justify-content-between"
                >
                  <Button variant="info" type="submit" className="btnPrimary">
                    Submit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={this.props.close}
                    className="btnPrimary"
                  >
                    Cancel
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
