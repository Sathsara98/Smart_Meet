import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Navbar } from "../components";
import "./Login.css";
import * as yup from "yup";
import { Formik } from "formik";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import logo from "../assets/logo.png";

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
        "http://localhost:5000/users/login",
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
      <Navbar varient="transparent" />
      {/* Mobile only */}
      <div className="login-cover1 center d-block d-sm-none position-absolute vh-100">
        <div className="d-flex flex-column  justify-content-between align-items-between ">
          <div
            className=" w-100 p-0 "
            style={{ borderRadius: "0px 0px 50px 0px" }}
          >
            {/* <div className="position-absolute " style={{ right: "0" }}>
              <div className="d-flex flex-column justify-content-start align-items-end ">
                <div>
                  <Button
                    className="mt-4 mx-auto mr-0 pl-4 pr-3 pt-3 pb-3 index-right-buttons1"
                    style={{ zIndex: "1071" }}
                    href="/login"
                  >
                    <span
                      id="loginButton"
                      className="  pb-0  mt-0 text-strong font-weight-boldn "
                      style={{ fontSize: "1.4em" }}
                    >
                      <strong>Logi</strong>
                      <strong style={{ color: "#14A9FF" }}>n &nbsp; </strong>
                    </span>
                  </Button>
                </div>
              </div>
            </div> */}
            <div className="py-5"></div>
            <div className="d-flex flex-column justify-content-center m-4">
              <div className="w-100 d-flex ">
                <img
                  className=" px-5 pt-5 pb-3 mx-auto"
                  src={logo}
                  width="80%"
                />
              </div>
              <div className="mb-2 ">
                <h4
                  className="text-center text-white mb-3"
                  style={{ fontSize: "1em" }}
                >
                  <strong>
                    The official meeting scheduler of advisory <br /> committee
                    of Ministry of industry
                  </strong>
                </h4>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 p-0 ">
            <div className="d-flex justify-content-center col align-items-center">
              <div
                className="container login-box"
                style={{
                  backgroundColor: "rgba(255,255,255,0.7)",
                  marginTop: "5px",
                  marginBottom: "5px",
                  borderRadius: "15px 15px 15px 15px",
                }}
              >
                <h3 className="text-center" style={{ color: "#003A5C" }}>
                  Enter your login details
                </h3>
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
                            className="d-flex align-items-center justify-content-between p-1"
                            style={{
                              boxShadow:
                                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                              backgroundColor: "rgb(255,255,255)",
                              borderRadius: "50px 50px 50px 50px",
                            }}
                          >
                            <div className="col-2 m-0 pl-0 ">
                              <img
                                className="ml-0 py-1 px-1 "
                                style={{
                                  width: "50px",

                                  boxShadow:
                                    "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
                                  borderRadius: "50px 50px 50px 50px",
                                }}
                                src={`${process.env.PUBLIC_URL}/assets/img/username.png`}
                                alt="Card image cap"
                              />
                            </div>
                            <Form.Control
                              style={{
                                border: 0,
                                padding: "20px",
                                borderRadius: "50px 50px 50px 50px",
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

                          <div className="text-center p-1 text-danger">
                            {" "}
                            {errors.email}
                          </div>
                        </Form.Group>
                      </Form.Row>

                      <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                          <div
                            className="d-flex align-items-center justify-content-between p-1 mt-4"
                            style={{
                              boxShadow:
                                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                              backgroundColor: "rgb(255,255,255)",
                              borderRadius: "50px 50px 50px 50px",
                            }}
                          >
                            <div className="col-2 m-0 pl-0 ">
                              <img
                                className="ml-0 py-1 px-1 "
                                style={{
                                  width: "50px",

                                  boxShadow:
                                    "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
                                  borderRadius: "50px 50px 50px 50px",
                                }}
                                src={`${process.env.PUBLIC_URL}/assets/img/password.png`}
                                alt="Card image cap"
                              />
                            </div>
                            <Form.Control
                              style={{
                                border: 0,
                                padding: "20px",
                                borderRadius: "50px 50px 50px 50px",
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
                          <div className="text-center p-1 text-danger">
                            {" "}
                            {errors.password};
                          </div>
                        </Form.Group>
                      </Form.Row>
                      {error != "" ? (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      ) : null}

                      <center>
                        <Button
                          className="mt-2 mx-auto btnPrimary login-button"
                          type="submit"
                        >
                          <span
                            id="loginButton"
                            className="pr-5 pl-5 pb-0 pt-0 mb-0 mt-0 text-strong font-weight-bold "
                          >
                            <h4
                              className="text-shadow pb-0 pt-0 mb-0 mt-0"
                              style={{ fontSize: "1.4em" }}
                            >
                              <strong> Login</strong>
                            </h4>
                          </span>
                        </Button>
                        <br />
                        <a href="/forget">
                          <h4 className="" style={{ color: "#000D61" }}>
                            Forget Password?
                          </h4>
                        </a>
                      </center>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* For large screens  */}
      <div className="login-cover center d-none d-md-block position-absolute">
        <div className="d-flex vh-100 justify-content-center align-items-center ">
          <div
            className="col-12 col-md-6 w-100 p-0 "
            style={{ borderRadius: "0px 0px 50px 0px" }}
          >
            <div className="position-absolute " style={{ right: "0" }}>
              <div className="d-flex flex-column justify-content-start align-items-end ">
                <div>
                  <Button
                    className="mt-4 mx-auto mr-0 pl-4 pr-3 pt-3 pb-3 index-right-buttons1"
                    style={{ zIndex: "1071" }}
                    href="/login"
                  >
                    <span
                      id="loginButton"
                      className="  pb-0  mt-0 text-strong font-weight-boldn "
                      style={{ fontSize: "1.4em" }}
                    >
                      <strong>Logi</strong>
                      <strong style={{ color: "#14A9FF" }}>n &nbsp; </strong>
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column justify-content-center m-4">
              <div className="w-100 d-flex ">
                <img
                  className=" px-5 pt-5 pb-3 mx-auto"
                  src={logo}
                  width="65%"
                />
              </div>
              <div className="mb-5 ">
                <h4
                  className="text-center text-white mb-5"
                  style={{ fontSize: "1em" }}
                >
                  <strong>
                    The official meeting scheduler of advisory <br /> committee
                    of Ministry of industry
                  </strong>
                </h4>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6  col-sm-12 p-0 ">
            <div className="d-flex justify-content-center col align-items-center">
              <div
                className="container login-box"
                style={{
                  backgroundColor: "rgba(255,255,255,0.7)",
                  marginTop: "5px",
                  marginBottom: "5px",
                  borderRadius: "15px 15px 15px 15px",
                }}
              >
                <h3 className="text-center" style={{ color: "#003A5C" }}>
                  Enter your login details
                </h3>
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
                            className="d-flex align-items-center justify-content-between p-1"
                            style={{
                              boxShadow:
                                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                              backgroundColor: "rgb(255,255,255)",
                              borderRadius: "50px 50px 50px 50px",
                            }}
                          >
                            <div className="col-2 m-0 pl-0 ">
                              <img
                                className="ml-0 py-1 px-1 "
                                style={{
                                  width: "50px",

                                  boxShadow:
                                    "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
                                  borderRadius: "50px 50px 50px 50px",
                                }}
                                src={`${process.env.PUBLIC_URL}/assets/img/username.png`}
                                alt="Card image cap"
                              />
                            </div>
                            <Form.Control
                              style={{
                                border: 0,
                                padding: "20px",
                                borderRadius: "50px 50px 50px 50px",
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

                          <div className="text-center p-1 text-danger">
                            {" "}
                            {errors.email}
                          </div>
                        </Form.Group>
                      </Form.Row>

                      <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                          <div
                            className="d-flex align-items-center justify-content-between p-1 mt-4"
                            style={{
                              boxShadow:
                                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                              backgroundColor: "rgb(255,255,255)",
                              borderRadius: "50px 50px 50px 50px",
                            }}
                          >
                            <div className="col-2 m-0 pl-0 ">
                              <img
                                className="ml-0 py-1 px-1 "
                                style={{
                                  width: "50px",

                                  boxShadow:
                                    "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
                                  borderRadius: "50px 50px 50px 50px",
                                }}
                                src={`${process.env.PUBLIC_URL}/assets/img/password.png`}
                                alt="Card image cap"
                              />
                            </div>
                            <Form.Control
                              style={{
                                border: 0,
                                padding: "20px",
                                borderRadius: "50px 50px 50px 50px",
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
                          <div className="text-center p-1 text-danger">
                            {" "}
                            {errors.password};
                          </div>
                        </Form.Group>
                      </Form.Row>
                      {error != "" ? (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      ) : null}

                      <center>
                        <Button
                          className="mt-2 mx-auto btnPrimary login-button"
                          type="submit"
                        >
                          <span
                            id="loginButton"
                            className="pr-5 pl-5 pb-0 pt-0 mb-0 mt-0 text-strong font-weight-bold "
                          >
                            <h4
                              className="text-shadow pb-0 pt-0 mb-0 mt-0"
                              style={{ fontSize: "1.4em" }}
                            >
                              <strong> Login</strong>
                            </h4>
                          </span>
                        </Button>
                        <br />
                        <a href="/forget">
                          <h4 className="" style={{ color: "#000D61" }}>
                            Forget Password?
                          </h4>
                        </a>
                      </center>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="position-fixed" style={{ right: "0" ,zIndex: "1071"  }} >
        <div className="d-flex flex-column justify-content-start align-items-end z-index-10" >
          <div>
            <Button
              className="mt-4 mx-auto mr-0 pl-4 pr-3 pt-3 pb-3 index-right-buttons"
              style={{ zIndex: "1071" }}
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
    </div>
  );
}

export default Login;
