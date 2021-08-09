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
    await fetch(`http://localhost:5000/events/all/`, {
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
    setLoading(false);
  };
  return (
    <div className="wrapper">
      {NotificationManager.info("Info message")}
      <SideBar dashboard={true} />
      {!isLoading ? (
        <div className="main-panel">
          <NavbarDashboard title="Dashboard" />

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
            <BreadCrum path={pathToPage} />

            <AdminCard>
              <Calender events={eventList != null ? eventList : null} />
            </AdminCard>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Index;
