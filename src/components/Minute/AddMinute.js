import React, { useState, useEffect } from "react";
import ReactChipInput from "react-chip-input";
import "react-bootstrap-typeahead/css/Typeahead.css";

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

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button as MUIButton,
} from "@material-ui/core";
import { Formik } from "formik";
import { getIn } from "formik";
import * as yup from "yup";
import ReactStars from "react-rating-stars-component";
import { Typeahead } from "react-bootstrap-typeahead";
import Auth from "../../authentication/Auth";
import "./Minute.css";
import { set } from "react-hook-form";
import Multiselect from "multiselect-react-dropdown";


// AddMinute component is used to create meeting minutes.
function AddMinute(props) {

  // Get current date and time.
  var curr = new Date();

  // Format current date according to Sri Lanka timezone.
  var date = curr
    .toLocaleString("fr-CA", { timeZone: "Asia/Colombo" })
    .substr(0, 10);

  // Format current time according to Sri Lanka timezone.
  var time = curr
    .toLocaleString("en-GB", { timeZone: "Asia/Colombo" })
    .substr(12, 5);

  // Store selected present private sector members.
  const [private_chips, setPrivatechips] = useState([]);

  // Store selected present public sector members.
  const [public_chips, setPublicchips] = useState([]);

  // Store selected present academic members.
  const [academic_chips, setAcademicchips] = useState([]);

  // Store selected present association members.
  const [association_chips, setAssociationchips] = useState([]);

  // Store members who are excused.
  const [excused_chips, setExcusedchips] = useState([]);

  // Store members who are absent.
  const [absent_chips, setAbsentchips] = useState([]);

  // Store activity input value before adding to table.
  const [row_activity, setRowActivity] = useState("");

  // Store action input value before adding to table.
  const [row_action, setRowAction] = useState("");

  // Store responsibility input value before adding to table.
  const [row_responsibility, setRowResponsibility] = useState("");

  // Store activity table rows.
  const [tableData, setTableData] = useState([]);

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

  // Store meeting motion text.
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

  // General option list.
  const [options, setOptions] = useState([]);

  // Controls whether error alert should be shown.
  const [show, setShow] = useState(false);

  // Stores validation/backend error message.
  const [error, setError] = useState("");

  // Controls delete confirmation dialog visibility.
  const [openDialog, setOpenDialog] = useState(false);

  // Stores which activity row should be deleted.
  const [activityIndexToDelete, setActivityIndexToDelete] = useState(null);

  // Used to change No button color on hover.
  const [hoverNo, setHoverNo] = useState(false);

  // Used to change Yes button color on hover.
  const [hoverYes, setHoverYes] = useState(false);

  // Used to disable submit button while minute is submitting.
  const [isSubmitting, setIsSubmitting] = useState(false);


  // useEffect runs when component loads.
  useEffect(() => {
    let isMounted = true;

    // Load meetings assigned to logged-in secretary.
    loadMeetings(isMounted);

    // Cleanup function.
    // Logic: prevents setting state after component is unmounted.
    return () => {
      isMounted = false;
    };
  }, []);


  // Validation schema.
  // Some fields here are not directly used by this custom form,
  // but schema is kept as in original code.
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


  // This function returns selected rating value.
  const ratingChanged = (newRating) => {
    return newRating;
  };


  // Add new activity row to activity table.
  const addRow = () => {
    // Hide previous error.
    setShow(false);
    setError("");

    // Check activity field.
    if (!row_activity.trim()) {
      setError("Activity is required.");
      setShow(true);
      return;
    }

    // Check action field.
    if (!row_action.trim()) {
      setError("Action taken / action to be taken is required.");
      setShow(true);
      return;
    }

    // Check responsibility field.
    if (!row_responsibility.trim()) {
      setError("Responsibility is required.");
      setShow(true);
      return;
    }

    // Create new activity row object.
    const newRow = {
      activity: row_activity.trim(),
      action: row_action.trim(),
      responsibility: row_responsibility.trim(),
      rating: 0,
    };

    // Add new row to existing table data.
    setTableData((prevData) => [...prevData, newRow]);

    // Clear input fields after adding row.
    setRowActivity("");
    setRowAction("");
    setRowResponsibility("");
  };


  // Filter members based on sector for selected meeting.
  const getMembersBySector = (meeting, sectorName) => {
    // If meeting or members are missing, return empty list.
    if (!meeting || !Array.isArray(meeting.members)) return [];

    return meeting.members
      .filter((member) => {
        // Only take members from selected sector.
        if (member.sector !== sectorName) return false;

        // Committee Secretary should not be shown under Public Sector present list.
        if (
          sectorName === "Public" &&
          member.utype === "Committee Secretary"
        ) {
          return false;
        }

        return true;
      })
      .map((member) => member.name);
  };


  // Remove activity row by index.
  const removeRow = (index) => {
    tableData.splice(index, 1);
    setTableData([...tableData]);
    console.log(tableData);
  };

  // Update rating value of a selected activity.
  const editRowRating = (index, value) => {
    console.log(index);
    console.log(value);
    tableData[index].rating = value;
    setTableData([...tableData]);
    console.log(tableData);
  };


  // Common change handler for multiple input fields.
  // Logic: check input name and update the correct state value.
  const handleChangeO = (event) => {
    if (event.target.name === "rowActivity") {
      setRowActivity(event.target.value);
    } else if (event.target.name === "rowAction") {
      setRowAction(event.target.value);
    } else if (event.target.name === "rowResponsibility") {
      setRowResponsibility(event.target.value);
    } else if (event.target.name === "name") {
      setMeetingName(event.target.value);
    } else if (event.target.name === "date") {
      setMeetingDate(event.target.value);
    } else if (event.target.name === "time") {
      setMeetingTime(event.target.value);
    } else if (event.target.name === "venue") {
      setMeetingVenue(event.target.value);
    } else if (event.target.name === "approval") {
      setMeetingApproval(event.target.value);
    } else if (event.target.name === "motion") {
      setMeetingMotion(event.target.value);
    } else if (event.target.name === "motionBy") {
      setMeetingMotionby(event.target.value);
    } else if (event.target.name === "proposedBy") {
      setMeetingProposedBy(event.target.value);
    } else if (event.target.name === "secondedBy") {
      setMeetingSecondedBy(event.target.value);
    } else if (event.target.name === "objective") {
      setMeetingObjective(event.target.value);
    } else if (event.target.name === "remarks") {
      setMeetingRemarks(event.target.value);
    }
  };


  // When delete icon is clicked, store row index and open confirmation dialog.
  const handleDeleteClick = (index) => {
    setActivityIndexToDelete(index);
    setOpenDialog(true);
  };


  // Close delete confirmation dialog.
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setActivityIndexToDelete(null);
  };


  // If user confirms delete, remove selected activity row.
  const handleConfirmDelete = () => {
    if (activityIndexToDelete !== null) {
      removeRow(activityIndexToDelete);
      handleCloseDialog();
    }
  };


  // This function loads all members.
  // In current code, this function is not called because loadMembers is commented in useEffect.
  const loadMembers = (isMounted = true) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/register/`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (!isMounted) return;

        const privateMembers = [];
        const publicMembers = [];
        const academicMembers = [];
        const associationMembers = [];
        const allMembers = [];

        // Separate members according to sector.
        response.forEach((element) => {
          allMembers.push(element.name);

          if (element.sector === "Private") {
            privateMembers.push(element.name);
          } else if (element.sector === "Public") {
            publicMembers.push(element.name);
          } else if (element.sector === "Academic") {
            academicMembers.push(element.name);
          } else if (element.sector === "Association") {
            associationMembers.push(element.name);
          }
        });

        // Save sector-wise member lists.
        setPrivateOptions(privateMembers);
        setPublicOptions(publicMembers);
        setAcademicOptions(academicMembers);
        setAssociationOptions(associationMembers);
        setAllOptions(allMembers);
      })
      .catch((error) => console.log(error));
  };


  // Check whether selected meeting is assigned to logged-in secretary.
  const isMeetingAssignedToLoggedSecretary = (meeting) => {
    // Get logged-in user's name.
    const loggedSecretary = Auth.getUserName()?.toLowerCase().trim();

    // Check meeting members and find Committee Secretary with same name.
    return meeting.members?.some(
      (member) =>
        member.utype === "Committee Secretary" &&
        member.name?.toLowerCase().trim() === loggedSecretary
    );
  };


  // Load meetings from backend.
  const loadMeetings = async (isMounted = true) => {
    try {
      // Load all meetings
      const meetingRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/meetings/`, {
        method: "GET",
        headers: new Headers({
          Accept: "application/vnd.github.cloak-preview",
        }),
      });

      const meetingResponse = await meetingRes.json();

      // Load already created minutes
      const minuteRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/minutes/`);
      const minuteResponse = await minuteRes.json();

      if (!isMounted) return;

      let meetingList = [];

      if (Array.isArray(meetingResponse)) {
        meetingList = meetingResponse;
      } else if (Array.isArray(meetingResponse.data)) {
        meetingList = meetingResponse.data;
      } else if (Array.isArray(meetingResponse.meetings)) {
        meetingList = meetingResponse.meetings;
      }

      // Get meeting IDs that already have minutes
      const createdMinuteMeetingIds = Array.isArray(minuteResponse)
        ? minuteResponse.map((minute) => minute.meeting_id)
        : [];

      // Show only:
      // 1. meetings assigned to logged-in secretary
      // 2. meetings that do NOT already have minutes
      const filteredMeetings = meetingList.filter(
        (meeting) =>
          isMeetingAssignedToLoggedSecretary(meeting) &&
          !createdMinuteMeetingIds.includes(meeting._id)
      );

      setMeetings(filteredMeetings);
    } catch (error) {
      console.log(error);
    }
  };



  // Store selectable private members.
  const [privateOptions, setPrivateOptions] = useState([]);

  // Store selectable public members.
  const [publicOptions, setPublicOptions] = useState([]);

  // Store selectable academic members.
  const [academicOptions, setAcademicOptions] = useState([]);

  // Store selectable association members.
  const [associationOptions, setAssociationOptions] = useState([]);

  // Store all selected meeting members.
  const [allOptions, setAllOptions] = useState([]);

  // Store meetings assigned to secretary.
  const [meetings, setMeetings] = useState([]);

  // Store selected meeting id from dropdown.
  const [selectedMeetingId, setSelectedMeetingId] = useState("");


  // This checks whether basic required data exists before enabling submit button.
  const canSubmit =
    !!selectedMeetingId &&
    !!meeting_name.trim() &&
    !!meeting_date &&
    !!meeting_time.trim() &&
    !!meeting_venue.trim() &&
    tableData.length > 0;


  // Count total present participants.
  const totalParticipants =
    private_chips.length +
    public_chips.length +
    academic_chips.length +
    association_chips.length;


  // Validate full minute form before submitting.
  const validateMinuteForm = () => {
    if (!selectedMeetingId) {
      return "Please select a meeting date.";
    }

    if (!meeting_name.trim()) {
      return "Meeting name is required.";
    }

    if (!meeting_date) {
      return "Meeting date is required.";
    }

    if (!meeting_time.trim()) {
      return "Meeting time is required.";
    }

    if (!meeting_venue.trim()) {
      return "Meeting venue is required.";
    }

    if (totalParticipants === 0) {
      return "Please select at least one present participant.";
    }

    if (tableData.length === 0) {
      return "Please add at least one activity.";
    }

    // Combine all attendance categories.
    const allAttendance = [
      ...private_chips,
      ...public_chips,
      ...academic_chips,
      ...association_chips,
      ...excused_chips,
      ...absent_chips,
    ];

    // Check duplicate attendance.
    // Logic: same member cannot be Present and Excused/Absent at the same time.
    const hasDuplicate = allAttendance.length !== new Set(allAttendance).size;

    if (hasDuplicate) {
      return "A member cannot be selected in more than one attendance category.";
    }

    // If motion text exists, approval people must be selected.
    if (meeting_motion.trim()) {
      if (!meeting_motionby || !meeting_proposedby || !meeting_secondedby) {
        return "Please select Motion By, Proposed By, and Seconded By.";
      }
    }

    // Collect approval people.
    const approvalPeople = [
      meeting_motionby,
      meeting_proposedby,
      meeting_secondedby,
    ].filter(Boolean);

    // Motion By, Proposed By, and Seconded By must be different people.
    const hasDuplicateApprovalPeople =
      approvalPeople.length !== new Set(approvalPeople).size;

    if (hasDuplicateApprovalPeople) {
      return "Motion By, Proposed By, and Seconded By must be different members.";
    }

    // Approval date cannot be before meeting date.
    if (meeting_approval_from < meeting_date) {
      return "Approval date cannot be before the meeting date.";
    }

    // Empty string means no validation error.
    return "";
  };


  // Submit minute to backend.
  const addMinute = async (event) => {
    // Stop default form reload.
    event.preventDefault();

    // Clear old messages.
    setShow(false);
    setError("");

    // Validate before sending to backend.
    const validationMessage = validateMinuteForm();

    if (validationMessage) {
      setError(validationMessage);
      setShow(true);
      return;
    }

    // Start submitting.
    setIsSubmitting(true);

    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // Prepare minute data to send to backend.
        body: JSON.stringify({
          meetingId: selectedMeetingId,
          name: meeting_name.trim(),
          date: meeting_date,
          time: meeting_time.trim(),
          venue: meeting_venue.trim(),
          private: private_chips,
          public: public_chips,
          academic: academic_chips,
          association: association_chips,
          excused: excused_chips,
          absent: absent_chips,
          approval: meeting_approval_from,
          motion: meeting_motion,
          motionBy: meeting_motionby,
          proposedBy: meeting_proposedby,
          secondedBy: meeting_secondedby,
          objective: meeting_objective,
          activities: tableData,
          remarks: meeting_remarks,
          isFinalized: true,
          s_finalized: true,
          total_participants: totalParticipants,
          total_rated_participants: 0,
          rating_completed: false,
        }),
      };

      // Send minute data to backend.
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/new-minute`,
        requestOptions
      );

      // Read response data safely.
      const data = await res.json().catch(() => null);

      // If response is not successful, show backend error.
      if (!res.ok) {
        const message =
          data?.message ||
          data?.error?.message ||
          `Something went wrong. Status code: ${res.status}`;

        throw new Error(message);
      }

      // If success, close modal and reload parent data.
      setError("");
      setShow(false);

      props.close();
      props.load();
    } catch (e) {
      // Show error if submission fails.
      setError(e.message || "Unable to submit minute. Please try again.");
      setShow(true);
    } finally {
      // Stop submitting state.
      setIsSubmitting(false);
    }
  };


  // Approval members should not include excused or absent members.
  const approvalMemberOptions = allOptions.filter(
    (member) =>
      !excused_chips.includes(member) &&
      !absent_chips.includes(member)
  );


  // Present members list.
  const presentMembers = [
    ...private_chips,
    ...public_chips,
    ...academic_chips,
    ...association_chips,
  ];


  // Excused options should not include present or absent members.
  const excusedOptions = allOptions.filter(
    (member) =>
      !presentMembers.includes(member) &&
      !absent_chips.includes(member)
  );


  // Absent options should not include present or excused members.
  const absentOptions = allOptions.filter(
    (member) => !presentMembers.includes(member) &&
      !excused_chips.includes(member)
  );


  // Remove selected members from another list.
  // Logic: prevents same member from appearing in multiple attendance categories.
  const removeSelectedMembers = (list, selected) => {
    return list.filter((item) => !selected.includes(item));
  };


  // Get all present members.
  const getPresentMembers = () => [
    ...private_chips,
    ...public_chips,
    ...academic_chips,
    ...association_chips,
  ];


  // Get members who can be selected as excused or absent.
  const getExcusedAbsentOptions = () => {
    const presentMembers = getPresentMembers();

    return allOptions.filter(
      (member) =>
        !presentMembers.includes(member) &&
        !excused_chips.includes(member) &&
        !absent_chips.includes(member)
    );
  };


  return (
    <div>
      {/* Formik wraps the form */}
      <Formik validationSchema={schema} onSubmit={addMinute} initialValues={{}}>
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

            {/* Meeting date dropdown */}
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Meeting Date</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  as="select"
                  value={selectedMeetingId}

                  // When meeting is selected, load its details and members.
                  onChange={(e) => {
                    const meetingId = e.target.value;
                    setSelectedMeetingId(meetingId);

                    // Find selected meeting object from meetings list.
                    const selectedMeeting = meetings.find((m) => m._id === meetingId);

                    if (selectedMeeting) {
                      // Auto-fill meeting details.
                      setMeetingName(selectedMeeting.name || "");
                      setMeetingDate(selectedMeeting.date || date);
                      setMeetingTime(selectedMeeting.time || "");
                      setMeetingVenue(selectedMeeting.venue || "");

                      // Reset approval member fields.
                      setMeetingMotionby("");
                      setMeetingProposedBy("");
                      setMeetingSecondedBy("");

                      const members = selectedMeeting.members || [];

                      // Get private members assigned to this meeting.
                      const assignedPrivateMembers = members
                        .filter((member) => member.sector === "Private")
                        .map((member) => member.name);

                      // Get public members except Committee Secretary.
                      const assignedPublicMembers = members
                        .filter(
                          (member) =>
                            member.sector === "Public" &&
                            member.utype !== "Committee Secretary"
                        )
                        .map((member) => member.name);

                      // Get academic members.
                      const assignedAcademicMembers = members
                        .filter((member) => member.sector === "Academic")
                        .map((member) => member.name);

                      // Get association members.
                      const assignedAssociationMembers = members
                        .filter((member) => member.sector === "Association")
                        .map((member) => member.name);

                      // Get members who already marked unable to attend.
                      const unableMemberNames = members
                        .filter((member) => member.unableToAttend === true)
                        .map((member) => member.name);

                      // Set dropdown options sector-wise.
                      setPrivateOptions(assignedPrivateMembers);
                      setPublicOptions(assignedPublicMembers);
                      setAcademicOptions(assignedAcademicMembers);
                      setAssociationOptions(assignedAssociationMembers);

                      // Store all assigned members in one list.
                      setAllOptions([
                        ...assignedPrivateMembers,
                        ...assignedPublicMembers,
                        ...assignedAcademicMembers,
                        ...assignedAssociationMembers,
                      ]);

                      // Unable members are automatically added to excused list.
                      setExcusedchips(unableMemberNames);

                      // Present private members exclude excused members.
                      setPrivatechips(
                        assignedPrivateMembers.filter((member) => !unableMemberNames.includes(member))
                      );

                      // Present public members exclude excused members.
                      setPublicchips(
                        assignedPublicMembers.filter((member) => !unableMemberNames.includes(member))
                      );

                      // Present academic members exclude excused members.
                      setAcademicchips(
                        assignedAcademicMembers.filter((member) => !unableMemberNames.includes(member))
                      );

                      // Present association members exclude excused members.
                      setAssociationchips(
                        assignedAssociationMembers.filter((member) => !unableMemberNames.includes(member))
                      );

                      // Reset absent list.
                      setAbsentchips([]);
                    }
                  }}
                >
                  <option value="">Select Meeting Date</option>

                  {/* Load assigned meetings into dropdown */}
                  {Array.isArray(meetings) &&
                    meetings.map((meeting) => (
                      <option key={meeting._id} value={meeting._id}>
                        {meeting.date}
                      </option>
                    ))}
                </Form.Control>
              </div>
            </div>


            {/* Meeting name */}
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Name of Meeting</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  required
                  name="name"
                  type="text"
                  value={meeting_name}
                  placeholder="Enter Name..."
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                  isInvalid={!!errors.name && touched.name}
                  isValid={touched.name && !errors.name}
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
              </div>
            </div>


            {/* Meeting time */}
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Time</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  required
                  name="time"
                  type="text"
                  value={meeting_time}
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                  isInvalid={!!errors.time && touched.time}
                  isValid={touched.time && !errors.time}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.time && touched.time && errors.time}
                </Form.Control.Feedback>
              </div>
            </div>


            {/* Meeting venue */}
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Venue</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  required
                  name="venue"
                  type="text"
                  value={meeting_venue}
                  placeholder="Enter Venue..."
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                  isInvalid={!!errors.venue && touched.venue}
                  isValid={touched.venue && !errors.venue}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.venue && touched.venue && errors.venue}
                </Form.Control.Feedback>
              </div>
            </div>


            {/* Attendance section */}
            <div className="w-100 mt-3">
              <h4 className=" separator_minute " style={{ color: "#FFFFFF" }}>
                <div className="">
                  <strong className="section-header">Attendance</strong>
                </div>
              </h4>
            </div>

            <div className="w-100 ">
              <h4 className="" style={{ color: "#070707" }}>
                <strong className="attendence-sub-header">Present</strong>
              </h4>
            </div>


            {/* Private sector present members */}
            <div>
              <div className="form-row approval-form-row">
                <div className="form-group mb-0" as={Col}>
                  <Form.Label className="mb-0 mt-1">Private Sector</Form.Label>
                </div>
              </div>

              <Typeahead
                id="private-present-typeahead"
                multiple

                // When private present members change,
                // remove them from excused and absent lists.
                onChange={(selected) => {
                  setPrivatechips(selected);
                  setExcusedchips(removeSelectedMembers(excused_chips, selected));
                  setAbsentchips(removeSelectedMembers(absent_chips, selected));
                }}
                options={privateOptions}
                placeholder="Choose private members..."
                selected={private_chips}
              />
            </div>


            {/* Public sector present members */}
            <div>
              <div className="form-row approval-form-row">
                <div className="form-group mb-0 mt-1" as={Col}>
                  <Form.Label className="mb-0 mt-1">Public Sector </Form.Label>
                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </div>
              </div>

              <Typeahead
                id="public-present-typeahead"
                multiple
                onChange={(selected) => {
                  setPublicchips(selected);
                  setExcusedchips(removeSelectedMembers(excused_chips, selected));
                  setAbsentchips(removeSelectedMembers(absent_chips, selected));
                }}
                options={publicOptions}
                placeholder="Choose public members..."
                selected={public_chips}
              />
            </div>


            {/* Academic present members */}
            <div>
              <div className="form-row approval-form-row">
                <div className="form-group mb-0 mt-1" as={Col}>
                  <Form.Label className="mb-0 mt-1">Academic</Form.Label>
                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </div>
              </div>

              <Typeahead
                id="academic-present-typeahead"
                multiple
                onChange={(selected) => {
                  setAcademicchips(selected);
                  setExcusedchips(removeSelectedMembers(excused_chips, selected));
                  setAbsentchips(removeSelectedMembers(absent_chips, selected));
                }}
                options={academicOptions}
                placeholder="Choose academic members..."
                selected={academic_chips}
              />
            </div>


            {/* Association present members */}
            <div>
              <div className="form-row approval-form-row">
                <div className="form-group mb-0 mt-1" as={Col}>
                  <Form.Label className="mb-0 mt-1">Association</Form.Label>
                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </div>
              </div>

              <Typeahead
                id="association-present-typeahead"
                multiple
                onChange={(selected) => {
                  setAssociationchips(selected);
                  setExcusedchips(removeSelectedMembers(excused_chips, selected));
                  setAbsentchips(removeSelectedMembers(absent_chips, selected));
                }}
                options={associationOptions}
                placeholder="Choose association members..."
                selected={association_chips}
              />
            </div>


            {/* Excused members */}
            <div>
              <div className="w-100 mt-3 mb-0 ">
                <h4 className="" style={{ color: "#070707" }}>
                  <strong className="attendence-sub-header">Excused</strong>
                </h4>
              </div>

              <Typeahead
                id="excused-typeahead"
                multiple

                // If a person becomes excused,
                // they cannot be used as Motion By, Proposed By, or Seconded By.
                onChange={(selected) => {
                  setExcusedchips(selected);

                  if (selected.includes(meeting_motionby)) setMeetingMotionby("");
                  if (selected.includes(meeting_proposedby)) setMeetingProposedBy("");
                  if (selected.includes(meeting_secondedby)) setMeetingSecondedBy("");
                }}
                options={excusedOptions}
                placeholder="Choose attendees..."
                selected={excused_chips}
              />
            </div>


            {/* Absent members */}
            <div>
              <div className="w-100 mt-3">
                <h4 className=" " style={{ color: "#070707" }}>
                  <strong className="attendence-sub-header">Absent</strong>
                </h4>
              </div>

              <Typeahead
                id="absent-typeahead"
                multiple

                // If a person becomes absent,
                // they cannot be used as Motion By, Proposed By, or Seconded By.
                onChange={(selected) => {
                  setAbsentchips(selected);

                  if (selected.includes(meeting_motionby)) setMeetingMotionby("");
                  if (selected.includes(meeting_proposedby)) setMeetingProposedBy("");
                  if (selected.includes(meeting_secondedby)) setMeetingSecondedBy("");
                }}
                options={absentOptions}
                placeholder="Choose attendees..."
                selected={absent_chips}
              />
            </div>


            {/* Approval section */}
            <div className="w-100 mt-4">
              <h4 className=" separator_minute " style={{ color: "#FFFFFF" }}>
                <div className=" ">
                  <strong className="section-header">Approval</strong>
                </div>
              </h4>
            </div>


            {/* Approval date */}
            <div className="form-row ">
              <div className="form-group col-3">
                <Form.Label>Approval Date</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  required
                  name="approval"
                  type="date"
                  value={meeting_approval_from}
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                  isInvalid={!!errors.approval && touched.approval}
                  isValid={touched.approval && !errors.approval}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.approval && touched.approval && errors.approval}
                </Form.Control.Feedback>
              </div>
            </div>


            {/* Motion text */}
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Motion</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  name="motion"
                  type="text"
                  value={meeting_motion}
                  placeholder="Enter Here..."
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                />
              </div>
            </div>


            {/* Motion By */}
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Motion By</Form.Label>
              </div>

              <div className="form-group col-9">
                <Typeahead
                  id="motion-by-typeahead"

                  // Only present members are allowed.
                  options={approvalMemberOptions}
                  placeholder="Choose members"
                  selected={meeting_motionby ? [meeting_motionby] : []}
                  onChange={(selected) => {
                    setMeetingMotionby(selected.length > 0 ? selected[0] : "");
                  }}
                />
              </div>
            </div>


            {/* Proposed By */}
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Proposed By</Form.Label>
              </div>

              <div className="form-group col-9">
                <Typeahead
                  id="proposed-by-typeahead"
                  options={approvalMemberOptions}
                  placeholder="Choose members"
                  selected={meeting_proposedby ? [meeting_proposedby] : []}
                  onChange={(selected) => {
                    setMeetingProposedBy(selected.length > 0 ? selected[0] : "");
                  }}
                />
              </div>
            </div>


            {/* Seconded By */}
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Seconded By</Form.Label>
              </div>

              <div className="form-group col-9">
                <Typeahead
                  id="seconded-by-typeahead"
                  options={approvalMemberOptions}
                  placeholder="Choose members"
                  selected={meeting_secondedby ? [meeting_secondedby] : []}
                  onChange={(selected) => {
                    setMeetingSecondedBy(selected.length > 0 ? selected[0] : "");
                  }}
                />
              </div>
            </div>


            {/* Objective section */}
            <div className="w-100 mt-4">
              <h4 className=" separator_minute " style={{ color: "#FFFFFF" }}>
                <div className="">
                  <strong className="section-header">Objective</strong>
                </div>
              </h4>
            </div>


            {/* Meeting objective */}
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Objective</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  name="objective"
                  type="text"
                  value={meeting_objective}
                  placeholder="Enter here..."
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                />
              </div>
            </div>


            {/* Activity input */}
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Activity</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  className="border border-light rounded"
                  as="textarea"
                  name="rowActivity"
                  value={row_activity}
                  placeholder="Enter New Activity..."
                  onChange={(e) => handleChangeO(e)}
                />
              </div>
            </div>


            {/* Action input */}
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Action taken/ Action to be taken</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  className="border border-light rounded"
                  as="textarea"
                  name="rowAction"
                  value={row_action}
                  placeholder="Enter New Action..."
                  onChange={(e) => handleChangeO(e)}
                />
              </div>
            </div>


            {/* Responsibility input */}
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Responsibility</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  name="rowResponsibility"
                  value={row_responsibility}
                  placeholder="Enter New Responsibility..."
                  onChange={(e) => handleChangeO(e)}
                />
              </div>
            </div>


            {/* Add activity button */}
            <div className="form-row d-flex justify-content-end">
              <Button
                variant=""
                type="button"
                onClick={() => addRow()}

                // Disable button until all three activity fields are filled.
                disabled={
                  !row_activity.trim() ||
                  !row_action.trim() ||
                  !row_responsibility.trim()
                }
                className="btn  btn-primary"
              >
                <i class="fa fa-plus" aria-hidden="true"></i>
              </Button>
            </div>


            {/* Activities table */}
            <Table
              striped
              bordered
              hover
              size="sm"
              style={{
                width: "100%",
                maxWidth: "100%",
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
                  <th style={{ width: 20 }}></th>
                </tr>
              </thead>

              <tbody>
                {/* Display all added activities */}
                {tableData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.activity}</td>
                      <td>{item.action}</td>
                      <td>{item.responsibility}</td>

                      <td>
                        {/* Delete icon opens confirmation dialog */}
                        <i
                          class="fa fa-trash"
                          aria-hidden="true"
                          onClick={() => handleDeleteClick(index)}
                        ></i>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>


            {/* Closing remarks */}
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Closing Remarks</Form.Label>
              </div>

              <div className="col-9">
                <Form.Control
                  name="remarks"
                  type="text"
                  value={meeting_remarks}
                  placeholder="Enter here..."
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                />
              </div>
            </div>


            {/* Signature section */}
            <div
              className="form-row d-flex justify-content-between"
              id="footer-modal-addMember"
            >
              <div className="mt-5">
                <span className="mt-5">
                  <span>
                    <b className="sign-line">
                      ....................................................................
                    </b>
                  </span>
                  <h4 className="text-center mt-0 mb-0">Chairman</h4>
                  <h4 className="text-center mt-0 mb-5">Advisory Committee</h4>
                </span>
              </div>

              <div className="mt-5">
                <span className="mt-5">
                  <span>
                    <b className="sign-line">
                      ....................................................................
                    </b>
                  </span>
                  <h4 className="text-center mt-0 mb-0">Secratory</h4>
                  <h4 className="text-center mt-0 mb-5">Advisory Committee</h4>
                </span>
              </div>
            </div>


            {/* Footer buttons */}
            <div
              className="form-row d-flex justify-content-end"
              id="footer-modal-addMember"
            >
              {/* Cancel closes modal/form */}
              <Button
                variant=""
                onClick={props.close}
                className="btn-secondary mr-3 btn"
              >
                Cancel
              </Button>

              {/* Submit validates and sends minute to backend */}
              <Button
                variant=""
                type="submit"
                className="btn  btn-primary btn"
                onClick={addMinute}
                disabled={isSubmitting || !canSubmit}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>


            {/* Show validation/backend error */}
            {show && error && (
              <Alert variant="danger" className="mt-2">
                {error}
              </Alert>
            )}
          </div>
        )}
      </Formik>


      {/* Delete confirmation dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Activity"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this activity? This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          {/* No button closes dialog without deleting */}
          <MUIButton
            onClick={handleCloseDialog}
            onMouseEnter={() => setHoverNo(true)}
            onMouseLeave={() => setHoverNo(false)}
            style={{
              backgroundColor: hoverNo ? '#474849' : '#57585a',
              color: 'white',
              padding: '6px 12px',
              textTransform: 'none',
              fontSize: '14px',
              transition: 'background-color 0.2s ease',
              cursor: 'pointer'
            }}
          >
            No
          </MUIButton>

          {/* Yes button confirms delete */}
          <MUIButton
            onClick={handleConfirmDelete}
            onMouseEnter={() => setHoverYes(true)}
            onMouseLeave={() => setHoverYes(false)}
            style={{
              backgroundColor: hoverYes ? '#055a75' : '#0a7a96',
              color: 'white',
              padding: '6px 12px',
              textTransform: 'none',
              fontSize: '14px',
              transition: 'background-color 0.2s ease',
              cursor: 'pointer'
            }}
          >
            Yes
          </MUIButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}


// Export AddMinute component.
export default AddMinute;

