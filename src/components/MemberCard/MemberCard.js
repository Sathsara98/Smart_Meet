import React, { useEffect, useState } from "react";
import "./MemberCard.css";


function MemberCard(props) {
  const [memberStats, setMemberStats] = useState({
    Public: 0,
    Private: 0,
    Academic: 0,
    Association: 0,
  });


  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/stats`)
      .then((res) => res.json())
      .then((data) => {
        setMemberStats(data);
      })
      .catch((error) => {
        console.error("Error fetching member stats:", error);
      });
  }, []);


  let icon = "fa-university";
  let count = memberStats.Public;


  if (props.type === "private") {
    icon = "fa-building";
    count = memberStats.Private;
  } else if (props.type === "academic") {
    icon = "fa-graduation-cap";
    count = memberStats.Academic;
  } else if (props.type === "association") {
    icon = "fa-users";
    count = memberStats.Association;
  }


  return (
    <a href={"/managemembers/" + props.type}>
      <div className="member-card" data={props.type}>
        <center>
          <div className="icon-wrap">
            <i className={"fas " + icon + " card-icon"}></i>
          </div>


          <h3>{props.text}</h3>


          <p>{count || 0} Members</p>
        </center>
      </div>
    </a>
  );
}


export default MemberCard;







