import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Navbar } from "../components";
import "./Login.css";
import * as yup from "yup";
import { Formik } from "formik";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import logo from "../assets/logo.png";
import backImg from "../assets/main_pg_img.png";
import govLogo from "../assets/main logo.png";

function Login() {
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);
  const schema = yup.object({
    email: yup
      .string()
      .email("Invalid Email : Ex example@example.com")
      .required("Email is required!"),
    password: yup.string().required("Password is required!"),
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
  if (redirect) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div>



      {/* For large screens  */}
      <div className="container-login">
        <div class="image-section login-image-section">
          <div class="decor-shape"></div>
          <img src={backImg} alt="Meeting Image" class="meetingimg" />

        </div>

        <div class="login-form-section">
          <div className="inner-wrapper h-100 d-flex flex-column justify-content-center">
            <div className="d-flex justify-content-center logo-wrapper">
              <img src={govLogo} className="pb-3 ml-0 pl-0 logo-login" />
            </div>

            <div className="welcome-wrapper text-center pt-3 py-3">
              <h2 className="font-weight-bold mb-0">Welcome</h2>
              <p>Sign in to your account</p>
            </div>
            <div className="login-form mt-4">
              <Formik
                validationSchema={schema}
                onSubmit={login}
                initialValues={{
                  password: "",
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
                          className="d-flex flex-column p-1"

                        >
                          <Form.Label className="font-weight-bold">Username</Form.Label>


                          <Form.Control
                            style={{
                              border: "1px solid #bababa",
                              padding: "10px",
                              borderRadius: "5px",
                              width: "100%",
                              maxWidth: "unset",
                            }}
                            className="form-control-lg  col-8 "
                            required
                            name="email"
                            type="email"
                            placeholder="Enter email here"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!errors.email}
                            isValid={touched.email && !errors.email}
                          />
                        </div>


                        <div className=" p-1 text-danger">
                          {" "}
                          {errors.email}
                        </div>
                      </Form.Group>
                    </Form.Row>


                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <div
                          className="d-flex flex-column"

                        >
                          <Form.Label className="font-weight-bold">Password</Form.Label>
                          <Form.Control
                            style={{
                              border: "1px solid #bababa",
                              padding: "10px",
                              borderRadius: "5px",
                              width: "100%",
                              maxWidth: "unset",
                            }}
                            className="form-control-lg  col-8 "
                            required
                            name="password"
                            type="password"
                            placeholder="Enter password here"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            isValid={touched.password && !errors.password}
                            isInvalid={!!errors.password}
                          />
                        </div>
                        <div className=" p-1 text-danger">
                          {" "}
                          {errors.password}
                        </div>
                      </Form.Group>
                    </Form.Row>
                    {error != "" ? (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    ) : null}
                    <a href="/forget">
                      <h4 className="" style={{ color: "#0D97B9", textAlign: "right" }}>
                        Forget Your Password?
                      </h4>
                    </a>


                    <center>
                      <Button
                        className="login-btn mx-auto btn-primary w-100"
                        type="submit"
                      >
                        <span
                          id="loginButton"
                          className="pr-3 pl-3 pb-0 pt-0 mb-0 mt-0  font-weight-bold"
                        >
                          <h4
                            className="pb-0 pt-0 mb-0 mt-0"
                            style={{ fontSize: "1.2em" }}
                          >
                            <strong> Login</strong>
                          </h4>
                        </span>
                      </Button>
                      <br />

                    </center>
                  </Form>
                )}
              </Formik>
            </div>
          </div>


        </div>
      </div>

    </div>
  );
}

export default Login;
