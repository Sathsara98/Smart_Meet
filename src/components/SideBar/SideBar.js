import React from "react";
// import "./SideBar.css";

function SideBar() {
  return (
    <div className="sidebar" data="custom">
      <div className="sidebar-wrapper">
        <div className="logo">
          <a className="simple-text logo-normal">User Name</a>
        </div>
        <ul className="nav">
          <li className="active ">
            <a href="./dashboard.html">
              <i className="tim-icons fas fa-chart-pie"></i>
              <p>Dashboard</p>
            </a>
          </li>
          <li>
            <a data-toggle="collapse" href="#componentsExamples">
              <i class="fa fa-users"></i>
              <p>
                Users
                <b class="caret"></b>
              </p>
            </a>
            <div class="collapse" id="componentsExamples">
              <ul class="nav">
                <li>
                  <a href="addmembers">
                    {/* <i class="fa fa-plus"></i> */}
                    <span class="sidebar-normal"> Add Users </span>
                  </a>
                </li>
                <li>
                  <a href="../../examples/components/grid.html">
                    {/* <i class="fa fa-trash"></i> */}
                    <span class="managemembers"> View/Delete Users </span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li>
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
                  <a href="../../examples/components/buttons.html">
                    {/* <i class="fa fa-plus"></i> */}
                    <span class="sidebar-normal"> Add Questions </span>
                  </a>
                </li>
                <li>
                  <a href="../../examples/components/grid.html">
                    {/* <i class="fa fa-trash"></i> */}
                    <span class="sidebar-normal"> View/Delete Questions </span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <a href="./map.html">
              <i className="fa fa-calendar"></i>
              <p>Scedules</p>
            </a>
          </li>
          <li>
            <a href="./notifications.html">
              <i className="fa fa-handshake"></i>
              <p>Meetings</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
