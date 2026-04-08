import React, { useRef, useEffect, useState } from "react";
import { BreadCrum, SideBar, Navbar, AdminCard, NavbarDashboard } from "../../components";
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

// function MySubmission() {

// }

const ChallengePage = () => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const history = useHistory();


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


    const handleOpenSubmission = (id, status) => {
        const mode = status === "completed" ? "view" : "edit";

        history.push("/addquestion", {
            submissionId: id,
            mode: mode,
        });
    };





    // Fetch data from your database API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace this URL with your backend endpoint
                const res = await axios.get("http://localhost:5001/admin/challenges");
                setData(res.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    // Filter the data based on selected tab
    const filteredData =
        filter === "all"
            ? data
            : data.filter(
                (item) => item.status.toLowerCase() === filter.toLowerCase()
            );


    // Pagination handlers
    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );

    return (
        <div className="wrapper">
            {model}
            <SideBar submission={true} />
            <div className="main-panel">
                <NavbarDashboard title="My Submission" subtitle="Track and Manage Your Submitted Challenges" />
                <div className="content">
                    <div className="tabs-wrapper mb-3">
                        <Tabs
                            value={filter}
                            onChange={(_, newValue) => setFilter(newValue)}
                            textColor="primary"
                            indicatorColor="primary"
                            sx={{ borderBottom: 1, borderColor: "divider" }}
                        >
                            <Tab label="All" value="all" />
                            <Tab label="Draft" value="draft" />
                            <Tab label="Completed" value="completed" />
                        </Tabs>
                    </div>
                    <AdminCard title="">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Created Date</b></TableCell>
                                        <TableCell><b>No. of Challenges</b></TableCell>
                                        <TableCell><b>Development Area</b></TableCell>
                                        <TableCell><b>Status</b></TableCell>

                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {filteredData
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <TableRow
                                                key={row.id}
                                                hover
                                                sx={{ "&:last-child td": { border: 0 } }}
                                            >
                                                <TableCell>{row.createdDate}</TableCell>
                                                <TableCell>{row.noOfChallenges}</TableCell>
                                                <TableCell>{row.developmentArea}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={row.status === "completed" ? "Completed" : "Draft"}
                                                        sx={{
                                                            backgroundColor:
                                                                row.status === "completed"
                                                                    ? "#C8FACD"
                                                                    : row.status === "draft"
                                                                        ? "#FFF9C4"
                                                                        : "#E0E0E0",
                                                            color:
                                                                row.status === "completed"
                                                                    ? "green"
                                                                    : row.status === "draft"
                                                                        ? "orange"
                                                                        : "black",
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell><i class="fa fa-chevron-right" aria-hidden="true" onClick={() =>
                                                    handleOpenSubmission(row.id, row.status)
                                                } style={{ cursor: "pointer" }}></i></TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10]}
                            component="div"
                            count={filteredData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </AdminCard>
                    <Footer />
                </div>
            </div>
        </div>
    );
}
export default ChallengePage;