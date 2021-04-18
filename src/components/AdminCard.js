import React from "react";

function AdminCard(props) {
  return (
    <div class="card ">
      <div class="card-header"></div>
      <div class="card-body">{props.children}</div>
    </div>
  );
}

export default AdminCard;
