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
  const [tableData, setTableData] = useState(props.minute.meeting_activities);
  const [tableDataEach, setTableDataEach] = useState(
    props.minute.meeting_activities_each
  );
  const [tableRows, setTableRows] = useState([]);
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

  const isFinalized = props.minute.is_finalized;

  const [errors, setError] = useState({
    name: "",
    date: "",
    time: "",
    venue: "",
  });
  const [options, setOptions] = useState(["saman", "kamal"]);
  const [openDialog, setOpenDialog] = useState(false);
  const [activityIndexToDelete, setActivityIndexToDelete] = useState(null);
  const [hoverNo, setHoverNo] = useState(false);
  const [hoverYes, setHoverYes] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  useEffect(() => {
    setMeetingName(props.minute.meeting_name);
    setMeetingDate(props.minute.meeting_date);
    setMeetingTime(props.minute.meeting_time);
    setMeetingVenue(props.minute.meeting_venue);
    setPrivatechips(props.minute.present_private);
    setPublicchips(props.minute.present_public);
    setAcademicchips(props.minute.present_academic);
    setAssociationchips(props.minute.present_association);
    setExcusedchips(props.minute.excused);
    setAbsentchips(props.minute.absent);
    setMeetingApproval(props.minute.meeting_approval_from);
    setMeetingMotion(props.minute.meeting_motion);
    setMeetingMotionby(props.minute.meeting_motionBy);
    setMeetingProposedBy(props.minute.meeting_proposedBy);
    setMeetingSecondedBy(props.minute.meeting_secondedBy);
    setMeetingObjective(props.minute.meeting_objective);
    setTableData(props.minute.meeting_activities);
    setTableDataEach(props.minute.meeting_activities_each);
    setMeetingRemarks(props.minute.meeting_remarks);
    ratingArray();
    loadMembers();
  }, []);

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
        response.forEach((element) => {
          memarray.push(element.name);
        });
        setOptions(memarray);
      })
      .catch((error) => console.log(error));
  };

  //Table row management
  const addRow = () => {
    const newRow = {
      activity: row_activity,
      action: row_action,
      responsibility: row_responsibility,
      rating: 0,
    };
    tableData.push(newRow);
    tableRows.push(newRow);
    setTableData([...tableData]);
    setTableRows([...tableRows]);

    setRowActivity("");
    setRowAction("");
    setRowResponsibility("");
  };
  const removeRow = (index) => {
    returnModel(true, "Are You Sure?", true, function (res) {
      if (res) {
        let obj = tableRows.splice(index, 1);
        // console.log(obj);

        // console.log(tableData.findIndex((e) => e._id === obj[0]._id));
        let i = tableData.findIndex(
          (e) =>
            e.activity === obj[0].activity &&
            e.action === obj[0].action &&
            e.responsibility === obj[0].responsibility
        );
        tableData.splice(i, 1);
        setTableRows([...tableRows]);
        setTableData([...tableData]);
      }
    });
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
      let obj = tableRows.splice(activityIndexToDelete, 1);
      let i = tableData.findIndex(
        (e) =>
          e.activity === obj[0].activity &&
          e.action === obj[0].action &&
          e.responsibility === obj[0].responsibility
      );
      tableData.splice(i, 1);
      setTableRows([...tableRows]);
      setTableData([...tableData]);
      handleCloseDialog();
    }
  };

  const totalParticipants = props.minute.total_participants || 0;
  const totalRatedParticipants = props.minute.total_rated_participants || 0;

  const isRatingCompleted = totalParticipants > 0 && totalRatedParticipants >= totalParticipants;


  console.log("participants", totalParticipants);
  console.log("rated", totalRatedParticipants);
  console.log("completed", isRatingCompleted);
  console.log("minute", props.minute);
  console.log("tableDataEach", tableDataEach);



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
  const editMinute = async (event) => {
    event.preventDefault();

    if (meeting_name == "") {
      const error = { name: "Name is required", date: "", time: "", venue: "" };

      setError(error);
    } else if (meeting_date == "") {
      const error = { name: "", date: "Date is required", time: "", venue: "" };
      setError(error);
    } else if (meeting_time == "") {
      const error = { name: "", date: "", time: "Time is required", venue: "" };
      setError(error);
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
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/admin/minute`,
          requestOptions
        );

        const data = await res.json();

        console.log(data);
        if (data.hasOwnProperty("error")) {
          setError(data.error);
        } else {
          setUpdateMessage("Updated!");
          setOpenUpdateDialog(true);
          setTimeout(() => {
            props.load();
            props.close();
          }, 1500);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  async function deleteMinute() {
    returnModel(
      true,
      "This step can not be undone!",
      true,
      async function (res) {
        if (res) {
          try {
            const requestOptions = {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: props.minute._id }),
            };
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/minute`, requestOptions);
            alert("Deleted");
            props.load();
            props.close();
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
  }

  // Calculating the percentage from ratings people are voted
  const ratingArray = () => {
    var arr = new Array(tableData.length).fill(0);
    let tbData = [...tableData];
    var total = 0;
    console.log(tableDataEach);
    if (tableDataEach.length > 0) {
      tableDataEach.forEach((element) => {
        console.log(element.tableData);

        for (let i = 0; i < element.tableData.length; i++) {
          arr[i] = arr[i] + element.tableData[i].rating;
        }
      });
      for (let i = 0; i < arr.length; i++) {
        total = total + arr[i];
      }
      for (let i = 0; i < arr.length; i++) {
        arr[i] = (arr[i] / total) * 100;
      }
      tbData.forEach(function (item, index) {
        item.overall = arr[index];
      });
      tbData.sort((a, b) => (a.overall < b.overall ? 1 : -1));
    } else {
      tbData.forEach(function (item, index) {
        item.overall = 0;
      });
    }
    setTableRows(tbData);
  };
  //Model Management
  const [model, setModel] = useState(null);
  const returnModel = (show, body, confirmation, callback) => {
    setModel(
      <Model
        show={show}
        confirmation={confirmation}
        body={body}
        handleClose={() => {
          returnModel(false, "", null);
        }}
        handleClick={(e) => {
          callback(e);
          returnModel(false, "", null);
        }}
      />
    );
  };
  return (
    <div>
      <div ref={ref} className="page-break ">
        {model}
        <h2 className="text-center mx-auto view-in-print text-black">
          <b>Meeting Minute</b>
        </h2>
        <div className="form-row">
          <div className="form-group col-3">
            <Form.Label>Name of Meeting</Form.Label>
          </div>

          <div className="form-group col-9">
            <Form.Control
              disabled={isFinalized}
              name="name"
              value={meeting_name}
              onChange={handleChangeO}
            />
            <div className="text-red">{errors.name}</div>
          </div>
        </div>
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
        <div className="w-100 mt-3">
          <h4 className=" separator_minute " style={{ color: "#FFFFFF" }}>
            <div
              className=" " >
              <strong className="section-header"> Attendance</strong>
            </div>
          </h4>
        </div>
        <div className="w-100 ">
          <h4 style={{ color: "#070707" }}>
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
            disabled={isFinalized}
            multiple
            options={options}
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
            disabled={isFinalized}
            multiple
            options={options}
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
            disabled={isFinalized}
            multiple
            options={options}
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
            disabled={isFinalized}
            multiple
            options={options}
            selected={association_chips}
          />
        </div>
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

        <div className="w-100 mt-4">
          <h4 className=" separator_minute " style={{ color: "#FFFFFF" }}>
            <div
              className="">
              <strong className="section-header">Approval</strong>
            </div>
          </h4>
        </div>

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
        <div className="w-100 mt-4">
          <h4 className=" separator_minute " style={{ color: "#FFFFFF" }}>
            <div
              className=" ">
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
              disabled={isFinalized}
              name="objective"
              value={meeting_objective}
              onChange={handleChangeO}
            />
          </div>
        </div>
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
              <th className="text-black ">Activity</th>
              <th className="text-black ">
                Action taken/
                <br />
                to be taken
              </th>
              <th className="text-black ">Responsibility</th>
              <th
                className="text-black "
                style={{
                  width: 100,
                }}
              >
                Rating
              </th>
              {/* <th
                className="view-in-web"
                style={{
                  width: 20,
                }}
              ></th> */}
            </tr>
          </thead>
          <tbody>
            {tableRows != null
              ? tableRows.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <span className="text-black-table ">
                        {item.activity}
                      </span>
                    </td>
                    <td>
                      <span className="text-black-table  ">
                        {item.action}
                      </span>
                    </td>
                    <td>
                      <span className="text-black-table ">
                        {item.responsibility}
                      </span>
                    </td>
                    <td className=" text-center">
                      <span className="text-black-table  ">
                        {item.overall != null
                          ? item.overall.toFixed(2)
                          : "0.00"}{" "}
                        %
                      </span>
                    </td>
                    {/* <td className="view-in-web delete-icon">
                      <i class="fa fa-trash" aria-hidden="true" onClick={() => handleDeleteClick(index)}></i>
                      
                    </td> */}
                  </tr>
                );
              })
              : null}
          </tbody>
          {/* <tbody>{tableDATA}</tbody> */}
        </Table>
        {/* <div className="border border-light p-2 mt-4 mb-5 view-in-web">
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
        </div> */}
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
        <div
          className="form-row d-flex justify-content-between"
          id="footer-modal-addMember"
        >
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
        <div
          className="form-row d-flex justify-content-end  mt-5 mb-5 "
          id="footer-modal-addMember"
        >
          <Button
            variant=""
            onClick={() => deleteMinute()}
            className="btn btn-secondary view-in-web"
          >
            Delete
          </Button>
          {/* <Button
            variant=""
            type="submit"
            className="btn btn-primary view-in-web ml-3 mr-3"
            onClick={(e) => editMinute(e)}
          >
            Save
          </Button> */}

          <Button
            variant=""
            onClick={() => props.bclick()}
            className="btn btn-ternitary view-in-web ml-3"
            disabled={!isRatingCompleted}
          >
            Print
          </Button>
          {/* <Button
            variant="danger"
            onClick={props.close}
            className="btnPrimary view-in-web"
          >
            Close
          </Button> */}
        </div>
      </div>

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
});
const EditMinute = forwardRef((props, ref) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      <div>
        <EditMinute1
          close={props.close}
          minute={props.minute}
          load={props.load}
          ref={componentRef}
          bclick={handlePrint}
        />
      </div>
    </div>
  );
});

export default EditMinute;