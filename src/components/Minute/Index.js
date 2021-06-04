import React, { useState } from "react";
import {
  BreadCrum,
  SideBar,
  Navbar,
  AdminCard,
  NavbarDashboard,
  AddMinute,
} from "../../components";
import {
  Container,
  Card,
  Col,
  Row,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
import Auth from "../../authentication/Auth";
import EditMinute from "./EditMinute";

const pathToPage = ["Home", "User", "Minute"];

function Index() {
  const [show, setShow] = useState(false);
  const [userd, setUserId] = useState(Auth.getUserId());
  const [userRole, setUserRole] = useState(Auth.getUserLevel());

  const handleClose = () => setShow(false);

  const handleShow = () => {
    setShow(true);
    console.log("Show True");
  };

  const Minute = () => {
    if (userRole == "Committee Member") {
      return <EditMinute />;
    } else if (
      userRole == "Committee Secretary" ||
      userRole == "Administrator"
    ) {
      return (
        <>
          <div className="row mb-2">
            <div className="col-md">
              <div className="d-flex justify-content-end">
                <Button variant="custom" onClick={handleShow}>
                  <i className="tim-icons fas fa-plus" /> Add New Minute
                </Button>
              </div>
            </div>
          </div>
          <Row>
            <h4>Public</h4>
          </Row>
        </>
      );
    } else {
      return (
        <div className="float-right  w-100 ">
          <h4 className="text-center" style={{ fontSize: "1.3em" }}>
            <strong>Please Login With Appropriate User !</strong>
          </h4>
          <div className="row">
            <Button
              className=" mx-auto btnPrimary "
              variant="info"
              href="login"
            >
              <span
                id="loginButton"
                className=" pr-1 pl-1 text-strong font-weight-bold"
                style={{ fontSize: "1.1em" }}
              >
                <strong> Login</strong>
              </span>
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="wrapper">
      <SideBar minute={true} />
      <div className="main-panel">
        <NavbarDashboard title="Minutes" />
        <div className="content">
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
              <h2 className="text-center mx-auto">
                <b>Meeting Minute</b>
              </h2>
            </Modal.Header>
            <Modal.Body>
              <AddMinute close={handleClose} />
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
          <AdminCard>
            <Container>
              <Minute />
            </Container>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}

export default Index;
