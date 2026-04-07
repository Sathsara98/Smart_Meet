import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router";
// import { Table, Container } from "react-bootstrap";
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
import Auth from '../authentication/Auth'

function ViewMembers(props) {
  const { type } = useParams();
  console.log(type);
  const [page, setPage] = useState(1);
  const [memberList, setMemberList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [memberIdToDelete, setMemberIdToDelete] = useState(null);
  const [hoverNo, setHoverNo] = useState(false);
  const [hoverYes, setHoverYes] = useState(false);

  const tableDATA = memberList.map((p, index) => {
    return (
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
        <TableCell>{index + 1}</TableCell>
        <TableCell></TableCell>
        <TableCell>{p.name}</TableCell>
        <TableCell>{p.email}</TableCell>
        <TableCell>{p.tel}</TableCell>
        <TableCell>{p.gender}</TableCell>
        <TableCell>{p.workplace}</TableCell>
        {Auth?.getUserLevel() !== "Committee Member" &&
          Auth?.getUserLevel() !== "Committee Secretary" ? (
          <TableCell>
            {/* <button
              className="btn btn-danger"
              onClick={() => deleteMember(p._id)}
            >
              
            </button> */}
            <i class="fa fa-trash" aria-hidden="true" onClick={() => handleDeleteClick(p._id)}></i>
          </TableCell>
        ) : null}
      </TableRow>
    );
  });

  const handleDeleteClick = (memberId) => {
    setMemberIdToDelete(memberId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMemberIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (memberIdToDelete) {
      await deleteMember(memberIdToDelete);
      handleCloseDialog();
    }
  };

  const deleteMember = async (event) => {
    // event.preventDefault();

    console.log(event);
    try {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: Auth.getToken()
        },
        body: JSON.stringify({
          id: event,
        }),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/delete`,
        requestOptions
      );

      const data = await res.json();

      console.log(data);
      loadMembers();
      // if (data.hasOwnProperty("error")) {
      //   setShow(true);
      // } else {
      //   setShow(true);
      // }
    } catch (e) {
      console.log(e);
    }
  }

  const loadMembers = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/register/` + type, {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        setMemberList(response);
        setIsLoading(false);
        console.log(response);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    loadMembers();
  }, [page]);
  return (
    <div className="wrapper">
      <SideBar members={true} viewmembers={true} />
      <div className="main-panel">
        <NavbarDashboard title="Members" />
        <div className="content">
          {/* <BreadCrum path={["Home", "Users", "View Members"]} /> */}
          <AdminCard title="View Members">
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
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile No</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Office</TableCell>
                    {Auth?.getUserLevel() !== "Committee Member" &&
                      Auth?.getUserLevel() !== "Committee Secretary" ? (
                      <TableCell>Action</TableCell>
                    ) : null}
                  </TableRow>
                </TableHead>
                <TableBody>{tableDATA}</TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={memberList.length}
                rowsPerPage={10}
                page={page - 1}
                onPageChange={(e, newPage) => setPage(newPage + 1)}
                onRowsPerPageChange={() => { }}
              />
            </TableContainer>

          </AdminCard>
        </div>
      </div>

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