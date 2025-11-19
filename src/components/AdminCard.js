import React from "react";

function AdminCard(props) {
  return (
    <div className="content-card-wrapper ">
      <div className="card-header"></div>
      <div className="card-body">{props.children}</div>
    </div>
  );
}

export default AdminCard;
