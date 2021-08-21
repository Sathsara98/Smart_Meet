import React from "react";
import logo from "../../assets/logo.png";
// import "./SideBar.css";
import Auth from "../../authentication/Auth";

function SideBar(props) {
  return (
    <div className="sidebar" data="custom">
      <div className="sidebar-wrapper">
        <div className="logo">
          <center>
            <img src={logo} className="mt-2 logo-sidebar" />
            <h4 className="text-secondary">
              <b>Admin Panel</b>
            </h4>
          </center>
        </div>
        <ul className="nav">
          <li className={props.dashboard == true ? "active" : ""}>
            <a href="/dashboard">
              <i className="tim-icons fas fa-chart-pie"></i>
              <p>Dashboard</p>
            </a>
          </li>
          <li className={props.members == true ? "active" : ""}>
            <a href="/addmembers">
              <i className="fa fa-users"></i>
              <p>Members</p>
            </a>
          </li>

          {Auth?.getUserLevel()==="Administrator" ?(
            <li className={props.questions == true ? "active" : ""}>
              <a href="/addquestion">
                <i className="fa fa-question"></i>
                <p>Questions</p>
              </a>
          </li>):null}
          <li className={props.events == true ? "active" : ""}>
            <a href="/events">
              <i className="fa fa-calendar"></i>
              <p>Events</p>
            </a>
          </li>
          <li className={props.minute == true ? "active" : ""}>
            <a href="/minute">
              <i class="fas fa-file-alt"></i>
              <p>Minute</p>
            </a>
          </li>
          <li className={props.notAvailable == true ? "active" : ""}>
            <a href="/notAvailable">
              <i className="fa fa-table"></i>
              <p>Not Available</p>
            </a>
          </li>
          <li className={props.profile == true ? "active" : ""}>
            <a href="/profile">
              <i className="tim-icons fas fa-user"></i>
              <p>Profile</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
