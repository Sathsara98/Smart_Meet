import React from "react";
import { Nav } from "react-bootstrap";
import "./AdminHeader.css";

function AdminHeader(props) {
  return (
    <div className="justify-content-center m-2 header-admin">
      <center>
        <h1 className="text-dark">ADMIN AREA</h1>
      </center>
      <Nav
        className="justify-content-center m-2"
        activeKey={props.active}
        variant="pills"
      >
        <Nav.Item>
          <Nav.Link href="/problems" disabled>
            Post Problems /
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/addmembers">Add Members /</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/viewmembers">View Members /</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}

export default AdminHeader;
