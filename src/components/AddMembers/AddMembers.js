import React, { useRef, useEffect, useState } from "react";
import { BreadCrum, SideBar, Navbar, AdminCard } from "../../components";
import { Container, Form, Col, Row, Button, Alert } from "react-bootstrap";
import * as yup from "yup";
import { Formik } from "formik";

const AddMembers = () => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

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
    sector: yup.string().required("Sector is required!"),
    workplace: yup.string().required("Workplace is required!"),
    role: yup.string().required("Role is required!"),
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
          name: event.role,
          email: event.email.toLowerCase(),
          tel: event.tel,
          sector: event.sector,
          workplace: event.workplace,
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
  return (
    <div class="content">
      <AdminCard title="Register New Members">
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
                    type="text"
                    name="sector"
                    placeholder="Sector"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.sector}
                    isValid={touched.sector && !errors.sector}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.sector}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridAddress1">
                  <Form.Label>Workplace</Form.Label>
                  <Form.Control
                    name="workplace"
                    placeholder="Workplace"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.workplace}
                    isValid={touched.workplace && !errors.workplace}
                  />
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
              <Alert show={show} variant={error == "" ? "success" : "danger"}>
                <Alert.Heading>
                  {error != "" ? (
                    error
                  ) : (
                    <>
                      Member Registered Successfully !
                      <p className="text-secondary">
                        Email containing loging details has been Successfully
                        sent to the Member.
                      </p>
                    </>
                  )}
                </Alert.Heading>

                <hr />
                <div className="d-flex justify-content-end">
                  {error == "" ? (
                    <Button onClick={() => setShow(false)} variant="info">
                      {" "}
                      Done{" "}
                    </Button>
                  ) : (
                    <Button onClick={() => setShow(false)} variant="primary">
                      OK
                    </Button>
                  )}
                </div>
              </Alert>
              <Button variant="info" type="submit">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </AdminCard>
    </div>
  );
};

export default AddMembers;
