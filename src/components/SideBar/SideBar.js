import React, { useState } from "react";
import logo from "../../assets/logo.png";
// import "./SideBar.css";
import Auth from "../../authentication/Auth";
import mainLogo from "../../assets/main logo.png";
import "./SideBar.css";


function SideBar(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  return (
    <>
      {/* Hamburger Icon (visible only on mobile) */}
      {/* <div className="menu-toggle" onClick={toggleSidebar}>
        <i className="fa fa-bars"></i>
      </div> */}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "active" : ""}`} data="custom">
        <div className="sidebar-wrapper">
          <div className="logo">
            <center>
              <img src={mainLogo} className="mt-2 logo-sidebar" alt="Logo" />
            </center>
          </div>
          <ul className="nav">
            <li className={props.dashboard ? "active" : ""}>
              <a href="/dashboard">
                <i className="fa fa-th-large" aria-hidden="true"></i>
                <p>Dashboard</p>
              </a>
            </li>

            {Auth?.getUserLevel() === "Administrator" && (
              <>
                <li className={props.questions ? "active" : ""}>
                  <a href="/addquestion">
                    <i className="fa fa-list" aria-hidden="true"></i>
                    <p>Add Challenges</p>
                  </a>
                </li>
                <li className={props.submission ? "active" : ""}>
                  <a href="/mysubmission">
                    <i className="fa fa-upload" aria-hidden="true"></i>
                    <p>My Submission</p>
                  </a>
                </li>
              </>
            )}

            <li className={props.events ? "active" : ""}>
              <a href="/events">
                <i className="fa fa-calendar"></i>
                <p>Meetings</p>
              </a>
            </li>

            <li className={props.minute ? "active" : ""}>
              <a href="/minute">
                <i className="fas fa-file-alt"></i>
                <p>Meeting Minutes</p>
              </a>
            </li>

            <li className={props.members ? "active" : ""}>
              <a href="/addmembers">
                <i className="fa fa-users"></i>
                <p>Committee Management</p>
              </a>
            </li>
            <li className={props.reports ? "active" : ""}>
              <a href="/reports">
                <i className="fa fa-chart-bar"></i>
                <p>Reports</p>
              </a>
            </li>

            <li className={props.profile ? "active" : ""}>
              <a href="/profile">
                <i className="fas fa-user"></i>
                <p>Profile</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default SideBar;
