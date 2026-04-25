import React from "react";
import profile from "../assets/profile.png";
import maleImg from "../assets/profile male.png";
import femaleImg from "../assets/profile female.png";
import { Card } from "react-bootstrap";

function MeetingMember(props) {
  const name = (props.name || "").split(" ");
  const genderRaw =
    props.obj && props.obj.gender
      ? String(props.obj.gender).toLowerCase().trim()
      : "";

  console.log("MeetingMember props:", props.obj);

  const getDefaultImage = () => {
    if (genderRaw.startsWith("f")) return femaleImg;
    if (genderRaw.startsWith("m")) return maleImg;
    return profile;
  };

  let userImage = getDefaultImage();

  if (props.obj && props.obj.userImage) {
    userImage = `${process.env.REACT_APP_BACKEND_URL}/${props.obj.userImage}`;
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
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getDefaultImage();
          }}
        />
        <Card.Title className="text-center pb-0 mb-0">
          {name[0]}
        </Card.Title>
        <Card.Title className="text-center mb-2 pt-0">
          <b>{props.sector}</b>
        </Card.Title>
      </Card>
    </div>
  );
}

export default MeetingMember;