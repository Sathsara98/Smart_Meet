// Import React hooks.
// useState is used to store values that can change.
// useEffect is used to run code when the component loads or props change.
import React, { useState, useEffect } from "react";

// Import chip input component.
// In this file, old chip input code is commented, but import is still here.
import ReactChipInput from "react-chip-input";

// Import Typeahead dropdown.
// Used to display selected members in read-only dropdown style.
import { Typeahead } from "react-bootstrap-typeahead";

// Import Bootstrap UI components.
import {
  Container,
  Form,
  Col,
  Row,
  Button,
  Alert,
  span,
  Table,
} from "react-bootstrap";


// Import Formik for form handling.
import { Formik } from "formik";

// Import getIn from Formik.
// In this file, it is imported but not used.
import { getIn } from "formik";

// Import yup for validation schema.
import * as yup from "yup";

// Import star rating component.
// Used by members to rate each activity.
import ReactStars from "react-rating-stars-component";

// Import Auth helper.
// Used to get logged-in user's ID.
import Auth from "../../authentication/Auth";

// Import CSS file for minute page.
import "./Minute.css";

// Import Typeahead CSS.
import "react-bootstrap-typeahead/css/Typeahead.css";


// This component is used by committee members.
// Purpose:
// 1. Show meeting minute details.
// 2. Check whether logged-in member attended the meeting.
// 3. Allow attended members to rate activities.
// 4. Submit rating data to backend.
function EditMinuteMembers(props) {

  // Get current date.
  var curr = new Date();

  // Format current date according to Sri Lanka timezone.
  // WHY: Used as default date before selected minute data loads.
  var date = curr
    .toLocaleString("fr-CA", { timeZone: "Asia/Colombo" })
    .substr(0, 10);

  // Format current time according to Sri Lanka timezone.
  // WHY: Used as default time before selected minute data loads.
  var time = curr
    .toLocaleString("en-GB", { timeZone: "Asia/Colombo" })
    .substr(12, 5);

  // Store present private sector members.
  const [private_chips, setPrivatechips] = useState([]);

  // Store present public sector members.
  const [public_chips, setPublicchips] = useState([]);

  // Store present academic members.
  const [academic_chips, setAcademicchips] = useState([]);

  // Store present association members.
  const [association_chips, setAssociationchips] = useState([]);

  // Store excused members.
  const [excused_chips, setExcusedchips] = useState([]);

  // Store absent members.
  const [absent_chips, setAbsentchips] = useState([]);

  // This array is declared but not used in the active code.
  const stars = [];


  // Store logged-in user's name after fetching from backend.
  const [userName, setUserName] = useState("");

  // Store activities that the member has to rate.
  const [tableData, setTableData] = useState([]);

  // Store all members' previous rating records for this minute.
  const [tableDataEach, setTableDataEach] = useState([]);

  // Store meeting name.
  const [meeting_name, setMeetingName] = useState("");

  // Store meeting date.
  const [meeting_date, setMeetingDate] = useState(date);

  // Store meeting time.
  const [meeting_time, setMeetingTime] = useState(time);

  // Store meeting venue.
  const [meeting_venue, setMeetingVenue] = useState("");

  // Store approval date.
  const [meeting_approval_from, setMeetingApproval] = useState(date);

  // Store meeting motion.
  const [meeting_motion, setMeetingMotion] = useState("");

  // Store person who moved the motion.
  const [meeting_motionby, setMeetingMotionby] = useState("");

  // Store person who proposed the motion.
  const [meeting_proposedby, setMeetingProposedBy] = useState("");

  // Store person who seconded the motion.
  const [meeting_secondedby, setMeetingSecondedBy] = useState("");

  // Store meeting objective.
  const [meeting_objective, setMeetingObjective] = useState("");

  // Store closing remarks.
  const [meeting_remarks, setMeetingRemarks] = useState("");

  // Store the selected minute object.
  const [minute, setMinute] = useState({});

  // Store logged-in user's ID.
  // WHY: When rating is submitted, backend must know which user rated.
  const [userID, setUserID] = useState(Auth.getUserId());

  // Controls whether alert/message should be shown.
  const [show, setShow] = useState(false);

  // Stores error message.
  const [error, setError] = useState("");

  // Controls loading status.
  const [isLoading, setLoading] = useState(true);

  // Stores whether logged-in user attended this meeting.
  // WHY: Only attended members should be allowed to rate activities.
  const [isAttended, setIsAttended] = useState(false);

  // Validation schema.
  // Some fields are read-only in this component,
  // but schema is still kept for form structure.
  const schema = yup.object({
    name: yup.string("Must be a date!").required("Name is required!"),
    date: yup.string().required("Date is required!"),
    time: yup.string().required("Time is required!"),
    venue: yup.string().required("Venue is required!"),
    sector: yup
      .string()
      .required("Sector is required!")
      .notOneOf(["Select Sector"], "Selection Invalid"),
    workplace: yup.string().required("Office is required!"),
    role: yup
      .string()
      .required("Role is required!")
      .notOneOf(["Select Member Role"], "Selection Invalid"),
    gender: yup
      .string()
      .required("Gender is required!")
      .notOneOf(["Select Gender"], "Selection Invalid"),
  });


  // This runs when props.minute changes.
  // WHY: When user opens a minute, the selected minute details must load.
  useEffect(() => {
    if (props.minute) {
      loadSelectedMinute(props.minute);
    }
  }, [props.minute]);


  // Load selected minute data into state.
  const loadSelectedMinute = async (selectedMinute) => {
    // Start loading.
    setLoading(true);

    try {
      // Save selected minute object.
      setMinute(selectedMinute);

      // Load meeting basic details.
      setMeetingName(selectedMinute.meeting_name);
      setMeetingDate(selectedMinute.meeting_date);
      setMeetingTime(selectedMinute.meeting_time);
      setMeetingVenue(selectedMinute.meeting_venue);

      // Load attendance lists.
      setPrivatechips(selectedMinute.present_private || []);
      setPublicchips(selectedMinute.present_public || []);
      setAcademicchips(selectedMinute.present_academic || []);
      setAssociationchips(selectedMinute.present_association || []);
      setExcusedchips(selectedMinute.excused || []);
      setAbsentchips(selectedMinute.absent || []);

      // Load approval details.
      setMeetingApproval(selectedMinute.meeting_approval_from);
      setMeetingMotion(selectedMinute.meeting_motion);
      setMeetingMotionby(selectedMinute.meeting_motionBy);
      setMeetingProposedBy(selectedMinute.meeting_proposedBy);
      setMeetingSecondedBy(selectedMinute.meeting_secondedBy);

      // Load objective, activities, remarks, and rating records.
      setMeetingObjective(selectedMinute.meeting_objective);
      setTableData(selectedMinute.meeting_activities || []);
      setMeetingRemarks(selectedMinute.meeting_remarks);
      setTableDataEach(selectedMinute.meeting_activities_each || []);

      // Check whether current logged-in user has already rated before.
      // If rated before, load previous rating values.
      ratedBefore(
        selectedMinute.meeting_activities_each || [],
        selectedMinute.meeting_activities || []
      );

      // Fetch logged-in user's details and check attendance.
      fetchSingleUser(selectedMinute);
    } catch (error) {
      console.log(error);
    } finally {
      // Stop loading whether success or error.
      setLoading(false);
    }
  };


  console.log("USER ID:", userID);
  console.log("USER NAME:", userName);


  // Fetch logged-in user's full details from backend.
  const fetchSingleUser = async (meeting) => {
    console.log(meeting);

    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/register/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      // Send logged-in user ID to backend.
      body: JSON.stringify({
        id: Auth?.getUserId(),
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        // Save logged-in user's name.
        setUserName(response[0].name);

        // Check whether logged-in user is in present list.
        // Logic:
        // First check user's sector.
        // Then check whether user's name is inside that sector's present list.
        if (response[0].sector === "Public") {
          if (meeting.present_public.includes(response[0].name)) {
            setIsAttended(true);
          }
        } else if (response[0].sector === "Private") {
          if (meeting.present_private.includes(response[0].name)) {
            setIsAttended(true);
          }
        } else if (response[0].sector === "Association") {
          if (meeting.present_association.includes(response[0].name)) {
            setIsAttended(true);
          }
        } else if (response[0].sector === "Academic") {
          if (meeting.present_academic.includes(response[0].name)) {
            setIsAttended(true);
          }
        }
      })
      .catch((error) => console.log(error));
  };


  // This function returns the selected rating value.
  // WHY: Used when star rating changes.
  const ratingChanged = (newRating) => {
    return newRating;
  };



  // Check whether the logged-in user already rated this minute before.
  // WHY:
  // If the user already rated before, we should show their previous ratings
  // instead of showing all ratings as 0 again.
  const ratedBefore = (tableDataEach1, tableData1) => {
    var isRated = false;

    console.log(tableDataEach1);
    console.log(tableData1);

    // td is declared but not used in current logic.
    let td = [];

    // td1 will store activity rows with user's previous ratings.
    let td1 = [];

    // Loop through all rating records.
    for (let k = 0; k < tableDataEach1.length; k++) {

      // Check whether this rating record belongs to logged-in user.
      if (tableDataEach1[k].userID === userID) {
        isRated = true;

        // Loop through all activities.
        for (let i = 0; i < tableData1.length; i++) {

          // If previous rating exists for this activity,
          // use that rated activity data.
          if (tableDataEach1[k].tableData[i] != null) {
            td1.push(tableDataEach1[k].tableData[i]);
          } else {
            // If previous rating is missing,
            // use original activity data.
            td1.push(tableData1[i]);
          }
        }
      }
    }

    /*
    // Old logic is commented.
    // It checked tableDataEach using forEach.
    tableDataEach1.forEach((element) => {
      if (element.userID === userID) {
        isRated = true;
        console.log(element.tableData);
        td = element.tableData;
      }
    });
    */

    // If user has rated before,
    // update tableData with their previous rating values.
    if (isRated) {
      setTableData([...td1]);
    }
  };


  // Update rating value for one activity row.
  // Logic:
  // 1. User selects star rating.
  // 2. This function updates that activity's rating.
  // 3. tableData is updated so UI shows selected stars.
  const editRowRating = (index, value) => {
    console.log(index);
    console.log(value);

    // Update selected activity rating.
    tableData[index].rating = value;

    // Refresh table data state.
    setTableData([...tableData]);

    console.log(tableData);
  };


  // Submit member ratings.
  // This function runs when user clicks Save.
  const editMinute = async (event) => {
    // Prevent page refresh.
    event.preventDefault();

    // Check whether any activity is not rated.
    // WHY: User must rate all activities before submitting.
    const hasUnrated = tableData.some(
      (item) => item.rating === 0 || item.rating == null
    );

    if (hasUnrated) {
      alert("Please rate all activities before submitting.");
      return;
    }

    try {
      // Prepare PUT request.
      // PUT is used because we update the minute with this user's rating.
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },

        // Send rating data to backend.
        body: JSON.stringify({
          // Minute ID.
          id: minute._id,

          // Logged-in user ID.
          userID: userID,

          // Logged-in user's name.
          userName: userName,

          // Activity rating data.
          tableData: tableData,
        }),
      };

      // Send rating update request to backend.
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/minute-each`,
        requestOptions
      );

      // Convert response to JSON.
      const data = await res.json();

      console.log(data);

      // If backend returns error, show error alert.
      if (data.hasOwnProperty("error")) {
        setError(data.error);
        setShow(true);
      } else {
        // If rating saved successfully.
        setError("");
        setShow(true);

        alert("Updated");

        // Close modal/page.
        props.close();

        // Reload parent data.
        props.load();

        // Reload selected minute data.
        loadSelectedMinute(props.minute);
      }
    } catch (e) {
      console.log(e);
    }
  };


  // Empty functions used by old ReactChipInput.
  // Current active UI uses Typeahead, not ReactChipInput.
  const chipSubmit = () => { };
  const chipRemove = () => { };


  /*
  // Old star-related logic is commented.
  const returnNum = (num) => {
    stars.push(parseInt(num));
    setStars(stars);
    if (num == 1) {
      stars.push(parseInt(1));
      setStars(stars);
    }
  };
  */


  // If logged-in user did not attend this meeting,
  // they are not allowed to rate.
  // WHY: Only present members should rate activities.
  if (!isAttended) {
    return (
      <div>
        <h4 className="text-center">You have Zero Attended Meetings</h4>
      </div>
    )
  }


  return (
    <div>
      {/* Show form only after data loading is completed */}
      {!isLoading ? (
        <Formik
          validationSchema={schema}
          onSubmit={editMinute}
          initialValues={{}}
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
            <div>

              {/* Meeting title field */}
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>Title</Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#ffffff" }}

                    // readOnly means user can view but cannot edit.
                    readOnly
                    name="name"
                    type="text"
                    value={minute.meeting_name}
                    placeholder="Enter Name..."
                    onBlur={handleBlur}
                    isInvalid={!!errors.name}
                    isValid={touched.name && !errors.name}
                    autoComplete="off"
                  />

                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </div>
              </div>


              {/* Meeting date field */}
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>Date</Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#ffffff" }}
                    readOnly
                    name="date"
                    type="date"
                    value={minute.meeting_date}
                    onBlur={handleBlur}
                    isInvalid={!!errors.date}
                    isValid={touched.date && !errors.date}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.date && touched.date && errors.date}
                  </Form.Control.Feedback>
                </div>
              </div>


              {/* Meeting time field */}
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>Time</Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#ffffff" }}
                    readOnly
                    name="time"
                    type="text"
                    value={minute.meeting_time}
                    onBlur={handleBlur}
                    isInvalid={!!errors.time}
                    isValid={touched.time && !errors.time}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.time && touched.time && errors.time}
                  </Form.Control.Feedback>
                </div>
              </div>


              {/* Meeting venue field */}
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>Venue</Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#ffffff" }}
                    readOnly
                    name="venue"
                    type="text"
                    value={minute.meeting_venue}
                    placeholder="Enter Venue..."
                    onBlur={handleChange}
                    isInvalid={!!errors.venue}
                    isValid={touched.venue && !errors.venue}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.venue && touched.venue && errors.venue}
                  </Form.Control.Feedback>
                </div>
              </div>


              {/* Attendance section heading */}
              <div className="w-100 mt-3">
                <h4 className=" separator_minute " style={{ color: "#FFFFFF" }}>
                  <div className="">
                    <strong className="section-header">Attendance</strong>
                  </div>
                </h4>
              </div>


              {/* Present members heading */}
              <div className="w-100 ">
                <h4 className=" " style={{ color: "#070707" }}>
                  <strong>Present</strong>
                </h4>
              </div>


              {/* Private sector members */}
              <div>
                <div className="form-row">
                  <div className="form-group mb-0" as={Col}>
                    <Form.Label className="mb-0 mt-1">
                      Private Sector
                    </Form.Label>
                  </div>
                </div>

                {/* 
                  Typeahead is used here only for display purposes.
                  disabled = user cannot modify values.
                  options = available values
                  selected = currently selected values
               */}
                <Typeahead
                  className="m-0 p-0"
                  disabled
                  multiple
                  options={private_chips}
                  selected={private_chips}
                />
              </div>


              {/* Public sector members */}
              <div>
                <div className="form-row">
                  <div className="form-group mb-0 mt-1" as={Col}>
                    <Form.Label className="mb-0 mt-1">
                      Public Sector
                    </Form.Label>

                    <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                  </div>
                </div>

                <Typeahead
                  className="m-0 p-0"
                  disabled
                  multiple
                  options={public_chips}
                  selected={public_chips}
                />
              </div>


              {/* Academic members */}
              <div>
                <div className="form-row">
                  <div className="form-group mb-0 mt-1" as={Col}>
                    <Form.Label className="mb-0 mt-1">
                      Academic
                    </Form.Label>

                    <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                  </div>
                </div>

                <Typeahead
                  className="m-0 p-0"
                  disabled
                  multiple
                  options={academic_chips}
                  selected={academic_chips}
                />
              </div>


              {/* Association members */}
              <div>
                <div className="form-row">
                  <div className="form-group mb-0 mt-1" as={Col}>
                    <Form.Label className="mb-0 mt-1">
                      Association
                    </Form.Label>

                    <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                  </div>
                </div>

                <Typeahead
                  className="m-0 p-0"
                  disabled
                  multiple
                  options={association_chips}
                  selected={association_chips}
                />
              </div>


              {/* Excused members */}
              <div>

                {/* Section heading */}
                <div className="w-100 mt-3 mb-0 ">
                  <h4
                    className="mb-2"
                    style={{ color: "#070707" }}
                  >
                    <strong>Excused</strong>
                  </h4>
                </div>

                <Typeahead
                  className="m-0 p-0"
                  disabled
                  multiple
                  options={excused_chips}
                  selected={excused_chips}
                />
              </div>


              {/* Absent members */}
              <div>

                {/* Section heading */}
                <div className="w-100 mt-3">
                  <h4
                    className="mb-2"
                    style={{ color: "#070707" }}
                  >
                    <strong>Absent</strong>
                  </h4>
                </div>

                <Typeahead
                  className="m-0 p-0"
                  disabled
                  multiple
                  options={absent_chips}
                  selected={absent_chips}
                />
              </div>


              {/* Approval section */}
              <div className="w-100 mt-4">
                <h4 className="separator_minute" style={{ color: "#FFFFFF" }}>
                  <div className="">
                    <strong className="section-header">
                      Approval
                    </strong>
                  </div>
                </h4>
              </div>


              {/* Approval date */}
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>
                    Approval Date
                  </Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#ffffff" }}
                    readOnly
                    name="approvalDate"
                    type="date"

                    // Display approval date from selected minute.
                    value={minute.meeting_approval_from}

                    onBlur={handleBlur}

                    isInvalid={!!errors.date}
                    isValid={touched.date && !errors.date}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.date && touched.date && errors.date}
                  </Form.Control.Feedback>
                </div>
              </div>


              {/* Motion details */}
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>
                    Motion
                  </Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#ffffff" }}
                    readOnly
                    name="motion"
                    type="text"

                    // Display motion text.
                    value={minute.meeting_motion}

                    placeholder="Enter Here..."
                    onBlur={handleBlur}
                  />
                </div>
              </div>


              {/* Motion By */}
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>
                    Motion By
                  </Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#ffffff" }}
                    readOnly
                    name="motionBy"
                    type="text"

                    // Display who created the motion.
                    value={minute.meeting_motionBy}

                    placeholder="Enter Here..."
                    onBlur={handleBlur}
                  />
                </div>
              </div>


              {/* Proposed By */}
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>
                    Proposed By
                  </Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#ffffff" }}
                    readOnly
                    name="proposedBy"
                    type="text"

                    value={minute.meeting_proposedBy}

                    placeholder="Enter Here..."
                    onBlur={handleBlur}
                  />
                </div>
              </div>


              {/* Seconded By */}
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>
                    Seconded By
                  </Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#ffffff" }}
                    readOnly
                    name="secondedBy"
                    type="text"

                    value={minute.meeting_secondedBy}

                    placeholder="Enter Here..."
                    onBlur={handleBlur}
                  />
                </div>
              </div>


              {/* Objective section heading */}
              <div className="w-100 mt-4">
                <h4 className="separator_minute" style={{ color: "#FFFFFF" }}>
                  <div className="">
                    <strong className="section-header">
                      Objective
                    </strong>
                  </div>
                </h4>
              </div>


              {/* Objective field */}
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>
                    Objective
                  </Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#ffffff" }}
                    readOnly
                    name="objective"
                    type="text"

                    // Display meeting objective.
                    value={minute.meeting_objective}

                    placeholder="Enter here..."
                    onBlur={handleChange}
                  />
                </div>
              </div>


              {/* Activity rating table */}
              <Table
                striped
                bordered
                hover
                size="sm"
                style={{
                  width: "100%",
                  maxWidth: "100%",

                  // Prevent long text from breaking table layout.
                  wordBreak: "break-all",
                }}
                className="mt-4"
              >
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>
                      Action taken/
                      <br />
                      to be taken
                    </th>
                    <th>Responsibility</th>
                    <th style={{ width: 100 }}>
                      Rating
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* Display each activity from the minute */}
                  {tableData != null
                    ? tableData.map((item, index) => {
                      return (
                        <tr key={index}>

                          {/* Activity name */}
                          <td>{item.activity}</td>

                          {/* Action taken or action to be taken */}
                          <td>{item.action}</td>

                          {/* Responsible person/team */}
                          <td>{item.responsibility}</td>

                          {/* Star rating input */}
                          <td>
                            <ReactStars
                              // Total stars = 5
                              count={5}

                              // Current rating value for this activity
                              value={item.rating}

                              // When user changes rating,
                              // update rating value in tableData.
                              onChange={(e) => {
                                editRowRating(index, ratingChanged(e));
                              }}

                              // Star size
                              size={17}

                              // Active star color
                              activeColor="#ffd700"
                            />
                          </td>
                        </tr>
                      );
                    })
                    : null}
                </tbody>

                {/* Old table rendering is commented */}
                {/* <tbody>{tableDATA}</tbody> */}
              </Table>


              {/* Closing remarks */}
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>
                    Closing Remarks
                  </Form.Label>
                </div>

                <div className="col-9">
                  <Form.Control
                    style={{ backgroundColor: "#ffffff" }}
                    readOnly
                    name="remarks"
                    type="text"

                    // Display closing remarks from minute.
                    value={minute.meeting_remarks}

                    placeholder="Enter here..."
                    onBlur={handleChange}
                  />
                </div>
              </div>


              {/* Save button */}
              <div className="form-row mt-5 display-flex justify-content-end">
                <Button
                  variant=""
                  type="submit"
                  className="btn btn-primary"

                  // Save rating data.
                  onClick={editMinute}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </Formik>
      ) : null}
    </div>
  );
}

export default EditMinuteMembers;

