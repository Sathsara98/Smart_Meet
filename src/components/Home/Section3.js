import React from "react";
import { Col, Row, Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";

const Section2 = () => {
  return (
    <Row className="col-12 mt-4 p-0 mr-0 ml-0" id="services">
      <div className="col-10 mx-auto">
        <div className="w-50 mx-auto ">
          <h2
            className="text-center separator fade"
            style={{ color: "#0071BF" }}
          >
            <strong>Services</strong>
          </h2>
        </div>

        <div className="row m-0 p-0 ">
          <div className=" col-lg-6 col-md-6 col-sm-12 p-1 ">
            <div
              className="card col-12 fade"
              style={{ margin: "1%", backgroundColor: "#e0f9ff" }}
            >
              <div className="row align-items-center ">
                <Col xs={3} className="p-0">
                  <div>
                    <img
                      className="ml-2 p-3"
                      src="https://img.icons8.com/carbon-copy/100/time.png"
                      alt="Card image cap"
                    />
                  </div>
                </Col>
                <Col xs={9}>
                  <div className="card-body pl-0">
                    <h4 className="card-title">
                      <strong style={{ fontWeight: "700", fontSize: "1.1em" }}>
                        Time Saving
                      </strong>
                    </h4>
                    <p className="card-text" style={{ fontSize: "1.15em" }}>
                      Saving valuble time on writing, printing, distributing.
                    </p>
                  </div>
                </Col>
              </div>
            </div>
          </div>
          <div className=" col-lg-6 col-md-6 col-sm-12 p-1 ">
            <div
              className="card col-12 fade"
              style={{ margin: "1%", backgroundColor: "#e0f9ff" }}
            >
              <div className="row align-items-center ">
                <Col xs={3} className="p-0">
                  <div>
                    <img
                      className="ml-2 p-3"
                      src="https://img.icons8.com/carbon-copy/100/money.png"
                      alt="Card image cap"
                    />
                  </div>
                </Col>
                <Col xs={9}>
                  <div className="card-body pl-0">
                    <h4 className="card-title">
                      <strong style={{ fontWeight: "700", fontSize: "1.1em" }}>
                        Cost Saving
                      </strong>
                    </h4>
                    <p className="card-text" style={{ fontSize: "1.15em" }}>
                      Saving money on too much papers.
                      <span style={{ visibility: "hidden" }}>
                        {" "}
                        Saving money on
                      </span>
                    </p>
                  </div>
                </Col>
              </div>
            </div>
          </div>
          <div className=" col-lg-6 col-md-6 col-sm-12 p-1 ">
            <div
              className="card col-12 fade"
              style={{ margin: "1%", backgroundColor: "#e0f9ff" }}
            >
              <div className="row align-items-center ">
                <Col xs={3} className="p-0">
                  <div>
                    <img
                      className="ml-2 p-3"
                      src="https://img.icons8.com/dotty/80/overtime.png"
                      alt="Card image cap"
                    />
                  </div>
                </Col>
                <Col xs={9}>
                  <div className="card-body pl-0">
                    <h4 className="card-title">
                      <strong style={{ fontWeight: "700", fontSize: "1.1em" }}>
                        Schedule Once
                      </strong>
                    </h4>
                    <p className="card-text" style={{ fontSize: "1.15em" }}>
                      Easy to schedule a meeting in less time at once.
                      <span style={{ visibility: "hidden" }}> Saving on</span>
                    </p>
                  </div>
                </Col>
              </div>
            </div>
          </div>
          <div className=" col-lg-6 col-md-6 col-sm-12 p-1 mb-5 ">
            <div
              className="card col-12 fade"
              style={{ margin: "1%", backgroundColor: "#e0f9ff" }}
            >
              <div className="row align-items-center ">
                <Col xs={3} className="p-0">
                  <div>
                    <img
                      className="ml-3 p-3"
                      src="https://img.icons8.com/wired/80/satisfaction.png"
                      alt="Card image cap"
                    />
                  </div>
                </Col>
                <Col xs={9}>
                  <div className="card-body pl-0">
                    <h4 className="card-title">
                      <strong style={{ fontWeight: "700", fontSize: "1.1em" }}>
                        Satisfaction
                      </strong>
                    </h4>
                    <p className="card-text" style={{ fontSize: "1.15em" }}>
                      Acceleration in time to engagement.
                      <span style={{ visibility: "hidden" }}>
                        {" "}
                        Saving, money go ss
                      </span>
                    </p>
                  </div>
                </Col>
              </div>
            </div>
          </div>
          <div style={{ minHeight: "20vh" }}></div>
        </div>
      </div>
    </Row>
  );
};

export default Section2;
