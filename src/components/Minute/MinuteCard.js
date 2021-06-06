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
import backImg from "../../assets/home_page/metal.jpg";
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
            className=" col-3 float-left"
            style={{
              borderRadius: "20px",
              overflow: "auto",
            }}
          >
            <img className="  " src={backImg} alt="Card image cap"></img>
          </div>
          <div className="col-9 float-right" style={{ fontWeight: "bolder" }}>
            <div style={{ textAlign: "left", marginLeft: "7%" }}>
              <h4 style={{ fontWeight: "bold" }}>
                Meeting Name : {props.minute.meeting_name}
              </h4>
              <h4 style={{ fontWeight: "bold" }}>
                Meeting Date<span style={{ color: "transparent" }}>d</span> :{" "}
                {props.minute.meeting_date}
              </h4>
              <h4 style={{ fontWeight: "bold" }}>
                Meeting Venue : {props.minute.meeting_venue}
              </h4>
            </div>
            <Button
              variant="info"
              className="btnPrimary float-right"
              type="submit"
              onClick={() => props.more(props.minute)}
            >
              More
            </Button>
          </div>

          {/* <Card.Text>sss</Card.Text> */}
        </Card.Body>
      </Row>
    </Card>
  );
}

export default MinuteCard;
