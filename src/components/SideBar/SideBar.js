import React from "react";
import logo from "../../assets/logo.png";
// import "./SideBar.css";

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
            <a href="./dashboard.html">
              <i className="tim-icons fas fa-chart-pie"></i>
              <p>Dashboard</p>
            </a>
          </li>
          <li className={props.members == true ? "active" : ""}>
            <a data-toggle="collapse" href="#componentsExamples">
              <i class="fa fa-users"></i>
              <p>
                Members
                <b class="caret"></b>
              </p>
            </a>
            <div class="collapse" id="componentsExamples">
              <ul class="nav">
                <li className={props.addmembers == true ? "active" : ""}>
                  <a href="addmembers">
                    {/* <i class="fa fa-plus"></i> */}
                    <span class="sidebar-normal"> Add Members </span>
                  </a>
                </li>
                <li>
                  <a href="managemembers">
                    {/* <i class="fa fa-trash"></i> */}
                    <span class="managemembers"> View/Delete Members </span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li className={props.questions == true ? "active" : ""}>
            <a data-toggle="collapse" href="#questionsSidebar">
              <i class="fa fa-question"></i>
              <p>
                Questions
                <b class="caret"></b>
              </p>
            </a>
            <div class="collapse" id="questionsSidebar">
              <ul class="nav">
                <li>
                  <a href="addquestion">
                    {/* <i class="fa fa-plus"></i> */}
                    <span class="sidebar-normal"> Add Questions </span>
                  </a>
                </li>
                <li>
                  <a href="managequestion">
                    {/* <i class="fa fa-trash"></i> */}
                    <span class="sidebar-normal"> View/Delete Questions </span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li className={props.events == true ? "active" : ""}>
            <a href="/events">
              <i className="fa fa-calendar"></i>
              <p>All Events</p>
            </a>
          </li>

          <li className={props.profile == true ? "active" : ""}>
            <a href="/profile">
              <i className="tim-icons fas fa-user"></i>
              <p>Profile</p>
            </a>
          </li>
          <li className={props.settings == true ? "active" : ""}>
            <a href="/settings">
              <i className="tim-icons fas fa-cog"></i>
              <p>Settings</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
