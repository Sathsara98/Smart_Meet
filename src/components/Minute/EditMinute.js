// Import React features.
// useState = store values that can change.
// useEffect = run code when component loads.
// useRef = create reference for printing.
// forwardRef = allow parent component to access this component for printing.
import React, { useState, useEffect, useRef, forwardRef } from "react";


import ReactChipInput from "react-chip-input";
import { useReactToPrint } from "react-to-print";
import { Typeahead } from 'react-bootstrap-typeahead';
import { Form, Col, Button, Table } from "react-bootstrap";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button as MUIButton,
} from "@material-ui/core";
import Model from "../../components/Model";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import "./Minute.css";
const EditMinute1 = forwardRef((props, ref) => {

  // Get current date.
  var curr = new Date();

  // Format today's date according to Sri Lanka timezone.
  // WHY: Used as default date if minute date is missing.
  var date = curr
    .toLocaleString("fr-CA", { timeZone: "Asia/Colombo" })
    .substr(0, 10);

  // Format current time according to Sri Lanka timezone.
  // WHY: Used as default time if minute time is missing.
  var time = curr
    .toLocaleString("en-GB", { timeZone: "Asia/Colombo" })
    .substr(12, 5);

  // Store present private sector members.
  const [private_chips, setPrivatechips] = useState([]);

  // Store present public sector members.
  const [public_chips, setPublicchips] = useState([]);

  // Store present academic sector members.
  const [academic_chips, setAcademicchips] = useState([]);

  // Store present association sector members.
  const [association_chips, setAssociationchips] = useState([]);

  // Store excused members.
  const [excused_chips, setExcusedchips] = useState([]);

  // Store absent members.
  const [absent_chips, setAbsentchips] = useState([]);

  // Store new activity input value.
  const [row_activity, setRowActivity] = useState("");

  // Store new action input value.
  const [row_action, setRowAction] = useState("");

  // Store new responsibility input value.
  const [row_responsibility, setRowResponsibility] = useState("");

  // Store original meeting activities from selected minute.
  // WHY: These are the activity rows saved in the database.
  const [tableData, setTableData] = useState(props.minute.meeting_activities);

  // Store each member's rating data for activities.
  // WHY: This is used to calculate overall activity rating percentage.
  const [tableDataEach, setTableDataEach] = useState(
    props.minute.meeting_activities_each
  );

  // Store table rows displayed in UI.
  // WHY: After rating calculation, activities are displayed using this state.
  const [tableRows, setTableRows] = useState([]);

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

  // Store motion text.
  const [meeting_motion, setMeetingMotion] = useState("");

  // Store member who moved the motion.
  const [meeting_motionby, setMeetingMotionby] = useState("");

  // Store member who proposed the motion.
  const [meeting_proposedby, setMeetingProposedBy] = useState("");

  // Store member who seconded the motion.
  const [meeting_secondedby, setMeetingSecondedBy] = useState("");

  // Store meeting objective.
  const [meeting_objective, setMeetingObjective] = useState("");

  // Store closing remarks.
  const [meeting_remarks, setMeetingRemarks] = useState("");

  // Check whether minute is finalized.
  // WHY: If finalized, fields are disabled to prevent editing.
  const isFinalized = props.minute.is_finalized;

  // Store validation error messages.
  const [errors, setError] = useState({
    name: "",
    date: "",
    time: "",
    venue: "",
  });

  // Store member name options for Typeahead dropdowns.
  const [options, setOptions] = useState(["saman", "kamal"]);

  // Controls delete confirmation dialog.
  const [openDialog, setOpenDialog] = useState(false);

  // Stores which activity row user wants to delete.
  const [activityIndexToDelete, setActivityIndexToDelete] = useState(null);

  // Used to change No button hover style.
  const [hoverNo, setHoverNo] = useState(false);

  // Used to change Yes button hover style.
  const [hoverYes, setHoverYes] = useState(false);

  // Controls update success dialog.
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  // Stores update success message.
  const [updateMessage, setUpdateMessage] = useState("");


  // This runs when component first loads.
  // WHY: Existing minute details must be loaded into the form.
  useEffect(() => {
    setMeetingName(props.minute.meeting_name);
    setMeetingDate(props.minute.meeting_date);
    setMeetingTime(props.minute.meeting_time);
    setMeetingVenue(props.minute.meeting_venue);

    // Load attendance details.
    setPrivatechips(props.minute.present_private);
    setPublicchips(props.minute.present_public);
    setAcademicchips(props.minute.present_academic);
    setAssociationchips(props.minute.present_association);
    setExcusedchips(props.minute.excused);
    setAbsentchips(props.minute.absent);

    // Load approval details.
    setMeetingApproval(props.minute.meeting_approval_from);
    setMeetingMotion(props.minute.meeting_motion);
    setMeetingMotionby(props.minute.meeting_motionBy);
    setMeetingProposedBy(props.minute.meeting_proposedBy);
    setMeetingSecondedBy(props.minute.meeting_secondedBy);

    // Load objective, activities, and remarks.
    setMeetingObjective(props.minute.meeting_objective);
    setTableData(props.minute.meeting_activities);
    setTableDataEach(props.minute.meeting_activities_each);
    setMeetingRemarks(props.minute.meeting_remarks);

    // Calculate activity rating percentages.
    ratingArray();

    // Load all member names for dropdown options.
    loadMembers();
  }, []);


  // Load all registered member names from backend.
  const loadMembers = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/register/`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        var memarray = [];

        // Take only member names from response.
        response.forEach((element) => {
          memarray.push(element.name);
        });

        // Save member names as dropdown options.
        setOptions(memarray);
      })
      .catch((error) => console.log(error));
  };


  // Add new activity row.
  // WHY: Allows secretary/admin to add another activity to the minute.
  const addRow = () => {
    const newRow = {
      activity: row_activity,
      action: row_action,
      responsibility: row_responsibility,
      rating: 0,
    };

    // Add row to main table data.
    tableData.push(newRow);

    // Add row to displayed rows.
    tableRows.push(newRow);

    // Update state so UI refreshes.
    setTableData([...tableData]);
    setTableRows([...tableRows]);

    // Clear input fields after adding.
    setRowActivity("");
    setRowAction("");
    setRowResponsibility("");
  };


  // Remove row after confirmation using custom Model.
  const removeRow = (index) => {
    returnModel(true, "Are You Sure?", true, function (res) {
      if (res) {
        // Remove selected row from displayed table rows.
        let obj = tableRows.splice(index, 1);

        // Find same row in main table data.
        let i = tableData.findIndex(
          (e) =>
            e.activity === obj[0].activity &&
            e.action === obj[0].action &&
            e.responsibility === obj[0].responsibility
        );

        // Remove from main data also.
        tableData.splice(i, 1);

        // Update UI.
        setTableRows([...tableRows]);
        setTableData([...tableData]);
      }
    });
  };


  // Open delete confirmation dialog.
  const handleDeleteClick = (index) => {
    setActivityIndexToDelete(index);
    setOpenDialog(true);
  };


  // Close delete confirmation dialog.
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setActivityIndexToDelete(null);
  };


  // Confirm delete selected activity.
  const handleConfirmDelete = () => {
    if (activityIndexToDelete !== null) {
      // Remove selected row from displayed rows.
      let obj = tableRows.splice(activityIndexToDelete, 1);

      // Find matching activity from main table data.
      let i = tableData.findIndex(
        (e) =>
          e.activity === obj[0].activity &&
          e.action === obj[0].action &&
          e.responsibility === obj[0].responsibility
      );

      // Remove from main data.
      tableData.splice(i, 1);

      // Refresh UI.
      setTableRows([...tableRows]);
      setTableData([...tableData]);

      // Close dialog.
      handleCloseDialog();
    }
  };


  // Total participants expected to rate.
  const totalParticipants = props.minute.total_participants || 0;

  // Total participants who already rated.
  const totalRatedParticipants = props.minute.total_rated_participants || 0;

  // Check whether all participants completed rating.
  // WHY: Print button is enabled only after all participants rate.
  const isRatingCompleted = totalParticipants > 0 && totalRatedParticipants >= totalParticipants;

  console.log("participants", totalParticipants);
  console.log("rated", totalRatedParticipants);
  console.log("completed", isRatingCompleted);
  console.log("minute", props.minute);
  console.log("tableDataEach", tableDataEach);


  // Common input change handler.
  // WHY: One function updates many fields based on input name.
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


  // Edit/update existing minute.
  // WHY: This function sends changed minute details to backend.
  const editMinute = async (event) => {
    // Stop browser from refreshing page.
    event.preventDefault();

    // Basic validation before update.
    // If meeting name is empty, show name error.
    if (meeting_name == "") {
      const error = { name: "Name is required", date: "", time: "", venue: "" };

      setError(error);

      // If date is empty, show date error.
    } else if (meeting_date == "") {
      const error = { name: "", date: "Date is required", time: "", venue: "" };
      setError(error);

      // If time is empty, show time error.
    } else if (meeting_time == "") {
      const error = { name: "", date: "", time: "Time is required", venue: "" };
      setError(error);

      // If venue is empty, show venue error.
    } else if (meeting_venue == "") {
      const error = {
        name: "",
        date: "",
        time: "",
        venue: "Venue is required",
      };
      setError(error);

    } else {
      try {
        // Prepare PUT request.
        // PUT is used to update existing data.
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },

          // Convert updated minute data into JSON.
          body: JSON.stringify({
            id: props.minute._id,
            name: meeting_name,
            date: meeting_date,
            time: meeting_time,
            venue: meeting_venue,
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
          }),
        };

        // Send update request to backend.
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/admin/minute`,
          requestOptions
        );

        // Convert backend response to JSON.
        const data = await res.json();

        console.log(data);

        // If backend returns error, show it.
        if (data.hasOwnProperty("error")) {
          setError(data.error);
        } else {
          // If update is successful, show success dialog.
          setUpdateMessage("Updated!");
          setOpenUpdateDialog(true);

          // Reload parent data and close after short delay.
          setTimeout(() => {
            props.load();
            props.close();
          }, 1500);
        }
      } catch (e) {
        // Show error in console if request fails.
        console.log(e);
      }
    }
  };


  // Delete selected minute.
  async function deleteMinute() {
    // Show confirmation model before deleting.
    // WHY: Delete action cannot be undone.
    returnModel(
      true,
      "This step can not be undone!",
      true,
      async function (res) {
        // If user confirms delete.
        if (res) {
          try {
            // Prepare DELETE request.
            const requestOptions = {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },

              // Send minute id to backend so backend knows which minute to delete.
              body: JSON.stringify({ id: props.minute._id }),
            };

            // Send delete request to backend.
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/minute`, requestOptions);

            alert("Deleted");

            // Reload list and close modal/form.
            props.load();
            props.close();
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
  }


  // Calculate rating percentage for each activity.
  // WHY: Participants rate activities, and this function calculates
  // which activities received the highest total rating.
  const ratingArray = () => {
    // Create an array with same length as activity list.
    // Each position stores total rating for one activity.
    var arr = new Array(tableData.length).fill(0);

    // Copy tableData so original array is not directly used.
    let tbData = [...tableData];

    // Stores total rating of all activities.
    var total = 0;

    console.log(tableDataEach);

    // If members have submitted ratings.
    if (tableDataEach.length > 0) {

      // Loop through each member's rating data.
      tableDataEach.forEach((element) => {
        console.log(element.tableData);

        // Add each activity rating into arr.
        // Example:
        // arr[0] = total rating for Activity 1.
        // arr[1] = total rating for Activity 2.
        for (let i = 0; i < element.tableData.length; i++) {
          arr[i] = arr[i] + element.tableData[i].rating;
        }
      });

      // Calculate total rating count.
      for (let i = 0; i < arr.length; i++) {
        total = total + arr[i];
      }

      // Convert each activity rating into percentage.
      // Formula: activity rating / total rating * 100
      for (let i = 0; i < arr.length; i++) {
        arr[i] = (arr[i] / total) * 100;
      }

      // Add calculated percentage to each activity row.
      tbData.forEach(function (item, index) {
        item.overall = arr[index];
      });

      // Sort activities by highest rating percentage.
      // WHY: Highest-rated activity should appear first.
      tbData.sort((a, b) => (a.overall < b.overall ? 1 : -1));
    } else {
      // If no one rated, set percentage as 0.
      tbData.forEach(function (item, index) {
        item.overall = 0;
      });
    }

    // Save final table rows with rating percentages.
    setTableRows(tbData);
  };


  // Model management state.
  // WHY: Used to show custom confirmation popup.
  const [model, setModel] = useState(null);


  // Reusable function to show/hide confirmation model.
  const returnModel = (show, body, confirmation, callback) => {
    setModel(
      <Model
        show={show}
        confirmation={confirmation}
        body={body}

        // Close model without action.
        handleClose={() => {
          returnModel(false, "", null);
        }}

        // Run callback when user confirms.
        handleClick={(e) => {
          callback(e);
          returnModel(false, "", null);
        }}
      />
    );
  };


  return (
    <div>
      {/* 
       This div contains the minute content.
       ref is used by print function to know what part should be printed.
     */}
      <div ref={ref} className="page-break ">

        {/* Show custom confirmation model if available */}
        {model}

        {/* Title shown in print view */}
        <h2 className="text-center mx-auto view-in-print text-black">
          <b>Meeting Minute</b>
        </h2>


        {/* Meeting name field */}
        <div className="form-row">
          <div className="form-group col-3">
            <Form.Label>Name of Meeting</Form.Label>
          </div>

          <div className="form-group col-9">
            <Form.Control
              // Disable editing if minute is finalized.
              disabled={isFinalized}
              name="name"
              value={meeting_name}
              onChange={handleChangeO}
            />

            {/* Display validation error */}
            <div className="text-red">{errors.name}</div>
          </div>
        </div>


        {/* Meeting date field */}
        <div className="form-row">
          <div className="form-group col-3">
            <Form.Label>Date</Form.Label>
          </div>

          <div className="form-group col-9">
            <Form.Control
              disabled={isFinalized}
              name="date"
              value={meeting_date}
              onChange={handleChangeO}
            />

            <div className="text-red">{errors.date}</div>
          </div>
        </div>


        {/* Meeting time field */}
        <div className="form-row">
          <div className="form-group col-3">
            <Form.Label>Time</Form.Label>
          </div>

          <div className="form-group col-9">
            <Form.Control
              disabled={isFinalized}
              name="time"
              value={meeting_time}
              onChange={handleChangeO}
            />

            <div className="text-red">{errors.time}</div>
          </div>
        </div>


        {/* Meeting venue field */}
        <div className="form-row">
          <div className="form-group col-3">
            <Form.Label>Venue</Form.Label>
          </div>

          <div className="form-group col-9">
            <Form.Control
              disabled={isFinalized}
              name="venue"
              value={meeting_venue}
              onChange={handleChangeO}
            />

            <div className="text-red">{errors.venue}</div>
          </div>
        </div>


        {/* Attendance section heading */}
        <div className="w-100 mt-3">
          <h4 className=" separator_minute " style={{ color: "#FFFFFF" }}>
            <div className=" ">
              <strong className="section-header"> Attendance</strong>
            </div>
          </h4>
        </div>


        {/* Present members heading */}
        <div className="w-100 ">
          <h4 style={{ color: "#070707" }}>
            <strong className="attendence-sub-header">Present</strong>
          </h4>
        </div>


        {/* Present private sector members */}
        <div>
          <div className="form-row approval-form-row">
            <div className="form-group mb-0" as={Col}>
              <Form.Label className="mb-0 mt-1">Private Sector</Form.Label>
            </div>
          </div>

          <Typeahead
            disabled={isFinalized}
            multiple
            options={options}
            selected={private_chips}
          />
        </div>


        {/* Present public sector members */}
        <div>
          <div className="form-row approval-form-row">
            <div className="form-group mb-0 mt-1" as={Col}>
              <Form.Label className="mb-0 mt-1">Public Sector </Form.Label>

              <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
            </div>
          </div>

          <Typeahead
            disabled={isFinalized}
            multiple
            options={options}
            selected={public_chips}
          />
        </div>


        {/* Present academic members */}
        <div>
          <div className="form-row approval-form-row">
            <div className="form-group mb-0 mt-1" as={Col}>
              <Form.Label className="mb-0 mt-1">Academic</Form.Label>

              <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
            </div>
          </div>

          <Typeahead
            disabled={isFinalized}
            multiple
            options={options}
            selected={academic_chips}
          />
        </div>


        {/* Present association members */}
        <div>
          <div className="form-row approval-form-row">
            <div className="form-group mb-0 mt-1" as={Col}>
              <Form.Label className="mb-0 mt-1">Association</Form.Label>

              <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
            </div>
          </div>

          <Typeahead
            disabled={isFinalized}
            multiple
            options={options}
            selected={association_chips}
          />
        </div>


        {/* Excused members */}
        <div>
          <div className="w-100 mt-3 mb-0 ">
            <h4 style={{ color: "#070707" }}>
              <strong className="attendence-sub-header">Excused</strong>
            </h4>
          </div>

          <Typeahead
            disabled={isFinalized}
            multiple
            options={options}
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
            disabled={isFinalized}
            multiple
            options={options}
            selected={absent_chips}
          />
        </div>



        {/* Approval section heading */}
        <div className="w-100 mt-4">
          <h4 className=" separator_minute " style={{ color: "#FFFFFF" }}>
            <div className="">
              <strong className="section-header">Approval</strong>
            </div>
          </h4>
        </div>


        {/* Approval date field */}
        <div className="form-row">
          <div className="form-group col-3">
            <Form.Label>Approval Date</Form.Label>
          </div>

          <div className="form-group col-9">
            <Form.Control
              disabled={isFinalized}
              name="approvalDate"
              value={meeting_approval_from}
              onChange={handleChangeO}
            />
          </div>
        </div>


        {/* Motion field */}
        <div className="form-row">
          <div className="form-group col-3">
            <Form.Label>Motion</Form.Label>
          </div>

          <div className="form-group col-9">
            <Form.Control
              disabled={isFinalized}
              name="motion"
              value={meeting_motion}
              onChange={handleChangeO}
            />
          </div>
        </div>


        {/* Motion By field */}
        <div className="form-row">
          <div className="form-group col-3">
            <Form.Label>Motion By</Form.Label>
          </div>

          <div className="form-group col-9">
            <Form.Control
              disabled={isFinalized}
              name="motionBy"
              value={meeting_motionby}
              onChange={handleChangeO}
            />
          </div>
        </div>


        {/* Proposed By field */}
        <div className="form-row">
          <div className="form-group col-3">
            <Form.Label>Proposed By</Form.Label>
          </div>

          <div className="form-group col-9">
            <Form.Control
              disabled={isFinalized}
              name="proposedBy"
              value={meeting_proposedby}
              onChange={handleChangeO}
            />
          </div>
        </div>


        {/* Seconded By field */}
        <div className="form-row">
          <div className="form-group col-3">
            <Form.Label>Seconded By</Form.Label>
          </div>

          <div className="form-group col-9">
            <Form.Control
              disabled={isFinalized}
              name="secondedBy"
              value={meeting_secondedby}
              onChange={handleChangeO}
            />
          </div>
        </div>


        {/* Objective section heading */}
        <div className="w-100 mt-4">
          <h4 className=" separator_minute " style={{ color: "#FFFFFF" }}>
            <div className=" ">
              <strong className="section-header">Objective</strong>
            </div>
          </h4>
        </div>


        {/* Objective field */}
        <div className="form-row">
          <div className="form-group col-3">
            <Form.Label>Objective</Form.Label>
          </div>

          <div className="form-group col-9">
            <Form.Control
              disabled={isFinalized}
              name="objective"
              value={meeting_objective}
              onChange={handleChangeO}
            />
          </div>
        </div>


        {/*
         This activity add section is commented out.
         WHY: In the current UI, users are not adding new activities here.
         The minute mainly shows already saved activities and rating results.
       */}

        {/*
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
           disabled={isFinalized}
           onClick={() => addRow()}
         >
           <i class="fa fa-plus" aria-hidden="true"></i>
         </Button>
       </div>
       */}


        {/* Activity table */}
        <Table
          striped
          bordered
          hover
          size="sm"
          style={{
            width: "100%",
            maxWidth: "100%",

            // Break long words to prevent table overflow.
            wordBreak: "break-all",
          }}
          className="mt-4"
        >
          <thead>
            <tr>
              <th className="text-black ">Activity</th>
              <th className="text-black ">
                Action taken/
                <br />
                to be taken
              </th>
              <th className="text-black ">Responsibility</th>

              {/* Rating percentage column */}
              <th
                className="text-black "
                style={{
                  width: 100,
                }}
              >
                Rating
              </th>

              {/*
               Delete column is commented.
               WHY: Finalized minutes should not allow deleting activities.
             */}
              {/* <th
               className="view-in-web"
               style={{
                 width: 20,
               }}
             ></th> */}
            </tr>
          </thead>

          <tbody>
            {/* If tableRows exists, display each activity row */}
            {tableRows != null
              ? tableRows.map((item, index) => {
                return (
                  <tr key={index}>

                    {/* Activity name */}
                    <td>
                      <span className="text-black-table ">
                        {item.activity}
                      </span>
                    </td>

                    {/* Action taken / action to be taken */}
                    <td>
                      <span className="text-black-table  ">
                        {item.action}
                      </span>
                    </td>

                    {/* Responsible person or party */}
                    <td>
                      <span className="text-black-table ">
                        {item.responsibility}
                      </span>
                    </td>

                    {/* Overall rating percentage */}
                    <td className=" text-center">
                      <span className="text-black-table  ">
                        {item.overall != null
                          ? item.overall.toFixed(2)
                          : "0.00"}{" "}
                        %
                      </span>
                    </td>

                    {/*
                     Delete icon is commented.
                     If enabled, it opens delete confirmation dialog.
                   */}
                    {/* <td className="view-in-web delete-icon">
                     <i class="fa fa-trash" aria-hidden="true" onClick={() => handleDeleteClick(index)}></i>
                   </td> */}
                  </tr>
                );
              })
              : null}
          </tbody>

          {/* Old table data rendering is commented */}
          {/* <tbody>{tableDATA}</tbody> */}
        </Table>


        {/*
         Add new row section is commented.
         WHY: This file mainly displays finalized minute content.
       */}

        {/*
       <div className="border border-light p-2 mt-4 mb-5 view-in-web">
         <Form.Label>
           Add New Row - (This will not be appeared in final minute)
         </Form.Label>

         <div className="form-row">
           <div className="col-6 form-group ">
             <Form.Control
               className="border border-light rounded"
               as="textarea"
               name="rowActivity"
               value={row_activity}
               placeholder="Enter New Activity..."
               onChange={(e) => handleChangeO(e)}
             />
           </div>

           <div className="form-group col-6">
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

         <div className="form-row d-flex justify-content-between">
           <div className="form-group col-9">
             <Form.Control
               name="rowResponsibility"
               value={row_responsibility}
               placeholder="Enter New Responsibility..."
               onChange={(e) => handleChangeO(e)}
             />
           </div>

           <Button
             variant="success"
             type="submit"
             onClick={() => addRow()}
             className="btnPrimary col-2 "
           >
             + Add Row
           </Button>
         </div>
       </div>
       */}


        {/* Closing remarks field */}
        <div className="form-row mt-5">
          <div className="form-group col-3">
            <Form.Label>Closing Remarks</Form.Label>
          </div>

          <div className="col-9">
            <Form.Control
              disabled={isFinalized}
              name="remarks"
              value={meeting_remarks}
              onChange={handleChangeO}
            />
          </div>
        </div>


        {/* Signature section */}
        <div
          className="form-row d-flex justify-content-between"
          id="footer-modal-addMember"
        >
          {/* Chairman signature area */}
          <div className="mt-5 view-in-print ">
            <span className="mt-5  ">
              <span>
                <b className="sign-line">
                  ....................................................................
                </b>
              </span>
              <h4 className="text-center mt-0 mb-0 text-black ">Chairman</h4>
              <h4 className="text-center mt-0 mb-5 text-black">
                Advisory Committee
              </h4>
            </span>
          </div>

          {/* Secretary signature area */}
          <div className="mt-5 view-in-print">
            <span className="mt-5">
              <span>
                <b className="sign-line">
                  ....................................................................
                </b>
              </span>
              <h4 className="text-center mt-0 mb-0 text-black">Secratory</h4>
              <h4 className="text-center mt-0 mb-5 text-black">
                Advisory Committee
              </h4>
            </span>
          </div>
        </div>


        {/* Footer action buttons */}
        <div
          className="form-row d-flex justify-content-end  mt-5 mb-5 "
          id="footer-modal-addMember"
        >
          {/* Delete minute button */}
          <Button
            variant=""
            onClick={() => deleteMinute()}
            className="btn btn-secondary view-in-web"
          >
            Delete
          </Button>

          {/*
           Save button is commented.
           WHY: Current screen may be used mainly for finalized viewing/printing.
         */}
          {/* <Button
           variant=""
           type="submit"
           className="btn btn-primary view-in-web ml-3 mr-3"
           onClick={(e) => editMinute(e)}
         >
           Save
         </Button> */}


          {/* Print button */}
          <Button
            variant=""

            // Calls print function passed from parent EditMinute component.
            onClick={() => props.bclick()}

            className="btn btn-ternitary view-in-web ml-3"

            // Print button is disabled until all participants complete rating.
            disabled={!isRatingCompleted}
          >
            Print
          </Button>

          {/*
           Close button is commented.
         */}
          {/* <Button
           variant="danger"
           onClick={props.close}
           className="btnPrimary view-in-web"
         >
           Close
         </Button> */}
        </div>
      </div>


      {/* Success dialog shown after update */}
      <Dialog
        open={openUpdateDialog}
        aria-labelledby="update-dialog-title"
        aria-describedby="update-dialog-description"
        PaperProps={{
          style: {
            minWidth: '350px'
          }
        }}
      >
        <DialogTitle id="update-dialog-title">
          {"Success"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="update-dialog-description">
            {updateMessage}
          </DialogContentText>
        </DialogContent>
      </Dialog>


      {/* Delete activity confirmation dialog */}
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
});


// EditMinute is the wrapper component.
// WHY: This wrapper handles printing.
// EditMinute1 contains the actual minute content.
const EditMinute = forwardRef((props, ref) => {

  // Create a reference to the printable component.
  // WHY: The print library needs to know exactly which part of the page to print.
  const componentRef = useRef();

  // useReactToPrint creates the print function.
  // content tells the library which component should be printed.
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <div>

        {/* 
         EditMinute1 displays the minute details.
         props are passed from parent to child component.
       */}
        <EditMinute1

          // close function closes modal/page.
          close={props.close}

          // minute contains selected minute details from database.
          minute={props.minute}

          // load function reloads minute list after update/delete.
          load={props.load}

          // ref connects EditMinute1 with print function.
          ref={componentRef}

          // bclick is passed as print button click function.
          bclick={handlePrint}
        />
      </div>
    </div>
  );
});


export default EditMinute;

