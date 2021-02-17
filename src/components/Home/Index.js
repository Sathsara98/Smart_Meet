import React, { useEffect, useState } from "react";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Parser from "rss-parser";
function Index() {
  return (
    <div>
      <Section1 />
      <Section2 />
    </div>
  );
}

export default Index;
