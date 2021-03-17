import React from "react";
import "./AdminHeader.css";

function BreadCrum(props) {
  let pathPrint = null;
  console.log(props.path);
  if (props.path != undefined) {
    pathPrint = props.path.map((p, index) => {
      if (props.path.length == index + 1) {
        return (
          <li class="breadcrumb-item active" key={index} aria-current="page">
            {p}
          </li>
        );
      } else {
        return (
          <li class="breadcrumb-item" key={index}>
            <a href={p}>{p}</a>
          </li>
        );
      }
    });
  }
  // console.log(pathPrint);
  // if (pathPrint != null) {
  //   return <div></div>;
  // } else {
  return (
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb">{pathPrint}</ol>
    </nav>
  );
  // }
}

export default BreadCrum;
