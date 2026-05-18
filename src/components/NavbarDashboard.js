import React, { useEffect, useState, useRef } from "react";
import "./NavbarDashboard.css";
import Auth from "../authentication/Auth";
import { useHistory } from "react-router-dom";
import Model from "../components/Model";
function NavbarDashboard(props) {
  const [currentFile, setCurrentFile] = useState(undefined);
  //const [meetings, setMeetings] = useState();
  const [notifications, setNotifications] = useState([]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);




  const history = useHistory();
  // useEffect(() => {
  //   loadUser();
  //   loadMeetings();
  // }, []);
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

  // const loadMeetings = async () => {
  //   fetch(`${process.env.REACT_APP_BACKEND_URL}/users/getMeetings/`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       id: Auth.getUserId(),
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((response) => {
  //       if (response != null) {
  //         getUpcomingMeetings(response);
  //       }
  //     })
  //     .catch((error) => console.log(error));
  // };

  const loadNotifications = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/notifications/user/${Auth.getUserId()}`,
      {
        headers: {
          token: Auth.getToken(),
        }
      })

      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
      })
      .catch(console.log);
  }
  useEffect(() => {
    loadUser();
    loadNotifications();
  }, [])


  // const getUpcomingMeetings = (meetings) => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const meetingsUpcoming = meetings.filter((m) => {
  //     if (!m.date) return false;

  //     const meetingDate = new Date(m.date);
  //     if (isNaN(meetingDate)) return false;

  //     meetingDate.setHours(0, 0, 0, 0);
  //     return meetingDate >= today;
  //   });

  //   console.log("Upcoming meetings:", meetingsUpcoming);
  //   setMeetings(meetingsUpcoming);
  // };
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
    <>
      <nav
        className="navbar navbar-expand-lg desktop-navbar"
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
              <li className="dropdown nav-item pr-0 ">
                <a
                  className="dropdown-toggle nav-link dropdownarrow position-relative"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fas fa-bell" style={{ color: "#1e1e1e" }}></i>

                  {/* 🔴 Badge */}
                  {notifications.length > 0 && (
                    <span className="notif-badge">
                      {notifications.length}
                    </span>
                  )}
                </a>

                <ul
                  className="dropdown-menu dropdown-navbar notif-wrapper"
                  style={{}}
                >
                  {notifications.length == 0 ? (
                    <li className="nav-link">
                      {/* <a href="/" className="nav-item dropdown-item subdropdowns">
                        No notifications
                      </a> */}
                      <span>No notifications</span>
                    </li>
                  ) : (
                    notifications.map((n) => {
                      return (
                        <li className="nav-link" key={n._id}>
                          <span className="nav-item dropdown-item subdropdowns">
                            {n.message}
                          </span>
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

      <nav className="mobile-navbar">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>

        <div className="mobile-title">
          <b className="title-main">{props.title}</b>
          <span className="subtitle">{props.subtitle}</span>
        </div>

        <div className="mobile-actions">
          <button
            className="mobile-icon-btn"
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setProfileOpen(false);
            }}
          >
            <i className="fas fa-bell" style={{ color: "#1e1e1e" }}></i>
            {notifications.length > 0 && (
              <span className="notif-badge">{notifications.length}</span>
            )}
          </button>

          <button
            className="mobile-profile-btn"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationOpen(false);
            }}
          >
            <img
              src={
                currentFile
                  ? currentFile
                  : `${process.env.PUBLIC_URL}/assets/img/default-avatar.png`
              }
              alt="Profile"
            />
          </button>
        </div>

        <div className={`mobile-nav-panel ${mobileMenuOpen ? "show" : ""}`}>
          <ul className="mobile-nav-list">
            <li className={props.dashboard ? "active" : ""}>
              <a href="/dashboard">
                <i className="fa fa-th-large"></i>
                <span>Dashboard</span>
              </a>
            </li>

            {Auth?.getUserLevel() === "Administrator" && (
              <>
                <li className={props.questions ? "active" : ""}>
                  <a href="/addquestion">
                    <i className="fa fa-list"></i>
                    <span>Add Challenges</span>
                  </a>
                </li>

                <li className={props.submission ? "active" : ""}>
                  <a href="/mysubmission">
                    <i className="fa fa-upload"></i>
                    <span>My Submission</span>
                  </a>
                </li>
              </>
            )}

            <li className={props.events ? "active" : ""}>
              <a href="/events">
                <i className="fa fa-calendar"></i>
                <span>Meetings</span>
              </a>
            </li>

            <li className={props.minute ? "active" : ""}>
              <a href="/minute">
                <i className="fas fa-file-alt"></i>
                <span>Meeting Minutes</span>
              </a>
            </li>

            <li className={props.members ? "active" : ""}>
              <a href="/addmembers">
                <i className="fa fa-users"></i>
                <span>Committee Management</span>
              </a>
            </li>

            <li className={props.reports ? "active" : ""}>
              <a href="/reports">
                <i className="fa fa-chart-bar"></i>
                <span>Reports</span>
              </a>
            </li>

            <li className={props.profile ? "active" : ""}>
              <a href="/profile">
                <i className="fas fa-user"></i>
                <span>Profile</span>
              </a>
            </li>
          </ul>
        </div>




        {notificationOpen && (
          <div className="mobile-notification-panel">
            <h5>Notifications</h5>
            {notifications.length == 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.map((n) => (
                <div className="notification-item" key={n._id}>
                  {n.message}
                </div>
              ))
            )}
          </div>
        )}

        {profileOpen && (
          <div className="mobile-profile-dropdown">
            <a href="/dashboard">Dashboard</a>
            <a href="/profile">Profile</a>
            <button>Log out</button>
          </div>
        )}
      </nav>

    </>



  );
}

export default NavbarDashboard;