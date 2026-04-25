import React, { Component } from "react";
import { Form, Col, Button, Alert } from "react-bootstrap";
import * as yup from "yup";
import { Formik } from "formik";
import "./AddEvent.css";
import Geocode from "react-geocode";
import Auth from "../../authentication/Auth";
import MeetingMember from "../MeetingMember";
import { MapWithAMarker } from "../../components";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyDYHoy5PXJquPMDRlN7HtC6RdagafbpywQ");
Geocode.setLanguage("en");
Geocode.setRegion("lk");

class AddEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: 6.9195320074092646,
      lng: 79.84868518061056,
      camZoom: { lat: 6.9195320074092646, lng: 79.84868518061056, zoom: 15 },
      usersNat: [],
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

    this.arr2d = new Array(40).fill(0);
    this.fetchQuestions = this.fetchQuestions.bind(this);

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
        }

        if (s.maxArea) {
          this.state.devArea = s.maxArea;

          setTimeout(() => {
            this.calculateBestTime();
          }, 0);
        }
      } catch (e) {
        console.warn("Could not apply submissionState to AddEvents:", e);
      }
    }
  }

  componentDidMount() {
    if (!this.props.submissionState) {
      this.fetchQuestions();
    }
  }

  fetchUsers = async () => {
    console.log("fetchUsers: Starting fetch...");

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/usersnat/`, {
        method: "GET",
        headers: new Headers({
          Accept: "application/vnd.github.cloak-preview",
          token: Auth.getToken(),
        }),
      });

      console.log("fetchUsers: Received response status:", res.status);
      const response = await res.json();
      console.log("fetchUsers: Response data:", response);

      if (response && Array.isArray(response)) {
        this.setState(
          {
            usersNat: response,
          },
          () => {
            console.log("fetchUsers: State set, calculating best slot...");
            this.calculateBestSlotWith20Members();
          }
        );
      } else {
        this.setState({
          loading: false,
          error: "No users available to calculate meeting time.",
          showError: true,
        });
      }
    } catch (error) {
      console.error("fetchUsers: Error occurred:", error);
      this.setState({
        loading: false,
        error: "Failed to fetch users.",
        showError: true,
      });
    }
  };

  calculateBestTime = () => {
    this.setState(
      {
        loading: true,
        error: "",
        showError: false,
      },
      () => {
        this.fetchUsers();
      }
    );
  };

  calculateBestSlotWith20Members = () => {
    console.log("calculateBestSlotWith20Members: Starting...");

    if (!this.state.usersNat || !Array.isArray(this.state.usersNat) || this.state.usersNat.length === 0) {
      this.setState({
        loading: false,
        error: "No user availability data found.",
        showError: true,
      });
      return;
    }

    this.arr2d = new Array(40).fill(0);

    this.state.usersNat.forEach((user) => {
      const nats = user.nat || [];
      for (let i = 0; i < 40; i++) {
        this.arr2d[i] += nats[i] || 0;
      }
    });

    const slotScores = this.arr2d
      .map((count, index) => ({ index, count }))
      .sort((a, b) => b.count - a.count);

    console.log("slotScores:", slotScores);

    for (const slot of slotScores) {
      const members = this.getMembersForSlot(slot.index, this.state.devArea);

      if (members.length === 20) {
        console.log("Valid slot found:", slot.index, "member count:", members.length);
        this.getSlotFromIndex(slot.index, members);
        return;
      }
    }

    this.setState({
      loading: false,
      error: "No suitable time slot found with exactly 20 members.",
      showError: true,
      meetingMembers: [],
      timeSlot: null,
      day: null,
    });
  };

  getSlotFromIndex = (x, members = []) => {
    let slot = "";
    let dayIndex = null;

    if (x < 5) {
      dayIndex = x + 1;
      slot = "08:30 - 09:15";
    } else if (x < 10) {
      dayIndex = x - 4;
      slot = "09:15 - 10:00";
    } else if (x < 15) {
      dayIndex = x - 9;
      slot = "10:00 - 10:45";
    } else if (x < 20) {
      dayIndex = x - 14;
      slot = "10:45 - 11:30";
    } else if (x < 25) {
      dayIndex = x - 19;
      slot = "11:30 - 12:15";
    } else if (x < 30) {
      dayIndex = x - 24;
      slot = "12:15 - 13:00";
    } else if (x < 35) {
      dayIndex = x - 29;
      slot = "14:30 - 15:15";
    } else if (x < 40) {
      dayIndex = x - 34;
      slot = "15:15 - 16:00";
    }

    const dayName = this.getDayFromIndex(dayIndex);
    const fullSlot = `${slot} ${dayName}`;

    this.setState({
      timeSlot: fullSlot,
      day: dayIndex,
      meetingMembers: members,
      loading: false,
    });
  };

  getDayFromIndex = (x) => {
    if (x === 1) return "Monday";
    if (x === 2) return "Tuesday";
    if (x === 3) return "Wednesday";
    if (x === 4) return "Thursday";
    if (x === 5) return "Friday";
    return "";
  };

  getSectorQuota = (da) => {
    if (da === "Policy") {
      return { publicS: 9, privateS: 7, academic: 3, associate: 1 };
    }
    if (da === "R&D") {
      return { publicS: 3, privateS: 7, academic: 9, associate: 1 };
    }
    if (da === "Technology") {
      return { publicS: 3, privateS: 9, academic: 7, associate: 1 };
    }
    if (da === "Work force" || da === "Workforce") {
      return { publicS: 7, privateS: 9, academic: 3, associate: 1 };
    }
    if (da === "Productivity") {
      return { publicS: 8, privateS: 9, academic: 3, associate: 1 };
    }
    if (da === "Marketing") {
      return { publicS: 9, privateS: 7, academic: 3, associate: 1 };
    }

    return { publicS: 0, privateS: 0, academic: 0, associate: 0 };
  };

  getMembersForSlot = (slot, da) => {
    if (!this.state.usersNat || !Array.isArray(this.state.usersNat)) {
      return [];
    }

    const { publicS, privateS, academic, associate } = this.getSectorQuota(da);

    const privateMembers = this.state.usersNat.filter(
      (el) => el.sector === "Private" && el.nat && el.nat[slot] === 1
    );

    const publicSecretaries = this.state.usersNat.filter(
      (el) =>
        el.sector === "Public" &&
        el.nat &&
        el.nat[slot] === 1 &&
        el.utype === "Committee Secretary"
    );

    const publicOthers = this.state.usersNat.filter(
      (el) =>
        el.sector === "Public" &&
        el.nat &&
        el.nat[slot] === 1 &&
        el.utype !== "Committee Secretary"
    );

    const academicMembers = this.state.usersNat.filter(
      (el) => el.sector === "Academic" && el.nat && el.nat[slot] === 1
    );

    const associationMembers = this.state.usersNat.filter(
      (el) => el.sector === "Association" && el.nat && el.nat[slot] === 1
    );

    const selected = [];

    selected.push(...privateMembers.slice(0, privateS));

    if (publicSecretaries.length > 0) {
      selected.push(publicSecretaries[0]);
      selected.push(...publicOthers.slice(0, Math.max(publicS - 1, 0)));
    } else {
      selected.push(...publicOthers.slice(0, publicS));
    }

    selected.push(...academicMembers.slice(0, academic));
    selected.push(...associationMembers.slice(0, associate));

    const uniqueMembers = [];
    const seen = new Set();

    selected.forEach((member) => {
      const key = member._id || member.email || `${member.name}-${member.sector}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueMembers.push(member);
      }
    });

    return uniqueMembers;
  };

  fetchQuestions = async () => {
    let self = this;
    this.setState({ loadingDevArea: true });

    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/questions`)
        .then(function (response) {
          return response.json();
        })
        .then((res) => {
          self.setState({ questions: res });
          let promise = res.map(async (que) => {
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
      console.log(e);
      this.setState({
        loadingDevArea: false,
        error: "Failed to fetch questions.",
        showError: true,
      });
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
      data_new.forEach((element) => {
        if (element.dArea === "Policy") {
          policy++;
        } else if (element.dArea === "R&D") {
          randd++;
        } else if (element.dArea === "Technology") {
          technology++;
        } else if (element.dArea === "Work force" || element.dArea === "Workforce") {
          workforce++;
        } else if (element.dArea === "Productivity") {
          productivity++;
        } else if (element.dArea === "Marketing") {
          marketing++;
        }
      });

      let dAreaArr = [policy, productivity, randd, technology, marketing, workforce];
      let max = dAreaArr[0];

      dAreaArr.forEach((element) => {
        if (max < element) {
          max = element;
        }
      });

      let selectedDevArea = null;

      if (max === policy) {
        selectedDevArea = "Policy";
      } else if (max === randd) {
        selectedDevArea = "R&D";
      } else if (max === productivity) {
        selectedDevArea = "Productivity";
      } else if (max === technology) {
        selectedDevArea = "Technology";
      } else if (max === marketing) {
        selectedDevArea = "Marketing";
      } else if (max === workforce) {
        selectedDevArea = "Workforce";
      }

      this.setState(
        {
          devArea: selectedDevArea,
          loadingDevArea: false,
        },
        () => {
          this.calculateBestTime();
        }
      );

      return;
    }

    this.setState({ loadingDevArea: false });
  };

  formatDate = (date) => {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;

    return [year, month, day].join("-");
  };

  onMarkerDragEnd = (coord) => {
    this.setState({
      lat: coord.latLng.lat(),
      lng: coord.latLng.lng(),
    });
  };

  onAddressChanged = (e) => {
    if (e.target.value != null && e.target.value.trim().length !== 0) {
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
        () => {
          this.setState({
            camZoom: {
              lat: 6.9195320074092646,
              lng: 79.84868518061056,
              zoom: 15,
            },
            lat: 6.9195320074092646,
            lng: 79.84868518061056,
          });
        }
      );
    }
  };

  checkDate = (event) => {
    const selectedMonday = new Date(event.target.value);

    if (selectedMonday.getDay() !== 1) {
      alert("Please Select The Monday of the Week");
      return;
    }

    if (this.state.day == null) return;

    const meetingDate = new Date(selectedMonday);
    meetingDate.setDate(selectedMonday.getDate() + (this.state.day - 1));

    this.setState({ date: this.formatDate(meetingDate) });
  };

  render() {
    const schema = yup.object({
      name: yup.string().required("Name is required!"),
      date: yup.string().required("Week is required!"),
      venue: yup.string().required("Venue is required!"),
      location: yup.string().required("Location is required!"),
    });

    const addNewEvent = async (event) => {
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

        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/events/new`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          this.setState({
            error: data.error || "Failed to create event",
            showError: true,
          });
          return;
        }

        this.setState({
          error: "",
          showError: true,
        });
      } catch (e) {
        console.log("Submit error:", e);
        this.setState({
          error: "Something went wrong while submitting the event",
          showError: true,
        });
      }
    };

    return (
      <div>
        <div className="content">
          <Formik
            validationSchema={schema}
            onSubmit={addNewEvent}
            initialValues={{
              name: "",
              venue: "",
              location: "",
              date: "",
            }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
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
                          Analysing Development Area ...
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
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridVenue">
                    <Form.Label>Venue</Form.Label>
                    <Form.Control
                      type="text"
                      name="venue"
                      placeholder="Enter the venue"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.venue}
                      isInvalid={!!errors.venue}
                      isValid={touched.venue && !errors.venue}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.venue}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridLocation">
                    <Form.Label>Venue Location</Form.Label>

                    <Form.Control
                      type="text"
                      name="location"
                      onBlur={handleBlur}
                      placeholder="Enter Address here"
                      value={values.location}
                      onChange={(e) => {
                        this.onAddressChanged(e);
                        handleChange(e);
                      }}
                      isInvalid={!!errors.location}
                      isValid={touched.location && !errors.location}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.location}
                    </Form.Control.Feedback>

                    <br />
                    <MapWithAMarker
                      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDYHoy5PXJquPMDRlN7HtC6RdagafbpywQ&v=3.exp&libraries=geometry,drawing,places"
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ height: `400px` }} />}
                      mapElement={<div style={{ height: `100%` }} />}
                      onDragged={this.onMarkerDragEnd}
                      lat={this.state.lat}
                      lng={this.state.lng}
                      camera={this.state.camZoom}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridDate">
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
                      {errors.date}
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
                            className="inputBackground"
                            name="question"
                            placeholder=""
                            disabled={true}
                            value={this.state.timeSlot || ""}
                            required
                            style={{ backgroundColor: "#ffffff" }}
                          />
                        </Form.Group>
                      )}
                    </>
                  )}
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridMembers">
                    <Form.Label>Members</Form.Label>
                    <div className="row col-12 m-auto p-0">
                      {this.state.meetingMembers && this.state.meetingMembers.length !== 0 ? (
                        this.state.meetingMembers.map((e, index) => (
                          <MeetingMember
                            key={e._id || e.email || index}
                            name={e.name}
                            sector={e.sector}
                            obj={e}
                          />
                        ))
                      ) : (
                        <div className="loader ml-4 mb-4">
                          Analysing Development Area ...
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridChallenges">
                    <Form.Label>Challenges</Form.Label>
                    <div className="col-12 m-auto">
                      {this.state.questions.length > 0 ? (
                        this.state.questions.map((e, index) => (
                          <p key={e._id || index}>
                            <i className="far fa-question-circle"></i> {e.body}
                          </p>
                        ))
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
                  variant={this.state.error === "" ? "success" : "danger"}
                >
                  <Alert.Heading>
                    {this.state.error !== "" ? (
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


                  <div className="d-flex justify-content-end">
                    {this.state.error === "" ? (
                      <Button
                        variant=""
                        className="btn btn-primary"
                        onClick={this.props.close}
                      >
                        Done
                      </Button>
                    ) : (
                      <Button
                        onClick={() => this.setState({ showError: false })}
                        variant="primary"
                        className="btn btn-primary btn"
                      >
                        OK
                      </Button>
                    )}
                  </div>
                </Alert>


                {!this.state.showError && (
                  <Form.Row
                    id="footer-modal-addMember"
                    className="d-flex justify-content-end"
                  >
                    <Button
                      variant=""
                      onClick={this.props.close}
                      className="btn-secondary mr-3 btn"
                    >
                      Cancel
                    </Button>

                    <Button variant="" type="submit" className="btn btn-primary">
                      Submit
                    </Button>
                  </Form.Row>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

export default AddEvents;

