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
function AddMinute(props) {
  var curr = new Date();
  var date = curr
    .toLocaleString("fr-CA", { timeZone: "Asia/Colombo" })
    .substr(0, 10);

  var time = curr
    .toLocaleString("en-GB", { timeZone: "Asia/Colombo" })
    .substr(12, 5);
  const [private_chips, setPrivatechips] = useState([]);
  const [public_chips, setPublicchips] = useState([]);
  const [academic_chips, setAcademicchips] = useState([]);
  const [association_chips, setAssociationchips] = useState([]);
  const [excused_chips, setExcusedchips] = useState([]);
  const [absent_chips, setAbsentchips] = useState([]);
  const [row_activity, setRowActivity] = useState("");
  const [row_action, setRowAction] = useState("");
  const [row_responsibility, setRowResponsibility] = useState("");
  const [tableData, setTableData] = useState([]);
  const [meeting_name, setMeetingName] = useState("");
  const [meeting_date, setMeetingDate] = useState(date);
  const [meeting_time, setMeetingTime] = useState(time);
  const [meeting_venue, setMeetingVenue] = useState("");
  const [meeting_approval_from, setMeetingApproval] = useState(date);
  const [meeting_motion, setMeetingMotion] = useState("");
  const [meeting_motionby, setMeetingMotionby] = useState("");
  const [meeting_proposedby, setMeetingProposedBy] = useState("");
  const [meeting_secondedby, setMeetingSecondedBy] = useState("");
  const [meeting_objective, setMeetingObjective] = useState("");
  const [meeting_remarks, setMeetingRemarks] = useState("");
  const [options, setOptions] = useState([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [activityIndexToDelete, setActivityIndexToDelete] = useState(null);
  const [hoverNo, setHoverNo] = useState(false);
  const [hoverYes, setHoverYes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // curr.setDate(curr.getDate());
  useEffect(() => {
    let isMounted = true;

    // loadMembers(isMounted);
    loadMeetings(isMounted);

    return () => {
      isMounted = false;
    };
  }, []);

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

  const ratingChanged = (newRating) => {
    return newRating;
  };

  //Table row management
  const addRow = () => {
    setShow(false);
    setError("");

    if (!row_activity.trim()) {
      setError("Activity is required.");
      setShow(true);
      return;
    }

    if (!row_action.trim()) {
      setError("Action taken / action to be taken is required.");
      setShow(true);
      return;
    }

    if (!row_responsibility.trim()) {
      setError("Responsibility is required.");
      setShow(true);
      return;
    }

    const newRow = {
      activity: row_activity.trim(),
      action: row_action.trim(),
      responsibility: row_responsibility.trim(),
      rating: 0,
    };

    setTableData((prevData) => [...prevData, newRow]);

    setRowActivity("");
    setRowAction("");
    setRowResponsibility("");
  };


  //filter members based on sector for selected meeting
  const getMembersBySector = (meeting, sectorName) => {
    if (!meeting || !Array.isArray(meeting.members)) return [];

    return meeting.members
      .filter((member) => {
        if (member.sector !== sectorName) return false;

        // Do not load Committee Secretary under Public Sector
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



  const removeRow = (index) => {
    tableData.splice(index, 1);
    setTableData([...tableData]);
    console.log(tableData);
  };
  const editRowRating = (index, value) => {
    console.log(index);
    console.log(value);
    tableData[index].rating = value;
    setTableData([...tableData]);
    console.log(tableData);
  };

  //Handle change overidder
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

  const handleDeleteClick = (index) => {
    setActivityIndexToDelete(index);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setActivityIndexToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (activityIndexToDelete !== null) {
      removeRow(activityIndexToDelete);
      handleCloseDialog();
    }
  };

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

        setPrivateOptions(privateMembers);
        setPublicOptions(publicMembers);
        setAcademicOptions(academicMembers);
        setAssociationOptions(associationMembers);
        setAllOptions(allMembers);
      })
      .catch((error) => console.log(error));
  };
  // const loadMeetings = (isMounted = true) => {
  //   fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/meetings/`, {
  //     method: "GET",
  //     headers: new Headers({
  //       Accept: "application/vnd.github.cloak-preview",
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((response) => {
  //       if (!isMounted) return;

  //       if (Array.isArray(response)) {
  //         setMeetings(response);
  //       } else if (Array.isArray(response.data)) {
  //         setMeetings(response.data);
  //       } else if (Array.isArray(response.meetings)) {
  //         setMeetings(response.meetings);
  //       } else {
  //         setMeetings([]);
  //       }
  //     })
  //     .catch((error) => console.log(error));


  // };

  const isMeetingAssignedToLoggedSecretary = (meeting) => {
    const loggedSecretary = Auth.getUserName()?.toLowerCase().trim();

    return meeting.members?.some(
      (member) =>
        member.utype === "Committee Secretary" &&
        member.name?.toLowerCase().trim() === loggedSecretary
    );
  };


  const loadMeetings = (isMounted = true) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/meetings/`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (!isMounted) return;

        let meetingList = [];

        if (Array.isArray(response)) {
          meetingList = response;
        } else if (Array.isArray(response.data)) {
          meetingList = response.data;
        } else if (Array.isArray(response.meetings)) {
          meetingList = response.meetings;
        }

        const filteredMeetings = meetingList.filter(isMeetingAssignedToLoggedSecretary);

        setMeetings(filteredMeetings);
      })
      .catch((error) => console.log(error));
  };




  const [privateOptions, setPrivateOptions] = useState([]);
  const [publicOptions, setPublicOptions] = useState([]);
  const [academicOptions, setAcademicOptions] = useState([]);
  const [associationOptions, setAssociationOptions] = useState([]);
  const [allOptions, setAllOptions] = useState([]);

  const [meetings, setMeetings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState("");

  const canSubmit =
    !!selectedMeetingId &&
    !!meeting_name.trim() &&
    !!meeting_date &&
    !!meeting_time.trim() &&
    !!meeting_venue.trim() &&
    tableData.length > 0;

  const totalParticipants =
    private_chips.length +
    public_chips.length +
    academic_chips.length +
    association_chips.length;


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

    const allAttendance = [
      ...private_chips,
      ...public_chips,
      ...academic_chips,
      ...association_chips,
      ...excused_chips,
      ...absent_chips,
    ];

    const hasDuplicate = allAttendance.length !== new Set(allAttendance).size;

    if (hasDuplicate) {
      return "A member cannot be selected in more than one attendance category.";
    }

    if (meeting_motion.trim()) {
      if (!meeting_motionby || !meeting_proposedby || !meeting_secondedby) {
        return "Please select Motion By, Proposed By, and Seconded By.";
      }
    }

    const approvalPeople = [
      meeting_motionby,
      meeting_proposedby,
      meeting_secondedby,
    ].filter(Boolean);

    const hasDuplicateApprovalPeople =
      approvalPeople.length !== new Set(approvalPeople).size;

    if (hasDuplicateApprovalPeople) {
      return "Motion By, Proposed By, and Seconded By must be different members.";
    }




    if (meeting_approval_from < meeting_date) {
      return "Approval date cannot be before the meeting date.";
    }

    return "";
  };




  const addMinute = async (event) => {
    event.preventDefault();

    setShow(false);
    setError("");

    const validationMessage = validateMinuteForm();

    if (validationMessage) {
      setError(validationMessage);
      setShow(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/new-minute`,
        requestOptions
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          data?.message ||
          data?.error?.message ||
          `Something went wrong. Status code: ${res.status}`;

        throw new Error(message);
      }

      setError("");
      setShow(false);

      props.close();
      props.load();
    } catch (e) {
      setError(e.message || "Unable to submit minute. Please try again.");
      setShow(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const approvalMemberOptions = allOptions.filter(
    (member) =>
      !excused_chips.includes(member) &&
      !absent_chips.includes(member)
  );


  const presentMembers = [
    ...private_chips,
    ...public_chips,
    ...academic_chips,
    ...association_chips,
  ];

  const excusedOptions = allOptions.filter(
    (member) =>
      !presentMembers.includes(member) &&
      !absent_chips.includes(member)
  );

  const absentOptions = allOptions.filter(
    (member) => !presentMembers.includes(member) &&
      !excused_chips.includes(member)
  );




  return (
    <div>
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



            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Meeting Date</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  as="select"
                  value={selectedMeetingId}
                  onChange={(e) => {
                    const meetingId = e.target.value;
                    setSelectedMeetingId(meetingId);

                    const selectedMeeting = meetings.find((m) => m._id === meetingId);

                    if (selectedMeeting) {
                      setMeetingName(selectedMeeting.name || "");
                      setMeetingDate(selectedMeeting.date || date);
                      setMeetingTime(selectedMeeting.time || "");
                      setMeetingVenue(selectedMeeting.venue || "");

                      setMeetingMotionby("");
                      setMeetingProposedBy("");
                      setMeetingSecondedBy("");


                      const assignedPrivateMembers = getMembersBySector(selectedMeeting, "Private");
                      const assignedPublicMembers = getMembersBySector(selectedMeeting, "Public");
                      const assignedAcademicMembers = getMembersBySector(selectedMeeting, "Academic");
                      const assignedAssociationMembers = getMembersBySector(selectedMeeting, "Association");

                      setPrivateOptions(assignedPrivateMembers);
                      setPublicOptions(assignedPublicMembers);
                      setAcademicOptions(assignedAcademicMembers);
                      setAssociationOptions(assignedAssociationMembers);

                      setAllOptions([
                        ...assignedPrivateMembers,
                        ...assignedPublicMembers,
                        ...assignedAcademicMembers,
                        ...assignedAssociationMembers,
                      ]);

                      setPrivatechips([]);
                      setPublicchips([]);
                      setAcademicchips([]);
                      setAssociationchips([]);
                      setExcusedchips([]);
                      setAbsentchips([]);




                    } else {
                      setMeetingName("");
                      setMeetingDate(date);
                      setMeetingTime("");
                      setMeetingVenue("");

                      setMeetingMotionby("");
                      setMeetingProposedBy("");
                      setMeetingSecondedBy("");

                      setPrivateOptions([]);
                      setPublicOptions([]);
                      setAcademicOptions([]);
                      setAssociationOptions([]);
                      setAllOptions([]);

                      setPrivatechips([]);
                      setPublicchips([]);
                      setAcademicchips([]);
                      setAssociationchips([]);
                      setExcusedchips([]);
                      setAbsentchips([]);
                    }
                  }}
                >
                  <option value="">Select Meeting Date</option>
                  {Array.isArray(meetings) &&
                    meetings.map((meeting) => (
                      <option key={meeting._id} value={meeting._id}>
                        {meeting.date}
                      </option>
                    ))}
                </Form.Control>
              </div>
            </div>



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
            {/* <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Date</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  required
                  name="date"
                  type="date"
                  value={meeting_date}
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                  isInvalid={!!errors.date && touched.date}
                  isValid={touched.date && !errors.date}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date && touched.date && errors.date}
                </Form.Control.Feedback>
              </div>
            </div> */}
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
            <div className="w-100 mt-3">
              <h4 className=" separator_minute " style={{ color: "#FFFFFF" }}>
                <div
                  className="">
                  <strong className="section-header">Attendance</strong>
                </div>
              </h4>
            </div>
            <div className="w-100 ">
              <h4 className="" style={{ color: "#070707" }}>
                <strong className="attendence-sub-header">Present</strong>
              </h4>
            </div>
            <div>
              <div className="form-row approval-form-row">
                <div className="form-group mb-0" as={Col}>
                  <Form.Label className="mb-0 mt-1">Private Sector</Form.Label>
                </div>
              </div>

              <Typeahead
                multiple
                onChange={setPrivatechips}
                options={privateOptions}
                placeholder="Choose private members..."
                selected={private_chips}
              />
            </div>
            <div>
              <div className="form-row approval-form-row">
                <div className="form-group mb-0 mt-1" as={Col}>
                  <Form.Label className="mb-0 mt-1">Public Sector </Form.Label>

                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </div>
              </div>

              <Typeahead
                multiple
                onChange={setPublicchips}
                options={publicOptions}
                placeholder="Choose public members..."
                selected={public_chips}
              />
            </div>
            <div>
              <div className="form-row approval-form-row">
                <div className="form-group mb-0 mt-1" as={Col}>
                  <Form.Label className="mb-0 mt-1">Academic</Form.Label>

                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </div>
              </div>


              <Typeahead
                multiple
                onChange={setAcademicchips}
                options={academicOptions}
                placeholder="Choose academic members..."
                selected={academic_chips}
              />
            </div>
            <div>
              <div className="form-row approval-form-row">
                <div className="form-group mb-0 mt-1" as={Col}>
                  <Form.Label className="mb-0 mt-1">Association</Form.Label>

                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </div>
              </div>



              <Typeahead
                multiple
                onChange={setAssociationchips}
                options={associationOptions}
                placeholder="Choose association members..."
                selected={association_chips}
              />
            </div>
            <div>
              <div className="w-100 mt-3 mb-0 ">
                <h4 className="" style={{ color: "#070707" }}>
                  <strong className="attendence-sub-header">Excused</strong>
                </h4>
              </div>

              <Typeahead
                id="excused-typeahead"
                multiple
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
            <div>
              <div className="w-100 mt-3">
                <h4 className=" " style={{ color: "#070707" }}>
                  <strong className="attendence-sub-header">Absent</strong>
                </h4>
              </div>

              <Typeahead
                id="absent-typeahead"
                multiple
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

            <div className="w-100 mt-4">
              <h4 className=" separator_minute " style={{ color: "#FFFFFF" }}>
                <div
                  className=" ">
                  <strong className="section-header">Approval</strong>
                </div>
              </h4>
            </div>

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

            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Motion By</Form.Label>
              </div>

              <div className="form-group col-9">
                {/* <Form.Control
                  name="motionBy"
                  type="text"
                  value={meeting_motionby}
                  placeholder="Enter Here..."
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                /> */}
                <Typeahead
                  id="motion-by-typeahead"
                  options={approvalMemberOptions}
                  placeholder="Choose members"
                  selected={meeting_motionby ? [meeting_motionby] : []}
                  onChange={(selected) => {
                    setMeetingMotionby(selected.length > 0 ? selected[0] : "");
                  }}
                />


              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Proposed By</Form.Label>
              </div>

              <div className="form-group col-9">
                {/* <Form.Control
                  name="proposedBy"
                  type="text"
                  value={meeting_proposedby}
                  placeholder="Enter Here..."
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                /> */}
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
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Seconded By</Form.Label>
              </div>

              <div className="form-group col-9">
                {/* <Form.Control
                  name="secondedBy"
                  type="text"
                  value={meeting_secondedby}
                  placeholder="Enter Here..."
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                /> */}
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
            <div className="w-100 mt-4">
              <h4 className=" separator_minute " style={{ color: "#FFFFFF" }}>
                <div
                  className="">
                  <strong className="section-header">Objective</strong>
                </div>
              </h4>
            </div>
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

            <div className="form-row d-flex justify-content-end">

              <Button
                variant=""
                type="button"
                onClick={() => addRow()}
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


            {/* <div className=" mt-4 mb-5">
             
              <div className="form-row">
                <div className="col-12 form-group ">
                  <Form.Label>Activity</Form.Label>
                  <Form.Control
                    className="border border-light rounded"
                    as="textarea"
                    name="rowActivity"
                    value={row_activity}
                    placeholder="Enter New Activity..."
                    onChange={(e) => handleChangeO(e)}
                  />
                </div>

                <div className="form-group col-12">
                  <Form.Label>Action taken/ Action to be taken</Form.Label>
                  <Form.Control
                    className="border border-light rounded"
                    as="textarea"
                    name="rowAction"
                    value={row_action}
                    placeholder="Enter New Action..."
                    onChange={(e) => handleChangeO(e)}
                  />
                </div>
                <div className="form-group col-12">
                  <Form.Label>Responsibility</Form.Label>
                  <Form.Control
                    name="rowResponsibility"
                    value={row_responsibility}
                    placeholder="Enter New Responsibility..."
                    onChange={(e) => handleChangeO(e)}
                  />
                </div>
              </div>
              <div className="form-row d-flex justify-content-end">

                <Button
                  variant="success"
                  type="submit"
                  onClick={() => addRow()}
                  className="btnPrimary col-2 "
                >
                  + Add Row
                </Button>
              </div>
            </div> */}




            {/* Table */}
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

                  <th
                    style={{
                      width: 20,
                    }}
                  ></th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.activity}</td>
                      <td>{item.action}</td>
                      <td>{item.responsibility}</td>

                      <td>
                        {/* <Button
                          className=""
                          onClick={() => handleDeleteClick(index)}
                        >
                          <i class="fa fa-trash" aria-hidden="true"></i>
                        </Button> */}
                        <i class="fa fa-trash" aria-hidden="true" onClick={() => handleDeleteClick(index)}></i>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* <tbody>{tableDATA}</tbody> */}
            </Table>

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
            <div
              className="form-row d-flex justify-content-end"
              id="footer-modal-addMember"
            >

              <Button
                variant=""
                onClick={props.close}
                className="btn-secondary mr-3 btn"
              >
                Cancel
              </Button>
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
            {show && error && (
              <Alert variant="danger" className="mt-2">
                {error}
              </Alert>
            )}
          </div>
        )}
      </Formik>

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

export default AddMinute;
