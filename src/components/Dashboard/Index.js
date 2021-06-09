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
} from "react-bootstrap";

function Index() {
  const [eventList, setEventList] = useState([]);
  const [event, setEvent] = useState(null);
  const [isLoading, setLoading] = useState(true);

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
      <SideBar dashboard={true} />
      {!isLoading ? (
        <div className="main-panel">
          <NavbarDashboard title="Dashboard" />
          <div className="content">
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
