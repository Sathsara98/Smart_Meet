import React from "react";
import profile from "../assets/profile.png";
import maleImg from "../assets/profile male.png";
import femaleImg from "../assets/profile female.png";
import { Card } from "react-bootstrap";
function MeetingMember(props) {
  var name = props.name.split(" ");
  // var userImage = `${process.env.REACT_APP_BACKEND_URL}/`+props.obj.userImage;
  const genderRaw = (props.obj && props.obj.gender) ? String(props.obj.gender).toLowerCase().trim() : "";
  let userImage = profile;


  if (props.obj && props.obj.userImage) {
    userImage = `${process.env.REACT_APP_BACKEND_URL}/${props.obj.userImage}`;
  } else if (genderRaw.startsWith("f")) {
    userImage = femaleImg;
  } else if (genderRaw.startsWith("m")) {
    userImage = maleImg;
  } else {
    userImage = profile;
  }
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
          src={userImage}
          onError={(e) => { e.target.onerror = null; e.target.src = profile; }}
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





