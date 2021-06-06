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
function EditMinuteMembers() {
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
  const stars = [];

  const [tableData, setTableData] = useState([]);
  const [tableDataEach, setTableDataEach] = useState([]);
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
  const [minute, setMinute] = useState({});
  const [userID, setUserID] = useState(Auth.getUserId());
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(true);
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
    loadLatestMinute();
    return () => {};
  }, []);
  const loadLatestMinute = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/admin/newest-minute/")
      .then(function (response) {
        return response.json();
      })
      .then((minute) => {
        setMinute(minute);
        setMeetingName(minute.meeting_name);
        setMeetingDate(minute.meeting_date);
        setMeetingTime(minute.meeting_time);
        setMeetingVenue(minute.meeting_venue);
        setPrivatechips(minute.present_private);
        setPublicchips(minute.present_public);
        setAcademicchips(minute.present_academic);
        setAssociationchips(minute.present_association);
        setExcusedchips(minute.excused);
        setAbsentchips(minute.absent);
        setMeetingApproval(minute.meeting_approval_from);
        setMeetingMotion(minute.meeting_motion);
        setMeetingMotionby(minute.meeting_motionBy);
        setMeetingProposedBy(minute.meeting_proposedBy);
        setMeetingSecondedBy(minute.meeting_secondedBy);
        setMeetingObjective(minute.meeting_objective);
        setTableData(minute.meeting_activities);
        setMeetingRemarks(minute.meeting_remarks);
        setTableDataEach(minute.meeting_activities_each);
        return minute;
      })
      .then(function (minute) {
        ratedBefore(minute.meeting_activities_each, minute.meeting_activities);
      })
      .catch((error) => console.log(error));
    setLoading(false);
  };
  const ratingChanged = (newRating) => {
    return newRating;
  };

  const ratedBefore = (tableDataEach1, tableData1) => {
    var isRated = false;
    console.log(tableDataEach1);
    console.log(tableData1);
    let td = [];
    let td1 = [];

    for (let k = 0; k < tableDataEach1.length; k++) {
      if (tableDataEach1[k].userID === userID) {
        isRated = true;
        for (let i = 0; i < tableData1.length; i++) {
          if (tableDataEach1[k].tableData[i] != null) {
            td1.push(tableDataEach1[k].tableData[i]);
          } else {
            td1.push(tableData1[i]);
          }
          // for (let j = 0; j < tableDataEach1[k].tableData.length; j++) {

          // }
        }
      }
    }

    // tableDataEach1.forEach((element) => {
    //   if (element.userID === userID) {
    //     isRated = true;
    //     console.log(element.tableData);
    //     td = element.tableData;
    //   }
    // });
    if (isRated) {
      setTableData([...td1]);
    }
  };
  //Table row management
  const editRowRating = (index, value) => {
    console.log(index);
    console.log(value);
    tableData[index].rating = value;
    setTableData([...tableData]);
    console.log(tableData);
  };

  //Handle change overidder

  const editMinute = async (event) => {
    event.preventDefault();
    console.log("event");
    try {
      const activity_each = {
        userID: userID,
        tableData: tableData,
      };
      let isRated = false;
      tableDataEach.forEach((element) => {
        if (element.userID === userID) {
          element.tableData = tableData;
          isRated = true;
        }
      });

      if (!isRated) {
        tableDataEach.push(activity_each);
        setTableDataEach(tableDataEach);
      } else {
        setTableDataEach(tableDataEach);
      }
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: minute._id,

          activities_each: tableDataEach,
        }),
      };
      const res = await fetch(
        "http://localhost:5000/admin/minute-each",
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
        alert("Updated");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const chipSubmit = () => {};
  const chipRemove = () => {};
  // const returnNum = (num) => {
  //   stars.push(parseInt(num));
  //   setStars(stars);
  //   if (num == 1) {
  //     stars.push(parseInt(1));
  //     setStars(stars);
  //   }
  // };
  return (
    <div>
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
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>Name of Meeting</Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#eefbfd" }}
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
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>Date</Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#eefbfd" }}
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
              <div className="form-row">
                <div className="form-group" className="col-3">
                  <Form.Label>Time</Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#eefbfd" }}
                    readOnly
                    name="time"
                    type="time"
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
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>Venue</Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#eefbfd" }}
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
                    <Form.Label className="mb-0 mt-1">
                      Private Sector
                    </Form.Label>
                  </div>
                </div>
                <ReactChipInput
                  disabled
                  readOnly
                  className="m-0 p-0"
                  onSubmit={chipSubmit}
                  onRemove={chipRemove}
                  chips={private_chips}
                />
              </div>
              <div>
                <div className="form-row">
                  <div className="form-group" className="mb-0 mt-1" as={Col}>
                    <Form.Label className="mb-0 mt-1">
                      Public Sector{" "}
                    </Form.Label>

                    <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                  </div>
                </div>
                <ReactChipInput
                  className="m-0 p-0"
                  onSubmit={chipSubmit}
                  onRemove={chipRemove}
                  chips={public_chips}
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
                  onSubmit={chipSubmit}
                  onRemove={chipRemove}
                  chips={academic_chips}
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
                  onSubmit={chipSubmit}
                  onRemove={chipRemove}
                  chips={association_chips}
                />
              </div>
              <div>
                <div className="w-100 mt-3 mb-0 ">
                  <h4
                    className=" text-center mb-2"
                    style={{ color: "#070707" }}
                  >
                    <strong>Excused</strong>
                  </h4>
                </div>
                <ReactChipInput
                  className="m-0 p-0"
                  onSubmit={chipSubmit}
                  onRemove={chipRemove}
                  chips={excused_chips}
                />
              </div>
              <div>
                <div className="w-100 mt-3">
                  <h4
                    className=" text-center mb-2"
                    style={{ color: "#070707" }}
                  >
                    <strong>Absent</strong>
                  </h4>
                </div>
                <ReactChipInput
                  className="m-0 p-0"
                  onSubmit={chipSubmit}
                  onRemove={chipRemove}
                  chips={absent_chips}
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
                    style={{ backgroundColor: "#eefbfd" }}
                    readOnly
                    name="approvalDate"
                    type="date"
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
              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>Motion</Form.Label>
                </div>

                <div className="form-group col-9">
                  <Form.Control
                    style={{ backgroundColor: "#eefbfd" }}
                    readOnly
                    name="motion"
                    type="text"
                    value={minute.meeting_motion}
                    placeholder="Enter Here..."
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
                    style={{ backgroundColor: "#eefbfd" }}
                    readOnly
                    name="motionBy"
                    type="text"
                    value={minute.meeting_motionBy}
                    placeholder="Enter Here..."
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
                    style={{ backgroundColor: "#eefbfd" }}
                    readOnly
                    name="proposedBy"
                    type="text"
                    value={minute.meeting_proposedBy}
                    placeholder="Enter Here..."
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
                    style={{ backgroundColor: "#eefbfd" }}
                    readOnly
                    name="secondedBy"
                    type="text"
                    value={minute.meeting_secondedBy}
                    placeholder="Enter Here..."
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
                    style={{ backgroundColor: "#eefbfd" }}
                    readOnly
                    name="objective"
                    type="text"
                    value={minute.meeting_objective}
                    placeholder="Enter here..."
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

                            <td>
                              <ReactStars
                                count={5}
                                value={item.rating}
                                onChange={(e) => {
                                  editRowRating(index, ratingChanged(e));
                                }}
                                size={17}
                                activeColor="#ffd700"
                              />
                            </td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
                {/* <tbody>{tableDATA}</tbody> */}
              </Table>

              <div className="form-row">
                <div className="form-group col-3">
                  <Form.Label>Closing Remarks</Form.Label>
                </div>

                <div className="col-9">
                  <Form.Control
                    style={{ backgroundColor: "#eefbfd" }}
                    readOnly
                    name="remarks"
                    type="text"
                    value={minute.meeting_remarks}
                    placeholder="Enter here..."
                    onBlur={handleChange}
                  />
                </div>
              </div>

              <div className="form-row mt-5 ">
                <Button
                  variant="info"
                  type="submit"
                  className="btnPrimary "
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
