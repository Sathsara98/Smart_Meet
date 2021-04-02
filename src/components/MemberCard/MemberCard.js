import React from "react";
import "./MemberCard.css";

function MemberCard(props) {
  return (
    <div className="member-card" data={props.type}>
      <center>
        <i className="fas fa-building card-icon"></i>
        <h3>{props.text}</h3>
      </center>
    </div>
  );
}

export default MemberCard;
