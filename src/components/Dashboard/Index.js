import React, { useEffect, useState } from "react";
import Calender from "./DashCalender";
import { Chart } from "react-google-charts";

import {
  BreadCrum,
  SideBar,
  Navbar,
  AdminCard,
  NavbarDashboard,
  MemberRatio,
} from "../../components";
import {
  Container,
  Form,
  Col,
  Row,
  Button,
  Alert,
  Spinner,
  Toast,
} from "react-bootstrap";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TablePagination,
} from "@material-ui/core";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Auth from "../../authentication/Auth";
import Footer from "../Footer/Footer";

function Index() {
  const [eventList, setEventList] = useState([]);
  const [event, setEvent] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const createNotification = (type) => {
    return () => {
      switch (type) {
        case "info":
          NotificationManager.info("Info message");
          break;
        case "success":
          NotificationManager.success("Success message", "Title here");
          break;
        case "warning":
          NotificationManager.warning(
            "Warning message",
            "Close after 3000ms",
            3000
          );
          break;
        case "error":
          NotificationManager.error("Error message", "Click me!", 5000, () => {
            alert("callback");
          });
          break;
      }
    };
  };
  const pathToPage = ["Home", "Admin", "Dashboard"];
  useEffect(() => {
    loadEvents();
    loadSubmissions();
  }, []);
  const loadEvents = async () => {
    setLoading(true);
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/events/all/`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
      }),
    })
      .then((res) => res.json())
      .then((response) => {

        //Filter event tht involves the logged user
        if (Auth.getUserLevel() === "Committee Member") {
          var eventArr = [];
          response.map(function (el) {
            var isUser = false;
            el.members.forEach((element) => {
              console.log(Auth?.getUserId() == element._id);
              if (Auth?.getUserId() == element._id) {
                isUser = true;
              }
            });
            if (isUser) {
              eventArr.push(el);
            }
          });
          setEventList(eventArr);
        } else {
          setEventList(response);
        }
      })
      .catch((error) => console.log(error));
    setLoading(false);
  };

  const loadSubmissions = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/challenges`);
      const data = await res.json();
      setSubmissionData(data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Filter only completed submissions
  const completedSubmissions = submissionData.filter(
    (submission) => submission.status === "completed"
  );

  // Prepare data for bar chart - count challenges by development area (all submissions)
  const developmentAreaCounts = {};
  submissionData.forEach((submission) => {
    const area = submission.developmentArea || "Unknown";
    developmentAreaCounts[area] = (developmentAreaCounts[area] || 0) + submission.noOfChallenges;
  });

  // Color mapping for development areas
  const areaColorMap = {
    "Policy": "#f3c612",
    "R&D": "#0D97B9",
    "Technology": "#9c9b9b",
    "Workforce": "#7FD858",
    "Productivity": "#CB6CE6",
    "Marketing": "#54DDFE",
  };

  // Create chart data with color column for per-bar styling
  const chartData = [
    ["Development Area", "Number of Challenges", { role: "style" }],
    ...Object.entries(developmentAreaCounts).map(([area, count]) => [
      area,
      count,
      areaColorMap[area] || "#4CAF50",
    ]),
  ];

  return (
    <div className="wrapper">
      {NotificationManager.info("Info message")}
      <SideBar dashboard={true} />
      {!isLoading ? (
        <div className="main-panel">
          <NavbarDashboard title="Hello, John!" subtitle="Welcome back to Meeting Management System" />

          <div className="content">
            {/* <div
              class="alert alert-info alert-dismissible fade show"
              role="alert"
            >
              <strong>Holy guacamole!</strong> You should check in on some of
              those fields below.
              <button
                type="button"
                class="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <i class="fa fa-times-circle mt-2"></i>
              </button>
            </div> */}
            {/* <BreadCrum path={pathToPage} /> */}

            {/* <AdminCard>
              <Calender events={eventList != null ? eventList : null} />
            </AdminCard> */}
            <div className="dashboard-grid">
              <div class="row g-4 dash-row pt-1">
                {/* bar chart */}
                <div class="col-lg-6">
                  <AdminCard>
                    <div class="c-header fw-bold pb-2">Challenges by Development Area</div>
                    {chartData.length > 1 ? (
                      <Chart
                        width={"100%"}
                        height={"300px"}
                        chartType="BarChart"
                        data={chartData}
                        options={{

                          titleTextStyle: { fontSize: 14, bold: false },
                          legend: { position: "none" },
                          hAxis: {
                            title: "Number of Challenges",
                            titleTextStyle: { color: "#333" },
                            minValue: 0,
                          },
                          vAxis: {
                            title: "Development Area",
                            titleTextStyle: { color: "#333" },
                          },
                          bar: { groupWidth: "75%" },
                        }}
                      />
                    ) : (
                      <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                        No data available
                      </div>
                    )}
                  </AdminCard>
                </div>

                {/* Calendar */}
                <div class="col-lg-6">
                  <AdminCard>
                    <div class="c-header fw-bold pb-2">Upcoming Meetings</div>
                    <Calender events={eventList != null ? eventList : []} height={300} />
                  </AdminCard>
                </div>

                {/* Countdown */}
                {/* <div class="col-lg-3">
                  <AdminCard>
                    <div class="c-header fw-bold pb-2">Next Meeting</div>
                    <canvas id="barChart"></canvas>
                  </AdminCard>
                </div> */}

              </div>

              <div class="row  dash-row">
                {/* Recent Challenges */}
                <div class="col-lg-9">
                  <AdminCard>
                    <div class="c-header fw-bold pb-2">Recent Challenges</div>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><b>ID</b></TableCell>
                            <TableCell><b>No. of Challenges</b></TableCell>
                            <TableCell><b>Development Area</b></TableCell>
                            <TableCell><b>Status</b></TableCell>
                            <TableCell><b>Created Date</b></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {completedSubmissions
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                              <TableRow key={row.id} hover>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.noOfChallenges}</TableCell>
                                <TableCell>{row.developmentArea}</TableCell>
                                <TableCell>
                                  <Chip
                                    label="Completed"
                                    sx={{
                                      backgroundColor: "#C8FACD",
                                      color: "green",
                                      fontWeight: 600,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{row.createdDate}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AdminCard>
                </div>

                {/* Calendar */}
                <div class="col-lg-3 mem-composition">
                  <AdminCard>
                    <div class="c-header fw-bold pb-2 ">Member Composition</div>
                    <MemberRatio />
                  </AdminCard>
                </div>


              </div>
            </div>

            <Footer />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Index;