import React, { useRef, useEffect, useState } from "react";
import {
  BreadCrum,
  SideBar,
  Navbar,
  AdminCard,
  AddEvents,
  MemberCard,
  NavbarDashboard,
} from "../components";
import {
  Container,
  Card,
  Col,
  Row,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
import * as yup from "yup";
import { Formik } from "formik";
import backImg from "../assets/home_page/metal.jpg";

const ManageEvents = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    console.log("Show True");
  };

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
        setShow(true);
      } else {
        setShow(true);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const pathToPage = ["Home", "Users", "ManageEvents"];
  return (
    <div className="wrapper">
      <SideBar events={true} />
      <div className="main-panel">
        <div className="content">
          <NavbarDashboard title="Members" />
          <Modal
            show={show}
            size="lg"
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            scrollable={true}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header closeButton>
              <h2>Add Events</h2>
            </Modal.Header>
            <Modal.Body>
              <AddEvents close={handleClose} />
            </Modal.Body>
            {/* <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer> */}
          </Modal>
          <BreadCrum path={pathToPage} />
          <AdminCard title="Members">
            <Container>
              <div className="row mb-2">
                <div className="col-md">
                  <div className="d-flex justify-content-end">
                    <Button variant="custom" onClick={handleShow}>
                      <i className="tim-icons fas fa-plus" /> Add New Event
                    </Button>
                  </div>
                </div>
              </div>
              <Card
                style={{
                  marginTop: "2%",
                  backgroundColor: "#eefbfd",
                  borderRadius: "15px",
                }}
              >
                <Row>
                  <Card.Body>
                    <div
                      className=" col-3 float-left"
                      style={{
                        borderRadius: "20px",
                        overflow: "auto",
                      }}
                    >
                      <img
                        className="  "
                        src={backImg}
                        alt="Card image cap"
                      ></img>
                    </div>
                    <div
                      className="col-9 float-right"
                      style={{ fontWeight: "bolder" }}
                    >
                      <div style={{ textAlign: "left", marginLeft: "7%" }}>
                        <h4 style={{ fontWeight: "bold" }}>Name : Meeting 1</h4>
                        <h4 style={{ fontWeight: "bold" }}>
                          Date<span style={{ color: "transparent" }}>d</span> :
                          2021/01/01 - 1:30 PM
                        </h4>
                        <h4 style={{ fontWeight: "bold" }}>Venue : Homagama</h4>
                      </div>
                      <Button
                        variant="info"
                        className="btnPrimary float-right"
                        type="submit"
                        // onClick={onSubmit}
                      >
                        More
                      </Button>
                    </div>

                    {/* <Card.Text>sss</Card.Text> */}
                  </Card.Body>
                </Row>
              </Card>
            </Container>
          </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
