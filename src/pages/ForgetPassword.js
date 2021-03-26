import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Navbar } from "../components";
import "./Login.css";
import * as yup from "yup";
import { Formik } from "formik";
import { Container, Form, Col, Row, Button } from "react-bootstrap";

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
    return <Redirect to="/addquestion" />;
  }
  return (
    <div>
      <Navbar varient="transparent" />
      <div class="login-cover center">
        <div className="container login-box">
          <h1 className="text-center text-secondary">
            <b>Forget Password</b>
          </h1>
          <Formik
            validationSchema={schema}
            onSubmit={login}
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
                    <Form.Label className="text-secondary">Email</Form.Label>
                    <Form.Control
                      className="form-control-lg bg-secondary"
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

                {error != "" ? (
                  <div class="alert alert-danger" role="alert">
                    {error}
                  </div>
                ) : null}

                <center>
                  <Button
                    variant="info"
                    className="align-self-center"
                    type="submit"
                  >
                    Reset
                  </Button>
                </center>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Login;
