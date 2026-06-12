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


// Main dashboard component.
function Index() {

  // Stores all meetings/events shown in dashboard calendar.
  const [eventList, setEventList] = useState([]);

  // Stores selected event details.
  // Currently this state is declared but not used in this file.
  const [event, setEvent] = useState(null);

  // Controls page loading.
  // true means data is still loading.
  const [isLoading, setLoading] = useState(true);

  // Stores challenge submission records from backend.
  const [submissionData, setSubmissionData] = useState([]);

  // Stores submitted questions/challenges.
  const [questions, setQuestions] = useState([]);

  // Stores current table page number.
  const [page, setPage] = useState(0);

  // Stores how many rows should show per page.
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Stores start date for date range filter.
  const [rangeStart, setRangeStart] = useState("");

  // Stores end date for date range filter.
  const [rangeEnd, setRangeEnd] = useState("");

  const [minutes, setMinutes] = useState([]);

  const [memberCount, setMemberCount] = useState(0);

  // Helper function to convert date string into JavaScript Date object.
  // WHY: Reports need to filter records by year, month, and date range.
  const parseDate = (str) => {
    if (!str) return null;

    const d = new Date(str);

    // If date is invalid, return null.
    return isNaN(d.getTime()) ? null : d;
  };

  const loadMinutes = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/minutes/`);
      const data = await res.json();
      setMinutes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setMinutes([]);
    }
  };

  const loadMemberCount = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/register/`);
      const data = await res.json();
      setMemberCount(Array.isArray(data) ? data.length : 0);
    } catch (e) {
      console.error(e);
      setMemberCount(0);
    }
  };

  // This function creates notification messages.
  // Logic:
  // Based on type, it shows different notification styles.
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

  // Breadcrumb path for dashboard.
  // Currently breadcrumb display is commented in JSX.
  const pathToPage = ["Home", "Admin", "Dashboard"];

  // Filter meetings based on selected From Date and To Date.
  const filteredMeetings = eventList.filter((event) => {
    // Convert meeting date into JavaScript Date object.
    const d = parseDate(event.date);

    // If user did not select date range, show all meetings.
    if (!rangeStart || !rangeEnd) return false;

    // Convert selected From Date.
    const start = new Date(rangeStart);

    // Convert selected To Date.
    const end = new Date(rangeEnd);

    // Include full To Date until 11:59 PM.
    end.setHours(23, 59, 59, 999);

    // Keep only meetings inside selected date range.
    return d && d >= start && d <= end;
  });


  // Get challenges from the filtered meetings.
  // One meeting can have many questions/challenges.
  const filteredChallenges = filteredMeetings.flatMap(
    (meeting) => meeting.questions || []
  );


  // Filter meeting minutes based on selected From Date and To Date.
  const filteredMinutes = minutes.filter((minute) => {
    // Convert meeting minute date into JavaScript Date object.
    const d = parseDate(minute.meeting_date);

    // If user did not select date range, show all minutes.
    if (!rangeStart || !rangeEnd) return false;

    // Convert selected From Date.
    const start = new Date(rangeStart);

    // Convert selected To Date.
    const end = new Date(rangeEnd);

    // Include full To Date until 11:59 PM.
    end.setHours(23, 59, 59, 999);

    // Keep only minutes inside selected date range.
    return d && d >= start && d <= end;
  });


  // useEffect runs once when dashboard page loads.
  // Logic:
  // 1. Load meeting events.
  // 2. Load challenge submissions.
  // 3. Load submitted questions for chart.
  useEffect(() => {
    loadEvents();
    loadSubmissions();
    loadQuestions();
    loadMinutes();
    loadMemberCount();
  }, []);


  // This function loads submitted questions/challenges.
  // These questions are used to prepare the bar chart.
  const loadQuestions = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/submitted-questions`);

      // Convert response into JSON.
      const data = await res.json();

      // If data is an array, save it.
      // Otherwise save empty array to avoid errors.
      setQuestions(Array.isArray(data) ? data : []);
    }
    catch (err) {
      // If request fails, show error in console and clear questions.
      console.error("Error fetching questions", err);
      setQuestions([]);
    }
  };


  // This function loads all events/meetings from backend.
  const loadEvents = async () => {
    // Start loading before API call.
    setLoading(true);

    await fetch(`${process.env.REACT_APP_BACKEND_URL}/events/all/`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
      }),
    })
      .then((res) => res.json())
      .then((response) => {

        // Logic:
        // If logged-in user is a Committee Member,
        // show only meetings where that member is included.
        if (Auth.getUserLevel() === "Committee Member") {
          var eventArr = [];

          // Loop through all meetings.
          response.map(function (el) {
            var isUser = false;

            // Check each member in the meeting.
            el.members.forEach((element) => {
              console.log(Auth?.getUserId() == element._id);

              // If logged-in user's ID matches meeting member ID,
              // this meeting belongs to the user.
              if (Auth?.getUserId() == element._id) {
                isUser = true;
              }
            });

            // Add meeting only if logged-in user is part of it.
            if (isUser) {
              eventArr.push(el);
            }
          });

          // Save filtered meetings.
          setEventList(eventArr);
        } else {
          // If user is admin/secretary, show all meetings.
          setEventList(response);
        }
      })
      .catch((error) => console.log(error));

    // Stop loading after request finishes.
    setLoading(false);
  };


  // This function loads challenge submission summary data.
  // This data is used in the recent completed challenges table.
  const loadSubmissions = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/challenges`);

      // Convert backend response to JSON.
      const data = await res.json();

      // Save submission data into state.
      setSubmissionData(data);
    } catch (err) {
      // If request fails, show error in console.
      console.error("Error fetching submissions:", err);
    }
  };


  // This function changes current table page.
  const handleChangePage = (_, newPage) => setPage(newPage);

  // This function changes how many rows show per page.
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);

    // Reset to first page when rows per page changes.
    setPage(0);
  };


  // Filter only completed submissions.
  // Logic:
  // Dashboard table should show only completed challenge submissions.
  const completedSubmissions = submissionData.filter(
    (submission) => submission.status === "completed"
  );


  // Prepare data for bar chart.
  // Logic:
  // Count how many questions/challenges belong to each development area.
  const developmentAreaCounts = {};

  questions.forEach((q) => {
    // If development area is missing, use "Unknown".
    const area = q.developmentArea || "Unknown";

    // Increase count for that development area.
    developmentAreaCounts[area] = (developmentAreaCounts[area] || 0) + 1;
  });


  // Color mapping for development areas.
  // Logic:
  // Each development area gets a different bar color in the chart.
  const areaColorMap = {
    "Policy": "#f3c612",
    "R&D": "#0D97B9",
    "Technology": "#9c9b9b",
    "Workforce": "#7FD858",
    "Productivity": "#CB6CE6",
    "Marketing": "#54DDFE",
  };


  // Create chart data in the format required by react-google-charts.
  // First row contains column names.
  // Other rows contain development area, challenge count, and bar color.
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

      {/* Shows an info notification message.
         Note: this runs while rendering the component. */}
      {NotificationManager.info("Info message")}

      {/* Sidebar navigation */}
      <SideBar dashboard={true} />

      {/* Show dashboard only after loading is completed */}
      {!isLoading ? (
        <div className="main-panel">

          {/* Top navbar with logged-in user's name */}
          <NavbarDashboard
            title={'Hello, ' + Auth.getUserName() + '!'}
            subtitle="Welcome back to Meeting Management System"
          />

          <div className="content">

            <div>
              <AdminCard>
                <div className="mt-2" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

                  {/* Start date filter */}
                  <div style={{ width: 200 }} className="width-100">
                    <Form.Label>From</Form.Label>
                    <Form.Control
                      type="date"
                      value={rangeStart}
                      onChange={(e) => {
                        setRangeStart(e.target.value);
                        setPage(0);
                      }}
                    />
                  </div>


                  {/* End date filter */}
                  <div style={{ width: 200 }} className="width-100">
                    <Form.Label>To</Form.Label>
                    <Form.Control
                      type="date"
                      value={rangeEnd}
                      onChange={(e) => {
                        setRangeEnd(e.target.value);
                        setPage(0);
                      }}
                    />
                  </div>

                </div>

                <div className="row mt-2">
                  <div className="col-4">
                    Total Challenges: {filteredChallenges.length}
                  </div>
                  <div className="col-4">
                    Total Meetings: {filteredMeetings.length}
                  </div>
                  <div>
                    Total Minutes: {filteredMinutes.length}
                  </div>
                </div>


              </AdminCard>
              {/* Filter input fields */}

            </div>

            {/* Breadcrumb is currently commented */}
            {/* <BreadCrum path={pathToPage} /> */}

            {/* Old calendar card is currently commented */}
            {/* <AdminCard>
             <Calender events={eventList != null ? eventList : null} />
           </AdminCard> */}

            <div className="dashboard-grid">

              {/* First dashboard row: chart and calendar */}
              <div class="row g-4 dash-row pt-1">

                {/* Bar chart section */}
                <div class="col-lg-6">
                  <AdminCard>
                    <div class="c-header fw-bold pb-2">
                      Challenges by Development Area
                    </div>

                    <div style={{ fontSize: 8, display: "flex" }}>
                      {Object.entries(developmentAreaCounts).map(([area, count]) => (
                        <div key={area}>
                          <strong>{area}</strong>: {count}
                        </div>
                      ))}
                    </div>

                    {/* If chart has data, display bar chart */}
                    {chartData.length > 1 ? (
                      <Chart
                        width={"100%"}
                        height={"300px"}
                        chartType="BarChart"
                        data={chartData}
                        options={{
                          titleTextStyle: { fontSize: 14, bold: false },
                          legend: { position: "none" },

                          // Horizontal axis shows challenge count.
                          hAxis: {
                            title: "Number of Challenges",
                            titleTextStyle: { color: "#333" },
                            minValue: 0,
                          },

                          // Vertical axis shows development area names.
                          vAxis: {
                            title: "Development Area",
                            titleTextStyle: { color: "#333" },
                          },

                          // Controls bar width.
                          bar: { groupWidth: "75%" },
                        }}
                      />
                    ) : (
                      // If there is no chart data, show message.
                      <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                        No data available
                      </div>
                    )}

                    <div>

                    </div>
                  </AdminCard>
                </div>


                {/* Upcoming meetings calendar section */}
                <div class="col-lg-6">
                  <AdminCard>
                    <div class="c-header fw-bold pb-2">Upcoming Meetings</div>

                    {/* Pass meeting list to calendar component */}
                    <Calender events={eventList != null ? eventList : []} height={300} />
                  </AdminCard>
                </div>

              </div>


              {/* Second dashboard row: recent challenges and member composition */}
              <div class="row  dash-row">

                {/* Recent completed challenges table */}
                <div class="col-lg-9">
                  <AdminCard>
                    <div class="c-header fw-bold pb-2">
                      Recent Completed Challenges
                    </div>

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><b>No. of Challenges</b></TableCell>
                            <TableCell><b>Development Area</b></TableCell>
                            <TableCell><b>Status</b></TableCell>
                            <TableCell><b>Created Date</b></TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {/* Show only rows for current page */}
                          {completedSubmissions
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                              <TableRow key={row.id} hover>

                                {/* Number of challenges in submission */}
                                <TableCell>{row.noOfChallenges}</TableCell>

                                {/* Development area of submission */}
                                <TableCell>{row.developmentArea}</TableCell>

                                {/* Status chip */}
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

                                {/* Created date */}
                                <TableCell>{row.createdDate}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AdminCard>
                </div>


                {/* Member composition chart/card */}
                <div class="col-lg-3 mem-composition">
                  <AdminCard>
                    <div class="c-header fw-bold pb-2 ">
                      Member Composition
                    </div>
                    <div>
                      Total Members: {memberCount}
                    </div>

                    {/* MemberRatio component shows member composition by sector */}
                    <MemberRatio />
                  </AdminCard>
                </div>

              </div>
            </div>

            {/* Footer section */}
            <Footer />
          </div>
        </div>
      ) : null}
    </div>
  );
}


export default Index;

