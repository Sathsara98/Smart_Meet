import React, { useRef, useEffect, useState } from "react";
import {
  BreadCrum,
  SideBar,
  Navbar,
  AdminCard,
  AddMembers,
  MemberCard,
  MemberRatio,
  NavbarDashboard,
} from "../components";

import {
  Container,
  Form,
  Col,
  Row,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";

import Auth from "../authentication/Auth";

import * as yup from "yup";
import { Formik } from "formik";

import Footer from "../components/Footer/Footer";


// ManageMembers component.
// Purpose:
// 1. Display committee member management page.
// 2. Show member sector cards.
// 3. Show member ratio chart.
// 4. Allow admin to open Add New User modal.
const ManageMembers = () => {

  // Controls Register New Member modal visibility.
  // false = modal is closed.
  // true = modal is open.
  const [show, setShow] = useState(false);

  // Close Register New Member modal.
  const handleClose = () => setShow(false);

  // Open Register New Member modal.
  const handleShow = () => {
    setShow(true);
    console.log("Show True");
  };


  // This function is prepared to register a member directly.
  // But in this file, AddMembers component handles registration inside the modal.
  // So this function is currently not used in active UI.
  const registerMember = async (event) => {
    // event.preventDefault();

    // Print form data in console for checking.
    console.log(event);

    try {
      // Prepare POST request to backend.
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // Convert JavaScript object into JSON before sending.
        body: JSON.stringify({
          // User role/type.
          utype: event.role,

          // NOTE: This currently sets name as event.role.
          // Kept as your original code.
          name: event.role,

          // Convert email to lowercase before saving.
          email: event.email.toLowerCase(),

          // Telephone number.
          tel: event.tel,

          // User sector.
          sector: event.sector,

          // User workplace.
          workplace: event.workplace,
        }),
      };

      // Send register request to backend.
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/register`,
        requestOptions
      );

      // Convert backend response to JSON.
      const data = await res.json();

      console.log(data);

      // If backend returns error, open modal/alert state.
      // Current logic opens the same modal in both cases.
      if (data.hasOwnProperty("error")) {
        setShow(true);
      } else {
        setShow(true);
      }
    } catch (e) {
      // Show error in browser console.
      console.log(e);
    }
  };

  // Breadcrumb path.
  // Currently breadcrumb is commented in JSX.
  const pathToPage = ["Home", "Users", "ManageMembers"];

  return (
    <div className="wrapper">

      {/* Sidebar with members section active */}
      <SideBar members={true} addmembers={true} />

      <div className="main-panel">

        {/* Page title and subtitle */}
        <NavbarDashboard
          title="Committee Management"
          subtitle="View, organize, and manage your committees efficiently"
        />

        <div className="content">

          {/* Register New Member modal */}
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
              <h2>Register New Member</h2>
            </Modal.Header>

            <Modal.Body>
              {/* AddMembers component contains the full member registration form */}
              <AddMembers close={handleClose} />
            </Modal.Body>

            {/*
             Old modal footer is commented.
             WHY: AddMembers component already has its own buttons.
           */}
            {/* <Modal.Footer>
             <Button variant="secondary" onClick={handleClose}>
               Close
             </Button>
             <Button variant="primary" onClick={handleClose}>
               Save Changes
             </Button>
           </Modal.Footer> */}
          </Modal>

          {/* Breadcrumb is currently commented */}
          {/* <BreadCrum path={pathToPage} /> */}

          {/* Main card for members page */}
          <AdminCard title="Members">

            {/* Add New User button row */}
            <div className="row mb-2">
              <div className="col-md">
                <div className="d-flex justify-content-end">

                  {/*
                   Show Add New User button only for higher-level users.
                   Committee Member and Committee Secretary cannot add users.
                 */}
                  {Auth?.getUserLevel() !== "Committee Member" &&
                    Auth?.getUserLevel() !== "Committee Secretary" ? (
                    <Button
                      className="btn-primary "
                      onClick={handleShow}
                    >
                      <i className="tim-icons fas fa-plus" /> Add New User
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>


            {/* Sector cards section */}
            <Row className="d-flex justify-space-end mt-4 sector-cards">

              {/* Public sector member card */}
              <Col sm>
                <MemberCard type="public" text="Public Sector" />
              </Col>

              {/* Private sector member card */}
              <Col sm>
                <MemberCard type="private" text="Private Sector" />
              </Col>

              {/* Academic member card */}
              <Col sm>
                <MemberCard type="academic" text="Academic" />
              </Col>

              {/* Association member card */}
              <Col sm>
                <MemberCard type="association" text="Association" />
              </Col>
            </Row>

            <br />

            {/* Member ratio chart/summary */}
            <center className="mt-4">
              <MemberRatio />
            </center>
          </AdminCard>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ManageMembers;

