import React, { useRef, useEffect, useState } from "react";

import {
    BreadCrum,
    SideBar,
    Navbar,
    AdminCard,
    NavbarDashboard
} from "../../components";

import { Container, Form, Col, Row, Button, Alert } from "react-bootstrap";
import * as yup from "yup";
import { Formik } from "formik";
import {
    Box,
    Tabs,
    Tab,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    TablePagination,
    CircularProgress,
    Typography,
} from "@material-ui/core";
import Model from "../../components/Model";

import axios from "axios";
import Footer from "../Footer/Footer";
import { useHistory } from "react-router-dom";
import "./MySubmission.css";


// Old component code is commented.
// function MySubmission() {
// }


// ChallengePage component.
// Purpose:
// This page shows user's challenge submissions.
// User can filter submissions by All, Draft, and Completed.
// User can click a row to open submission in view/edit mode.
const ChallengePage = () => {

    // Stores submission data loaded from backend.
    const [data, setData] = useState([]);

    // Stores currently selected filter tab.
    // Default is "all", so all submissions are shown first.
    const [filter, setFilter] = useState("all");

    // Controls loading spinner.
    // true means data is still loading from backend.
    const [loading, setLoading] = useState(true);

    // Stores current table page number.
    const [page, setPage] = useState(0);

    // Stores how many rows should display per page.
    const [rowsPerPage, setRowsPerPage] = useState(5);

    //stored text for search input
    const [searchText, setSearchText] = useState("");

    //dev area filter state
    const [selectedArea, setSelectedArea] = useState("all");

    //challenge count state
    const [challengeCountText, setChallengeCountText] = useState("");

    // useHistory is used to navigate programmatically.
    // Example: redirect user to addquestion page.
    const history = useHistory();


    // Model state.
    // Stores popup model component.
    const [model, setModel] = useState(null);

    // Reusable function to show/hide confirmation model.
    // Logic:
    // 1. show = whether model should open.
    // 2. body = message inside model.
    // 3. confirmation = whether confirmation buttons are needed.
    // 4. callback = function to run when user confirms.
    const returnModel = (show, body, confirmation, callback) => {
        setModel(
            <Model
                show={show}
                confirmation={confirmation}
                body={body}

                // Close model without action.
                handleClose={() => {
                    returnModel(false, "", null);
                }}

                // Run callback when user clicks confirm.
                handleClick={(e) => {
                    callback(e);
                    returnModel(false, "", null);
                }}
            />
        );
    };


    // This function runs when user clicks the arrow icon in the table.
    // Logic:
    // If submission is completed, open in view mode.
    // If submission is not completed, open in edit mode.
    const handleOpenSubmission = (id, status) => {
        const mode = status === "completed" ? "view" : "edit";

        // Navigate to addquestion page and pass submissionId and mode.
        history.push("/addquestion", {
            submissionId: id,
            mode: mode,
        });
    };


    // Fetch data from backend when page loads.
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get challenge submissions from backend.
                const res = await axios.get("http://localhost:5001/admin/challenges");

                // Save data to state.
                setData(res.data);
            } catch (err) {
                // If API fails, show error in console.
                console.error("Error fetching data:", err);
            } finally {
                // Stop loading after API finishes.
                setLoading(false);
            }
        };

        // Call function.
        fetchData();
    }, []);


    const developmentAreas = [
        ...new Set(data.map((item) => item.developmentArea).filter(Boolean)),
    ];


    // First filter data based on selected tab.
    // Example: All, Draft, Completed.
    const tabFilteredData =
        filter === "all"
            ? data
            : data.filter(
                (item) => item.status.toLowerCase() === filter.toLowerCase()
            );




    // Then filter tab result using search box.
    // User can search by:
    // 1. Created Date
    // 2. Development Area
    const filteredData = tabFilteredData.filter((item) => {

        // Development Area Filter
        if (
            selectedArea !== "all" &&
            item.developmentArea !== selectedArea
        ) {
            return false;
        }

        //filter by no.of challenges
        if (challengeCountText !== "") {
            const enteredNumber = Number(challengeCountText);
            const itemChallengeCount = Number(item.noOfChallenges || 0);
            if (itemChallengeCount <= enteredNumber) {
                return false;
            }
        }


        // Convert search text to lowercase for easy matching.
        const search = searchText.toLowerCase();


        // Convert created date to lowercase string.
        const createdDate = item.createdDate
            ? item.createdDate.toLowerCase()
            : "";


        // Convert development area to lowercase string.
        const developmentArea = item.developmentArea
            ? item.developmentArea.toLowerCase()
            : "";




        // If search box is empty, show all tab-filtered records.
        if (!search) return true;


        // Show record if date or development area contains search text.
        return (
            createdDate.includes(search) ||
            developmentArea.includes(search)
        );
    });



    // Change table page.
    const handleChangePage = (_, newPage) => setPage(newPage);

    // Change number of rows per page.
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);

        // Reset back to first page when rows per page changes.
        setPage(0);
    };


    // If data is still loading, show spinner.
    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );


    return (
        <div className="wrapper">

            {/* Show model popup if available */}
            {model}

            {/* Sidebar with submission menu active */}
            <SideBar submission={true} />

            <div className="main-panel">

                {/* Top navbar */}
                <NavbarDashboard
                    title="My Submission"
                    subtitle="Track and Manage Your Submitted Challenges"
                />

                <div className="content">

                    {/* Tabs section */}
                    <div className="tabs-wrapper mb-3">
                        <Tabs
                            // Current selected tab value.
                            value={filter}

                            // When tab changes, update filter state.
                            onChange={(_, newValue) => setFilter(newValue)}

                            textColor="primary"
                            indicatorColor="primary"
                            sx={{ borderBottom: 1, borderColor: "divider" }}
                        >
                            {/* Show all submissions */}
                            <Tab label="All" value="all" />

                            {/* Show only draft submissions */}
                            <Tab label="Draft" value="draft" />

                            {/* Show only completed submissions */}
                            <Tab label="Completed" value="completed" />
                        </Tabs>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {/* Search box section */}
                        <div className="mb-3" style={{ maxWidth: "350px" }}>

                            <Form.Control
                                type="text"
                                placeholder="Search by date or development area"
                                value={searchText}
                                onChange={(e) => {
                                    // Save typed search text.
                                    setSearchText(e.target.value);


                                    // Reset table to first page after searching.
                                    setPage(0);
                                }}
                            />
                        </div>

                        <div>
                            <Form.Control
                                type="number"
                                placeholder="Enter challenge count"
                                value={challengeCountText}
                                onChange={(e) => {
                                    setChallengeCountText(e.target.value);
                                    console.log("Entered number:", e.target.value);
                                    setPage(0);
                                }}
                            />

                        </div>


                        <div className="mb-3" style={{ maxWidth: "250px" }}>
                            <Form.Control
                                as="select"
                                value={selectedArea}
                                onChange={(e) => {
                                    setSelectedArea(e.target.value);
                                    setPage(0);
                                }}
                            >
                                <option value="all">All Development Areas</option>
                                {developmentAreas.map((area) => (
                                    <option key={area} value={area}>
                                        {area}
                                    </option>
                                ))}
                            </Form.Control>
                        </div>

                    </div>


                    {/* Card wrapper for submission table */}
                    <AdminCard title="">
                        <TableContainer>
                            <Table>

                                {/* Table header */}
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Created Date</b></TableCell>
                                        <TableCell><b>No. of Challenges</b></TableCell>
                                        <TableCell><b>Development Area</b></TableCell>
                                        <TableCell><b>Status</b></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>


                                {/* Table body */}
                                <TableBody>
                                    {filteredData

                                        // Pagination logic:
                                        // Shows only rows for current page.
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

                                        // Display each submission row.
                                        .map((row) => (
                                            <TableRow
                                                key={row.id}
                                                hover
                                                sx={{ "&:last-child td": { border: 0 } }}
                                            >
                                                {/* Created date */}
                                                <TableCell>{row.createdDate}</TableCell>

                                                {/* Number of challenges in submission */}
                                                <TableCell>{row.noOfChallenges}</TableCell>

                                                {/* Development area */}
                                                <TableCell>{row.developmentArea}</TableCell>

                                                {/* Status chip */}
                                                <TableCell>
                                                    <Chip
                                                        // Show Completed or Draft label.
                                                        label={row.status === "completed" ? "Completed" : "Draft"}

                                                        // Apply different colors based on status.
                                                        style={{
                                                            backgroundColor:
                                                                row.status === "completed"
                                                                    ? "#C8FACD"
                                                                    : row.status === "draft"
                                                                        ? "#FFF9C4"
                                                                        : row.status === "submitted"
                                                                            ? "#BBDEFB"
                                                                            : "#E0E0E0",
                                                            color:
                                                                row.status === "completed"
                                                                    ? "green"
                                                                    : row.status === "draft"
                                                                        ? "orange"
                                                                        : row.status === "submitted"
                                                                            ? "#1565C0"
                                                                            : "black",
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* Arrow icon to open submission */}
                                                <TableCell>
                                                    <i
                                                        class="fa fa-chevron-right"
                                                        aria-hidden="true"

                                                        // Open selected submission in view/edit mode.
                                                        onClick={() =>
                                                            handleOpenSubmission(row.id, row.status)
                                                        }

                                                        style={{ cursor: "pointer" }}
                                                    ></i>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>


                        {/* Pagination control */}
                        <TablePagination
                            rowsPerPageOptions={[5, 10]}
                            component="div"

                            // Total number of rows after filtering.
                            count={filteredData.length}

                            // Current rows per page.
                            rowsPerPage={rowsPerPage}

                            // Current page number.
                            page={page}

                            // Change page function.
                            onPageChange={handleChangePage}

                            // Change rows per page function.
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </AdminCard>

                    {/* Footer section */}
                    <Footer />
                </div>
            </div>
        </div >
    );
}

export default ChallengePage;

