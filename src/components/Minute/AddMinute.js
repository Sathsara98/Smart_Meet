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
} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Formik } from "formik";
import { getIn } from "formik";
import * as yup from "yup";
import ReactStars from "react-rating-stars-component";

function AddMinute(props) {
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
  const [chips, setchips] = useState([]);
  const [chipsc, setchipsc] = useState([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  var curr = new Date();
  curr.setDate(curr.getDate());
  var date = curr.toISOString().substr(0, 10);
  var time = curr.toISOString().substr(11, 5);

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
    // const newRow = {
    //   activity: row_activity,
    //   action: row_action,
    //   responsibility: row_responsibility,
    //   rating: 0,
    // };

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
    }
  };
  const addMinute = async (event) => {
    event.preventDefault();
    console.log(event);
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utype: event.role,
          name: event.name,
          email: event.email.toLowerCase(),
          tel: event.tel,
          sector: event.sector,
          workplace: event.workplace,
          gender: event.gender,
        }),
      };
      const res = await fetch(
        "http://localhost:5000/users/register",
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
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Formik
        validationSchema={schema}
        // onSubmit={addMinute}
        initialValues={{
          name: "",
          venue: "",
          date: date,
          time: time,
        }}
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
                  placeholder="Enter Name..."
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.name}
                  isValid={touched.name && !errors.name}
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name && touched.name && errors.name}
                </Form.Control.Feedback>
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
                  defaultValue={date}
                  placeholder="Email"
                  onChange={handleChange}
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
                  defaultValue={time}
                  placeholder="Email"
                  onChange={handleChange}
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
                  placeholder="Enter Venue..."
                  onChange={handleChange}
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
                  defaultValue={date}
                  onChange={handleChange}
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
                  placeholder="Enter Here..."
                  onChange={handleChange}
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
                  placeholder="Enter Here..."
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-3">
                <Form.Label>Proposed By</Form.Label>
              </div>

              <div className="form-group" className="col-9">
                <Form.Control
                  name="proposedBy"
                  type="text"
                  placeholder="Enter Here..."
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" className="col-3">
                <Form.Label>Seconded By</Form.Label>
              </div>

              <div className="form-group" className="col-9">
                <Form.Control
                  name="secondedBy"
                  type="text"
                  placeholder="Enter Here..."
                  onChange={handleChange}
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
                  required
                  name="objective"
                  type="text"
                  placeholder="Enter here..."
                  onChange={handleChange}
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
                {tableData.map((item, index) => {
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
                    required
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
                    required
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
                  required
                  name="objective"
                  type="text"
                  placeholder="Enter here..."
                  onChange={handleChange}
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
              <Button variant="info" type="" className="btnPrimary">
                Submit
              </Button>
              <Button
                variant="danger"
                onClick={props.close}
                className="btnPrimary"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default AddMinute;
