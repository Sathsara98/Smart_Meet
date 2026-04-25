import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Col,
  Row,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
import backImg from "../assets/home_page/metal.jpg";

function Event(props) {
  const [image, setimage] = useState(backImg);
  useEffect(() => {
    if (props.event.sector == "Policy") {
      setimage("/assets/img/sectors/1.png");
    } else if (props.event.sector == "R&D") {
      setimage("/assets/img/sectors/2.png");
    } else if (props.event.sector == "Technology") {
      setimage("/assets/img/sectors/5.png");
    } else if (props.event.sector == "Work force") {
      setimage("/assets/img/sectors/6.png");
    } else if (props.event.sector == "Productivity") {
      setimage("/assets/img/sectors/4.png");
    } else if (props.event.sector == "Marketing") {
      setimage("/assets/img/sectors/3.png");
    }
  }, [])

  return (
    <Card className="card-event"
      style={{
        marginTop: "2%",
        borderRadius: "15px",
        marginLeft: "10px",
        marginRight: "10px",
        boxShadow: "none",
        marginBottom: "0%",
      }}
    >
      <Row>
        <Card.Body
          style={{
            boxShadow: "-2px 3px 14px -4px rgba(74, 74, 74, 0.4)",
            borderRadius: "10px"
          }}>
          {/* <div
            className=" col-3 float-left"
            style={{
              borderRadius: "20px",
              overflow: "auto",
            }}
          >
            { <img className="  " src={`${process.env.PUBLIC_URL}`+image} alt={'${process.env.PUBLIC_URL}'+image}></img> }
          </div> */}
          <div className="row">
            <div className="col-md-10 d-flex flex-column justify-content-center">
              <h4 className="meeting-name">{props.event.name}</h4>
              <div className="d-flex meeting-detail-wrap">
                <div className="col-md-4 pl-0">
                  Date:{props.event.date}
                </div>
                <div className="col-md-4">
                  Time:{props.event.time}
                </div>
                <div className="col-md-4">
                  Venue:{props.event.venue}
                </div>

              </div>
            </div>
            <div className="col-md-2 minute-view-btn">
              <Button
                variant=""
                className="btn  btn-primary float-right"
                type="submit"
                onClick={() => props.more(props.event)}
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

export default Event;