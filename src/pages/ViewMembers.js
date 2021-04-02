import React from "react";
import { Table, Container } from "react-bootstrap";
import { BreadCrum, SideBar, Navbar, AdminCard } from "../components";

function ViewMembers() {
  return (
    <div className="wrapper">
      <SideBar members={true} viewmembers={true} />
      <div class="main-panel">
        <Navbar />
        <div class="content">
          <BreadCrum path={["Home", "Users", "View Members"]} />
          <AdminCard title="View Members">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile No</th>
                  <th>Gender</th>
                  <th>Workspace</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
              </tbody>
            </Table>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}

export default ViewMembers;
