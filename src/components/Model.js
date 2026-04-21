import React from "react";
import {
  Container,
  Card,
  Col,
  Row,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
export default function Model(props) {
  return (
    <div>
      <Modal
        show={props.show}
        size="lg"
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
        scrollable={true}
      >
        <Modal.Header closeButton>
          <h2></h2>
        </Modal.Header>
        <Modal.Body>
          <h4 className="text-center mx-auto">
            <b>{props.body}</b>
          </h4>
        </Modal.Body>
        <div
          className="form-row w-100 "
          id="footer-modal-addMember "

        >
          <div className="modal-footer d-flex justify-content-center w-100">
            <Button
              className="btn  btn-primary "
              variant=""
              onClick={() => props.handleClick(true)}
            >
              Ok
            </Button>
            {props.confirmation ? (
              <Button
                className="btn-secondary ml-2 pr-4 pl-4"
                variant=""
                onClick={() => props.handleClick(false)}
              >
                Close
              </Button>
            ) : null}
          </div>
        </div>
      </Modal>
    </div>
  );
}