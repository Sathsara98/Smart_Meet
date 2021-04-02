import { getByPlaceholderText } from "@testing-library/dom";
import React from "react";
import { Chart } from "react-google-charts";

function MemberRatio() {
  const styleTitle = {
    fontSize: 20,
    fontWeight: "bold",
  };
  return (
    <div className="mt-4">
      <span className="heading" style={styleTitle}>
        The Ratio Of The Advisory Committee
      </span>
      <Chart
        height={"250px"}
        width={"400px"}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={[
          ["Task", "Hours per Day"],
          ["Private", 11],
          ["Public", 2],
          ["Association", 2],
          ["Academic", 2],
        ]}
        options={{
          is3D: true,
          animation: {
            startup: true,
            easing: "linear",
            duration: 1500,
          },
        }}
        rootProps={{ "data-testid": "1" }}
      />
    </div>
  );
}

export default MemberRatio;
