import React from "react";
import { Col, Row, Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import picind1 from "../../assets/home_page/picind1.jpg";
import picind2 from "../../assets/home_page/picind2.jpg";
import picind3 from "../../assets/home_page/picind3.jpg";
import picind4 from "../../assets/home_page/picind4.jpg";
const Section2 = () => {
  return (
    <Row className="col-12 mt-4 m-0 p-0">
      <div className="col-lg-9 col-md-12 col-sm-12 mx-auto">
        <div className="w-50 mx-auto">
          <h2 className="text-center separator " style={{ color: "#0071BF" }}>
            <strong>About Us</strong>
          </h2>
        </div>

        <div className="row m-0" style={{ display: "flex", flexWrap: "wrap" }}>
          <div className=" col-lg-8 col-md-8 col-sm-12 ">
            <div className=" col-12" style={{ margin: "1%" }}>
              <div className="row align-items-center ">
                <h3 className="mt-5 mb-2">
                  Value Chain Development Programmes
                </h3>
                <p className="text-justify" style={{ fontSize: "1.15em" }}>
                  The ministry has initiated value chain development programmes
                  to increase the value addition in manufacturing industry.
                  These programmes are focused on the improvement of different
                  levels of production process up to the marketing of products.
                  Technological institutes, Universities and training institutes
                  are linked with these programmes to provide services to
                  industry.{" "}
                </p>
                <br />
                <h3 className="mt-3 mb-2">Advisory Committee Activities</h3>
                <p className="text-justify" style={{ fontSize: "1.15em" }}>
                  Ministry is in the process of setting up the sector Advisory
                  committees for the identified potential Sectors. Chairman and
                  the Secretary of these committees will be selected from the
                  Private Sector. The Directors of the Development Divisions
                  will act as Coordinators to these Committees. The objective of
                  these Committees are to get the industry leaders' inputs for
                  the preparation of development plans and recommendations based
                  on the new budget proposals to upgrade the technology and
                  develop these value chains to compete in the global market
                  with the available foreign and local assistance programs.
                </p>
              </div>
            </div>
          </div>
          <div
            className=" col-lg-4 col-md-4 col-sm-12 mx-auto"
            style={{ minHeight: "100%" }}
          >
            <div className="row m-0">
              <div className=" col-5 p-0">
                <img
                  className="w-100 p-1"
                  src={picind1}
                  alt="Card image cap"
                  style={{ marginTop: "100%" }}
                />
                <img
                  className="w-100 mt-5 p-1"
                  src={picind2}
                  alt="Card image cap"
                />
              </div>
              <div className=" col-7 m-0 p-0">
                <img className="w-100 p-2" src={picind3} alt="Card image cap" />
                <img
                  className="w-100 mt-4  p-2"
                  src={picind4}
                  alt="Card image cap"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Row>
  );
};

export default Section2;
