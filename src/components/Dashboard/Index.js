import React, { useEffect, useState } from "react";
import Calender from "./DashCalender";

import {
  BreadCrum,
  SideBar,
  Navbar,
  AdminCard,
  NavbarDashboard,
} from "../../components";
import {
  Container,
  Form,
  Col,
  Row,
  Button,
  Alert,
  Spinner,
  Toast,
} from "react-bootstrap";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Auth from "../../authentication/Auth";
import Footer from "../Footer/Footer";

function Index() {
  const [eventList, setEventList] = useState([]);
  const [event, setEvent] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const createNotification = (type) => {
    return () => {
      switch (type) {
        case "info":
          NotificationManager.info("Info message");
          break;
        case "success":
          NotificationManager.success("Success message", "Title here");
          break;
        case "warning":
          NotificationManager.warning(
            "Warning message",
            "Close after 3000ms",
            3000
          );
          break;
        case "error":
          NotificationManager.error("Error message", "Click me!", 5000, () => {
            alert("callback");
          });
          break;
      }
    };
  };
  const pathToPage = ["Home", "Admin", "Dashboard"];
  useEffect(() => {
    loadEvents();
  }, []);
  const loadEvents = async () => {
    setLoading(true);
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/events/all/`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
      }),
    })
      .then((res) => res.json())
      .then((response) => {

        //Filter event tht involves the logged user
        if (Auth.getUserLevel() === "Committee Member") {
          var eventArr = [];
          response.map(function (el) {
            var isUser = false;
            el.members.forEach((element) => {
              console.log(Auth?.getUserId() == element._id);
              if (Auth?.getUserId() == element._id) {
                isUser = true;
              }
            });
            if (isUser) {
              eventArr.push(el);
            }
          });
          setEventList(eventArr);
        } else {
          setEventList(response);
        }
      })
      .catch((error) => console.log(error));
    setLoading(false);
  };
  return (
    <div className="wrapper">
      {NotificationManager.info("Info message")}
      <SideBar dashboard={true} />
      {!isLoading ? (
        <div className="main-panel">
          <NavbarDashboard title="Hello, John!" subtitle="Welcome back to Meeting Management System" />

          <div className="content">
            {/* <div
              class="alert alert-info alert-dismissible fade show"
              role="alert"
            >
              <strong>Holy guacamole!</strong> You should check in on some of
              those fields below.
              <button
                type="button"
                class="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <i class="fa fa-times-circle mt-2"></i>
              </button>
            </div> */}
            {/* <BreadCrum path={pathToPage} /> */}

            <AdminCard>
              <Calender events={eventList != null ? eventList : null} />
            </AdminCard>
            <Footer />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Index;
