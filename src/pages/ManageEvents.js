import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router";
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
import Footer from "../components/Footer/Footer";


const ManageEvents = () => {
  const { isOpen } = useParams();
  const location = useLocation();
  const [show, setShow] = useState(isOpen === "true" ? true : false);


  const handleClose = () => {
    setShow(false);
    setShow2(false); // close EventDetails modal too
    setEvent(null); // clear event data
    // Store questions from submission for later use
    if (location.state?.questions) {
      setSubmissionQuestions(location.state.questions);
      console.log("Stored submission questions:", location.state.questions);
    }
    loadMembers(); // reload event list
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
  const [submissionQuestions, setSubmissionQuestions] = useState(null); // Store questions from submission


  useEffect(() => {
    if (isOpen === "true") {
      setShow(true);
    } else {
      setShow(false);
    }
  }, []);
  useEffect(() => {
    loadMembers();
  }, [page]);


  const loadMembers = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/events/all/`, {
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


  const showDetails = (event) => {
    console.log("Showing event details for:", event);
    // If we have stored submission questions and the event doesn't have questions, add them
    if (submissionQuestions && !event.questions) {
      event.questions = submissionQuestions;
      console.log("Added submission questions to event:", event);
    }
    setEvent(event);
    setShow2(true);
  };
  const pathToPage = ["Home", "Users", "ManageEvents"];
  return (
    <div className="wrapper">
      <SideBar events={true} />
      <div className="main-panel">
        <NavbarDashboard title="Meetings" subtitle="View All Scheduled Meetings" />
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
            <Modal.Header closeButton style={{ justifyContent: "center" }}>
              <h2>Add Meeting Details</h2>
            </Modal.Header>
            <Modal.Body>
              {/* pass submission state (if any) to AddEvents so it can prefill */}
              <AddEvents close={handleClose} submissionState={location.state} />
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
            <Modal.Header closeButton onClick={handleClose2} style={{ justifyContent: "center" }}>
              <h2>View Meeting Details</h2>
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
          {/* <BreadCrum path={pathToPage} /> */}
          {/* <div className="d-flex justify-content-end">
            {Auth?.getUserLevel() !== "Committee Member" &&
              Auth?.getUserLevel() !== "Committee Secretary" ? (
              <Button
                variant=""
                className="btn btn-ternitary  btn"
                onClick={handleShow}
              >
                <i className="tim-icons fas fa-plus" /> Add New Event
              </Button>
            ) : null}
          </div> */}


          <Row>
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
          </Row>
          <Footer />



        </div>
      </div>
    </div>
  );
};


export default ManageEvents;





