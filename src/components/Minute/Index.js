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
} from "react-bootstrap";
import Auth from "../../authentication/Auth";
import EditMinuteMembers from "./EditMinuteMembers";
import EditMinute from "./EditMinute";
import MinuteCard from "./MinuteCard";
import "./Minute.css";
import Footer from "../Footer/Footer";

const pathToPage = ["Home", "User", "Minute"];

function Index() {
  const [show, setShow] = useState(false);
  const [userd, setUserId] = useState(Auth.getUserId());
  const [userRole, setUserRole] = useState(Auth.getUserLevel());

  const [loggedUser, setLoggedUser] = useState(null);

  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const handleClose = () => setShow(false);

  const handleShow = (meeting) => {
    setSelectedMeeting(meeting);
    setShow(true);
  };
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => {
    setShow2(true);
    console.log("Show2 True");
  };
  const [page, setPage] = useState(1);
  const [minuteList, setMinuteList] = useState([]);
  const [minute, setMinute] = useState(null);

  useEffect(() => {
    loadMinutes();
    loadLoggedUser();
  }, []);

  const loadLoggedUser = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/register/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Auth.getUserId(),
        }),
      });


      const data = await res.json();
      setLoggedUser(data[0]);
    } catch (error) {
      console.log(error);
    }
  };



  const loadMinutes = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/minutes/`)
      .then(function (response) {
        return response.json();
      })
      .then((response) => {
        setMinuteList(response);
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  const showDetails = (event) => {
    console.log(event);
    setMinute(event);
    setShow2(true);
  };
  console.log(minuteList[minuteList.length - 1]);
  const Minute = () => {
    if (userRole == "Committee Member") {
      const participatedMinutes = minuteList
        .filter((minute) => {
          if (!loggedUser) return false;


          if (loggedUser.sector === "Private") {
            return minute.present_private?.includes(loggedUser.name);
          }


          if (loggedUser.sector === "Public") {
            return minute.present_public?.includes(loggedUser.name);
          }


          if (loggedUser.sector === "Academic") {
            return minute.present_academic?.includes(loggedUser.name);
          }


          if (loggedUser.sector === "Association") {
            return minute.present_association?.includes(loggedUser.name);
          }


          return false;
        })
        .sort((a, b) => new Date(b.meeting_date) - new Date(a.meeting_date));


      return (
        <>
          <Row>
            {participatedMinutes.length > 0 ? (
              participatedMinutes.map((minute, index) => (
                <MinuteCard
                  key={index}
                  minute={minute}
                  more={showDetails}
                  isLatest={index == 0}
                />
              ))
            ) : (
              <h4 className="text-center w-100">
                No participated meeting minutes available
              </h4>
            )}
          </Row>
        </>
      );
    }




    else if (
      userRole == "Committee Secretary" ||
      userRole == "Administrator"
    ) {
      return (
        <>
          <div className="row mb-2">
            <div className="col-md">
              <div className="d-flex justify-content-end">

                {/* {Auth?.getUserLevel() !== "Committee Member" && Auth?.getUserLevel() !== "Administrator" ? (
                  <Button variant="info"
                    className="btnPrimary " onClick={handleShow}>
                    <i className="tim-icons fas fa-plus" /> Add New Minute
                  </Button>
                ) : null} */}
                <Button variant=""
                  className="btn btn-ternitary " onClick={handleShow}>
                  <i className="tim-icons fas fa-plus" /> Create Minute
                </Button>

              </div>
            </div>
          </div>
          <Row>
            {minuteList != null
              ? minuteList.map((minute, index) => {
                return (
                  <MinuteCard
                    key={index}
                    minute={minute}
                    more={showDetails}
                  />
                );
              })
              : null}
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
        <NavbarDashboard title="Minutes" subtitle="Create and View Meeting Minutes" />
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
              <AddMinute
                close={handleClose}
                load={loadMinutes}
                selectedMeeting={selectedMeeting}
              />
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
                <EditMinuteMembers
                  close={handleClose2}
                  minute={minute}
                  load={loadMinutes}
                />
              ) : (
                <EditMinute
                  close={handleClose2}
                  minute={minute}
                  load={loadMinutes}
                />
              )}
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
          {/* <AdminCard className="minute-card-wrapper">

            <Minute />

          </AdminCard> */}

          <div className="minute-card-wrapper">

            <Minute />

          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Index;