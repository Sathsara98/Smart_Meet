import React, { Component } from "react";
import { Form, Col, Button, Alert } from "react-bootstrap";
import * as yup from "yup";
import { Formik } from "formik";
import "./AddEvent.css";
import Geocode from "react-geocode";
import Auth from "../../authentication/Auth";
import MeetingMember from "../MeetingMember";
import { MapWithAMarker } from "../../components";




// Google Geocode setup.
// This is used to convert a typed address into latitude and longitude for the map.
Geocode.setApiKey("AIzaSyDYHoy5PXJquPMDRlN7HtC6RdagafbpywQ");
Geocode.setLanguage("en");
Geocode.setRegion("lk");




class AddEvents extends Component {
  constructor(props) {
    super(props);


    // State is used to store data that can change on this page.
    // Example: selected date, selected members, loading status, errors, etc.
    this.state = {
      // Default map location latitude
      lat: 6.9195320074092646,


      // Default map location longitude
      lng: 79.84868518061056,


      // Default map camera position and zoom level
      camZoom: { lat: 6.9195320074092646, lng: 79.84868518061056, zoom: 15 },


      // This stores all users with their availability data
      usersNat: [],


      // Used to show loading when best time is calculating
      loading: false,


      // Stores the final selected best time slot
      timeSlot: null,


      // Stores the final calculated meeting date
      date: null,


      // Stores the selected day number
      // Example: 1 = Monday, 2 = Tuesday
      day: null,


      // Used to show loading while development area is being analysed
      loadingDevArea: false,


      // Stores the selected development area
      // Example: Policy, R&D, Technology
      devArea: null,


      // Stores final selected meeting members
      meetingMembers: [],


      // Stores error message
      error: "",


      // Controls whether success/error alert should be shown
      showError: false,


      // Stores submitted challenges/questions
      questions: [],
    };


    // This array has 40 positions.
    // Logic: 5 weekdays x 8 time slots = 40 slots.
    // Each index stores how many members are available for that slot.
    this.arr2d = new Array(40).fill(0);


    // Binding function so it can access "this" correctly
    this.fetchQuestions = this.fetchQuestions.bind(this);


    // If this component receives submissionState from another component,
    // it uses that data directly instead of fetching questions again.
    if (props && props.submissionState) {
      try {
        const s = props.submissionState;
        console.log("AddEvents received submissionState:", s);


        // If questions are already passed through props,
        // format them and save into state.
        if (s.questions && Array.isArray(s.questions) && s.questions.length > 0) {
          this.state.questions = s.questions.map((q, i) => ({
            _id: q._id || `pre-${i}`,
            body: q.body || q,
            dArea: q.dArea || q.dArea,
            disabled: false,
          }));
        }


        // If highest development area is already calculated,
        // save it and start calculating best meeting time.
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
    // componentDidMount runs after the page/component loads.


    // If submissionState is not passed,
    // then the system fetches questions from backend.
    if (!this.props.submissionState) {
      this.fetchQuestions();
    }
  }




  fetchUsers = async () => {
    // This function fetches all users and their availability data from backend.
    // Availability data is needed to calculate the best meeting time.


    console.log("fetchUsers: Starting fetch...");


    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/usersnat/`, {
        method: "GET",
        headers: new Headers({
          Accept: "application/vnd.github.cloak-preview",


          // Token is sent to backend to prove logged-in user is authorized.
          token: Auth.getToken(),
        }),
      });


      console.log("fetchUsers: Received response status:", res.status);


      // Convert backend response into JSON format.
      const response = await res.json();
      console.log("fetchUsers: Response data:", response);


      // If backend returns a valid array of users,
      // save users into state and then calculate the best slot.
      if (response && Array.isArray(response)) {
        this.setState(
          {
            usersNat: response,
          },
          () => {
            console.log("fetchUsers: State set, calculating best slot...");


            // After users are saved, calculate best meeting slot.
            this.calculateBestSlotWith20Members();
          }
        );
      } else {
        // If backend does not return users, show error.
        this.setState({
          loading: false,
          error: "No users available to calculate meeting time.",
          showError: true,
        });
      }
    } catch (error) {
      // If backend request fails, show error.
      console.error("fetchUsers: Error occurred:", error);
      this.setState({
        loading: false,
        error: "Failed to fetch users.",
        showError: true,
      });
    }
  };




  calculateBestTime = () => {
    // This function starts the automatic best time calculation.
    // Logic:
    // 1. Show loading.
    // 2. Clear previous errors.
    // 3. Fetch user availability.
    // 4. After users are fetched, best time will be calculated.


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
    // This function calculates the best time slot for the meeting.
    // Logic:
    // 1. Check whether users exist.
    // 2. Count how many users are available in each of the 40 slots.
    // 3. Sort slots by highest availability.
    // 4. Check each slot and select members based on sector quota.
    // 5. If exactly 20 members are available, select that slot.
    // 6. If no valid slot is found, show error.


    console.log("calculateBestSlotWith20Members: Starting...");


    // If no users are available, calculation cannot continue.
    if (!this.state.usersNat || !Array.isArray(this.state.usersNat) || this.state.usersNat.length === 0) {
      this.setState({
        loading: false,
        error: "No user availability data found.",
        showError: true,
      });
      return;
    }


    // Reset all 40 time slots to 0 before calculating.
    this.arr2d = new Array(40).fill(0);


    // Go through every user.
    // user.nat contains availability values.
    // If nats[i] is 1, user is available for that slot.
    // If nats[i] is 0, user is not available.
    this.state.usersNat.forEach((user) => {
      const nats = user.nat || [];
      for (let i = 0; i < 40; i++) {
        this.arr2d[i] += nats[i] || 0;
      }
    });


    // Convert slot count into objects like:
    // { index: 0, count: 15 }
    // Then sort by highest available count.
    const slotScores = this.arr2d
      .map((count, index) => ({ index, count }))
      .sort((a, b) => b.count - a.count);


    console.log("slotScores:", slotScores);


    // Check the most available slots first.
    for (const slot of slotScores) {
      // Get valid members for this slot based on development area and sector quota.
      const members = this.getMembersForSlot(slot.index, this.state.devArea);


      // Meeting requires exactly 20 members.
      // If exactly 20 valid members are found, select this slot.
      if (members.length === 20) {
        console.log("Valid slot found:", slot.index, "member count:", members.length);
        this.getSlotFromIndex(slot.index, members);
        return;
      }
    }


    // If no slot has exactly 20 members, show error.
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
    // This function converts slot index into real time and day.
    // Example:
    // Slot index 0 means Monday 08:30 - 09:15.
    // Slot index 5 means Monday 09:15 - 10:00.
    // There are 5 days and 8 time periods.


    let slot = "";
    let dayIndex = null;


    // First 5 indexes are 08:30 - 09:15 from Monday to Friday.
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


    // Convert day number into day name.
    const dayName = this.getDayFromIndex(dayIndex);


    // Final time slot text.
    const fullSlot = `${slot} ${dayName}`;


    // Save selected time slot, day, members into state.
    this.setState({
      timeSlot: fullSlot,
      day: dayIndex,
      meetingMembers: members,
      loading: false,
    });
  };




  getDayFromIndex = (x) => {
    // This function converts day number into day name.
    // 1 means Monday, 2 means Tuesday, etc.


    if (x === 1) return "Monday";
    if (x === 2) return "Tuesday";
    if (x === 3) return "Wednesday";
    if (x === 4) return "Thursday";
    if (x === 5) return "Friday";
    return "";
  };




  getSectorQuota = (da) => {
    // This function decides how many members should be selected
    // from each sector based on the development area.
    //
    // Example:
    // If development area is Policy,
    // system selects 9 public, 7 private, 3 academic, 1 association.
    //
    // This supports automatic committee composition.


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


    // If development area is not matched, return zero quota.
    return { publicS: 0, privateS: 0, academic: 0, associate: 0 };
  };




  getMembersForSlot = (slot, da) => {
    // This function selects members for a particular time slot.
    // Logic:
    // 1. Get required sector quota according to development area.
    // 2. Filter members who are available for selected slot.
    // 3. Select members from Private, Public, Academic, and Association sectors.
    // 4. Make sure Committee Secretary is included.
    // 5. Remove duplicate members.
    // 6. Return final selected members.


    if (!this.state.usersNat || !Array.isArray(this.state.usersNat)) {
      return [];
    }


    // Get required member count for each sector.
    const { publicS, privateS, academic, associate } = this.getSectorQuota(da);


    // Get private members available for this time slot.
    const privateMembers = this.state.usersNat.filter(
      (el) => el.sector === "Private" && el.nat && el.nat[slot] === 1
    );


    // Get public sector members who are Committee Secretary and available.
    const publicSecretaries = this.state.usersNat.filter(
      (el) =>
        el.sector === "Public" &&
        el.nat &&
        el.nat[slot] === 1 &&
        el.utype === "Committee Secretary"
    );


    // Get other public sector members except Committee Secretary.
    const publicOthers = this.state.usersNat.filter(
      (el) =>
        el.sector === "Public" &&
        el.nat &&
        el.nat[slot] === 1 &&
        el.utype !== "Committee Secretary"
    );


    // Get academic members available for this time slot.
    const academicMembers = this.state.usersNat.filter(
      (el) => el.sector === "Academic" && el.nat && el.nat[slot] === 1
    );


    // Get association members available for this time slot.
    const associationMembers = this.state.usersNat.filter(
      (el) => el.sector === "Association" && el.nat && el.nat[slot] === 1
    );


    // This array stores selected members.
    const selected = [];


    // Add private members according to private sector quota.
    selected.push(...privateMembers.slice(0, privateS));


    // Committee Secretary is mandatory.
    // If no secretary is available for this slot, this slot is invalid.
    if (publicSecretaries.length === 0) {
      return [];
    }


    // Add one Committee Secretary.
    selected.push(publicSecretaries[0]);


    // Add other public members.
    // publicS - 1 because one public place is already used by secretary.
    selected.push(...publicOthers.slice(0, Math.max(publicS - 1, 0)));


    // Add academic members according to quota.
    selected.push(...academicMembers.slice(0, academic));


    // Add association members according to quota.
    selected.push(...associationMembers.slice(0, associate));


    // Remove duplicate members.
    // This prevents the same member from being added twice.
    const uniqueMembers = [];
    const seen = new Set();


    selected.forEach((member) => {
      // Create unique key using id, email, or name-sector.
      const key = member._id || member.email || `${member.name}-${member.sector}`;


      // Add member only if not already added.
      if (!seen.has(key)) {
        seen.add(key);
        uniqueMembers.push(member);
      }
    });


    // Return final selected unique members.
    return uniqueMembers;
  };




  fetchQuestions = async () => {
    // This function fetches submitted challenges/questions from backend.
    // These challenges are used to find the highest priority development area.


    let self = this;


    // Show loading while analysing development area.
    this.setState({ loadingDevArea: true });


    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/questions`)
        .then(function (response) {
          // Convert backend response to JSON.
          return response.json();
        })
        .then((res) => {
          // Save all questions into state.
          self.setState({ questions: res });


          // Format question data.
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
          // After formatting questions, find the development area
          // with the highest number of challenges.
          this.findMax(res);
        });
    } catch (e) {
      // If question loading fails, show error message.
      console.log(e);
      this.setState({
        loadingDevArea: false,
        error: "Failed to fetch questions.",
        showError: true,
      });
    }
  };




  findMax = (data_new) => {
    // This function finds the development area with the highest number of challenges.
    // Logic:
    // 1. Count how many challenges belong to each development area.
    // 2. Find the highest count.
    // 3. Select that development area as priority.
    // 4. Then calculate best meeting time for that area.


    console.log(data_new);


    // Variables to count challenges by area.
    let policy = 0;
    let randd = 0;
    let technology = 0;
    let workforce = 0;
    let productivity = 0;
    let marketing = 0;


    if (data_new != null) {
      // Count challenges based on dArea value.
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


      // Store all development area counts in one array.
      let dAreaArr = [policy, productivity, randd, technology, marketing, workforce];


      // Start by assuming first value is the maximum.
      let max = dAreaArr[0];


      // Find highest count.
      dAreaArr.forEach((element) => {
        if (max < element) {
          max = element;
        }
      });


      let selectedDevArea = null;


      // Select development area that has the highest count.
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


      // Save selected development area into state.
      this.setState(
        {
          devArea: selectedDevArea,
          loadingDevArea: false,
        },
        () => {
          // After finding development area,
          // calculate best meeting time automatically.
          this.calculateBestTime();
        }
      );


      return;
    }


    // If there is no data, stop loading.
    this.setState({ loadingDevArea: false });
  };




  formatDate = (date) => {
    // This function converts a date into YYYY-MM-DD format.
    // This format is commonly used for saving dates in database.


    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();


    // Add 0 before month if month is single digit.
    if (month.length < 2) month = `0${month}`;


    // Add 0 before day if day is single digit.
    if (day.length < 2) day = `0${day}`;


    // Return formatted date.
    return [year, month, day].join("-");
  };




  onMarkerDragEnd = (coord) => {
    // This function runs when user drags the map marker.
    // It updates latitude and longitude based on new marker position.


    this.setState({
      lat: coord.latLng.lat(),
      lng: coord.latLng.lng(),
    });
  };




  onAddressChanged = (e) => {
    // This function runs when user types a venue address.
    // Logic:
    // 1. Check address is not empty.
    // 2. Convert address into latitude and longitude.
    // 3. Move map marker to that location.
    // 4. If address cannot be found, reset to default location.


    if (e.target.value != null && e.target.value.trim().length !== 0) {
      Geocode.fromAddress(e.target.value).then(
        (response) => {
          // Get latitude and longitude from geocode response.
          const { lat, lng } = response.results[0].geometry.location;


          // Update map position.
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
          // If address search fails, reset map to default location.
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
    // This function checks selected week start date.
    // Logic:
    // 1. User must select Monday as first day of week.
    // 2. System already calculated best day number.
    // 3. Final meeting date is calculated using Monday + best day.


    const selectedMonday = new Date(event.target.value);


    // getDay() returns:
    // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
    // This system requires Monday.
    if (selectedMonday.getDay() !== 1) {
      alert("Please Select The Monday of the Week");
      return;
    }


    // If best day is not calculated yet, stop.
    if (this.state.day == null) return;


    // Create meeting date from selected Monday.
    const meetingDate = new Date(selectedMonday);


    // Add calculated day offset.
    // Example: if best day is Wednesday, day = 3.
    // Monday + 2 days = Wednesday.
    meetingDate.setDate(selectedMonday.getDate() + (this.state.day - 1));


    // Save final meeting date in YYYY-MM-DD format.
    this.setState({ date: this.formatDate(meetingDate) });
  };




  render() {
    // This validation schema checks required form fields.
    // yup is used together with Formik.
    const schema = yup.object({
      name: yup.string().required("Name is required!"),
      date: yup.string().required("Week is required!"),
      venue: yup.string().required("Meeting location is required!"),
      location: yup.string().required("Venue is required!"),
    });




    const addNewEvent = async (event) => {
      // This function runs when Submit button is clicked.
      // Logic:
      // 1. Collect form values.
      // 2. Create Google Maps direction URL.
      // 3. Create payload with meeting details.
      // 4. Send payload to backend.
      // 5. Show success or error message.


      console.log("addNewEvent called");
      console.log("Form values:", event);
      console.log("Current state questions:", this.state.questions);


      // Create Google Maps direction URL using selected latitude and longitude.
      const directionUrl =
        "https://www.google.com/maps?saddr=My+Location&daddr=" +
        this.state.lat +
        "," +
        this.state.lng;


      try {
        // Payload means the data object sent to backend.
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


        // Send new event data to backend API.
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/events/new`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });


        // Convert response to JSON.
        const data = await res.json();


        // If response is not successful, show backend error.
        if (!res.ok) {
          this.setState({
            error: data.error || "Failed to create event",
            showError: true,
          });
          return;
        }


        // If event is created successfully, show success alert.
        this.setState({
          error: "",
          showError: true,
        });
      } catch (e) {
        // If something goes wrong while submitting, show error.
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
          {/* Formik manages form values, validation, and form submission */}
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


                {/* Development area display section */}
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


                {/* Meeting name input */}
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


                    {/* Show validation error for meeting name */}
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>


                {/* Venue address section */}
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridLocation">
                    <Form.Label>Venue</Form.Label>


                    <Form.Control
                      type="text"
                      name="location"
                      onBlur={handleBlur}
                      placeholder="Enter Address here"
                      value={values.location}
                      onChange={(e) => {
                        // Update map based on typed address.
                        this.onAddressChanged(e);


                        // Update Formik form value.
                        handleChange(e);
                      }}
                      isInvalid={!!errors.location}
                      isValid={touched.location && !errors.location}
                    />


                    {/* Show validation error for venue address */}
                    <Form.Control.Feedback type="invalid">
                      {errors.location}
                    </Form.Control.Feedback>


                    <br />


                    {/* Google map with draggable marker */}
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


                {/* Meeting location dropdown */}
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridVenue">
                    <Form.Label>Meeting Location</Form.Label>


                    <Form.Control
                      as="select"
                      name="venue"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.venue}
                      isInvalid={!!errors.venue}
                      isValid={touched.venue && !errors.venue}
                    >
                      <option value="">Select meeting location</option>
                      <option value="Main Building – 1st Floor – Committee Meeting Room">
                        Main Building – 1st Floor – Committee Meeting Room
                      </option>
                      <option value="Industry Development Building – 2nd Floor – Sector Coordination Room">
                        Industry Development Building – 2nd Floor – Sector Coordination Room
                      </option>
                      <option value="Admin Building – 1st Floor – Board Room 01">
                        Admin Building – 1st Floor – Board Room 01
                      </option>
                      <option value="Main Building – Ground Floor – Conference Room A">
                        Main Building – Ground Floor – Conference Room A
                      </option>
                    </Form.Control>


                    {/* Show validation error for meeting location */}
                    <Form.Control.Feedback type="invalid">
                      {errors.venue}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>


                {/* Week start date selection */}
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridDate">
                    <Form.Label>Date (Select First Day of the Week)</Form.Label>
                    <Form.Control
                      required
                      name="date"
                      type="date"
                      placeholder="Select First Day of the Week"
                      onChange={(e) => {
                        // Check whether selected date is Monday
                        // and calculate actual meeting date.
                        this.checkDate(e);


                        // Update Formik date value.
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      value={values.date}
                      isValid={touched.date && !errors.date}
                      isInvalid={!!errors.date}
                    />


                    {/* Show validation error for date */}
                    <Form.Control.Feedback type="invalid">
                      {errors.date}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>


                {/* Show calculated meeting time only after date is selected */}
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


                {/* Selected meeting members section */}
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridMembers">
                    <Form.Label>Members</Form.Label>
                    <div className="row col-12 m-auto p-0">
                      {this.state.meetingMembers && this.state.meetingMembers.length !== 0 ? (
                        // Display each selected member using MeetingMember component.
                        this.state.meetingMembers.map((e, index) => (
                          <MeetingMember
                            key={e._id || e.email || index}
                            name={e.name}
                            sector={e.sector}
                            obj={e}
                          />
                        ))
                      ) : (
                        // Show loading message while members are being analysed.
                        <div className="loader ml-4 mb-4">
                          Analysing Development Area ...
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Form.Row>


                {/* Challenges section */}
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridChallenges">
                    <Form.Label>Challenges</Form.Label>
                    <div className="col-12 m-auto">
                      {this.state.questions.length > 0 ? (
                        // Display all challenges/questions related to selected development area.
                        this.state.questions.map((e, index) => (
                          <p key={e._id || index}>
                            <i className="far fa-question-circle"></i> {e.body}
                          </p>
                        ))
                      ) : (
                        // Show loading while challenges are being fetched.
                        <div className="loader ml-4 mb-4">
                          Fetching Challenges...
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Form.Row>


                {/* Alert box for success or error message */}
                <Alert
                  show={this.state.showError}
                  variant={this.state.error === "" ? "success" : "danger"}
                >
                  <Alert.Heading>
                    {this.state.error !== "" ? (
                      // If error exists, show error message.
                      this.state.error
                    ) : (
                      // If no error, show success message.
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
                      // If event is successfully created, close modal using Done button.
                      <Button
                        variant=""
                        className="btn btn-primary"
                        onClick={this.props.close}
                      >
                        Done
                      </Button>
                    ) : (
                      // If error occurs, OK button hides the alert.
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


                {/* Footer buttons are shown only when alert is hidden */}
                {!this.state.showError && (
                  <Form.Row
                    id="footer-modal-addMember"
                    className="d-flex justify-content-end"
                  >
                    {/* Cancel button closes the form/modal */}
                    <Button
                      variant=""
                      onClick={this.props.close}
                      className="btn-secondary mr-3 btn"
                    >
                      Cancel
                    </Button>


                    {/* Submit button sends meeting data to backend */}
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



