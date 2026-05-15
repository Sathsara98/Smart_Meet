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

// helper for CSV export
const downloadCsv = (rows, headers, filename) => {
    const csvContent = [
        headers.join(","),
        ...rows.map((r) => headers.map((h) => r[h] ?? "").join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

export default function Reports() {
    const [tabIndex, setTabIndex] = useState(0);
    const [events, setEvents] = useState([]); // flattened submitted questions
    const [minutes, setMinutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [questions, setQuestions] = useState([]); // all questions (for trend/comparison tabs)

    // color map for development areas
    const areaColorMap = {
        Policy: "#f3c612",
        "R&D": "#0D97B9",
        Technology: "#9c9b9b",
        Workforce: "#7FD858",
        Productivity: "#CB6CE6",
        Marketing: "#54DDFE",
        Unknown: "#4CAF50",
    };

    const MONTH_NAMES = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const parseDate = (str) => {
        if (!str) return null;
        const d = new Date(str);
        return isNaN(d.getTime()) ? null : d;
    };

    useEffect(() => {
        Promise.all([loadEvents(), loadMinutes()])
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const loadEvents = async () => {
        try {
            // Change from /admin/events/ to /events/
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/events/all`);
            const data = await res.json();
            console.log("Events API response:", data);

            // Check if response is an error
            if (!res.ok || data.error) {
                console.error("Error loading events:", data.error || data);
                setEvents([]);
                return;
            }

            // Handle different response formats
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
            console.error("Error fetching events:", e);
            setEvents([]);
        }
    };
    const loadMinutes = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/minutes/`);
            const data = await res.json();
            console.log("Minutes:", data);
            setMinutes(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            setMinutes([]);
        }
    };

    const isAdministrator = Auth?.getUserLevel() === "Administrator";
    const isSecretary = Auth?.getUserLevel() === "Committee Secretary";


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
    ];


    const activeTabKey = reportTabs[tabIndex]?.key;





    /** -------------------------
     *  CHALLENGES TAB FILTERS
     *  ------------------------- */
    const [challengeMode, setChallengeMode] = useState("month"); // "month" | "range"
    const [selYear, setSelYear] = useState("");
    const [selMonth, setSelMonth] = useState(new Date().getMonth() + 1);
    const [rangeStart, setRangeStart] = useState("");
    const [rangeEnd, setRangeEnd] = useState("");

    const challengeYears = useMemo(() => {
        return Array.from(
            new Set(
                events
                    .map((e) => parseDate(e.date)?.getFullYear())
                    .filter((y) => y !== null && y !== undefined)
            )
        ).sort((a, b) => b - a);
    }, [events]);

    useEffect(() => {
        if (!selYear && challengeYears.length > 0) setSelYear(challengeYears[0]);
    }, [challengeYears, selYear]);

    const filteredChallenges = useMemo(() => {
        const filteredEvents = events.filter((event) => {
            const d = parseDate(event.date);
            if (!d) return false;

            if (challengeMode === "month") {
                if (!selYear) return false;
                return (
                    d.getFullYear() === Number(selYear) &&
                    d.getMonth() + 1 === Number(selMonth)
                );
            }

            // range
            if (!rangeStart || !rangeEnd) return false;
            const start = new Date(rangeStart);
            const end = new Date(rangeEnd);
            end.setHours(23, 59, 59, 999);

            return d >= start && d <= end;
        });

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



    // Chart data for Challenges tab (counts by developmentArea)
    const challengeChartData = useMemo(() => {
        if (!filteredChallenges.length) {
            return [["Development Area", "Number", { role: "style" }], ["No Data", 0, "#ccc"]];
        }

        const counts = filteredChallenges.reduce((acc, q) => {
            const area = q.developmentArea || "Unknown";
            acc[area] = (acc[area] || 0) + 1;
            return acc;
        }, {});

        return [
            ["Development Area", "Number", { role: "style" }],
            ...Object.entries(counts).map(([area, count]) => [
                area,
                count,
                areaColorMap[area] || areaColorMap.Unknown,
            ]),
        ];
    }, [filteredChallenges]);

    /** -------------------------
     *  YEARLY TREND TAB
     *  ------------------------- */
    const [trendYear, setTrendYear] = useState("");

    useEffect(() => {
        if (!trendYear && challengeYears.length > 0) setTrendYear(challengeYears[0]);
    }, [challengeYears, trendYear]);

    const trendAreas = useMemo(() => {
        return Array.from(
            new Set(
                events.flatMap((event) =>
                    (event.questions || []).map((q) => q.dArea || "Unknown")
                )
            )
        );
    }, [events]);



    const trendData = useMemo(() => {
        if (!trendYear) return [["Month", ...trendAreas]];

        const data = [["Month", ...trendAreas]];

        for (let m = 1; m <= 12; m++) {
            const row = [MONTH_NAMES[m - 1]];

            trendAreas.forEach((area) => {
                const total = events.reduce((sum, event) => {
                    const d = parseDate(event.date);

                    if (
                        d &&
                        d.getFullYear() === Number(trendYear) &&
                        d.getMonth() + 1 === m
                    ) {
                        const count = (event.questions || []).filter(
                            (q) => (q.dArea || "Unknown") === area
                        ).length;

                        return sum + count;
                    }

                    return sum;
                }, 0);

                row.push(total);
            });

            data.push(row);
        }

        return data;
    }, [events, trendYear, trendAreas]);




    const trendColors = useMemo(
        () => trendAreas.map((a) => areaColorMap[a] || areaColorMap.Unknown),
        [trendAreas]
    );

    /** -------------------------
     *  YEARLY COMPARISON TAB
     *  ------------------------- */
    const [compYear1, setCompYear1] = useState("");
    const [compYear2, setCompYear2] = useState("");

    useEffect(() => {
        if (!compYear1 && challengeYears.length > 0) {
            setCompYear1(challengeYears[0]);
        }

        if (!compYear2 && challengeYears.length > 1) {
            setCompYear2(challengeYears[1]);
        }
    }, [challengeYears, compYear1, compYear2]);




    const comparisonAreas = useMemo(() => {
        return Array.from(
            new Set(
                events.flatMap((event) =>
                    (event.questions || []).map((q) => q.dArea || "Unknown")
                )
            )
        );
    }, [events]);




    const comparisonData = useMemo(() => {
        if (!compYear1 || !compYear2) {
            return [["Development Area", "Year 1", "Year 2"]];
        }

        const data = [["Development Area", String(compYear1), String(compYear2)]];

        comparisonAreas.forEach((area) => {
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

            // 🔥 IMPORTANT: ensure numbers
            data.push([
                area,
                Number(year1Count) || 0,
                Number(year2Count) || 0
            ]);
        });

        return data;
    }, [events, comparisonAreas, compYear1, compYear2]);






    const comparisonColors = useMemo(
        () => comparisonAreas.map((a) => areaColorMap[a] || areaColorMap.Unknown),
        [comparisonAreas]
    );

    const hasComparisonData = useMemo(() => {
        return comparisonData.length > 1 &&
            comparisonData.slice(1).some(row => row.slice(1).some(val => val > 0));
    }, [comparisonData]);




    /** -------------------------
     *  MEMBER PARTICIPATION TAB (unchanged)
     *  ------------------------- */
    const [mpYear, setMpYear] = useState("");
    const [mpMonth, setMpMonth] = useState(new Date().getMonth() + 1);
    const [mpExcusedAbsentYear, setMpExcusedAbsentYear] = useState("");

    const minuteYears = useMemo(() => {
        return Array.from(
            new Set(
                minutes
                    .map((m) => parseDate(m.meeting_date)?.getFullYear())
                    .filter(Boolean)
            )
        ).sort((a, b) => b - a);
    }, [minutes]);

    useEffect(() => {
        if (!mpYear && minuteYears.length > 0) setMpYear(minuteYears[0]);
    }, [minuteYears, mpYear]);

    useEffect(() => {
        if (!mpExcusedAbsentYear && minuteYears.length > 0) setMpExcusedAbsentYear(minuteYears[0]);
    }, [minuteYears, mpExcusedAbsentYear]);

    const getPresentMembersList = () => {
        const filteredMinutes = minutes.filter((m) => {
            const d = parseDate(m.meeting_date);
            return (
                d &&
                d.getFullYear() === Number(mpYear) &&
                d.getMonth() + 1 === Number(mpMonth)
            );
        });

        const memberMap = new Map();

        filteredMinutes.forEach((m) => {
            const presentGroups = [
                { sector: "Private", members: m.present_private || [] },
                { sector: "Public", members: m.present_public || [] },
                { sector: "Association", members: m.present_association || [] },
                { sector: "Academic", members: m.present_academic || [] },
            ];

            presentGroups.forEach((group) => {
                group.members.forEach((name) => {
                    if (!memberMap.has(name)) {
                        memberMap.set(name, {
                            Name: name,
                            Sector: group.sector,
                            Meetings: 1,
                        });
                    } else {
                        const existing = memberMap.get(name);
                        existing.Meetings += 1;
                        memberMap.set(name, existing);
                    }
                });
            });
        });

        return Array.from(memberMap.values());
    };


    const getYearlyExcusedAbsentMembersList = () => {
        const filteredMinutes = minutes.filter((m) => {
            const d = parseDate(m.meeting_date);
            return d && d.getFullYear() === Number(mpExcusedAbsentYear);
        });

        const memberMap = new Map();

        const getMemberSectorFromPresentLists = (m, name) => {
            if ((m.present_private || []).includes(name)) return "Private";
            if ((m.present_public || []).includes(name)) return "Public";
            if ((m.present_academic || []).includes(name)) return "Academic";
            if ((m.present_association || []).includes(name)) return "Association";
            return "N/A";
        };

        const ensureMember = (name, sector = "N/A") => {
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

            const existing = memberMap.get(name);

            if (existing.Sector === "N/A" && sector !== "N/A") {
                existing.Sector = sector;
            }

            return existing;
        };

        filteredMinutes.forEach((m) => {
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

            // 1. Count present members as assigned meetings
            presentGroups.forEach((group) => {
                group.members.forEach((name) => {
                    const existing = ensureMember(name, group.sector);
                    existing["Total Assigned Meetings"] += 1;
                    memberMap.set(name, existing);
                });
            });

            // 2. Count excused members as assigned meetings + excused
            (m.excused || []).forEach((name) => {
                const sector = getMemberSectorFromPresentLists(m, name);
                const existing = ensureMember(name, sector);

                existing["Total Assigned Meetings"] += 1;
                existing.Excused += 1;
                existing["Total Missed"] += 1;

                memberMap.set(name, existing);
            });

            // 3. Count absent members as assigned meetings + absent
            (m.absent || []).forEach((name) => {
                const sector = getMemberSectorFromPresentLists(m, name);
                const existing = ensureMember(name, sector);

                existing["Total Assigned Meetings"] += 1;
                existing.Absent += 1;
                existing["Total Missed"] += 1;

                memberMap.set(name, existing);
            });
        });

        // Show only members who have at least one excused or absent record
        return Array.from(memberMap.values())
            .filter((member) => member.Excused > 0 || member.Absent > 0)
            .sort((a, b) => b["Total Missed"] - a["Total Missed"]);
    };





    /** -------------------------
     *  PAGINATION (Challenges tab table)
     *  ------------------------- */
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="wrapper">
            <SideBar reports={true} />
            <div className="main-panel">
                <NavbarDashboard
                    title="Reports"
                    subtitle="Strategic insights for informed decision-making"
                />

                <div className="content">
                    <div className="content-inner-wrapper">
                        <div className="tabs-wrapper mb-3">
                            <Tabs
                                value={tabIndex}
                                onChange={(_, i) => setTabIndex(i)}
                                textColor="primary"
                                indicatorColor="primary"
                            >
                                {reportTabs.map((tab) => (
                                    <Tab key={tab.key} label={tab.label} />
                                ))}
                            </Tabs>




                        </div>

                        {/* ------------------ Challenges tab ------------------ */}
                        {activeTabKey === "challenges" && (
                            <div className="tabContainer">
                                {/* Filters */}
                                <div className="mt-3 d-flex justify-content-between filter-section">
                                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="By month"
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
                                            checked={challengeMode === "range"}
                                            onChange={() => {
                                                setChallengeMode("range");
                                                setPage(0);
                                            }}
                                        />
                                    </div>

                                    <div className="mt-2" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                        {challengeMode === "month" ? (
                                            <>
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
                                                            <option key={i + 1} value={i + 1}>{MONTH_NAMES[i]}</option>
                                                        ))}
                                                    </Form.Control>
                                                </div>
                                            </>
                                        ) : (
                                            <>
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

                                {/* Chart */}
                                <AdminCard>
                                    <h4 className="availability-title">Challenges by Development Area</h4>
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

                                {/* Table */}
                                <div className="table-container-wrapper">
                                    <AdminCard>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><b>Challenge</b></TableCell>
                                                        <TableCell><b>Development Area</b></TableCell>
                                                        <TableCell><b>Meeting Date</b></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {filteredChallenges
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row, idx) => (
                                                            <TableRow key={idx} hover>
                                                                <TableCell>{row.question}</TableCell>
                                                                <TableCell>{row.developmentArea}</TableCell>
                                                                <TableCell>
                                                                    {row.meetingDate ? new Date(row.meetingDate).toLocaleDateString() : ""}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        <TablePagination
                                            rowsPerPageOptions={[5, 10]}
                                            component="div"
                                            count={filteredChallenges.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />

                                        <div className="mt-2 d-flex justify-content-end">
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    const rows = filteredChallenges.map((q) => ({
                                                        Question: q.question || "",
                                                        "Development Area": q.developmentArea || "",
                                                        "Meeting Date": q.meetingDate
                                                            ? new Date(q.meetingDate).toISOString().slice(0, 10)
                                                            : "",
                                                    }));
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
                                <div>
                                    <div className="mt-3 d-flex filter-section" style={{ gap: 16 }}>
                                        <div style={{ width: 200 }} className="width-100">
                                            <Form.Label>Year</Form.Label>
                                            <Form.Control as="select" value={mpYear} onChange={(e) => setMpYear(e.target.value)}>
                                                {minuteYears.map((y) => (
                                                    <option key={y} value={y}>{y}</option>
                                                ))}
                                            </Form.Control>
                                        </div>

                                        <div style={{ width: 200 }} className="width-100">
                                            <Form.Label>Month</Form.Label>
                                            <Form.Control as="select" value={mpMonth} onChange={(e) => setMpMonth(e.target.value)}>
                                                {[...Array(12)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>{MONTH_NAMES[i]}</option>
                                                ))}
                                            </Form.Control>
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        <AdminCard>
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell><b>Name</b></TableCell>
                                                            <TableCell><b>Sector</b></TableCell>
                                                            <TableCell><b>No of Meetings Participated</b></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {getPresentMembersList().map((r, idx) => (
                                                            <TableRow key={idx} hover>
                                                                <TableCell>{r.Name}</TableCell>
                                                                <TableCell>{r.Sector}</TableCell>
                                                                <TableCell>{r.Meetings}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>

                                            <div className="mt-2" style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <Button
                                                    size="sm"
                                                    onClick={() => downloadCsv(getPresentMembersList(), ["Name", "Sector", "Meetings"], "present_members.csv")}
                                                >
                                                    Export
                                                </Button>
                                            </div>
                                        </AdminCard>
                                    </div>
                                </div>

                                <div className="mt-4">
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


                                    <div className="mt-3 d-flex filter-section" style={{ gap: 16 }}>
                                        <div style={{ width: 200 }} className="width-100">
                                            <Form.Label>Year</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={mpExcusedAbsentYear}
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


                                    <div className="mt-2">
                                        <AdminCard>
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell><b>Name</b></TableCell>
                                                            {/* <TableCell><b>Sector</b></TableCell> */}
                                                            <TableCell><b>Total Meetings</b></TableCell>

                                                            <TableCell><b>Excused</b></TableCell>
                                                            <TableCell><b>Absent</b></TableCell>
                                                        </TableRow>
                                                    </TableHead>


                                                    <TableBody>
                                                        {getYearlyExcusedAbsentMembersList().length === 0 ? (
                                                            <TableRow>
                                                                <TableCell colSpan={5} align="center">
                                                                    No records found for selected year
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            getYearlyExcusedAbsentMembersList().map((r, idx) => (
                                                                <TableRow key={idx} hover>
                                                                    <TableCell>{r["Member Name"]}</TableCell>
                                                                    {/* <TableCell>{r.Sector}</TableCell> */}
                                                                    <TableCell>{r["Total Assigned Meetings"]}</TableCell>

                                                                    <TableCell>{r.Excused}</TableCell>
                                                                    <TableCell>{r.Absent}</TableCell>
                                                                </TableRow>


                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>


                                            <div
                                                className="mt-2"
                                                style={{ display: "flex", justifyContent: "flex-end" }}
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
                                <div className="mt-3 d-flex filter-section" style={{ gap: 16 }}>
                                    <div style={{ width: 260 }} className="width-100">
                                        <Form.Label>Year</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={trendYear}
                                            onChange={(e) => setTrendYear(e.target.value)}
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
                                </div>

                                <div className="mt-4">
                                    <AdminCard>
                                        <Chart
                                            width="100%"
                                            height="400px"
                                            chartType="ColumnChart"
                                            data={trendData}
                                            options={{
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
                                <div className="mt-3 d-flex filter-section" style={{ gap: 16 }}>
                                    <div style={{ width: 200 }} className="width-100">
                                        <Form.Label>Year 1</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={compYear1}
                                            onChange={(e) => setCompYear1(e.target.value)}
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

                                    <div style={{ width: 200 }} className="width-100">
                                        <Form.Label>Year 2</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={compYear2}
                                            onChange={(e) => setCompYear2(e.target.value)}
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
                                </div>




                                <div className="mt-4">
                                    <AdminCard>
                                        {!compYear1 || !compYear2 ? (
                                            <div style={{ textAlign: "center", padding: "40px" }}>
                                                <p>Please select both years to view comparison</p>
                                            </div>
                                        ) : !hasComparisonData ? (
                                            <div style={{ textAlign: "center", padding: "40px" }}>
                                                <p>No challenges found for the selected years</p>
                                            </div>
                                        ) : (
                                            <Chart
                                                width="100%"
                                                height="400px"
                                                chartType="ColumnChart"
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

                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}

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