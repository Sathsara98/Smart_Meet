import React, { useEffect, useState } from "react";
import Section1 from "./Section1";
import Section2 from "./Section2";
import { BreadCrum, SideBar, Navbar, AdminCard } from "../";

function Index() {
  return (
    <div className="wrapper">
      <Navbar varient="transparent" />
      <div class="main-panel ">
        <Section1 />
        <Section2 />
      </div>
    </div>
  );
}

export default Index;
