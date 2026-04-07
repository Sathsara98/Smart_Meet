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
import "./Minute.css";
function MinuteCard(props) {
  return (
    <Card
      style={{
        marginTop: "2%",
        borderRadius: "15px",
        marginLeft: "10px",
        marginRight: "10px",
        boxShadow: "none"
      }}
    >
      <Row>
        <Card.Body
          style={{
            boxShadow: "-2px 3px 14px -4px rgba(74, 74, 74, 0.4)",
            borderRadius: "10px"
          }}

        >
          {/* <div
            className=" col-2 float-left"
            style={{
              borderRadius: "20px",
              overflow: "auto",
            }}
          >
            <img className="  " width="150px" src={`${process.env.PUBLIC_URL}/assets/img/minute.jpg`} alt="Card image cap"></img>
          </div> */}
          {/* <div className=" d-flex justify-content-between align-items-center p-3" style={{ fontWeight: "bolder" }}>
            <div style={{ textAlign: "left", marginLeft: "0" }}>
              <h4 style={{ fontWeight: "bold" }}>
                Meeting Name : <span style={{ textTransform: 'uppercase' }}>{props.minute.meeting_name}</span>
              </h4>
              <h4 style={{ fontWeight: "bold" }}>
                Meeting Date<span style={{ color: "transparent" }}>d</span> :{" "}
                {props.minute.meeting_date}
              </h4>
              <h4 style={{ fontWeight: "bold" }}>
                Meeting Venue : {props.minute.meeting_venue}
              </h4>
            </div>
            <div className="align-self-end">
              <Button
                variant="light"
                className="btnPrimary float-right"
                type="submit"
                onClick={() => props.more(props.minute)}
              >
                View
              </Button>
            </div>
          </div> */}

          {/* <Card.Text>sss</Card.Text> */}



          <div className="row">
            <div className="col-md-10 d-flex flex-column justify-content-center">
              <h4 className="meeting-name">
                {props.minute.meeting_name}
              </h4>
              <div className="d-flex meeting-detail-wrap">
                <div className="col-md-4">Date :{" "}{props.minute.meeting_date}</div>
                <div className="col-md-4">Time :{" "}{props.minute.meeting_time}</div>
                <div className="col-md-4">Venue :{" "}{props.minute.meeting_venue}</div>
              </div>


            </div>
            <div className="col-md-2 minute-view-btn">
              <Button
                variant=""
                className="btn  btn-primary float-right"
                type="submit"
                onClick={() => props.more(props.minute)}
              >
                View
              </Button>
            </div>
          </div>
        </Card.Body>
      </Row>
    </Card>
  );
}

export default MinuteCard;