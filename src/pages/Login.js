import React from "react";
import { Navbar } from "../components";
import "./Login.css";
import * as yup from "yup";
import { Formik } from "formik";
import { Container, Form, Col, Row, Button } from "react-bootstrap";

function Login() {
  const schema = yup.object({
    email: yup
      .string()
      .email("Invalid Email : Ex example@example.com")
      .required("Email is required!"),
    password: yup.string().required("Password is required!"),
  });
  return (
    <div>
      <Navbar varient="transparent" />
      <div class="login-cover center">
        <div className="container login-box">
          <h1 className="text-center text-secondary">
            <b>Login</b>
          </h1>
          <Formik
            validationSchema={schema}
            //   onSubmit={registerMember}
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

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label className="text-secondary">Password</Form.Label>
                    <Form.Control
                      className="form-control-lg bg-secondary"
                      required
                      name="password"
                      type="text"
                      placeholder="Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      isValid={touched.password && !errors.password}
                      isInvalid={!!errors.password}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.password};
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
                <center>
                  <Button
                    variant="info"
                    className="align-self-center"
                    type="submit"
                  >
                    Login
                  </Button>
                  <br />
                  <a href="/forget">
                    <h4 className="text-info">Forget Password?</h4>
                  </a>
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
