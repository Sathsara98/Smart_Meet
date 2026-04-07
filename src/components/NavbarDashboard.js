import React, { useEffect, useState, useRef } from "react";
import "./NavbarDashboard.css";
import Auth from "../authentication/Auth";
import { useHistory } from "react-router-dom";
import Model from "../components/Model";
function NavbarDashboard(props) {
  const [currentFile, setCurrentFile] = useState(undefined);
  const [meetings, setMeetings] = useState();

  const history = useHistory();
  useEffect(() => {
    loadUser();
    loadMeetings();
  }, []);
  const loadUser = async () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/register/` + Auth.getUserId(), {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
        token: Auth.getToken(),
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.userImage != null) {
          setCurrentFile(`${process.env.REACT_APP_BACKEND_URL}/` + response.userImage);
        }
      })
      .catch((error) => console.log(error));
  };

  const loadMeetings = async () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/getMeetings/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Auth.getUserId(),
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response != null) {
          getUpcomingMeetings(response);
        }
      })
      .catch((error) => console.log(error));
  };

  const getUpcomingMeetings = (meetings) => {
    var current_date = new Date();
    var meetingsUpcoming = meetings.filter((m) => {
      if (m.date != null && m.date != undefined && m.date.length > 3) {
        var date = new Date(m.date);
        if (date >= current_date) {
          return m;
        }
      }
    });
    console.log(meetingsUpcoming);
    setMeetings(meetingsUpcoming);
  };
  //model
  const [model, setModel] = useState(null);
  const returnModel = (show, body, confirmation, callback) => {
    setModel(
      <Model
        show={show}
        confirmation={confirmation}
        body={body}
        handleClose={() => {
          returnModel(false, "", null);
        }}
        handleClick={(e) => {
          callback(e);
          returnModel(false, "", null);
        }}
      />
    );
  };
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
      className="navbar navbar-expand-lg "
      data-color="orange ml-0 pl-0 pr-0 mr-0"
      id="navdash"
    >
      {model}
      <div className="container-fluid ml-0 pl-0 mr-0 pr-0 text-center">
        <div className="navbar-wrapper ml-0 pl-0">
          {BurgerMenu}
          <span style={{ fontSize: "1.613em" }}>
            <b className="title-main align-middle">{props.title}</b>
          </span>
          <span className="subtitle">{props.subtitle}</span>
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
            <li className="dropdown nav-item pr-0">
              <a
                className="dropdown-toggle nav-link dropdownarrow"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className={"fas fa-bell "} style={{ color: "#1e1e1e" }}></i>
              </a>
              <ul
                className="dropdown-menu dropdown-navbar"
                style={{ marginRight: 80 }}
              >
                {meetings == undefined || meetings.length == 0 ? (
                  <li className="nav-link">
                    <a href="/" className="nav-item dropdown-item subdropdowns">
                      No notifications
                    </a>
                  </li>
                ) : (
                  meetings.map((m) => {
                    return (
                      <li className="nav-link">
                        <a
                          href="/"
                          className="nav-item dropdown-item subdropdowns"
                        >
                          You Have A Scheduled <br /> Meeting On {m.date}
                          {m.time.match(/.{1,13}/g)[1]}
                          {" at "}
                          {m.time.match(/.{1,13}/g)[0]}
                        </a>
                      </li>
                    );
                  })
                )}
              </ul>
            </li>
            <li className="dropdown nav-item pr-0">
              <a
                href="#"
                className="dropdown-toggle nav-link dropdownarrow"
                data-toggle="dropdown"
              >
                <div className="photo">
                  <img
                    src={
                      currentFile
                        ? currentFile
                        : `${process.env.PUBLIC_URL}/assets/img/default-avatar.png`
                    }
                    alt="Profile Photo"
                    width="30"
                    height="30"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <b className="caret d-none d-lg-block d-xl-block text-white"></b>
                <p className="d-lg-none text-white">
                  <strong>Log out</strong>
                </p>
              </a>
              <ul className="dropdown-menu dropdown-navbar">
                <li className="nav-link">
                  <a
                    href="/dashboard"
                    className="nav-item dropdown-item subdropdowns"
                  >
                    Dashboard
                  </a>
                </li>
                <li className="nav-link">
                  <a
                    href="/profile"
                    className="nav-item dropdown-item subdropdowns"
                  >
                    Profile
                  </a>
                </li>

                <li className="dropdown-divider"></li>
                <li className="nav-link">
                  <a
                    type="button"
                    onClick={() => {
                      returnModel(
                        true,
                        "Do you really want to Logout!",
                        true,
                        function (ans) {
                          if (ans) {
                            Auth.logout((res) => {
                              if (res) {
                                history.push("/");
                              }
                            });
                          }
                        }
                      );
                    }}
                    className="nav-item dropdown-item subdropdowns"
                  >
                    Log out
                  </a>
                </li>
              </ul>
            </li>
            <li className="separator d-lg-none"></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavbarDashboard;