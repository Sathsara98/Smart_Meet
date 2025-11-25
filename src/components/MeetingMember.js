import React from "react";
import profile from "../assets/profile.png";
import { Card } from "react-bootstrap";
function MeetingMember(props) {
  var name = props.name.split(" ");
  var userImage = `${process.env.REACT_APP_BACKEND_URL}/`+props.obj.userImage;
  return (
    <div className="p-1 memberCards">
      <Card
        style={{
          borderTopLeftRadius: "50%",
          borderTopRightRadius: "50%",
          float: "left",
          margin: "5px",
        }}
      >
        <Card.Img
          variant="top"
          className="rounded-circle"
          width="80"
          height="80"
          style={{ objectFit: "cover" }}
          src={props.obj.userImage ? userImage : profile}
        />
        <Card.Title className="text-center pb-0 mb-0">{name[0]}</Card.Title>
        <Card.Title className="text-center mb-2 pt-0">
          <b>{props.sector}</b>
        </Card.Title>
      </Card>
    </div>
  );
}

export default MeetingMember;
