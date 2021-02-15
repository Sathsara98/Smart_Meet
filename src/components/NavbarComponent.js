import React from "react";
import { Navbar, Nav, NavDropdown, Button, Image } from "react-bootstrap";
import govLogo from "../assets/gov-logo.png";

function NavbarComponent() {
  return (
    <Navbar expand="lg" bg="light">
      <Image src={govLogo} rounded style={{ height: 50 }} className="mr-2" />
      <Navbar.Brand href="#home"> Trade Ministry</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#link">Link</Nav.Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Button>Login</Button>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarComponent;
