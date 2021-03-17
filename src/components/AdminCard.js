import React from "react";

function AdminCard(props) {
  return (
    <div class="card ">
      <div class="card-header">
        <h2 class="card-title">{props.title}</h2>
      </div>
      <div class="card-body">{props.children}</div>
    </div>
  );
}

export default AdminCard;
