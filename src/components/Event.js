import React,{useState,useEffect} from "react";
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
            <img className="  " src={`${process.env.PUBLIC_URL}`+image} alt={'${process.env.PUBLIC_URL}'+image}></img>
          </div>
          <div className="col-9 float-right d-flex justify-content-between align-items-center p-3" style={{ fontWeight: "bolder" }}>
            <div style={{ textAlign: "left" }}>
              <h4 style={{ fontWeight: "bold" }}>Name : <span style={{ textTransform: 'uppercase'}}>{props.event.name}</span></h4>
              <h4 style={{ fontWeight: "bold" }}>
                Date<span style={{ color: "transparent" }}>d</span> : {" "}
                {props.event.time}
              </h4>
              <h4 style={{ fontWeight: "bold" }}>
                Venue : {props.event.venue}
              </h4>
            </div>
            <div className="align-self-end">
            <Button
              variant="light"
              className="btnPrimary float-right"
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
