import React, { Component } from "react";
import { AdminHeader } from "../components";
import { Container, Form, Col, Row, Button } from "react-bootstrap";

class ManageMembers extends Component {
  render() {
    return (
      <Container>
        <AdminHeader active="/addmembers"/>
        <h3 className="font-weight-normal text-dark mb-4">Register New Members</h3>
        <Container>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Name" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Telephone Number</Form.Label>
                <Form.Control type="tel" placeholder="Telephone Number" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Sector</Form.Label>
                <Form.Control type="text" placeholder="Sector" />
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="formGridAddress1">
              <Form.Label>Workplace</Form.Label>
              <Form.Control placeholder="Workplace" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Container>
      </Container>
    );
  }


}

export default ManageMembers;
