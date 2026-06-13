// Import React hooks.
// useEffect is used to run code when the page loads.
// useMemo is used to calculate values efficiently and avoid recalculating unnecessarily.
// useState is used to store changing data.
import React, { useEffect, useMemo, useState } from "react";
import { SideBar, NavbarDashboard, AdminCard } from "../../components";
import { Form, Button } from "react-bootstrap";
import {
    Box,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    CircularProgress,
} from "@material-ui/core";

import Auth from "../../authentication/Auth";
import { Chart } from "react-google-charts";
import Footer from "../Footer/Footer";
import Report from "./Report.css";
import { use } from "react";


// Helper function for CSV export.
// rows = data rows to export.
// headers = column names.
// filename = downloaded CSV file name.
const downloadCsv = (rows, headers, filename) => {

    // Create CSV text.
    // First row is header row.
    // Other rows are created by matching each header with row value.
    const csvContent = [
        headers.join(","),
        ...rows.map((r) => headers.map((h) => r[h] ?? "").join(",")),
    ].join("\n");

    // Create a CSV file object in browser memory.
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create temporary file URL.
    const url = URL.createObjectURL(blob);

    // Create temporary anchor tag to download file.
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    // Trigger download.
    a.click();

    // Remove temporary file URL from browser memory.
    URL.revokeObjectURL(url);
};


// Reports component.
// Purpose:
// This page generates different reports:
// 1. Challenges by development area
// 2. Member participation
// 3. Yearly trend
// 4. Yearly comparison
export default function Reports() {

    // Stores currently selected tab index.
    const [tabIndex, setTabIndex] = useState(0);

    // Stores meeting/event data loaded from backend.
    // These events contain submitted questions/challenges.
    const [events, setEvents] = useState([]);

    // Stores meeting minutes data.
    // Used for member participation reports.
    const [minutes, setMinutes] = useState([]);

    // Controls page loading spinner.
    const [isLoading, setIsLoading] = useState(true);

    // Stores all questions.
    // In this code, events are mainly used for reports.
    const [questions, setQuestions] = useState([]);


    // Color map for development areas.
    // WHY: Each development area gets a separate color in charts.
    const areaColorMap = {
        Policy: "#f3c612",
        "R&D": "#0D97B9",
        Technology: "#9c9b9b",
        Workforce: "#7FD858",
        Productivity: "#CB6CE6",
        Marketing: "#54DDFE",
        Unknown: "#4CAF50",
    };


    // Month names used in dropdowns and trend chart.
    const MONTH_NAMES = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];


    // Helper function to convert date string into JavaScript Date object.
    // WHY: Reports need to filter records by year, month, and date range.
    const parseDate = (str) => {
        if (!str) return null;

        const d = new Date(str);

        // If date is invalid, return null.
        return isNaN(d.getTime()) ? null : d;
    };



    // Runs when report page first loads.
    // Logic:
    // 1. Load events/challenges.
    // 2. Load minutes.
    // 3. Stop loading spinner when both finish.
    useEffect(() => {
        Promise.all([loadEvents(), loadMinutes()])
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);


    // Load all meeting/event data from backend.
    // These events contain questions/challenges used in reports.
    const loadEvents = async () => {
        try {
            // Fetch all events from backend.
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/events/all`);
            const data = await res.json();

            console.log("Events API response:", data);


            // If backend returns error, clear events.
            if (!res.ok || data.error) {
                console.error("Error loading events:", data.error || data);
                setEvents([]);
                return;
            }


            // Backend response can come in different formats.
            // This logic safely handles all expected formats.
            if (Array.isArray(data)) {
                setEvents(data);
            } else if (Array.isArray(data.events)) {
                setEvents(data.events);
            } else if (data.data && Array.isArray(data.data)) {
                setEvents(data.data);
            } else {
                console.warn("Unexpected events response format:", data);
                setEvents([]);
            }
        } catch (e) {
            // If API request fails, show error and clear events.
            console.error("Error fetching events:", e);
            setEvents([]);
        }
    };


    // Load all meeting minutes from backend.
    // WHY: Minutes contain attendance data used for participation reports.
    const loadMinutes = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/minutes/`);
            const data = await res.json();

            console.log("Minutes:", data);

            // Save minutes only if backend returns an array.
            setMinutes(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            setMinutes([]);
        }
    };


    // Check logged-in user role.
    // WHY: Member Participation report should be visible only to Administrator or Secretary.
    const isAdministrator = Auth?.getUserLevel() === "Administrator";
    const isSecretary = Auth?.getUserLevel() === "Committee Secretary";


    // Report tabs.
    // Member Participation tab is added only for Administrator or Committee Secretary.
    const reportTabs = [
        {
            label: "Challenges",
            key: "challenges",
        },
        ...(isAdministrator || isSecretary
            ? [
                {
                    label: "Member Participation",
                    key: "memberParticipation",
                },
            ]
            : []),
        {
            label: "Yearly Trend",
            key: "yearlyTrend",
        },
        {
            label: "Yearly Comparison",
            key: "yearlyComparison",
        },
        {
            label: "New",
            key: "new",
        },
    ];


    // Get key of currently active tab.
    const activeTabKey = reportTabs[tabIndex]?.key;
    /** -------------------------
     *  CHALLENGES TAB FILTERS
     *  ------------------------- */

    // Stores how user wants to filter challenges.
    // "month" means filter by selected year and month.
    // "range" means filter by selected start and end date.
    const [challengeMode, setChallengeMode] = useState("month");

    // Stores selected year for challenge report.
    const [selYear, setSelYear] = useState("");

    // Stores selected month.
    // Default is current month.
    const [selMonth, setSelMonth] = useState(new Date().getMonth() + 1);

    // Stores start date for date range filter.
    const [rangeStart, setRangeStart] = useState("");

    // Stores end date for date range filter.
    const [rangeEnd, setRangeEnd] = useState("");


    // Get available years from event dates.
    // useMemo is used so this calculation runs only when events change.
    const challengeYears = useMemo(() => {
        return Array.from(
            new Set(
                events
                    // Convert event date into year.
                    .map((e) => parseDate(e.date)?.getFullYear())

                    // Remove invalid/null years.
                    .filter((y) => y !== null && y !== undefined)
            )
        ).sort((a, b) => b - a); // Sort latest year first.
    }, [events]);


    // Automatically select latest year when years are loaded.
    useEffect(() => {
        if (!selYear && challengeYears.length > 0) setSelYear(challengeYears[0]);
    }, [challengeYears, selYear]);


    // Filter challenges based on selected filter mode.
    const filteredChallenges = useMemo(() => {

        // First filter events by month or date range.
        const filteredEvents = events.filter((event) => {
            const d = parseDate(event.date);

            // Skip event if date is invalid.
            if (!d) return false;


            // Filter by selected year and month.
            if (challengeMode === "month") {
                if (!selYear) return false;

                return (
                    d.getFullYear() === Number(selYear) &&
                    d.getMonth() + 1 === Number(selMonth)
                );
            }


            // Filter by date range.
            if (!rangeStart || !rangeEnd) return false;

            const start = new Date(rangeStart);
            const end = new Date(rangeEnd);

            // Include the full end day until 23:59:59.
            end.setHours(23, 59, 59, 999);

            return d >= start && d <= end;
        });


        // Convert filtered events into flat challenge rows.
        // WHY: One event can have many questions/challenges.
        // Table needs one row per challenge.
        return filteredEvents.flatMap((event) =>
            (event.questions || []).map((q) => ({
                question: q.body ?? "",
                developmentArea: q.dArea ?? "Unknown",
                meetingTitle: event.name ?? "",
                meetingDate: event.date ?? null,
                venue: event.venue ?? "",
                sector: event.sector ?? "",
            }))
        );
    }, [events, challengeMode, selYear, selMonth, rangeStart, rangeEnd]);


    // Prepare chart data for Challenges tab.
    // Chart shows number of challenges by development area.
    const challengeChartData = useMemo(() => {

        // If no challenges found, show No Data.
        if (!filteredChallenges.length) {
            return [["Development Area", "Number", { role: "style" }], ["No Data", 0, "#ccc"]];
        }


        // Count challenges by development area.
        const counts = filteredChallenges.reduce((acc, q) => {
            const area = q.developmentArea || "Unknown";

            acc[area] = (acc[area] || 0) + 1;

            return acc;
        }, {});


        // Convert counts into Google Chart format.
        return [
            ["Development Area", "Number", { role: "style" }],
            ...Object.entries(counts).map(([area, count]) => [
                area,
                count,
                areaColorMap[area] || areaColorMap.Unknown,
            ]),
        ];
    }, [filteredChallenges]);

    //count no of challenges by dev area after filters are applied
    const developmentAreaCounts = useMemo(() => {
        const counts = {};

        filteredChallenges.forEach((challenge) => {
            const area = challenge.developmentArea || "Unknown";
            counts[area] = (counts[area] || 0) + 1;
        });

        return counts;
    }, [filteredChallenges]);

    //Total count of challenges by development area after filters are applied
    const totalChallenges = useMemo(() => filteredChallenges.length, [filteredChallenges]);

    /** -------------------------
     *  YEARLY TREND TAB
     *  ------------------------- */

    // Stores selected year for yearly trend chart.
    const [trendYear, setTrendYear] = useState("");


    // Automatically select latest available year for trend chart.
    useEffect(() => {
        if (!trendYear && challengeYears.length > 0) setTrendYear(challengeYears[0]);
    }, [challengeYears, trendYear]);


    // Get all development areas available in events.
    // WHY: Trend chart needs one column/series per development area.
    const trendAreas = useMemo(() => {
        return Array.from(
            new Set(
                events.flatMap((event) =>
                    (event.questions || []).map((q) => q.dArea || "Unknown")
                )
            )
        );
    }, [events]);


    // Prepare monthly challenge trend data for selected year.
    const trendData = useMemo(() => {

        // If year is not selected, return only header.
        if (!trendYear) return [["Month", ...trendAreas]];


        // First row is chart header.
        const data = [["Month", ...trendAreas]];


        // Loop through 12 months.
        for (let m = 1; m <= 12; m++) {

            // First value in row is month name.
            const row = [MONTH_NAMES[m - 1]];


            // For each development area, count challenges in this month.
            trendAreas.forEach((area) => {
                const total = events.reduce((sum, event) => {
                    const d = parseDate(event.date);


                    // Check if event belongs to selected year and current month.
                    if (
                        d &&
                        d.getFullYear() === Number(trendYear) &&
                        d.getMonth() + 1 === m
                    ) {
                        // Count only questions of selected development area.
                        const count = (event.questions || []).filter(
                            (q) => (q.dArea || "Unknown") === area
                        ).length;


                        return sum + count;
                    }


                    return sum;
                }, 0);


                // Add count to row.
                row.push(total);
            });


            // Add month row to chart data.
            data.push(row);
        }


        return data;
    }, [events, trendYear, trendAreas]);


    // Prepare chart colors for trend chart.
    const trendColors = useMemo(
        () => trendAreas.map((a) => areaColorMap[a] || areaColorMap.Unknown),
        [trendAreas]
    );
    /** -------------------------
     *  YEARLY COMPARISON TAB
     *  ------------------------- */

    // Stores first selected year for comparison.
    const [compYear1, setCompYear1] = useState("");

    // Stores second selected year for comparison.
    const [compYear2, setCompYear2] = useState("");


    // Automatically select default years.
    // Logic:
    // Year 1 = latest year
    // Year 2 = second latest year
    useEffect(() => {

        // Select latest year if empty.
        if (!compYear1 && challengeYears.length > 0) {
            setCompYear1(challengeYears[0]);
        }

        // Select second latest year if available.
        if (!compYear2 && challengeYears.length > 1) {
            setCompYear2(challengeYears[1]);
        }

    }, [challengeYears, compYear1, compYear2]);


    // Get all available development areas.
    // WHY:
    // Comparison chart needs categories such as:
    // Policy, R&D, Technology etc.
    const comparisonAreas = useMemo(() => {
        return Array.from(
            new Set(
                events.flatMap((event) =>
                    (event.questions || []).map((q) => q.dArea || "Unknown")
                )
            )
        );
    }, [events]);


    // Create chart data for comparing two selected years.
    const comparisonData = useMemo(() => {

        // If years are not selected,
        // return only chart header.
        if (!compYear1 || !compYear2) {
            return [["Development Area", "Year 1", "Year 2"]];
        }

        // Chart header:
        // First column = Development Area
        // Next columns = selected years
        const data = [["Development Area", String(compYear1), String(compYear2)]];


        // Loop through each development area.
        comparisonAreas.forEach((area) => {

            // Count challenges for Year 1.
            const year1Count = events.reduce((sum, event) => {

                const d = parseDate(event.date);

                if (d && d.getFullYear() === Number(compYear1)) {

                    return (
                        sum +
                        (event.questions || []).filter(
                            (q) => (q.dArea || "Unknown") === area
                        ).length
                    );
                }

                return sum;
            }, 0);


            // Count challenges for Year 2.
            const year2Count = events.reduce((sum, event) => {

                const d = parseDate(event.date);

                if (d && d.getFullYear() === Number(compYear2)) {

                    return (
                        sum +
                        (event.questions || []).filter(
                            (q) => (q.dArea || "Unknown") === area
                        ).length
                    );
                }

                return sum;
            }, 0);


            // Convert values into numbers before adding.
            // WHY:
            // Chart libraries expect numeric values.
            data.push([
                area,
                Number(year1Count) || 0,
                Number(year2Count) || 0
            ]);
        });

        return data;

    }, [events, comparisonAreas, compYear1, compYear2]);


    // Generate chart colors.
    const comparisonColors = useMemo(
        () => comparisonAreas.map(
            (a) => areaColorMap[a] || areaColorMap.Unknown
        ),
        [comparisonAreas]
    );


    // Check whether chart contains data.
    // WHY:
    // If both years contain 0 challenges,
    // show "No data found" message instead of empty chart.
    const hasComparisonData = useMemo(() => {

        return comparisonData.length > 1 &&
            comparisonData
                .slice(1)
                .some(row =>
                    row.slice(1).some(val => val > 0)
                );

    }, [comparisonData]);


    /** -------------------------
     * MEMBER PARTICIPATION TAB
     * ------------------------- */

    // Stores selected year for participation report.
    const [mpYear, setMpYear] = useState("");

    // Stores selected month.
    // Default = current month.
    const [mpMonth, setMpMonth] = useState(
        new Date().getMonth() + 1
    );

    // Stores year for excused/absent report.
    const [mpExcusedAbsentYear, setMpExcusedAbsentYear] = useState("");


    // Get years available in minutes.
    const minuteYears = useMemo(() => {
        return Array.from(
            new Set(
                minutes
                    .map((m) =>
                        parseDate(m.meeting_date)?.getFullYear()
                    )
                    .filter(Boolean)
            )
        ).sort((a, b) => b - a);

    }, [minutes]);


    // Automatically select latest minute year.
    useEffect(() => {
        if (!mpYear && minuteYears.length > 0)
            setMpYear(minuteYears[0]);

    }, [minuteYears, mpYear]);


    // Automatically select year for absent report.
    useEffect(() => {
        if (!mpExcusedAbsentYear && minuteYears.length > 0)
            setMpExcusedAbsentYear(minuteYears[0]);

    }, [minuteYears, mpExcusedAbsentYear]);


    // Get members who attended meetings.
    const getPresentMembersList = () => {

        // Filter minutes using selected year and month.
        const filteredMinutes = minutes.filter((m) => {

            const d = parseDate(m.meeting_date);

            return (
                d &&
                d.getFullYear() === Number(mpYear) &&
                d.getMonth() + 1 === Number(mpMonth)
            );

        });


        // Map stores unique members.
        const memberMap = new Map();


        filteredMinutes.forEach((m) => {

            // Group members by sector.
            const presentGroups = [
                {
                    sector: "Private",
                    members: m.present_private || []
                },
                {
                    sector: "Public",
                    members: m.present_public || []
                },
                {
                    sector: "Association",
                    members: m.present_association || []
                },
                {
                    sector: "Academic",
                    members: m.present_academic || []
                },
            ];


            // Count member attendance.
            presentGroups.forEach((group) => {

                group.members.forEach((name) => {

                    // First occurrence
                    if (!memberMap.has(name)) {

                        memberMap.set(name, {
                            Name: name,
                            Sector: group.sector,
                            Meetings: 1,
                        });

                    } else {

                        // Increase meeting count
                        const existing = memberMap.get(name);

                        existing.Meetings += 1;

                        memberMap.set(name, existing);
                    }
                });
            });

        });

        return Array.from(memberMap.values());
    };
    // Get yearly excused / absent members list.
    // Purpose:
    // This report helps the administrator identify members
    // who frequently miss meetings.
    const getYearlyExcusedAbsentMembersList = () => {

        // Filter minutes by selected year.
        const filteredMinutes = minutes.filter((m) => {
            const d = parseDate(m.meeting_date);

            return d && d.getFullYear() === Number(mpExcusedAbsentYear);
        });


        // Map is used to store each member only once.
        const memberMap = new Map();


        // Helper function to find member sector.
        // It checks present lists to identify member sector.
        const getMemberSectorFromPresentLists = (m, name) => {
            if ((m.present_private || []).includes(name)) return "Private";
            if ((m.present_public || []).includes(name)) return "Public";
            if ((m.present_academic || []).includes(name)) return "Academic";
            if ((m.present_association || []).includes(name)) return "Association";

            // If sector cannot be found.
            return "N/A";
        };


        // Helper function to create member object if it does not exist.
        const ensureMember = (name, sector = "N/A") => {

            // If member is not already in map, create new record.
            if (!memberMap.has(name)) {
                memberMap.set(name, {
                    "Member Name": name,
                    Sector: sector,
                    "Total Assigned Meetings": 0,
                    Excused: 0,
                    Absent: 0,
                    "Total Missed": 0,
                });
            }

            // Get existing member record.
            const existing = memberMap.get(name);

            // If sector was unknown before and now found, update it.
            if (existing.Sector === "N/A" && sector !== "N/A") {
                existing.Sector = sector;
            }

            return existing;
        };


        // Loop through all filtered minutes.
        filteredMinutes.forEach((m) => {

            // Group present members by sector.
            const presentGroups = [
                {
                    sector: "Private",
                    members: m.present_private || [],
                },
                {
                    sector: "Public",
                    members: m.present_public || [],
                },
                {
                    sector: "Academic",
                    members: m.present_academic || [],
                },
                {
                    sector: "Association",
                    members: m.present_association || [],
                },
            ];


            // 1. Count present members as assigned meetings.
            // WHY:
            // If a member was present, it means they were assigned to that meeting.
            presentGroups.forEach((group) => {
                group.members.forEach((name) => {

                    const existing = ensureMember(name, group.sector);

                    existing["Total Assigned Meetings"] += 1;

                    memberMap.set(name, existing);
                });
            });


            // 2. Count excused members.
            // WHY:
            // Excused means assigned but officially unable to attend.
            (m.excused || []).forEach((name) => {

                const sector = getMemberSectorFromPresentLists(m, name);

                const existing = ensureMember(name, sector);

                existing["Total Assigned Meetings"] += 1;
                existing.Excused += 1;
                existing["Total Missed"] += 1;

                memberMap.set(name, existing);
            });


            // 3. Count absent members.
            // WHY:
            // Absent means assigned but did not attend.
            (m.absent || []).forEach((name) => {

                const sector = getMemberSectorFromPresentLists(m, name);

                const existing = ensureMember(name, sector);

                existing["Total Assigned Meetings"] += 1;
                existing.Absent += 1;
                existing["Total Missed"] += 1;

                memberMap.set(name, existing);
            });
        });


        // Return only members who have at least one excused or absent record.
        // Sort highest missed count first.
        return Array.from(memberMap.values())
            .filter((member) => member.Excused > 0 || member.Absent > 0)
            .sort((a, b) => b["Total Missed"] - a["Total Missed"]);
    };

    /** -------------------------
    * New Tab
    * ------------------------- */
    // Filter meetings in the selected date range.
    // WHY: New tab should show meeting count and meeting list,
    // not challenge count.
    const filteredNewMeetings = useMemo(() => {
        // If From or To date is not selected, return empty list.
        if (!rangeStart || !rangeEnd) return [];

        // Convert selected From date into Date object.
        const start = new Date(rangeStart);

        // Convert selected To date into Date object.
        const end = new Date(rangeEnd);

        // Include the full selected end date until 11:59 PM.
        end.setHours(23, 59, 59, 999);

        // Return only meetings between From and To dates.
        return events.filter((event) => {
            // Convert meeting date into Date object.
            const d = parseDate(event.date);

            // Keep meeting only if date is valid and inside range.
            return d && d >= start && d <= end;
        });
    }, [events, rangeStart, rangeEnd]);



    /** -------------------------
     * PAGINATION
     * ------------------------- */

    // Current page number for challenges table.
    const [page, setPage] = useState(0);

    // Number of rows per page.
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Change page when user clicks pagination.
    const handleChangePage = (_, newPage) => setPage(newPage);

    // Change rows per page.
    const handleChangeRowsPerPage = (event) => {

        // Convert selected value to number.
        setRowsPerPage(+event.target.value);

        // Reset back to first page.
        setPage(0);
    };


    // Show loading spinner while data is loading.
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }


    return (
        <div className="wrapper">

            {/* Sidebar with reports menu active */}
            <SideBar reports={true} />

            <div className="main-panel">

                {/* Top navbar title */}
                <NavbarDashboard
                    title="Reports"
                    subtitle="Strategic insights for informed decision-making"
                />


                <div className="content">
                    <div className="content-inner-wrapper">

                        {/* Report tabs */}
                        <div className="tabs-wrapper mb-3">
                            <Tabs
                                // Current selected tab index.
                                value={tabIndex}

                                // Change selected tab.
                                onChange={(_, i) => setTabIndex(i)}

                                textColor="primary"
                                indicatorColor="primary"
                            >
                                {/* Show available report tabs */}
                                {reportTabs.map((tab) => (
                                    <Tab key={tab.key} label={tab.label} />
                                ))}
                            </Tabs>
                        </div>


                        {/* ------------------ Challenges tab ------------------ */}
                        {activeTabKey === "challenges" && (
                            <div className="tabContainer">

                                {/* Filter section */}
                                <div className="mt-3 d-flex justify-content-between filter-section">

                                    {/* Radio buttons to select filter type */}
                                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="By month"

                                            // Checked if current mode is month.
                                            checked={challengeMode === "month"}

                                            onChange={() => {
                                                setChallengeMode("month");
                                                setPage(0);
                                            }}
                                        />

                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="By date range"

                                            // Checked if current mode is date range.
                                            checked={challengeMode === "range"}

                                            onChange={() => {
                                                setChallengeMode("range");
                                                setPage(0);
                                            }}
                                        />
                                    </div>


                                    {/* Filter input fields */}
                                    <div className="mt-2" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                        {challengeMode === "month" ? (
                                            <>
                                                {/* Year filter */}
                                                <div style={{ width: 200 }} className="width-100">
                                                    <Form.Label>Year</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        value={selYear}
                                                        onChange={(e) => {
                                                            setSelYear(e.target.value);
                                                            setPage(0);
                                                        }}
                                                    >
                                                        {challengeYears.length === 0 ? (
                                                            <option value="">No data</option>
                                                        ) : (
                                                            challengeYears.map((y) => (
                                                                <option key={y} value={y}>{y}</option>
                                                            ))
                                                        )}
                                                    </Form.Control>
                                                </div>


                                                {/* Month filter */}
                                                <div style={{ width: 200 }} className="width-100">
                                                    <Form.Label>Month</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        value={selMonth}
                                                        onChange={(e) => {
                                                            setSelMonth(e.target.value);
                                                            setPage(0);
                                                        }}
                                                    >
                                                        {[...Array(12)].map((_, i) => (
                                                            <option key={i + 1} value={i + 1}>
                                                                {MONTH_NAMES[i]}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </div>
                                            </>
                                        ) : (
                                            <>
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
                                            </>
                                        )}
                                    </div>
                                </div>
                                {/* Chart section */}
                                <AdminCard>
                                    <h4 className="availability-title">
                                        Challenges by Development Area
                                    </h4>

                                    <div style={{ fontSize: 8, display: "flex" }}>
                                        {Object.entries(developmentAreaCounts).map(([area, count]) => (
                                            <div key={area}>
                                                <strong>{area}</strong>: {count}
                                            </div>
                                        ))}
                                    </div>
                                    <h5>Total Challenges: {totalChallenges}</h5>

                                    {/* 
                                     ColumnChart displays challenge count by development area.
                                     challengeChartData is already prepared using filteredChallenges.
                                   */}
                                    <Chart
                                        width="100%"
                                        height="300px"
                                        chartType="ColumnChart"
                                        data={challengeChartData}
                                        options={{
                                            legend: { position: "none" },
                                            hAxis: { title: "Development Area" },
                                            vAxis: { title: "Number of challenges" },
                                        }}
                                    />
                                </AdminCard>


                                {/* Challenges table */}
                                <div className="table-container-wrapper">
                                    <AdminCard>
                                        <TableContainer>
                                            <Table>

                                                {/* Table header */}
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            <b>Challenge</b>
                                                        </TableCell>
                                                        <TableCell>
                                                            <b>Development Area</b>
                                                        </TableCell>
                                                        <TableCell>
                                                            <b>Meeting Date</b>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                {/* Table body */}
                                                <TableBody>
                                                    {filteredChallenges

                                                        // Show only rows for selected page.
                                                        .slice(
                                                            page * rowsPerPage,
                                                            page * rowsPerPage + rowsPerPage
                                                        )

                                                        // Display each challenge row.
                                                        .map((row, idx) => (
                                                            <TableRow key={idx} hover>

                                                                {/* Challenge text */}
                                                                <TableCell>
                                                                    {row.question}
                                                                </TableCell>

                                                                {/* Development area */}
                                                                <TableCell>
                                                                    {row.developmentArea}
                                                                </TableCell>

                                                                {/* Meeting date */}
                                                                <TableCell>
                                                                    {row.meetingDate
                                                                        ? new Date(row.meetingDate).toLocaleDateString()
                                                                        : ""}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>


                                        {/* Pagination for challenge table */}
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10]}
                                            component="div"

                                            // Total number of filtered records.
                                            count={filteredChallenges.length}

                                            // Rows per page.
                                            rowsPerPage={rowsPerPage}

                                            // Current page.
                                            page={page}

                                            // Change page.
                                            onPageChange={handleChangePage}

                                            // Change rows per page.
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />


                                        {/* Export button */}
                                        <div className="mt-2 d-flex justify-content-end">
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    // Prepare rows for CSV.
                                                    const rows = filteredChallenges.map((q) => ({
                                                        Question: q.question || "",
                                                        "Development Area": q.developmentArea || "",
                                                        "Meeting Date": q.meetingDate
                                                            ? new Date(q.meetingDate).toISOString().slice(0, 10)
                                                            : "",
                                                    }));

                                                    // Download challenges report as CSV.
                                                    downloadCsv(
                                                        rows,
                                                        ["Question", "Development Area", "Meeting Date"],
                                                        "challenges.csv"
                                                    );
                                                }}
                                            >
                                                Export
                                            </Button>
                                        </div>
                                    </AdminCard>
                                </div>
                            </div>
                        )}


                        {/* ------------------ Member Participation tab ------------------ */}
                        {(isAdministrator || isSecretary) && activeTabKey === "memberParticipation" && (
                            <div className="tabContainer">

                                {/* Present members report section */}
                                <div>

                                    {/* Year and month filters */}
                                    <div className="mt-3 d-flex filter-section" style={{ gap: 16 }}>

                                        {/* Year dropdown */}
                                        <div style={{ width: 200 }} className="width-100">
                                            <Form.Label>Year</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={mpYear}
                                                onChange={(e) => setMpYear(e.target.value)}
                                            >
                                                {minuteYears.map((y) => (
                                                    <option key={y} value={y}>
                                                        {y}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </div>


                                        {/* Month dropdown */}
                                        <div style={{ width: 200 }} className="width-100">
                                            <Form.Label>Month</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={mpMonth}
                                                onChange={(e) => setMpMonth(e.target.value)}
                                            >
                                                {[...Array(12)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {MONTH_NAMES[i]}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </div>
                                    </div>


                                    {/* Present members table */}
                                    <div className="mt-2">
                                        <AdminCard>
                                            <TableContainer>
                                                <Table>

                                                    {/* Table header */}
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>
                                                                <b>Name</b>
                                                            </TableCell>
                                                            <TableCell>
                                                                <b>Sector</b>
                                                            </TableCell>
                                                            <TableCell>
                                                                <b>No of Meetings Participated</b>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>

                                                    {/* Table body */}
                                                    <TableBody>
                                                        {getPresentMembersList().map((r, idx) => (
                                                            <TableRow key={idx} hover>

                                                                {/* Member name */}
                                                                <TableCell>{r.Name}</TableCell>

                                                                {/* Member sector */}
                                                                <TableCell>{r.Sector}</TableCell>

                                                                {/* Number of meetings participated */}
                                                                <TableCell>{r.Meetings}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>


                                            {/* Export present members report */}
                                            <div
                                                className="mt-2"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "flex-end"
                                                }}
                                            >
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        downloadCsv(
                                                            getPresentMembersList(),
                                                            ["Name", "Sector", "Meetings"],
                                                            "present_members.csv"
                                                        )
                                                    }
                                                >
                                                    Export
                                                </Button>
                                            </div>
                                        </AdminCard>
                                    </div>
                                </div>
                                {/* Frequently Excused / Absent Members section */}
                                <div className="mt-4">

                                    {/* Section heading */}
                                    <div className="w-100 mt-3">
                                        <h4
                                            className="separator_minute"
                                            style={{ color: "rgb(255, 255, 255)" }}
                                        >
                                            <div>
                                                <strong className="section-header">
                                                    Frequently Excused / Absent Members
                                                </strong>
                                            </div>
                                        </h4>
                                    </div>


                                    {/* Year filter for excused/absent report */}
                                    <div className="mt-3 d-flex filter-section" style={{ gap: 16 }}>
                                        <div style={{ width: 200 }} className="width-100">
                                            <Form.Label>Year</Form.Label>

                                            <Form.Control
                                                as="select"
                                                value={mpExcusedAbsentYear}

                                                // Change selected year.
                                                onChange={(e) => setMpExcusedAbsentYear(e.target.value)}
                                            >
                                                {minuteYears.length === 0 ? (
                                                    <option value="">No data</option>
                                                ) : (
                                                    minuteYears.map((y) => (
                                                        <option key={y} value={y}>
                                                            {y}
                                                        </option>
                                                    ))
                                                )}
                                            </Form.Control>
                                        </div>
                                    </div>


                                    {/* Excused / Absent table */}
                                    <div className="mt-2">
                                        <AdminCard>
                                            <TableContainer>
                                                <Table>

                                                    {/* Table header */}
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>
                                                                <b>Name</b>
                                                            </TableCell>

                                                            {/* Sector column is commented in your code */}
                                                            {/* <TableCell><b>Sector</b></TableCell> */}

                                                            <TableCell>
                                                                <b>Total Meetings</b>
                                                            </TableCell>

                                                            <TableCell>
                                                                <b>Excused</b>
                                                            </TableCell>

                                                            <TableCell>
                                                                <b>Absent</b>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>


                                                    {/* Table body */}
                                                    <TableBody>
                                                        {getYearlyExcusedAbsentMembersList().length === 0 ? (
                                                            // If no records exist for selected year.
                                                            <TableRow>
                                                                <TableCell colSpan={5} align="center">
                                                                    No records found for selected year
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            // Display each member with excused/absent count.
                                                            getYearlyExcusedAbsentMembersList().map((r, idx) => (
                                                                <TableRow key={idx} hover>

                                                                    {/* Member name */}
                                                                    <TableCell>
                                                                        {r["Member Name"]}
                                                                    </TableCell>

                                                                    {/* Sector column is commented in your code */}
                                                                    {/* <TableCell>{r.Sector}</TableCell> */}

                                                                    {/* Total meetings assigned */}
                                                                    <TableCell>
                                                                        {r["Total Assigned Meetings"]}
                                                                    </TableCell>

                                                                    {/* Excused count */}
                                                                    <TableCell>
                                                                        {r.Excused}
                                                                    </TableCell>

                                                                    {/* Absent count */}
                                                                    <TableCell>
                                                                        {r.Absent}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>


                                            {/* Export excused/absent report */}
                                            <div
                                                className="mt-2"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "flex-end"
                                                }}
                                            >
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        downloadCsv(
                                                            getYearlyExcusedAbsentMembersList(),
                                                            [
                                                                "Member Name",
                                                                "Sector",
                                                                "Total Meetings",
                                                                "Present",
                                                                "Excused",
                                                                "Absent",
                                                            ],
                                                            `frequently_excused_absent_members_${mpExcusedAbsentYear}.csv`
                                                        )
                                                    }
                                                >
                                                    Export
                                                </Button>
                                            </div>
                                        </AdminCard>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* ------------------ Yearly Trend tab ------------------ */}
                        {activeTabKey === "yearlyTrend" && (
                            <div className="tabContainer">

                                {/* Year filter */}
                                <div className="mt-3 d-flex filter-section" style={{ gap: 16 }}>
                                    <div style={{ width: 260 }} className="width-100">
                                        <Form.Label>Year</Form.Label>

                                        <Form.Control
                                            as="select"
                                            value={trendYear}

                                            // Change selected trend year.
                                            onChange={(e) => setTrendYear(e.target.value)}
                                        >
                                            {challengeYears.length === 0 ? (
                                                <option value="">No data</option>
                                            ) : (
                                                challengeYears.map((y) => (
                                                    <option key={y} value={y}>
                                                        {y}
                                                    </option>
                                                ))
                                            )}
                                        </Form.Control>
                                    </div>
                                </div>


                                {/* Trend chart */}
                                <div className="mt-4">
                                    <AdminCard>
                                        <Chart
                                            width="100%"
                                            height="400px"
                                            chartType="ColumnChart"

                                            // trendData contains monthly challenge counts.
                                            data={trendData}

                                            options={{
                                                // Stacked chart shows all areas in same monthly bar.
                                                isStacked: true,
                                                legend: { position: "top" },
                                                hAxis: { title: "Month" },
                                                vAxis: { title: "Number of challenges" },
                                                colors: trendColors,
                                            }}
                                        />
                                    </AdminCard>
                                </div>
                            </div>
                        )}


                        {/* ------------------ Yearly Comparison tab ------------------ */}
                        {activeTabKey === "yearlyComparison" && (
                            <div className="tabContainer">

                                {/* Year selection filters */}
                                <div className="mt-3 d-flex filter-section" style={{ gap: 16 }}>

                                    {/* First year dropdown */}
                                    <div style={{ width: 200 }} className="width-100">
                                        <Form.Label>Year 1</Form.Label>

                                        <Form.Control
                                            as="select"
                                            value={compYear1}

                                            // Change first comparison year.
                                            onChange={(e) => setCompYear1(e.target.value)}
                                        >
                                            {challengeYears.length === 0 ? (
                                                <option value="">No data</option>
                                            ) : (
                                                challengeYears.map((y) => (
                                                    <option key={y} value={y}>
                                                        {y}
                                                    </option>
                                                ))
                                            )}
                                        </Form.Control>
                                    </div>


                                    {/* Second year dropdown */}
                                    <div style={{ width: 200 }} className="width-100">
                                        <Form.Label>Year 2</Form.Label>

                                        <Form.Control
                                            as="select"
                                            value={compYear2}

                                            // Change second comparison year.
                                            onChange={(e) => setCompYear2(e.target.value)}
                                        >
                                            {challengeYears.length === 0 ? (
                                                <option value="">No data</option>
                                            ) : (
                                                challengeYears.map((y) => (
                                                    <option key={y} value={y}>
                                                        {y}
                                                    </option>
                                                ))
                                            )}
                                        </Form.Control>
                                    </div>
                                </div>


                                {/* Comparison chart section */}
                                <div className="mt-4">
                                    <AdminCard>
                                        {!compYear1 || !compYear2 ? (
                                            // If both years are not selected.
                                            <div style={{ textAlign: "center", padding: "40px" }}>
                                                <p>Please select both years to view comparison</p>
                                            </div>
                                        ) : !hasComparisonData ? (
                                            // If selected years have no challenge data.
                                            <div style={{ textAlign: "center", padding: "40px" }}>
                                                <p>No challenges found for the selected years</p>
                                            </div>
                                        ) : (
                                            // Show comparison chart.
                                            <Chart
                                                width="100%"
                                                height="400px"
                                                chartType="ColumnChart"

                                                // comparisonData compares selected two years.
                                                data={comparisonData}

                                                options={{
                                                    legend: { position: "top" },
                                                    hAxis: { title: "Development Area" },
                                                    vAxis: { title: "Number of challenges" },
                                                }}
                                            />
                                        )}
                                    </AdminCard>
                                </div>
                            </div>
                        )}

                        {/* ------------------ New tab ------------------ */}
                        {activeTabKey === "new" && (
                            <div className="tabContainer">

                                {/* Filter section */}
                                <div className="mt-3 d-flex justify-content-between filter-section">




                                    {/* Filter input fields */}
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
                                </div>
                                {/* Chart section */}
                                <AdminCard>
                                    <h4 className="availability-title">
                                        Total Meetings
                                    </h4>

                                    <h2>Count: {filteredNewMeetings.length}</h2>


                                    {/* Meetings table */}
                                    <div className="table-container-wrapper">

                                        <TableContainer>
                                            <Table>

                                                {/* Table header */}
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            <b>Meeting Name</b>
                                                        </TableCell>
                                                        <TableCell>
                                                            <b>Meeting Date</b>
                                                        </TableCell>
                                                        <TableCell>
                                                            <b>Meeting Time</b>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                {/* Table body */}
                                                <TableBody>
                                                    {filteredNewMeetings.length === 0 ? (
                                                        // Show message when no meetings are found.
                                                        <TableRow>
                                                            <TableCell colSpan={5} align="center">
                                                                No meetings found for selected date range
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        // Show only meetings for current pagination page.
                                                        filteredNewMeetings
                                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                            .map((meeting, idx) => (
                                                                <TableRow key={idx} hover>
                                                                    {/* Meeting name */}
                                                                    <TableCell>{meeting.name || ""}</TableCell>

                                                                    {/* Meeting date */}
                                                                    <TableCell>
                                                                        {meeting.date
                                                                            ? new Date(meeting.date).toLocaleDateString()
                                                                            : ""}
                                                                    </TableCell>

                                                                    {/* Meeting time */}
                                                                    <TableCell>{meeting.time || ""}</TableCell>

                                                                </TableRow>
                                                            ))
                                                    )}
                                                </TableBody>


                                            </Table>
                                        </TableContainer>


                                        {/* Pagination for challenge table */}
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10]}
                                            component="div"

                                            // Total number of filtered records.
                                            count={filteredChallenges.length}

                                            // Rows per page.
                                            rowsPerPage={rowsPerPage}

                                            // Current page.
                                            page={page}

                                            // Change page.
                                            onPageChange={handleChangePage}

                                            // Change rows per page.
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />


                                        {/* Export button */}
                                        <div className="mt-2 d-flex justify-content-end">
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    // Prepare rows for CSV.
                                                    const rows = filteredChallenges.map((q) => ({
                                                        Question: q.question || "",
                                                        "Development Area": q.developmentArea || "",
                                                        "Meeting Date": q.meetingDate
                                                            ? new Date(q.meetingDate).toISOString().slice(0, 10)
                                                            : "",
                                                    }));

                                                    // Download challenges report as CSV.
                                                    downloadCsv(
                                                        rows,
                                                        ["Question", "Development Area", "Meeting Date"],
                                                        "challenges.csv"
                                                    );
                                                }}
                                            >
                                                Export
                                            </Button>
                                        </div>

                                    </div>

                                </AdminCard>



                            </div>
                        )}

                        {/* Footer */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}


// Old MongoDB aggregation query example.
// This is commented and not executed.
// It may have been used to prepare challenge report data directly from database.
// [
//   {
//     $match: {
//       status: "submitted"
//     }
//   },
//   {
//     $unwind: {
//       path: "$questions"
//     }
//   },
//   {
//     $project: {
//       _id: 0,
//       question: "$questions.body",
//       developmentArea: "$questions.dArea"
//     }
//   }
// ]


