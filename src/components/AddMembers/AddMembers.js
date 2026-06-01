import React, { useRef, useEffect, useState } from "react";
import { BreadCrum, SideBar, Navbar, AdminCard } from "../../components";
import { Container, Form, Col, Row, Button, Alert } from "react-bootstrap";
import * as yup from "yup";
import { Formik } from "formik";
import "./AddMember.css";
import Footer from "../Footer/Footer";


// AddMembers is a functional component.
// This page is used to register/add a new committee member.
const AddMembers = (props) => {

  // show controls whether success/error alert is visible.
  const [show, setShow] = useState(false);

  // error stores backend error message.
  // If error is empty, it means registration is successful.
  const [error, setError] = useState("");

  // This regular expression checks whether phone number format is valid.
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  // workplace stores the selected sector value.
  // Logic: when user selects sector, workplace dropdown options change.
  const [workplace, setWorkplace] = useState("");

  // workPlaces contains workplace options for each sector.
  // Logic: different sectors have different workplaces.
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


  // Association workplace list.
  // This is currently not used in the form directly.
  const Association = [
    "Sri Lanka Automotive Component Manufacturers Association",
  ];


  // Academic workplace list.
  // This is currently not used in the form directly.
  const Academic = [
    "University of Moratuwa",
    "Ceylon German Technical Institute",
  ];


  // This function runs when sector dropdown changes.
  // Logic: selected sector is saved into workplace state.
  // Then workplace dropdown can show related workplace options.
  const handleChangeWork = (e) => {
    console.log(e.target.value);
    setWorkplace(e.target.value);
  };


  // Validation schema for the form.
  // Logic: before submitting, every important field must be checked.
  const schema = yup.object({
    // Name is required.
    name: yup.string().required("Name is required!"),

    // NIC must be old format or new format.
    // Example old NIC: 123456789V
    // Example new NIC: 200012345678
    nic: yup
      .string()
      .matches(
        /^(?:\d{9}[VvXx]|\d{12})$/,
        "NIC must be valid. Ex: 123456789V or 200012345678"
      )
      .required("NIC is required!"),

    // Email must be in valid email format.
    email: yup
      .string()
      .email("Invalid Email : Ex example@example.com")
      .required("Email is required!"),

    // Telephone number must match phone pattern.
    // It must also be exactly 10 numbers.
    tel: yup
      .string()
      .matches(phoneRegExp, "Phone Number is not valid")
      .min(10, "Phone no should be atleast 10 numbers long")
      .max(10, "Phone no should not more than 10 numbers long")
      .required("Phone no is required!"),

    // Sector is required.
    // User cannot keep default value "Select Sector".
    sector: yup
      .string()
      .required("Sector is required!")
      .notOneOf(["Select Sector"], "Selection Invalid"),

    // Workplace is required.
    workplace: yup.string().required("Office is required!"),

    // Role is required.
    // User cannot keep default value "Select Member Role".
    role: yup
      .string()
      .required("Role is required!")
      .notOneOf(["Select Member Role"], "Selection Invalid"),

    // Gender is required.
    // User cannot keep default value "Select Gender".
    gender: yup
      .string()
      .required("Gender is required!")
      .notOneOf(["Select Gender"], "Selection Invalid"),
  });


  // This function runs when user clicks Submit.
  // Logic:
  // 1. Get form values from Formik.
  // 2. Prepare request data.
  // 3. Send data to backend using POST request.
  // 4. If backend returns error, show error alert.
  // 5. If success, show success alert.
  const registerMember = async (event) => {
    // event.preventDefault();

    // Print form values in browser console for checking.
    console.log(event);

    try {
      // requestOptions contains backend request details.
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // Convert JavaScript object into JSON string before sending.
        body: JSON.stringify({
          // Save selected role as user type.
          utype: event.role,

          // Convert NIC to uppercase and remove extra spaces.
          nic: event.nic.toUpperCase().trim(),

          // Member name.
          name: event.name,

          // Convert email to lowercase before saving.
          email: event.email.toLowerCase(),

          // Telephone number.
          tel: event.tel,

          // Selected sector.
          sector: event.sector,

          // Selected workplace.
          workplace: event.workplace,

          // Selected gender.
          gender: event.gender,
        }),
      };

      // Send member registration request to backend.
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/register`,
        requestOptions
      );

      // Convert backend response to JSON.
      const data = await res.json();

      console.log(data);

      // If backend response has error property, show error alert.
      if (data.hasOwnProperty("error")) {
        setError(data.error);
        setShow(true);
      } else {
        // If no error, show success alert.
        setError("");
        setShow(true);
      }
    } catch (e) {
      // If request fails, print error in console.
      console.log(e);
    }
  };

  // Breadcrumb path.
  // This is currently not displayed in this code.
  const pathToPage = ["Home", "Users", "ManageMembers"];


  // This variable stores workplace dropdown options based on selected sector.
  var printWorkplaces;


  // If selected sector is Public, show public workplaces.
  if (workplace == "Public") {
    printWorkplaces = workPlaces.public;

    // If selected sector is Private, this currently shows Association workplaces.
    // Logic intention may be to show private workplaces.
  } else if (workplace == "Private") {
    printWorkplaces = workPlaces.Association;

    // If selected sector is Academic, show academic workplaces.
  } else if (workplace == "Academic") {
    printWorkplaces = workPlaces.Academic;

    // If selected sector is Association, show association workplaces.
  } else if (workplace == "Association") {
    printWorkplaces = workPlaces.Association;
  }

  return (
    <div className="content">

      {/* Formik handles form data, validation, and submit action */}
      <Formik
        validationSchema={schema}
        onSubmit={registerMember}
        initialValues={{
          name: "",
          nic: "",
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

            {/* First row: Name and NIC */}
            <Form.Row>
              <Form.Group as={Col} controlId="formGridName">
                <Form.Label>Name</Form.Label>

                {/* Name input field */}
                <Form.Control
                  required
                  name="name"
                  type="text"
                  placeholder="Name"

                  // handleChange updates Formik value.
                  onChange={handleChange}

                  // handleBlur marks field as touched after user leaves field.
                  onBlur={handleBlur}

                  // Current name value.
                  value={values.name}

                  // Show green validation if field is touched and has no error.
                  isValid={touched.name && !errors.name}

                  // Show red validation if field has error.
                  isInvalid={!!errors.name}
                />

                {/* Show name validation error */}
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>


              <Form.Group as={Col} controlId="formGridNIC">
                <Form.Label>NIC</Form.Label>

                {/* NIC input field */}
                <Form.Control
                  required
                  name="nic"
                  type="text"
                  placeholder="NIC"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.nic}
                  isValid={touched.nic && !errors.nic}
                  isInvalid={!!errors.nic}
                />

                {/* Show NIC validation error */}
                <Form.Control.Feedback type="invalid">
                  {errors.nic}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>


            {/* Second row: Email and Telephone Number */}
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>

                {/* Email input field */}
                <Form.Control
                  required
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  isInvalid={!!errors.email}
                  isValid={touched.email && !errors.email}
                />

                {/* Show email validation error */}
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>


              <Form.Group as={Col} controlId="formGridTel">
                <Form.Label>Telephone Number</Form.Label>

                {/* Telephone input field */}
                <Form.Control
                  type="tel"
                  name="tel"
                  placeholder="Telephone Number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.tel}
                  isInvalid={!!errors.tel}
                  isValid={touched.tel && !errors.tel}
                />

                {/* Show telephone validation error */}
                <Form.Control.Feedback type="invalid">
                  {errors.tel}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>


            {/* Third row: Sector and Workplace */}
            <Form.Row>
              <Form.Group as={Col} controlId="formGridSector">
                <Form.Label>Sector</Form.Label>

                {/* Sector dropdown */}
                <Form.Control
                  as="select"
                  name="sector"
                  onChange={(e) => {
                    // Update Formik sector value.
                    handleChange(e);

                    // Update workplace state to load matching workplace options.
                    handleChangeWork(e);
                  }}
                  onBlur={handleBlur}
                  value={values.sector}
                  isInvalid={!!errors.sector}
                  isValid={touched.sector && !errors.sector}
                >
                  <option>Select Sector</option>
                  <option>Public</option>
                  <option>Private</option>
                  <option>Academic</option>
                  <option>Association</option>
                </Form.Control>

                {/* Show sector validation error */}
                <Form.Control.Feedback type="invalid">
                  {errors.sector}
                </Form.Control.Feedback>
              </Form.Group>


              <Form.Group as={Col} controlId="formGridWorkplace">
                <Form.Label>Workplace</Form.Label>

                {/* Workplace dropdown.
                   Options change based on selected sector. */}
                <Form.Control
                  as="select"
                  name="workplace"
                  placeholder="Workplace"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.workplace}
                  isInvalid={!!errors.workplace}
                  isValid={touched.workplace && !errors.workplace}
                >
                  <option>Select Office</option>

                  {/* Display workplace options according to selected sector */}
                  {printWorkplaces}
                </Form.Control>

                {/* Show workplace validation error */}
                <Form.Control.Feedback type="invalid">
                  {errors.workplace}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>


            {/* Fourth row: Member Role and Gender */}
            <Form.Row>
              <Form.Group as={Col} controlId="formGridRole">
                <Form.Label>Member Role</Form.Label>

                {/* Member role dropdown */}
                <Form.Control
                  as="select"
                  name="role"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.role}
                  isInvalid={!!errors.role}
                  isValid={touched.role && !errors.role}
                >
                  <option>Select Member Role</option>
                  <option>Committee Member</option>
                  <option>Committee Secretary</option>
                  <option>Administrator</option>
                </Form.Control>

                {/* Show role validation error */}
                <Form.Control.Feedback type="invalid">
                  {errors.role}
                </Form.Control.Feedback>
              </Form.Group>


              <Form.Group as={Col} controlId="formGridGender">
                <Form.Label>Gender</Form.Label>

                {/* Gender dropdown */}
                <Form.Control
                  as="select"
                  name="gender"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.gender}
                  isInvalid={!!errors.gender}
                  isValid={touched.gender && !errors.gender}
                >
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </Form.Control>

                {/* Show gender validation error */}
                <Form.Control.Feedback type="invalid">
                  {errors.gender}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>


            {/* Alert box for success or error message */}
            <Alert show={show} variant={error === "" ? "success" : "danger"}>
              <Alert.Heading>
                {error !== "" ? (
                  // If error exists, display error message.
                  error
                ) : (
                  // If no error, display success message.
                  <>
                    Member Registered Successfully!
                    <p className="">
                      Email containing login details has been successfully sent to the
                      Member.
                    </p>
                  </>
                )}
              </Alert.Heading>


              <div className="d-flex justify-content-end">
                {error === "" ? (
                  // If registration successful, Done button closes the form/modal.
                  <Button onClick={() => setShow(false)} className="btn-Primary" onClick={props.close}>
                    Done
                  </Button>
                ) : (
                  // If error occurs, OK button hides the alert.
                  <Button
                    onClick={() => setShow(false)}
                    variant="primary"
                    className="btn-Primary"
                  >
                    OK
                  </Button>
                )}
              </div>
            </Alert>


            {/* Show Cancel and Submit buttons only when alert is not visible */}
            {!show && (
              <Form.Row
                id="footer-modal-addMember"
                className="d-flex justify-content-end"
              >
                {/* Cancel button closes the form/modal */}
                <Button onClick={props.close} className="btn-secondary">
                  Cancel
                </Button>


                {/* Submit button validates form and calls registerMember */}
                <Button type="submit" className="btn-primary ml-2">
                  Submit
                </Button>
              </Form.Row>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};


// Export AddMembers component so it can be used in other files.
export default AddMembers;

