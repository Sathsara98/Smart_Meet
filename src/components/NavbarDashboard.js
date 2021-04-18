import React from "react";
import "./NavbarDashboard.css";

function NavbarDashboard(props) {
  var BurgerMenu = (
    <div className="navbar-toggle d-inline">
      <button type="button" className="navbar-toggler">
        <span className="navbar-toggler-bar bar1"></span>
        <span className="navbar-toggler-bar bar2"></span>
        <span className="navbar-toggler-bar bar3"></span>
      </button>
    </div>
  );
  return (
    <nav
      className="navbar navbar-expand-lg fixed-top"
      data-color="orange ml-0 pl-0 pr-0 mr-0"
      id="navdash"
    >
      <div className="container-fluid ml-0 pl-0 mr-0 pr-0 text-center">
        <div className="navbar-wrapper ml-0 pl-0">
          {BurgerMenu}
          <span style={{ fontSize: "1.613em" }}>
            <b className="text-white align-middle">{props.title}</b>
          </span>
        </div>
        <button
          className="navbar-toggler m-0 p-0 float-right  text-white"
          type="button"
          data-toggle="collapse"
          data-target="#navigation"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            position: "fixed",
            right: "5%",
            top: "5%",
          }}
        >
          <span className="navbar-toggler-bar navbar-kebab"></span>
          <span className="navbar-toggler-bar navbar-kebab"></span>
          <span className="navbar-toggler-bar navbar-kebab"></span>
        </button>

        <div className="collapse navbar-collapse" id="navigation">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item mt-2">
              <a href="home">
                <h4 className="text-white">
                  <i className={"fas fa-bell "}></i>
                </h4>
              </a>
            </li>
            <li className="nav-item mt-2">
              <a href="#loginButton">
                <h4 className="text-white">
                  <i className={"fas fa-user "}></i>
                </h4>
              </a>
            </li>

            {/* 
            <li className="dropdown nav-item ">
              <a
                href=""
                className="dropdown-toggle nav-link dropdownarrow"
                data-toggle="dropdown"
              >
                <div className="notification d-none d-lg-block d-xl-block"></div>
                <i className="fa fa-bell text-white"></i>
                <p className="d-lg-none text-white ">
                  <strong>Notifications</strong>
                </p>
              </a>
              <ul className="dropdown-menu dropdown-menu-right dropdown-navbar ">
                <li className="nav-link ">
                  <a href="#" className="nav-item dropdown-item subdropdowns">
                    Mike John responded to your email
                  </a>
                </li>
                <li className="nav-link">
                  <a href="" className="nav-item dropdown-item subdropdowns">
                    You have 5 more tasks
                  </a>
                </li>
                <li className="nav-link">
                  <a href="" className="nav-item dropdown-item subdropdowns">
                    Your friend Michael is in town
                  </a>
                </li>
                <li className="nav-link">
                  <a href="" className="nav-item dropdown-item subdropdowns ">
                    Another notification
                  </a>
                </li>
                <li className="nav-link">
                  <a href="" className="nav-item dropdown-item subdropdowns">
                    Another one
                  </a>
                </li>
              </ul>
            </li>

            <li className="dropdown nav-item">
              <a
                href="#"
                className="dropdown-toggle nav-link dropdownarrow"
                data-toggle="dropdown"
              >
                <div className="photo">
                  <img src="../assets/img/anime3.png" alt="Profile Photo" />
                </div>
                <b className="caret d-none d-lg-block d-xl-block text-white"></b>
                <p className="d-lg-none text-white">
                  <strong>Log out</strong>
                </p>
              </a>
              <ul className="dropdown-menu dropdown-navbar">
                <li className="nav-link">
                  <a
                    // href="javascript:void(0)"
                    className="nav-item dropdown-item subdropdowns"
                  >
                    Dashboard
                  </a>
                </li>
                <li className="nav-link">
                  <a href="" className="nav-item dropdown-item subdropdowns">
                    Profile
                  </a>
                </li>
                <li className="nav-link">
                  <a href="" className="nav-item dropdown-item subdropdowns">
                    Settings
                  </a>
                </li>
                <li className="dropdown-divider"></li>
                <li className="nav-link">
                  <a href="" className="nav-item dropdown-item subdropdowns">
                    Log out
                  </a>
                </li>
              </ul>
            </li>
            <li className="separator d-lg-none"></li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavbarDashboard;
