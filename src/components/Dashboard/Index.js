import React, { useEffect, useState } from "react";
import Calender from "./DashCalender";

import { BreadCrum, SideBar, Navbar, AdminCard } from "../../components";
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
  const pathToPage = ["Home", "Admin", "Dashboard"];
  return (
    <div className="wrapper">
      <SideBar dashboard={true} />
      <div className="main-panel">
        <Navbar />
        <div className="content">
          <BreadCrum path={pathToPage} />

          <AdminCard>
            <Calender />
          </AdminCard>
        </div>
      </div>
    </div>
  );
}

export default Index;
