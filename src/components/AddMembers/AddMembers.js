import React, { useRef, useEffect, useState } from "react";
import { BreadCrum, SideBar, Navbar, AdminCard } from "../../components";
import { Container, Form, Col, Row, Button, Alert } from "react-bootstrap";
import * as yup from "yup";
import { Formik } from "formik";
import "./AddMember.css";

const AddMembers = (props) => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const [workplace, setWorkplace] = useState("");
  const workPlaces = {
    public: [
      <option>Ministry of industries</option>,
      <option>Ministry of transport</option>,
      <option>Ministry of vocational training and skills development</option>,
      <option>Ministry of plantation</option>,
      <option>Department of sri lanka custome</option>,
      <option>Department of import export control</option>,
      <option>Department of trade and tariff</option>,
      <option>Sri Lanka standard institute</option>,
      <option>Industrial development board </option>,
      <option>Export development board</option>,
      <option>Board of investment</option>,
    ],
    Association: [
      <option>Sri Lanka Automotive Component Manufacturers Association</option>,
    ],
    private: [
      <option>CEAT-Kelani International Tyres (Pvt) Ltd</option>,
      <option>Kelani cables PLC</option>,
      <option>Laugfs Lanka</option>,
      <option>ACL cable</option>,
      <option>Global rubber industries</option>,
      <option> Rigid tyre corporation</option>,
      <option>Micro cars (Pvt) Ltd</option>,
      <option>United Motors</option>,
      <option>IDL motors</option>,
      <option>Sierra cables</option>,
    ],
    Academic: [
      <option>University of Moratuwa</option>,
      <option>Ceylon German Technical Institute</option>,
    ],
  };

  const Association = [
    "Sri Lanka Automotive Component Manufacturers Association",
  ];

  const Academic = [
    "University of Moratuwa",
    "Ceylon German Technical Institute",
  ];

  const handleChangeWork = (e) => {
    console.log(e.target.value);
    setWorkplace(e.target.value);
  };

  const schema = yup.object({
    name: yup.string().required("Name is required!"),
    email: yup
      .string()
      .email("Invalid Email : Ex example@example.com")
      .required("Email is required!"),
    tel: yup
      .string()
      .matches(phoneRegExp, "Phone Number is not valid")
      .min(10, "Phone no should be atleast 10 numbers long")
      .max(10, "Phone no should not more than 10 numbers long")
      .required("Phone no is required!"),
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

  const registerMember = async (event) => {
    // event.preventDefault();
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
  const pathToPage = ["Home", "Users", "ManageMembers"];

  var printWorkplaces;

  if (workplace == "Public") {
    printWorkplaces = workPlaces.public;
  } else if (workplace == "Private") {
    printWorkplaces = workPlaces.Association;
  } else if (workplace == "Academic") {
    printWorkplaces = workPlaces.Academic;
  } else if (workplace == "Association") {
    printWorkplaces = workPlaces.Association;
  }
  return (
    <div className="content">
      <Formik
        validationSchema={schema}
        onSubmit={registerMember}
        initialValues={{
          name: "",
          email: "",
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
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Name</Form.Label>
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

                <Form.Control.Feedback type="invalid">
                  {errors.name};
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.email}
                  isValid={touched.email && !errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Telephone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="tel"
                  placeholder="Telephone Number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.tel}
                  isValid={touched.tel && !errors.tel}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tel}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Sector</Form.Label>
                <Form.Control
                  as="select"
                  name="sector"
                  onChange={(e) => {
                    handleChange(e);
                    handleChangeWork(e);
                  }}
                  onBlur={handleBlur}
                  isInvalid={!!errors.sector}
                  isValid={touched.sector && !errors.sector}
                >
                  <option>Select Sector</option>
                  <option>Public</option>
                  <option>Private</option>
                  <option>Academic</option>
                  <option>Association</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.sector}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Workplace</Form.Label>
                <Form.Control
                  as="select"
                  name="workplace"
                  placeholder="Workplace"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.workplace}
                  isValid={touched.workplace && !errors.workplace}
                >
                  <option>Select Office</option>
                  {printWorkplaces}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.workplace}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="exampleForm.ControlSelect1">
                <Form.Label>Member Role</Form.Label>
                <Form.Control
                  as="select"
                  name="role"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.role}
                  isValid={touched.role && !errors.role}
                >
                  <option>Select Member Role</option>
                  <option>Committee Member</option>
                  <option>Committee Secretary</option>
                  <option>Administrator</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.role}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.gender}
                  isValid={touched.gender && !errors.gender}
                >
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.gender}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col}></Form.Group>
            </Form.Row>
            <Alert show={show} variant={error == "" ? "success" : "danger"}>
              <Alert.Heading>
                {error != "" ? (
                  error
                ) : (
                  <>
                    Member Registered Successfully !
                    <p className="text-secondary">
                      Email containing loging details has been Successfully sent
                      to the Member.
                    </p>
                  </>
                )}
              </Alert.Heading>

              <hr />
              <div className="d-flex justify-content-end">
                {error == "" ? (
                  <Button
                    onClick={() => setShow(false)}
                    variant="info"
                    className="btnPrimary"
                    onClick={props.close}
                  >
                    Done
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShow(false)}
                    variant="primary"
                    className="btnPrimary"
                  >
                    OK
                  </Button>
                )}
              </div>
            </Alert>

            <Form.Row
              id="footer-modal-addMember"
              className="d-flex justify-content-between"
            >
              <Button variant="info" type="submit" className="btnPrimary">
                Submit
              </Button>
              <Button
                variant="danger"
                onClick={props.close}
                className="btnPrimary"
              >
                Cancel
              </Button>
            </Form.Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddMembers;
