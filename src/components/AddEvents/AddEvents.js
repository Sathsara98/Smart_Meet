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
    console.log("slot : "+x)
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
    this.setState({timeSlot:slot});
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

  calculateBestTime = () => {
    this.setState({ loading: true }, this.fetchUsers);
  };

  getMeetingDate() {}

  componentDidMount() {
    // this.fetchUsers();
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
    // const [show, setShow] = useState(false);
    // const [error, setError] = useState("");
    const phoneRegExp =
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    // const markerRef = React.useRef();

    const schema = yup.object({
      name: yup.string().required("Name is required!"),
      email: yup
        .string()
        .email("Invalid Email : Ex example@example.com")
        .required("Email is required!"),
      tel: yup
        .string()
        .matches(phoneRegExp, "Phone Number is not valid")
        .min(10, "Phone no should be atleast 10 numbers long")
        .max(10, "Phone no should not more than 10 numbers long")
        .required("Phone no is required!"),
      sector: yup
        .string()
        .required("Sector is required!")
        .notOneOf(["Select Sector"], "Selection Invalid"),
      workplace: yup.string().required("Workplace is required!"),
      role: yup
        .string()
        .required("Role is required!")
        .notOneOf(["Select Member Role"], "Selection Invalid"),
      gender: yup
        .string()
        .required("Gender is required!")
        .notOneOf(["Select Gender"], "Selection Invalid"),
    });

    const registerMember = async (event) => {
      // event.preventDefault();
      console.log(event);
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            utype: event.role,
            name: event.name,
            email: event.email.toLowerCase(),
            tel: event.tel,
            sector: event.sector,
            workplace: event.workplace,
            gender: event.gender,
          }),
        };
        const res = await fetch(
          "http://localhost:5000/users/register",
          requestOptions
        );

        const data = await res.json();

        console.log(data);
        if (data.hasOwnProperty("error")) {
          // setError(data.error);
          // setShow(true);
        } else {
          // setError("");
          // setShow(true);
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
            onSubmit={registerMember}
            initialValues={{
              name: "",
              email: "",
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
                      // isValid={touched.name && !errors.name}
                      // isInvalid={!!errors.name}
                    />

                    <Form.Control.Feedback type="invalid">
                      {/* {errors.name}; */}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
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
                      // isValid={touched.name && !errors.name}
                      // isInvalid={!!errors.name}
                    />

                    <Form.Control.Feedback type="invalid">
                      {/* {errors.name}; */}
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
                      // isInvalid={!!errors.email}
                      // isValid={touched.email && !errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {/* {errors.email} */}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Venue</Form.Label>
                    <Form.Control
                      type="tel"
                      name="tel"
                      placeholder="Enter the venue"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      // isInvalid={!!errors.tel}
                      // isValid={touched.tel && !errors.tel}
                    />
                    <Form.Control.Feedback type="invalid">
                      {/* {errors.tel} */}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Venue Location</Form.Label>
                    <br />
                    <Row>
                      <Col>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Address here"
                          onChange={this.onAddressChanged}
                          // isInvalid={!!errors.tel}
                          // isValid={touched.tel && !errors.tel}
                        />
                      </Col>
                      {/* <Col>
                        <button className="btn bg-secondary"> Search</button>
                      </Col> */}
                    </Row>
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
                        Time : <span style={{fontSize:22}}>{this.state.timeSlot}</span>
                        {this.state.loading ? (
                          <div className="loader ml-4 mb-4">Loading...</div>
                        ) : null}
                      </span>
                    </Form.Label>
                  </Col>
                  <Col>
                    <Button className="btnPrimary" variant="info"  onClick={this.calculateBestTime}>
                      Calculate Optimal Event Time
                    </Button>
                  </Col>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Members</Form.Label>
                    <div className="row col-12 m-auto">
                      <div className="p-1 memberCards">
                        <Card
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            float: "left",
                            margin: "5px",
                          }}
                        >
                          <Card.Img variant="top" src={profile} />

                          <Card.Title className="text-center">Saman</Card.Title>
                        </Card>
                      </div>
                      <div className="p-1 memberCards">
                        <Card
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            float: "left",
                            margin: "5px",
                          }}
                        >
                          <Card.Img variant="top" src={profile} />

                          <Card.Title className="text-center">Saman</Card.Title>
                        </Card>
                      </div>
                      <div className="p-1 memberCards">
                        <Card
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            float: "left",
                            margin: "5px",
                          }}
                        >
                          <Card.Img variant="top" src={profile} />

                          <Card.Title className="text-center">Saman</Card.Title>
                        </Card>
                      </div>
                      <div className="p-1 memberCards">
                        <Card
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            float: "left",
                            margin: "5px",
                          }}
                        >
                          <Card.Img variant="top" src={profile} />

                          <Card.Title className="text-center">Saman</Card.Title>
                        </Card>
                      </div>
                      <div className="p-1 memberCards">
                        <Card
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            float: "left",
                            margin: "5px",
                          }}
                        >
                          <Card.Img variant="top" src={profile} />

                          <Card.Title className="text-center">Saman</Card.Title>
                        </Card>
                      </div>
                      <div className="p-1 memberCards">
                        <Card
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            float: "left",
                            margin: "5px",
                          }}
                        >
                          <Card.Img variant="top" src={profile} />

                          <Card.Title className="text-center">Saman</Card.Title>
                        </Card>
                      </div>
                      <div className="p-1 memberCards">
                        <Card
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            float: "left",
                            margin: "5px",
                          }}
                        >
                          <Card.Img variant="top" src={profile} />

                          <Card.Title className="text-center">Saman</Card.Title>
                        </Card>
                      </div>
                      <div className="p-1 memberCards">
                        <Card
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            float: "left",
                            margin: "5px",
                          }}
                        >
                          <Card.Img variant="top" src={profile} />

                          <Card.Title className="text-center">Saman</Card.Title>
                        </Card>
                      </div>
                      <div className="p-1 memberCards">
                        <Card
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            float: "left",
                            margin: "5px",
                          }}
                        >
                          <Card.Img variant="top" src={profile} />

                          <Card.Title className="text-center">Saman</Card.Title>
                        </Card>
                      </div>
                      <div className="p-1 memberCards">
                        <Card
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            float: "left",
                            margin: "5px",
                          }}
                        >
                          <Card.Img variant="top" src={profile} />

                          <Card.Title className="text-center">Saman</Card.Title>
                        </Card>
                      </div>
                      <div className="p-1 memberCards">
                        <Card
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            float: "left",
                            margin: "5px",
                          }}
                        >
                          <Card.Img variant="top" src={profile} />

                          <Card.Title className="text-center">Saman</Card.Title>
                        </Card>
                      </div>
                      <div className="p-1 memberCards">
                        <Card
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            float: "left",
                            margin: "5px",
                          }}
                        >
                          <Card.Img variant="top" src={profile} />

                          <Card.Title className="text-center">Saman</Card.Title>
                        </Card>
                      </div>
                      <div className="p-1 memberCards">
                        <Card
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            float: "left",
                            margin: "5px",
                          }}
                        >
                          <Card.Img variant="top" src={profile} />

                          <Card.Title className="text-center">Saman</Card.Title>
                        </Card>
                      </div>
                    </div>
                  </Form.Group>
                </Form.Row>

                <Alert
                  show={false}
                  // variant={error == "" ? "success" : "danger"}
                >
                  {/* <Alert.Heading>
                    {error != "" ? (
                      error
                    ) : (
                      <>
                        Member Registered Successfully !
                        <p className="text-secondary">
                          Email containing loging details has been Successfully
                          sent to the Member.
                        </p>
                      </>
                    )}
                  </Alert.Heading> */}

                  <hr />
                  <div className="d-flex justify-content-end">
                    {/* {error == "" ? (
                      <Button
                        // onClick={() => setShow(false)}
                        variant="info"
                        className="btnPrimary"
                        onClick={props.close}
                      >
                        Done
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setShow(false)}
                        variant="primary"
                        className="btnPrimary"
                      >
                        OK
                      </Button>
                    )} */}
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
                    // onClick={props.close}
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
