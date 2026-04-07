import { getByPlaceholderText } from "@testing-library/dom";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

function MemberRatio() {
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/stats/`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        setStats(response);
        console.log(response);
      })
      .catch((error) => console.log(error));
  }, [page]);

  const styleTitle = {
    fontSize: 20,
    fontWeight: "bold",
  };

  return (
    <div className="mt-4">
      <span className="heading" style={styleTitle}>
        Committee Composition
      </span>
      <Chart
        height={"250px"}
        width={"400px"}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={[
          ["Task", "Hours per Day"],
          ["Public", stats.Public],
          ["Private", stats.Private],
          ["Association", stats.Association],
          ["Academic", stats.Academic],
        ]}
        options={{
          is3D: false,
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
