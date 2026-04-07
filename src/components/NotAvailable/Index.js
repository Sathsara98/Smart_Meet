import React from "react";
import {
  BreadCrum,
  SideBar,
  Navbar,
  AdminCard,
  NavbarDashboard,
} from "../../components";
import TimeTable from "./TimeTable";
function Index() {
  const pathToPage = ["Home", "Admin", "Not Available"];
  return (
    <div className="wrapper">
      <SideBar notAvailable={true} />
      <div className="main-panel">
        <NavbarDashboard title="Dashboard" subtitle="" />
        <div className="content">
          {/* <BreadCrum path={pathToPage} /> */}

          <AdminCard>
            <TimeTable />
          </AdminCard>
        </div>
      </div>
    </div>
  );
}

export default Index;
