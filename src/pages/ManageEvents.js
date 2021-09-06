import React, { useRef, useEffect, useState } from "react";
import {
  BreadCrum,
  SideBar,
  Navbar,
  AdminCard,
  AddEvents,
  MemberCard,
  NavbarDashboard,
  Event,
  EventDetails,
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
import Auth from "../authentication/Auth";
import { useParams } from "react-router";

const ManageEvents = () => {
  const { isOpen } = useParams();
  const [show, setShow] = useState(isOpen==="true"?true:false);
  
  const handleClose = () => {
    setShow(false);
    loadMembers();
  };
  const handleShow = () => {
    setShow(true);
    console.log("Show True");
  };

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => {
    setShow2(true);
    console.log("Show2 True");
  };
  const [page, setPage] = useState(1);
  const [eventList, setEventList] = useState([]);
  const [event, setEvent] = useState(null);

  const loadMembers = () => {
    fetch(`http://localhost:5000/events/all/`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        setEventList(response);
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    loadMembers();
  }, [page]);
  const showDetails = (event) => {
    console.log(event);
    setEvent(event);
    setShow2(true);
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
          <Modal
            show={show2}
            size="lg"
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            scrollable={true}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header closeButton onClick={handleClose2}>
              <h2>View Event Details</h2>
            </Modal.Header>
            <Modal.Body>
              <EventDetails close={handleClose2} event={event} />
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
                    {Auth?.getUserLevel() !== "Committee Member" &&
                    Auth?.getUserLevel() !== "Committee Secretary" ? (
                      <Button
                        variant="info"
                        className="btnPrimary "
                        onClick={handleShow}
                      >
                        <i className="tim-icons fas fa-plus" /> Add New Event
                      </Button>
                    ) : null}
                  </div>
                  {eventList != null
                    ? eventList.map((ev, index) => {
                        var isIn = false;
                        ev.members.forEach((element) => {
                          if (Auth?.getUserLevel() != "Committee Member") {
                            isIn = true;
                          } else if (
                            Auth?.getUserLevel() === "Committee Member" &&
                            element._id === Auth?.getUserId()
                          ) {
                            isIn = true;
                          }
                        });
                        if (isIn) {
                          return (
                            <Event key={index} event={ev} more={showDetails} />
                          );
                        }
                      })
                    : null}
                </div>
              </div>
            </Container>
          </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
