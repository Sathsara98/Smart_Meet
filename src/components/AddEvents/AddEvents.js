import React, { useRef, useEffect, useState } from "react";
import { BreadCrum, SideBar, Navbar, AdminCard } from "../../components";
import profile from "../../assets/profile.png";
import {
  Container,
  Form,
  Col,
  Row,
  Button,
  Alert,
  Card,
} from "react-bootstrap";
import * as yup from "yup";
import { Formik } from "formik";
import "./AddEvent.css";

const AddEvents = (props) => {
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
    sector: yup
      .string()
      .required("Sector is required!")
      .notOneOf(["Select Sector"], "Selection Invalid"),
    workplace: yup.string().required("Workplace is required!"),
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
  const pathToPage = ["Home", "Users", "ManageEvents"];
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
                <Form.Label>Event Name</Form.Label>
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
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  required
                  name="name"
                  type="date"
                  placeholder=""
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
                <Form.Label>Time</Form.Label>
                <Form.Control
                  required
                  name="email"
                  type="time"
                  placeholder=""
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
                <Form.Label>Venue</Form.Label>
                <Form.Control
                  type="tel"
                  name="tel"
                  placeholder="Enter the venue"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.tel}
                  isValid={touched.tel && !errors.tel}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tel}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Venue Location</Form.Label>
                <div
                  style={{ height: "150px", border: "1px solid black" }}
                ></div>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Members</Form.Label>
                <div className="row col-12 m-auto">
                  <div className="p-1 memberCards">
                    <Card
                      style={{
                        borderTopLeftRadius: "50%",
                        borderTopRightRadius: "50%",
                        float: "left",
                        margin: "5px",
                      }}
                    >
                      <Card.Img variant="top" src={profile} />

                      <Card.Title className="text-center">Saman</Card.Title>
                    </Card>
                  </div>
                  <div className="p-1 memberCards">
                    <Card
                      style={{
                        borderTopLeftRadius: "50%",
                        borderTopRightRadius: "50%",
                        float: "left",
                        margin: "5px",
                      }}
                    >
                      <Card.Img variant="top" src={profile} />

                      <Card.Title className="text-center">Saman</Card.Title>
                    </Card>
                  </div>
                  <div className="p-1 memberCards">
                    <Card
                      style={{
                        borderTopLeftRadius: "50%",
                        borderTopRightRadius: "50%",
                        float: "left",
                        margin: "5px",
                      }}
                    >
                      <Card.Img variant="top" src={profile} />

                      <Card.Title className="text-center">Saman</Card.Title>
                    </Card>
                  </div>
                  <div className="p-1 memberCards">
                    <Card
                      style={{
                        borderTopLeftRadius: "50%",
                        borderTopRightRadius: "50%",
                        float: "left",
                        margin: "5px",
                      }}
                    >
                      <Card.Img variant="top" src={profile} />

                      <Card.Title className="text-center">Saman</Card.Title>
                    </Card>
                  </div>
                  <div className="p-1 memberCards">
                    <Card
                      style={{
                        borderTopLeftRadius: "50%",
                        borderTopRightRadius: "50%",
                        float: "left",
                        margin: "5px",
                      }}
                    >
                      <Card.Img variant="top" src={profile} />

                      <Card.Title className="text-center">Saman</Card.Title>
                    </Card>
                  </div>
                  <div className="p-1 memberCards">
                    <Card
                      style={{
                        borderTopLeftRadius: "50%",
                        borderTopRightRadius: "50%",
                        float: "left",
                        margin: "5px",
                      }}
                    >
                      <Card.Img variant="top" src={profile} />

                      <Card.Title className="text-center">Saman</Card.Title>
                    </Card>
                  </div>
                  <div className="p-1 memberCards">
                    <Card
                      style={{
                        borderTopLeftRadius: "50%",
                        borderTopRightRadius: "50%",
                        float: "left",
                        margin: "5px",
                      }}
                    >
                      <Card.Img variant="top" src={profile} />

                      <Card.Title className="text-center">Saman</Card.Title>
                    </Card>
                  </div>
                  <div className="p-1 memberCards">
                    <Card
                      style={{
                        borderTopLeftRadius: "50%",
                        borderTopRightRadius: "50%",
                        float: "left",
                        margin: "5px",
                      }}
                    >
                      <Card.Img variant="top" src={profile} />

                      <Card.Title className="text-center">Saman</Card.Title>
                    </Card>
                  </div>
                  <div className="p-1 memberCards">
                    <Card
                      style={{
                        borderTopLeftRadius: "50%",
                        borderTopRightRadius: "50%",
                        float: "left",
                        margin: "5px",
                      }}
                    >
                      <Card.Img variant="top" src={profile} />

                      <Card.Title className="text-center">Saman</Card.Title>
                    </Card>
                  </div>
                  <div className="p-1 memberCards">
                    <Card
                      style={{
                        borderTopLeftRadius: "50%",
                        borderTopRightRadius: "50%",
                        float: "left",
                        margin: "5px",
                      }}
                    >
                      <Card.Img variant="top" src={profile} />

                      <Card.Title className="text-center">Saman</Card.Title>
                    </Card>
                  </div>
                  <div className="p-1 memberCards">
                    <Card
                      style={{
                        borderTopLeftRadius: "50%",
                        borderTopRightRadius: "50%",
                        float: "left",
                        margin: "5px",
                      }}
                    >
                      <Card.Img variant="top" src={profile} />

                      <Card.Title className="text-center">Saman</Card.Title>
                    </Card>
                  </div>
                  <div className="p-1 memberCards">
                    <Card
                      style={{
                        borderTopLeftRadius: "50%",
                        borderTopRightRadius: "50%",
                        float: "left",
                        margin: "5px",
                      }}
                    >
                      <Card.Img variant="top" src={profile} />

                      <Card.Title className="text-center">Saman</Card.Title>
                    </Card>
                  </div>
                  <div className="p-1 memberCards">
                    <Card
                      style={{
                        borderTopLeftRadius: "50%",
                        borderTopRightRadius: "50%",
                        float: "left",
                        margin: "5px",
                      }}
                    >
                      <Card.Img variant="top" src={profile} />

                      <Card.Title className="text-center">Saman</Card.Title>
                    </Card>
                  </div>
                </div>
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

export default AddEvents;
