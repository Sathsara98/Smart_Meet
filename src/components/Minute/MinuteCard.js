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
function MinuteCard(props) {
  return (
    <Card
      style={{
        marginTop: "2%",
        backgroundColor: "#eefbfd",
        borderRadius: "15px",
      }}
    >
      <Row>
        <Card.Body>
          <div
            className=" col-2 float-left"
            style={{
              borderRadius: "20px",
              overflow: "auto",
            }}
          >
            <img className="  " width="150px" src={`${process.env.PUBLIC_URL}/assets/img/minute.jpg`} alt="Card image cap"></img>
          </div>
          <div className="col-10 float-right d-flex justify-content-between align-items-center p-3" style={{ fontWeight: "bolder" }}>
            <div style={{ textAlign: "left", marginLeft: "0" }}>
              <h4 style={{ fontWeight: "bold" }}>
                Meeting Name : <span style={{ textTransform: 'uppercase'}}>{ props.minute.meeting_name}</span>
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
              More
            </Button>
              </div>
          </div>

          {/* <Card.Text>sss</Card.Text> */}
        </Card.Body>
      </Row>
    </Card>
  );
}

export default MinuteCard;
