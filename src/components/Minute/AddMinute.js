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

import { Formik } from "formik";
import { getIn } from "formik";
import * as yup from "yup";
import ReactStars from "react-rating-stars-component";
import { Typeahead } from "react-bootstrap-typeahead";
import Auth from "../../authentication/Auth";
import "./Minute.css";
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

  // curr.setDate(curr.getDate());
  useEffect(() => {
    loadMembers();
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
    const newRow = {
      activity: row_activity,
      action: row_action,
      responsibility: row_responsibility,
      rating: 0,
    };
    tableData.push(newRow);
    setTableData([...tableData]);
    console.log(tableData);

    setRowActivity("");
    setRowAction("");
    setRowResponsibility("");
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

  const addMinute = async (event) => {
    event.preventDefault();
    console.log("event");
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        `${process.env.REACT_APP_BACKEND_URL}/admin/new-minute`,
        requestOptions
      );

      const data = await res.json();

      console.log(data);
      if (data.hasOwnProperty("error")) {
        setError(data.error);
        setShow(true);
      } else {
        setError("");
        setShow(true);
        props.close();
        props.load();
      }
    } catch (e) {
      console.log(e);
    }
  };

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
                  isInvalid={!!errors.name}
                  isValid={touched.name && !errors.name}
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
              </div>
            </div>
            <div className="form-row">
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
                  isInvalid={!!errors.date}
                  isValid={touched.date && !errors.date}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date && touched.date && errors.date}
                </Form.Control.Feedback>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Time</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  required
                  name="time"
                  type="time"
                  value={meeting_time}
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                  isInvalid={!!errors.time}
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
                  onBlur={handleChange}
                  isInvalid={!!errors.venue}
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
                id="basic-typeahead-multiple"
                labelKey="private_chips"
                multiple
                onChange={setPrivatechips}
                options={options}
                placeholder="Choose attendies..."
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
                id="basic-typeahead-multiple"
                labelKey="public_chips"
                multiple
                onChange={setPublicchips}
                options={options}
                placeholder="Choose attendies..."
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
                id="basic-typeahead-multiple"
                labelKey="academic_chips"
                multiple
                onChange={setAcademicchips}
                options={options}
                placeholder="Choose attendies..."
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
                id="basic-typeahead-multiple"
                labelKey="association_chips"
                multiple
                onChange={setAssociationchips}
                options={options}
                placeholder="Choose attendies..."
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
                id="basic-typeahead-multiple"
                labelKey="excused_chips"
                multiple
                onChange={setExcusedchips}
                options={options}
                placeholder="Choose attendies..."
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
                id="basic-typeahead-multiple"
                labelKey="absent_chips"
                multiple
                onChange={setAbsentchips}
                options={options}
                placeholder="Choose attendies..."
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
                <Form.Label>Approval from</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  required
                  name="approvalDate"
                  type="date"
                  value={meeting_approval_from}
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                  isInvalid={!!errors.date}
                  isValid={touched.date && !errors.date}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date && touched.date && errors.date}
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
                <Form.Label>Motion by</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  name="motionBy"
                  type="text"
                  value={meeting_motionby}
                  placeholder="Enter Here..."
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Proposed By</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  name="proposedBy"
                  type="text"
                  value={meeting_proposedby}
                  placeholder="Enter Here..."
                  onChange={handleChangeO}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Seconded By</Form.Label>
              </div>

              <div className="form-group col-9">
                <Form.Control
                  name="secondedBy"
                  type="text"
                  value={meeting_secondedby}
                  placeholder="Enter Here..."
                  onChange={handleChangeO}
                  onBlur={handleBlur}
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
                  onBlur={handleChange}
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
                type="submit"
                onClick={() => addRow()}
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
                        <Button
                          className="btnPrimary  m-1 p-1"
                          onClick={() => removeRow(index)}
                        >
                          x
                        </Button>
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
                  onBlur={handleChange}
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
                    <b>
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
                    <b>
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
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default AddMinute;
