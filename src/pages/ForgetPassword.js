import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Navbar } from "../components";
import "./Login.css";
import * as yup from "yup";
import { Formik } from "formik";
import { Container, Form, Col, Row, Button, Modal } from "react-bootstrap";
import logo from "../assets/logo.png";
import backImg from "../assets/main_pg_img.png";
import govLogo from "../assets/main logo.png";



function Login() {
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [show, setShow] = useState(false);
  const schema = yup.object({
    email: yup
      .string()
      .email("Invalid Email : Ex example@example.com")
      .required("Email is required!"),
    password: yup.string().required("Password is required!"),
  });
  const schema2 = yup.object({
    email: yup
      .string()
      .email("Invalid Email : Ex example@example.com")
      .required("Email is required!"),
  });
  const login = async (event) => {
    console.log(event);

    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: event.email,
          password: event.password,
        }),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/login`,
        requestOptions
      );

      const data = await res.json();

      if (data.hasOwnProperty("accessToken")) {
        localStorage.setItem("token", data.accessToken);
        setRedirect(true);
      } else {
        setError(data.error);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleClose = () => {
    setShow(false);
    setRedirect(true);
  };
  const reset = async (event) => {
    console.log(event.email);

    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: event.email,
        }),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/forget`,
        requestOptions
      );

      const data = await res.json();

      console.log(data);

      if (data) {
        setShow(true);
      }
    } catch (e) {
      console.log(e);
    }
  };
  if (redirect) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      {/* For all large screens */}
      <div className="container-login">

        <div class="image-section login-image-section">
          <div class="decor-shape"></div>
          <img src={backImg} alt="Meeting Image" class="meetingimg" />

        </div>


        <div className="login-form-section">

          <div className="inner-wrapper d-flex flex-column justify-content-center">


            <div className="d-flex justify-content-center logo-wrapper">
              <img src={govLogo} className="pb-3 ml-0 pl-0 logo-login" />
            </div>

            <div className="welcome-wrapper text-center pt-3 py-3">
              <h2 className="font-weight-bold mb-0">Forgot Your Password?</h2>
              {/* <p>Sign in to your account</p> */}
            </div>

            <Formik
              validationSchema={schema2}
              onSubmit={reset}
              initialValues={{
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
                    <Form.Group as={Col} controlId="formGridPassword">
                      <div
                        className="d-flex flex-column  p-1 ">
                        <Form.Label className="font-weight-bold">Email</Form.Label>


                        <Form.Control
                          style={{
                            border: "1px solid #bababa",
                            padding: "10px",
                            borderRadius: "5px",
                            width: "100%",
                            maxWidth: "unset",
                          }}
                          className="form-control-lg  col-8"
                          required
                          value={values.email}
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!errors.email}
                          isValid={touched.email && !errors.email}
                        />
                      </div>
                      <div className="text-center p-1 text-danger">
                        {errors.email}
                      </div>
                    </Form.Group>
                  </Form.Row>

                  {error != "" ? (
                    <div className="alert alert-success" role="alert">
                      {error}
                    </div>
                  ) : null}

                  <center>
                    <Button
                      className="login-btn mx-auto btn-primary w-100"
                      type="submit"
                    >
                      <span
                        id="loginButton"
                        className="pr-5 pl-5 pb-0 pt-0 mb-0 mt-0 text-strong font-weight-bold "
                      >
                        <h4
                          className="pb-0 pt-0 mb-0 mt-0"
                          style={{ fontSize: "1.2em" }}
                        >
                          <strong> Reset</strong>
                        </h4>
                      </span>
                    </Button>
                  </center>
                </Form>
              )}
            </Formik>

          </div>

        </div>
      </div>
      <div className="position-fixed " style={{ right: "0", zIndex: "1071" }}>
        <div className="d-flex flex-column  justify-content-start align-items-end z-index-10">
          <div>
            <Button
              className="mt-4 mx-auto mr-0 pl-4 pr-3 pt-3 pb-3 index-right-buttons"
              href="/"
            >
              <span
                id="loginButton"
                className="  pb-0  mt-0 text-strong font-weight-bold overflow-hidden"
                style={{ fontSize: "1.4em" }}
              >
                <i class="fas fa-home"></i>
                <strong>&nbsp; Hom</strong>
                <strong style={{ color: "#14A9FF" }}>e</strong>
              </span>
            </Button>
          </div>
        </div>
      </div>
      <Modal
        show={show}
        size="lg"
        onHide={() => handleClose()}
        backdrop="static"
        keyboard={false}
        scrollable={true}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton onClick={() => handleClose()}></Modal.Header>
        <Modal.Body>
          {" "}
          <h2>Your Password Has Been Reset</h2>
          <h3>An Email Containing Your New Password has been sent to you.</h3>
          <Button
            className="mt-2 mx-auto btnPrimary login-button"
            onClick={() => handleClose()}
          >
            <span
              id="loginButton"
              className="pr-5 pl-5 pb-0 pt-0 mb-0 mt-0 text-strong font-weight-bold "
            >
              <h4
                className="text-shadow pb-0 pt-0 mb-0 mt-0"
                style={{ fontSize: "1.4em" }}
              >
                <strong> Done</strong>
              </h4>
            </span>
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Login;
