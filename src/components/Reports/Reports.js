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
    const [questions, setQuestions] = useState([]); // flattened submitted questions
    const [minutes, setMinutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const parseDate = (str) => (str ? new Date(str) : null);

    useEffect(() => {
        Promise.all([loadSubmittedQuestions(), loadMinutes()])
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const loadSubmittedQuestions = async () => {
        const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/questions/submitted-questions`
        );
        const data = await res.json();

        // API returns: [{question, developmentArea, submissionDate}]
        const rows = Array.isArray(data)
            ? data.map((q) => ({
                question: q.question ?? "",
                developmentArea: q.developmentArea ?? "Unknown",
                submissionDate: q.submissionDate ?? null,
            }))
            : [];

        setQuestions(rows);
        console.log("Submitted questions:", rows);
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
                questions
                    .map((q) => parseDate(q.submissionDate)?.getFullYear())
                    .filter(Boolean)
            )
        ).sort((a, b) => b - a);
    }, [questions]);

    useEffect(() => {
        if (!selYear && challengeYears.length > 0) setSelYear(challengeYears[0]);
    }, [challengeYears, selYear]);

    const filteredChallenges = useMemo(() => {
        return questions.filter((q) => {
            const d = parseDate(q.submissionDate);
            if (!d) return false;

            if (challengeMode === "month") {
                if (!selYear) return false;
                return d.getFullYear() === Number(selYear) && d.getMonth() + 1 === Number(selMonth);
            }

            // range
            if (!rangeStart || !rangeEnd) return false;
            const start = new Date(rangeStart);
            const end = new Date(rangeEnd);
            // include whole end day
            end.setHours(23, 59, 59, 999);
            return d >= start && d <= end;
        });
    }, [questions, challengeMode, selYear, selMonth, rangeStart, rangeEnd]);

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
        return Array.from(new Set(questions.map((q) => q.developmentArea || "Unknown")));
    }, [questions]);

    const trendData = useMemo(() => {
        if (!trendYear) return [["Month", ...trendAreas]];

        const data = [["Month", ...trendAreas]];
        for (let m = 1; m <= 12; m++) {
            const row = [MONTH_NAMES[m - 1]];
            trendAreas.forEach((area) => {
                const total = questions.filter((q) => {
                    const d = parseDate(q.submissionDate);
                    return (
                        d &&
                        d.getFullYear() === Number(trendYear) &&
                        d.getMonth() + 1 === m &&
                        (q.developmentArea || "Unknown") === area
                    );
                }).length;
                row.push(total);
            });
            data.push(row);
        }
        return data;
    }, [questions, trendYear, trendAreas]);

    const trendColors = useMemo(
        () => trendAreas.map((a) => areaColorMap[a] || areaColorMap.Unknown),
        [trendAreas]
    );

    /** -------------------------
     *  YEARLY COMPARISON TAB
     *  ------------------------- */
    const [compStart, setCompStart] = useState("");
    const [compEnd, setCompEnd] = useState("");

    const comparisonAreas = useMemo(() => {
        return Array.from(new Set(questions.map((q) => q.developmentArea || "Unknown")));
    }, [questions]);

    const comparisonData = useMemo(() => {
        if (!compStart || !compEnd) return [["Year", ...comparisonAreas]];

        const start = new Date(compStart);
        const end = new Date(compEnd);
        end.setHours(23, 59, 59, 999);

        const years = Array.from(
            new Set(
                questions
                    .map((q) => parseDate(q.submissionDate))
                    .filter((d) => d && d >= start && d <= end)
                    .map((d) => d.getFullYear())
            )
        ).sort((a, b) => a - b);

        const data = [["Year", ...comparisonAreas]];
        years.forEach((yr) => {
            const row = [yr];
            comparisonAreas.forEach((area) => {
                const total = questions.filter((q) => {
                    const d = parseDate(q.submissionDate);
                    return (
                        d &&
                        d.getFullYear() === yr &&
                        d >= start &&
                        d <= end &&
                        (q.developmentArea || "Unknown") === area
                    );
                }).length;
                row.push(total);
            });
            data.push(row);
        });

        return data;
    }, [questions, compStart, compEnd, comparisonAreas]);

    const comparisonColors = useMemo(
        () => comparisonAreas.map((a) => areaColorMap[a] || areaColorMap.Unknown),
        [comparisonAreas]
    );

    /** -------------------------
     *  MEMBER PARTICIPATION TAB (unchanged)
     *  ------------------------- */
    const [mpYear, setMpYear] = useState("");
    const [mpMonth, setMpMonth] = useState(new Date().getMonth() + 1);

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

    const getAbsentList = () => {
        const filtered = minutes.filter((m) => {
            const d = parseDate(m.meeting_date);
            return d && d.getFullYear() === Number(mpYear) && d.getMonth() + 1 === Number(mpMonth);
        });

        const rows = [];
        filtered.forEach((m) => {
            if (Array.isArray(m.absent)) {
                m.absent.forEach((a) => {
                    if (typeof a === "string") rows.push({ Name: a, Sector: "" });
                    else if (a && typeof a === "object")
                        rows.push({ Name: a.name || "", Sector: a.sector || "" });
                });
            }
        });
        return rows;
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
                                <Tab label="Challenges" />
                                <Tab label="Member Participation" />
                                <Tab label="Yearly Trend" />
                                <Tab label="Yearly Comparison" />
                            </Tabs>
                        </div>

                        {/* ------------------ Challenges tab ------------------ */}
                        {tabIndex === 0 && (
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
                                                <div style={{ width: 200 }}>
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

                                                <div style={{ width: 200 }}>
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
                                                <div style={{ width: 200 }}>
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

                                                <div style={{ width: 200 }}>
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
                                            vAxis: { title: "Number of questions" },
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
                                                        <TableCell><b>Question</b></TableCell>
                                                        <TableCell><b>Development Area</b></TableCell>
                                                        <TableCell><b>Submitted Date</b></TableCell>
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
                                                                    {row.submissionDate ? new Date(row.submissionDate).toLocaleDateString() : ""}
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
                                                        "Submitted Date": q.submissionDate
                                                            ? new Date(q.submissionDate).toISOString().slice(0, 10)
                                                            : "",
                                                    }));
                                                    downloadCsv(
                                                        rows,
                                                        ["Question", "Development Area", "Submitted Date"],
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
                        {tabIndex === 1 && (
                            <div className="tabContainer">
                                <div className="mt-3 d-flex filter-section" style={{ gap: 16 }}>
                                    <div style={{ width: 200 }}>
                                        <Form.Label>Year</Form.Label>
                                        <Form.Control as="select" value={mpYear} onChange={(e) => setMpYear(e.target.value)}>
                                            {minuteYears.map((y) => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </Form.Control>
                                    </div>

                                    <div style={{ width: 200 }}>
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
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {getAbsentList().map((r, idx) => (
                                                        <TableRow key={idx} hover>
                                                            <TableCell>{r.Name}</TableCell>
                                                            <TableCell>{r.Sector}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        <div className="mt-2" style={{ display: "flex", justifyContent: "flex-end" }}>
                                            <Button
                                                size="sm"
                                                onClick={() => downloadCsv(getAbsentList(), ["Name", "Sector"], "absentees.csv")}
                                            >
                                                Export
                                            </Button>
                                        </div>
                                    </AdminCard>
                                </div>
                            </div>
                        )}

                        {/* ------------------ Yearly Trend tab ------------------ */}
                        {tabIndex === 2 && (
                            <div className="tabContainer">
                                <div className="mt-3 d-flex filter-section" style={{ gap: 16 }}>
                                    <div style={{ width: 260 }}>
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
                                                vAxis: { title: "Number of questions" },
                                                colors: trendColors,
                                            }}
                                        />
                                    </AdminCard>
                                </div>
                            </div>
                        )}

                        {/* ------------------ Yearly Comparison tab ------------------ */}
                        {tabIndex === 3 && (
                            <div className="tabContainer">
                                <div className="mt-3 d-flex filter-section" style={{ gap: 16 }}>
                                    <div style={{ width: 200 }}>
                                        <Form.Label>From</Form.Label>
                                        <Form.Control type="date" value={compStart} onChange={(e) => setCompStart(e.target.value)} />
                                    </div>

                                    <div style={{ width: 200 }}>
                                        <Form.Label>To</Form.Label>
                                        <Form.Control type="date" value={compEnd} onChange={(e) => setCompEnd(e.target.value)} />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <AdminCard>
                                        <Chart
                                            width="100%"
                                            height="400px"
                                            chartType="ColumnChart"
                                            data={comparisonData}
                                            options={{
                                                isStacked: true,
                                                legend: { position: "top" },
                                                hAxis: { title: "Year" },
                                                vAxis: { title: "Number of questions" },
                                                colors: comparisonColors,
                                            }}
                                        />
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