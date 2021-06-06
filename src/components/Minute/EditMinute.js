import React, { useState, useEffect } from "react";
import ReactChipInput from "react-chip-input";
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
import Auth from "../../authentication/Auth";
function EditMinute(props) {
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
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
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
  }, []);

  const ratingChanged = (newRating) => {
    return newRating;
  };
  //chips management
  const addPrivateChip = (value) => {
    const nchips = private_chips.slice();
    nchips.push(value);
    if (value != "") {
      setPrivatechips(nchips);
    }
  };
  const addPublicChip = (value) => {
    const nchips = public_chips.slice();
    nchips.push(value);
    if (value != "") {
      setPublicchips(nchips);
    }
  };

  const addAcademicChip = (value) => {
    const nchips = academic_chips.slice();
    nchips.push(value);
    if (value != "") {
      setAcademicchips(nchips);
    }
  };

  const addAssociationChip = (value) => {
    const nchips = association_chips.slice();
    nchips.push(value);
    if (value != "") {
      setAssociationchips(nchips);
    }
  };

  const addExcusedChip = (value) => {
    const nchips = excused_chips.slice();
    nchips.push(value);
    if (value != "") {
      setExcusedchips(nchips);
    }
  };
  const addAbsentChip = (value, y) => {
    const nchips = absent_chips.slice();
    nchips.push(value);
    if (value != "") {
      setAbsentchips(nchips);
    }
  };

  const removePrivateChip = (index) => {
    const nchips = private_chips.slice();
    nchips.splice(index, 1);
    setPrivatechips(nchips);
  };
  const removePublicChip = (index) => {
    const nchips = public_chips.slice();
    nchips.splice(index, 1);
    setPublicchips(nchips);
  };
  const removeAcademicChip = (index) => {
    const nchips = academic_chips.slice();
    nchips.splice(index, 1);
    setAcademicchips(nchips);
  };
  const removeAssociationChip = (index) => {
    const nchips = association_chips.slice();
    nchips.splice(index, 1);
    setAssociationchips(nchips);
  };
  const removeExcusedChip = (index) => {
    const nchips = excused_chips.slice();
    nchips.splice(index, 1);
    setExcusedchips(nchips);
  };
  const removeAbsentChip = (index) => {
    const nchips = absent_chips.slice();
    nchips.splice(index, 1);
    setAbsentchips(nchips);
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
  const editMinute = async (event) => {
    event.preventDefault();
    console.log("event");
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
        "http://localhost:5000/admin/minute",
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
        props.load();
        props.close();
      }
    } catch (e) {
      console.log(e);
    }
  };

  async function deleteMinute() {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: props.minute._id }),
      };
      await fetch("http://localhost:5000/admin/minute", requestOptions);
      alert("Deleted");
      props.load();
      props.close();
    } catch (e) {
      console.log(e);
    }
  }

  const ratingArray = () => {
    var arr = new Array(tableData.length).fill(0);
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
      tableData.forEach(function (item, index) {
        item.overall = arr[index];
      });
      tableData.sort((a, b) => (a.overall < b.overall ? 1 : -1));
      setTableData(tableData);
    } else {
      tableData.forEach(function (item, index) {
        item.overall = 0;
      });
    }
    // tableData.forEach(element => {
    //   element.overall=
    // });

    //sort the table rows according to the percentage
  };

  return (
    <div>
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
              <div className="form-group" className="col-3">
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
                  className="pr-5 pb-2 pl-2 pt-1 "
                  style={{
                    backgroundColor: "#0A2057",
                    borderEndEndRadius: "90px",
                  }}
                >
                  <strong>Attendance</strong>
                </div>
              </h4>
            </div>
            <div className="w-100 ">
              <h4 className=" text-center " style={{ color: "#070707" }}>
                <strong>Present</strong>
              </h4>
            </div>
            <div>
              <div className="form-row">
                <div className="form-group mb-0" as={Col}>
                  <Form.Label className="mb-0 mt-1">Private Sector</Form.Label>
                </div>
              </div>
              <ReactChipInput
                className="m-0 p-0"
                chips={private_chips}
                onSubmit={(e) => addPrivateChip(e)}
                onRemove={(index) => removePrivateChip(index)}
              />
            </div>
            <div>
              <div className="form-row">
                <div className="form-group" className="mb-0 mt-1" as={Col}>
                  <Form.Label className="mb-0 mt-1">Public Sector </Form.Label>

                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </div>
              </div>
              <ReactChipInput
                className="m-0 p-0"
                chips={public_chips}
                onSubmit={(value) => addPublicChip(value)}
                onRemove={(index) => removePublicChip(index)}
              />
            </div>
            <div>
              <div className="form-row">
                <div className="form-group" className="mb-0 mt-1" as={Col}>
                  <Form.Label className="mb-0 mt-1">Academic</Form.Label>

                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </div>
              </div>
              <ReactChipInput
                className="m-0 p-0"
                chips={academic_chips}
                onSubmit={(value) => addAcademicChip(value)}
                onRemove={(index) => removeAcademicChip(index)}
              />
            </div>
            <div>
              <div className="form-row">
                <div className="form-group mb-0 mt-1" as={Col}>
                  <Form.Label className="mb-0 mt-1">Association</Form.Label>

                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </div>
              </div>
              <ReactChipInput
                className="m-0 p-0"
                chips={association_chips}
                onSubmit={(value) => addAssociationChip(value)}
                onRemove={(index) => removeAssociationChip(index)}
              />
            </div>
            <div>
              <div className="w-100 mt-3 mb-0 ">
                <h4 className=" text-center mb-2" style={{ color: "#070707" }}>
                  <strong>Excused</strong>
                </h4>
              </div>
              <ReactChipInput
                className="m-0 p-0"
                chips={excused_chips}
                onSubmit={(value) => addExcusedChip(value)}
                onRemove={(index) => removeExcusedChip(index)}
              />
            </div>
            <div>
              <div className="w-100 mt-3">
                <h4 className=" text-center mb-2" style={{ color: "#070707" }}>
                  <strong>Absent</strong>
                </h4>
              </div>
              <ReactChipInput
                className="m-0 p-0"
                chips={absent_chips}
                onSubmit={(value) => addAbsentChip(value)}
                onRemove={(index) => removeAbsentChip(index)}
              />
            </div>

            <div className="w-100 mt-4">
              <h4 className=" separator_minute " style={{ color: "#FFFFFF" }}>
                <div
                  className="pr-5 pb-2 pl-2 pt-1 "
                  style={{
                    backgroundColor: "#0A2057",
                    borderEndEndRadius: "90px",
                  }}
                >
                  <strong>Approval</strong>
                </div>
              </h4>
            </div>

            <div className="form-row">
              <div className="form-group" className="col-3">
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
                  className="pr-5 pb-2 pl-2 pt-1 "
                  style={{
                    backgroundColor: "#0A2057",
                    borderEndEndRadius: "90px",
                  }}
                >
                  <strong>Objective</strong>
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
                      width: 90,
                    }}
                  >
                    Rating
                  </th>
                  <th
                    style={{
                      width: 20,
                    }}
                  >
                    X
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData != null
                  ? tableData.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item.activity}</td>
                          <td>{item.action}</td>
                          <td>{item.responsibility}</td>
                          <td className="text-center">
                            {item.overall != null
                              ? item.overall.toFixed(2)
                              : "0.00"}{" "}
                            %
                          </td>
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
                    })
                  : null}
              </tbody>
              {/* <tbody>{tableDATA}</tbody> */}
            </Table>
            <div className="border border-light p-2 mt-4 mb-5">
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
              className="form-row"
              id="footer-modal-addMember"
              className="d-flex justify-content-between"
            >
              <Button
                variant="info"
                type="submit"
                className="btnPrimary"
                onClick={editMinute}
              >
                Save
              </Button>
              <Button
                variant="danger"
                onClick={() => deleteMinute()}
                className="btnPrimary"
              >
                Delete
              </Button>
              <Button
                variant="info"
                onClick={props.close}
                className="btnPrimary"
              >
                Print
              </Button>
              <Button
                variant="danger"
                onClick={props.close}
                className="btnPrimary"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default EditMinute;
