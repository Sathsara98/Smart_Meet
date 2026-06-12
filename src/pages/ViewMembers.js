import React, { useState, useEffect } from "react";

import ReactDOM from "react-dom";

import { useParams } from "react-router";

import {
  BreadCrum,
  SideBar,
  Navbar,
  AdminCard,
  NavbarDashboard,
} from "../components";

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

import Auth from '../authentication/Auth';

import Footer from "../components/Footer/Footer";


function ViewMembers(props) {

  // Get member type from URL.
  // Example: public, private, academic, association.
  const { type } = useParams();

  console.log(type);

  // Stores current page number for pagination.
  const [page, setPage] = useState(1);

  // Stores members loaded from backend.
  const [memberList, setMemberList] = useState([]);

  // Controls loading status.
  // Currently set to false after members are loaded.
  const [isLoading, setIsLoading] = useState(true);

  // Controls delete confirmation dialog visibility.
  const [openDialog, setOpenDialog] = useState(false);

  // Stores selected member ID before deleting.
  const [memberIdToDelete, setMemberIdToDelete] = useState(null);

  // Used to change No button color on hover.
  const [hoverNo, setHoverNo] = useState(false);

  // Used to change Yes button color on hover.
  const [hoverYes, setHoverYes] = useState(false);


  // Create table rows from memberList.
  // Logic:
  // For each member, display image, name, email, phone, gender, workplace,
  // and delete icon if logged-in user has permission.
  const tableDATA = memberList.map((p, index) => {
    return (
      /*
        Old normal HTML table row is commented.
        Current UI uses Material UI TableRow.
      */
      // <tr key={index}>
      //   <td>{index + 1}</td>
      //   <td></td>
      //   <td>{p.name}</td>
      //   <td>{p.email}</td>
      //   <td>{p.tel}</td>
      //   <td>{p.gender}</td>
      //   <td>{p.workplace}</td>
      //   {Auth?.getUserLevel() !== "Committee Member" && Auth?.getUserLevel() !== "Committee Secretary" ? (<td>
      //     <button className="btn btn-danger" onClick={() => deleteMember(p._id)}>Delete</button>
      //   </td>) : null}
      // </tr>

      <TableRow key={index}>

        {/* Row number */}
        <TableCell>{index + 1}</TableCell>

        {/* Member profile image */}
        <TableCell>
          <img
            src={
              p.userImage
                // If member has uploaded image, show it from backend.
                ? `${process.env.REACT_APP_BACKEND_URL}/${p.userImage}`

                // Otherwise show default image.
                : "/default-user.png"
            }
            alt={p.name}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </TableCell>

        {/* Member name */}
        <TableCell>{p.name}</TableCell>

        {/* Member email */}
        <TableCell>{p.email}</TableCell>

        {/* Member telephone number */}
        <TableCell>{p.tel}</TableCell>

        {/* Member gender */}
        <TableCell>{p.gender}</TableCell>

        {/* Member workplace */}
        <TableCell>{p.workplace}</TableCell>

        {/*
         Delete icon is shown only to users who are NOT:
         - Committee Member
         - Committee Secretary

         WHY:
         Normal committee members and secretaries should not delete members.
       */}
        {Auth?.getUserLevel() !== "Committee Member" &&
          Auth?.getUserLevel() !== "Committee Secretary" ? (
          <TableCell>
            {/*
             Old delete button is commented.
             Current UI uses only trash icon.
           */}
            {/* <button
             className="btn btn-danger"
             onClick={() => deleteMember(p._id)}
           >
           </button> */}

            {/* Trash icon opens delete confirmation dialog */}
            <i
              class="fa fa-trash"
              aria-hidden="true"
              onClick={() => handleDeleteClick(p._id)}
            ></i>
          </TableCell>
        ) : null}
      </TableRow>
    );
  });


  // Runs when trash icon is clicked.
  // Logic:
  // 1. Store selected member ID.
  // 2. Open delete confirmation dialog.
  const handleDeleteClick = (memberId) => {
    setMemberIdToDelete(memberId);
    setOpenDialog(true);
  };


  // Close delete dialog without deleting.
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMemberIdToDelete(null);
  };


  // Runs when user confirms delete.
  const handleConfirmDelete = async () => {
    // Delete only if member ID exists.
    if (memberIdToDelete) {
      await deleteMember(memberIdToDelete);

      // Close dialog after deleting.
      handleCloseDialog();
    }
  };


  // Delete selected member from backend.
  const deleteMember = async (event) => {
    // event.preventDefault();

    console.log(event);

    try {
      // Prepare DELETE request.
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",

          // Send login token for authorization.
          token: Auth.getToken()
        },

        // Send selected member ID to backend.
        body: JSON.stringify({
          id: event,
        }),
      };

      // Call backend delete API.
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/delete`,
        requestOptions
      );

      // Convert response to JSON.
      const data = await res.json();

      console.log(data);

      // Reload member list after deleting.
      loadMembers();

    } catch (e) {
      console.log(e);
    }
  };


  const loadMembers = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/register/${type}`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log("Members response:", response);


        // Make sure memberList is always an array
        if (Array.isArray(response)) {
          setMemberList(response);
        } else {
          setMemberList([]);
        }


        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setMemberList([]);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    loadMembers();
  }, [type]);






  return (
    <div className="wrapper">

      {/* Sidebar with view members menu active */}
      <SideBar members={true} viewmembers={true} />

      <div className="main-panel">

        {/* Page heading */}
        <NavbarDashboard title="Members" />

        <div className="content">

          {/* Back arrow */}
          <div className="ml-3">
            <i
              class="fas fa-arrow-left back-arrow"

              // Go back to previous page.
              onClick={() => window.history.back()}
            ></i>
          </div>

          {/* Breadcrumb is currently commented */}
          {/* <BreadCrum path={["Home", "Users", "View Members"]} /> */}

          {/* Members table card */}
          <AdminCard title="View Members">

            {/*
             Old normal HTML table is commented.
             Current UI uses Material UI table.
           */}
            {/* <table id="example" className="table table-bordered">
             <thead>
               <tr>
                 <th>No</th>
                 <th>Image</th>
                 <th>Name</th>
                 <th>Email</th>
                 <th>Mobile No</th>
                 <th>Gender</th>
                 <th>Ofiice</th>
                 {Auth?.getUserLevel() !== "Committee Member" && Auth?.getUserLevel() !== "Committee Secretary" ? (<th>Action</th>) : null}
               </tr>
             </thead>
             <tbody>{tableDATA}</tbody>
           </table> */}

            {/* Material UI table */}
            <TableContainer>
              <Table>

                {/* Table header */}
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile No</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Office</TableCell>

                    {/*
                     Show Action column only to users allowed to delete.
                   */}
                    {Auth?.getUserLevel() !== "Committee Member" &&
                      Auth?.getUserLevel() !== "Committee Secretary" ? (
                      <TableCell>Action</TableCell>
                    ) : null}
                  </TableRow>
                </TableHead>

                {/* Table rows */}
                <TableBody>{tableDATA}</TableBody>
              </Table>

              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"

                // Total member count.
                count={memberList.length}

                // Always show 10 rows per page.
                rowsPerPage={10}

                // Material UI page index starts from 0.
                // Your page state starts from 1, so subtract 1.
                page={page - 1}

                // Update page state.
                onPageChange={(e, newPage) => setPage(newPage + 1)}

                // Rows per page change is disabled/empty.
                onRowsPerPageChange={() => { }}
              />
            </TableContainer>
          </AdminCard>

          {/* Footer */}
          <Footer />
        </div>
      </div>


      {/* Delete confirmation dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Member"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this member? This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>

          {/* No button: close dialog without deleting */}
          <Button
            onClick={handleCloseDialog}
            onMouseEnter={() => setHoverNo(true)}
            onMouseLeave={() => setHoverNo(false)}
            style={{
              backgroundColor: hoverNo ? '#57585a' : '#6b6b6b',
              color: 'white',
              transition: 'background-color 0.2s ease',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            No
          </Button>

          {/* Yes button: confirm delete */}
          <Button
            onClick={handleConfirmDelete}
            onMouseEnter={() => setHoverYes(true)}
            onMouseLeave={() => setHoverYes(false)}
            style={{
              backgroundColor: hoverYes ? '#0a7a96' : '#0D97B9',
              color: 'white',
              transition: 'background-color 0.2s ease',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export default ViewMembers;
