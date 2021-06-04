import React, { useState } from "react";
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


const pathToPage = ["Home", "User", "Minute"];

function Index() {
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleShow = () => {
    setShow(true);
    console.log("Show True");
  };
  

  return (
    <div className="wrapper">
      <SideBar minute={true} />
      <div className="main-panel">
        <NavbarDashboard title="Minutes" />
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
              <h2 className="text-center mx-auto"><b>Meeting Minute</b></h2>
            </Modal.Header>
            <Modal.Body>
              <AddMinute close={handleClose} />
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
          <AdminCard>
            <Container>
            <div className="row mb-2">
                <div className="col-md">
                  <div className="d-flex justify-content-end">
                    <Button variant="custom" onClick={handleShow}>
                      <i className="tim-icons fas fa-plus" /> Add New Minute
                    </Button>
                  </div>
                </div>
              </div>
              <Row>
                <h4>Public</h4>
              </Row>

              
            </Container>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}

export default Index;
