// Import React hooks.
// useState stores changing data.
// useEffect runs code when the page loads.
import React, { useState, useEffect } from "react";
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
  Form,
} from "react-bootstrap";

import Auth from "../../authentication/Auth";
import EditMinuteMembers from "./EditMinuteMembers";
import EditMinute from "./EditMinute";
import MinuteCard from "./MinuteCard";
import "./Minute.css";
import Footer from "../Footer/Footer";


// Breadcrumb path.
// Currently breadcrumb is commented in JSX.
const pathToPage = ["Home", "User", "Minute"];


function Index() {
  // Controls Create Minute modal.
  const [show, setShow] = useState(false);

  // Stores logged-in user ID.
  const [userd, setUserId] = useState(Auth.getUserId());

  // Stores logged-in user role.
  // Example: Committee Member, Committee Secretary, Administrator.
  const [userRole, setUserRole] = useState(Auth.getUserLevel());

  // Stores full logged-in user details from backend.
  const [loggedUser, setLoggedUser] = useState(null);

  // Stores selected meeting when creating minute.
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Close Create Minute modal.
  const handleClose = () => setShow(false);

  //stored text for search input
  const [searchText, setSearchText] = useState("");


  // Open Create Minute modal.
  // Also stores selected meeting.
  const handleShow = (meeting) => {
    setSelectedMeeting(meeting);
    setShow(true);
  };

  // Controls View/Edit Minute modal.
  const [show2, setShow2] = useState(false);

  // Close View/Edit Minute modal.
  const handleClose2 = () => setShow2(false);

  // Open View/Edit Minute modal.
  const handleShow2 = () => {
    setShow2(true);
    console.log("Show2 True");
  };

  // Stores page number.
  // Currently not used in active code.
  const [page, setPage] = useState(1);

  // Stores all meeting minutes loaded from backend.
  const [minuteList, setMinuteList] = useState([]);

  // Stores selected minute when user clicks a minute card.
  const [minute, setMinute] = useState(null);

  //Stores selected date for filtering minutes.
  const [selectedDate, setSelectedDate] = useState("");

  // Filter meetings using search box.
  // Search works by meeting name and meeting date.
  const filteredMinutes = minuteList.filter((minute) => {
    const search = searchText.toLowerCase();

    //date picker filter
    if (selectedDate) {
      const minuteDate = new Date(minute.meeting_date);
      const pickedDate = new Date(selectedDate);

      minuteDate.setHours(0, 0, 0, 0);
      pickedDate.setHours(0, 0, 0, 0);

      if (minuteDate >= pickedDate) {
        return false;
      }
    }

    // If search box is empty, show all meetings.
    if (!search) return true;

    return (
      minute.meeting_name?.toLowerCase().includes(search) ||
      minute.meeting_date?.toLowerCase().includes(search)
    );
  });


  // This runs when the page first loads.
  // Logic:
  // 1. Load all minutes.
  // 2. Load logged-in user's full details.
  useEffect(() => {
    loadMinutes();
    loadLoggedUser();
  }, []);


  // Load logged-in user details from backend.
  // WHY: For Committee Member, we need user's name and sector
  // to filter only the minutes they participated in.
  const loadLoggedUser = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/register/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // Send logged-in user's ID to backend.
        body: JSON.stringify({
          id: Auth.getUserId(),
        }),
      });

      // Convert backend response to JSON.
      const data = await res.json();

      // Save logged-in user object.
      setLoggedUser(data[0]);
    } catch (error) {
      console.log(error);
    }
  };


  // Load all meeting minutes from backend.
  const loadMinutes = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/minutes/`)
      .then(function (response) {
        // Convert response to JSON.
        return response.json();
      })
      .then((response) => {
        // Save minute list into state.
        setMinuteList(response);

        console.log(response);
      })
      .catch((error) => console.log(error));
  };


  // Show selected minute details.
  // This function runs when user clicks "more/view" on MinuteCard.
  const showDetails = (event) => {
    console.log(event);

    // Save clicked minute.
    setMinute(event);

    // Open View/Edit modal.
    setShow2(true);
  };

  console.log(minuteList[minuteList.length - 1]);


  // This function decides what minute content should be shown
  // based on the logged-in user's role.
  const Minute = () => {

    // If logged-in user is Committee Member,
    // show only minutes where that member was present.
    if (userRole == "Committee Member") {
      const participatedMinutes = minuteList
        .filter((minute) => {
          // If logged user details are not loaded yet, do not show anything.
          if (!loggedUser) return false;

          // If user is Private sector,
          // check whether their name is in present_private list.
          if (loggedUser.sector === "Private") {
            return minute.present_private?.includes(loggedUser.name);
          }

          // If user is Public sector,
          // check whether their name is in present_public list.
          if (loggedUser.sector === "Public") {
            return minute.present_public?.includes(loggedUser.name);
          }

          // If user is Academic sector,
          // check whether their name is in present_academic list.
          if (loggedUser.sector === "Academic") {
            return minute.present_academic?.includes(loggedUser.name);
          }

          // If user is Association sector,
          // check whether their name is in present_association list.
          if (loggedUser.sector === "Association") {
            return minute.present_association?.includes(loggedUser.name);
          }

          return false;
        })

        // Sort minutes by latest meeting date first.
        .sort((a, b) => new Date(b.meeting_date) - new Date(a.meeting_date));


      return (
        <>
          <Row>
            {participatedMinutes.length > 0 ? (
              participatedMinutes.map((minute, index) => (
                <MinuteCard
                  key={index}
                  minute={minute}

                  // more opens selected minute details.
                  more={showDetails}

                  // Latest minute is marked.
                  isLatest={index == 0}
                />
              ))
            ) : (
              // If member has no participated minutes.
              <h4 className="text-center w-100">
                No participated meeting minutes available
              </h4>
            )}
          </Row>
        </>
      );
    }


    // If user is Committee Secretary or Administrator,
    // show all minutes.
    else if (
      userRole == "Committee Secretary" ||
      userRole == "Administrator"
    ) {
      return (
        <>
          <div className="d-flex justify-content-end">

            {/* Create Minute button is visible only to Committee Secretary */}
            {userRole === "Committee Secretary" && (
              <Button
                variant=""
                className="btn btn-ternitary"
                onClick={handleShow}
              >
                <i className="tim-icons fas fa-plus" /> Create Minute
              </Button>
            )}
          </div>


          <Row>
            {filteredMinutes != null
              ? filteredMinutes.map((minute, index) => {
                return (
                  <MinuteCard
                    key={index}
                    minute={minute}

                    // Opens selected minute details.
                    more={showDetails}
                  />
                );
              })
              : null}
          </Row>
        </>
      );
    }

    // If user role is not allowed, show login message.
    else {
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

      {/* Sidebar with minute menu active */}
      <SideBar minute={true} />

      <div className="main-panel">

        {/* Top navbar */}
        <NavbarDashboard
          title="Minutes"
          subtitle="Create and View Meeting Minutes"
        />

        <div className="content">

          {/* Create Minute modal */}
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
              {/* AddMinute component is used to create a new minute */}
              <AddMinute
                close={handleClose}

                // Reload minutes after creating a minute.
                load={loadMinutes}

                // Pass selected meeting if available.
                selectedMeeting={selectedMeeting}
              />
            </Modal.Body>
          </Modal>


          {/* View/Edit Minute modal */}
          <Modal
            show={show2}
            size="lg"
            onHide={handleClose2}
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
              {userRole === "Committee Member" ? (
                // Committee Member can view minute and rate activities.
                <EditMinuteMembers
                  close={handleClose2}
                  minute={minute}
                  load={loadMinutes}
                />
              ) : (
                // Secretary/Admin can view/manage/print minute.
                <EditMinute
                  close={handleClose2}
                  minute={minute}
                  load={loadMinutes}
                />
              )}
            </Modal.Body>
          </Modal>


          {/* Breadcrumb is currently commented */}
          {/* <BreadCrum path={pathToPage} /> */}

          <div className="d-flex justify-content-between align-items-center mb-3">
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

            <div className="mb-3" style={{ maxWidth: "350px" }}>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  console.log(e.target.value);
                  setPage(0);
                }}
              />
            </div>
          </div>

          {/* Minute cards wrapper */}
          <div className="minute-card-wrapper">

            {/* Render minute cards according to user role */}
            <Minute />

          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}


export default Index;