import React from "react";
import "./MemberCard.css";

function MemberCard(props) {
  var icon = "fa-university";
  if (props.type != null) {
    if (props.type == "private") {
      icon = "fa-building";
    } else if (props.type == "academic") {
      icon = "fa-graduation-cap";
    } else if (props.type == "association") {
      icon = "fa-users";
    }
  }
  return (
    <a href={"/managemembers/" + props.type}>
      <div className="member-card" data={props.type} onClick={"/managemembers"}>
        <center>
          <div className="icon-wrap">
            <i className={"fas " + icon + " card-icon"}></i>
          </div>

          <h3>{props.text}</h3>
        </center>
      </div>
    </a>
  );
}

export default MemberCard;
