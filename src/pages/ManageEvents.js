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
  Form,
} from "react-bootstrap";

import * as yup from "yup";
import { Formik } from "formik";
import backImg from "../assets/home_page/metal.jpg";

import Auth from "../authentication/Auth";

import { useParams } from "react-router";

import Footer from "../components/Footer/Footer";
import { get } from "react-hook-form";


// ManageEvents component.
// Purpose:
// 1. Display all scheduled meetings.
// 2. Open Add Meeting modal when URL says true.
// 3. Open Meeting Details modal when user clicks a meeting.
// 4. Show only assigned meetings for Committee Members.
const ManageEvents = () => {

  // Read isOpen value from URL parameters.
  // Example: /events/true means Add Meeting modal should open.
  const { isOpen } = useParams();

  // Read navigation state passed from another page.
  // Example: questions and maxArea passed after submitting challenges.
  const location = useLocation();

  // Controls Add Meeting modal.
  // If isOpen is "true", modal opens automatically.
  const [show, setShow] = useState(isOpen === "true" ? true : false);


  // Close Add Meeting modal and details modal.
  const handleClose = () => {
    // Close Add Meeting modal.
    setShow(false);

    // Close EventDetails modal too.
    setShow2(false);

    // Clear selected event details.
    setEvent(null);

    // Store questions from submitted challenge data.
    // WHY: If a meeting does not already contain questions,
    // we can attach submitted questions before showing details.
    if (location.state?.questions) {
      setSubmissionQuestions(location.state.questions);
      console.log("Stored submission questions:", location.state.questions);
    }

    // Reload meeting list after closing.
    loadMembers();
  };


  // Open Add Meeting modal.
  const handleShow = () => {
    setShow(true);
    console.log("Show True");
  };


  // State for filtering by status.
  const [selectedStatus, setSelectedStatus] = useState("all");




  // Controls View Meeting Details modal.
  const [show2, setShow2] = useState(false);

  // Close View Meeting Details modal.
  const handleClose2 = () => setShow2(false);

  // Open View Meeting Details modal.
  const handleShow2 = () => {
    setShow2(true);
    console.log("Show2 True");
  };

  // Page state.
  // Currently used as dependency to reload meetings.
  const [page, setPage] = useState(1);

  // Stores all meetings/events loaded from backend.
  const [eventList, setEventList] = useState([]);

  // Stores selected meeting/event for details modal.
  const [event, setEvent] = useState(null);

  // Stores questions passed from challenge submission.
  const [submissionQuestions, setSubmissionQuestions] = useState(null);


  // This runs when component first loads.
  // Logic:
  // If URL parameter is true, open Add Meeting modal.
  useEffect(() => {
    if (isOpen === "true") {
      setShow(true);
    } else {
      setShow(false);
    }
  }, []);


  // This runs when page state changes.
  // Logic:
  // Load/reload meetings from backend.
  useEffect(() => {
    loadMembers();
  }, [page]);


  // Load all meetings/events from backend.
  const loadMembers = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/events/all/`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        // Save meeting list into state.
        setEventList(response);

        console.log(response);
      })
      .catch((error) => console.log(error));
  };


  // Get meeting status based on meeting date and time.
  // Upcoming  = meeting date is after today
  // Ongoing   = meeting date is today
  // Completed = meeting date is before today
  const getMeetingStatus = (date) => {
    // Convert meeting date into JavaScript Date object.
    const meetingDate = new Date(date);


    // Get today's date.
    const today = new Date();


    // Remove time from both dates.
    // WHY: We only compare the date, not current hour/minute.
    meetingDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);


    // If meeting date is after today, meeting is upcoming.
    if (meetingDate > today) {
      return "Upcoming";
    }


    // If meeting date is before today, meeting is completed.
    if (meetingDate < today) {
      return "Completed";
    }


    // If meeting date is today, meeting is ongoing.
    return "Ongoing";
  };


  // Show selected meeting details.
  const showDetails = (event) => {
    console.log("Showing event details for:", event);

    // If questions were passed from submission and selected event has no questions,
    // add those questions to the event before showing details.
    if (submissionQuestions && !event.questions) {
      event.questions = submissionQuestions;
      console.log("Added submission questions to event:", event);
    }

    // Save selected event.
    setEvent(event);

    // Open details modal.
    setShow2(true);
  };

  //stored text for search input
  const [searchText, setSearchText] = useState("");

  // Breadcrumb path.
  // Currently breadcrumb is commented in JSX.
  const pathToPage = ["Home", "Users", "ManageEvents"];

  // Filter meetings using search box.
  // Search works by meeting name and meeting date.
  const filteredEvents = eventList.filter((ev) => {
    const search = searchText.toLowerCase();
    const status = getMeetingStatus(ev.date);

    // Filter by status first.
    if (selectedStatus !== "all" && status !== selectedStatus) {
      return false;
    }

    // If search box is empty, show all meetings.
    if (!search) return true;

    return (
      ev.name?.toLowerCase().includes(search) ||
      ev.date?.toLowerCase().includes(search)
    );
  });




  return (
    <div className="wrapper">

      {/* Sidebar with Events menu active */}
      <SideBar events={true} />

      <div className="main-panel">

        {/* Top navbar */}
        <NavbarDashboard
          title="Meetings"
          subtitle="View All Scheduled Meetings"
        />

        <div className="content">

          {/* Add Meeting modal */}
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
              {/* 
               AddEvents component creates a new meeting.
               submissionState is passed so AddEvents can prefill data
               from submitted challenges, such as questions and maxArea.
             */}
              <AddEvents
                close={handleClose}
                submissionState={location.state}
              />
            </Modal.Body>
          </Modal>


          {/* View Meeting Details modal */}
          <Modal
            show={show2}
            size="lg"
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            scrollable={true}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              onClick={handleClose2}
              style={{ justifyContent: "center" }}
            >
              <h2>View Meeting Details</h2>
            </Modal.Header>

            <Modal.Body>
              {/* EventDetails displays full meeting details */}
              <EventDetails
                close={handleClose2}
                event={event}
              />
            </Modal.Body>
          </Modal>


          {/* Breadcrumb is currently commented */}
          {/* <BreadCrum path={pathToPage} /> */}


          {/* Add New Event button is currently commented.
             Logic in comment:
             Only users except Committee Member and Committee Secretary
             could see Add New Event button.
         */}
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

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* Search box section */}
            <div className="mb-3" style={{ maxWidth: "350px" }}>

              <Form.Control
                type="text"
                placeholder="Search by name or date"
                value={searchText}
                onChange={(e) => {
                  // Save typed search text.
                  setSearchText(e.target.value);


                  // Reset table to first page after searching.
                  setPage(0);
                }}
              />
            </div>

            <div className="mb-3" style={{ maxWidth: "250px" }}>
              <Form.Control
                as="select"
                value={selectedStatus}
                onChange={(e) => {
                  console.log("Selected status:", e.target.value);
                  setSelectedStatus(e.target.value);
                  setPage(0);
                }}
              >
                <option value="all">All</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </div>
          </div>


          {/* Meetings list */}
          <Row>
            {eventList != null
              ? filteredEvents.map((ev, index) => {
                // isIn decides whether the current logged-in user can see this meeting.
                var isIn = false;

                // Check each member assigned to the meeting.
                ev.members.forEach((element) => {

                  // If user is not Committee Member,
                  // allow viewing all meetings.
                  if (Auth?.getUserLevel() != "Committee Member") {
                    isIn = true;

                    // If user is Committee Member,
                    // show only meetings where their user ID exists in members list.
                  } else if (
                    Auth?.getUserLevel() === "Committee Member" &&
                    element._id === Auth?.getUserId()
                  ) {
                    isIn = true;
                  }
                });

                // If user is allowed to see this meeting, show Event card.
                if (isIn) {
                  return (
                    <Event
                      key={index}
                      event={ev}
                      more={showDetails}
                    />
                  );
                }
              })
              : null}
          </Row>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};


export default ManageEvents;

