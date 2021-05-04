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
      <SideBar dashboard={true} />
      <div className="main-panel">
        <NavbarDashboard title="Dashboard" />
        <div className="content">
          <BreadCrum path={pathToPage} />

          <AdminCard>
            <TimeTable />
          </AdminCard>
        </div>
      </div>
    </div>
  );
}

export default Index;
