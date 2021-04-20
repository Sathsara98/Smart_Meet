import React, { useRef, useEffect, useState } from "react";
import {
  BreadCrum,
  SideBar,
  Navbar,
  AdminCard,
  AddMembers,
  MemberCard,
  MemberRatio,
  NavbarDashboard,
} from "../components";
import {
  Container,
  Form,
  Col,
  Row,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
import * as yup from "yup";
import { Formik } from "formik";

const ManageMembers = () => {
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
  const pathToPage = ["Home", "Users", "ManageMembers"];
  return (
    <div className="wrapper">
      <SideBar members={true} addmembers={true} />
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
              <Modal.Title>Register New Member</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddMembers close={handleClose} />
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
                      <i className="tim-icons fas fa-plus" /> Add New User
                    </Button>
                  </div>
                </div>
              </div>

              <Row className="d-flex justify-space-end">
                <Col sm>
                  <MemberCard type="public" text="Public Sector" />
                </Col>
                <Col sm>
                  <MemberCard type="private" text="Private Sector" />
                </Col>
                <Col sm>
                  <MemberCard type="academic" text="Academic" />
                </Col>
                <Col sm>
                  <MemberCard type="association" text="Association" />
                </Col>
              </Row>
            </Container>
            <br />
            <center className="mt-4">
              <MemberRatio />
            </center>
          </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default ManageMembers;
