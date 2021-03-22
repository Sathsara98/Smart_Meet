import React from "react";
import { Col, Row, Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";

const Section2 = () => {
  return (
    <Row className="col-12 mt-3">
      <div className="col-10 mx-auto">
        <h2 className="text-center">
          <strong>OUR SERVICES</strong>
        </h2>
        <div className="row">
          <div className=" col-lg-6 col-md-6 col-sm-12 p-1">
            <div className="card col-12" style={{ margin: "1%" }}>
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
                  <div class="card-body pl-0">
                    <h4 class="card-title">Time Saving</h4>
                    <p class="card-text">
                      Saving valuble time on writing, printing, distributing.
                    </p>
                  </div>
                </Col>
              </div>
            </div>
          </div>
          <div className=" col-lg-6 col-md-6 col-sm-12 p-1">
            <div className="card col-12" style={{ margin: "1%" }}>
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
                  <div class="card-body pl-0">
                    <h4 class="card-title">Cost Saving</h4>
                    <p class="card-text">
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
          <div className=" col-lg-6 col-md-6 col-sm-12 p-1">
            <div className="card col-12" style={{ margin: "1%" }}>
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
                  <div class="card-body pl-0">
                    <h4 class="card-title">Schedule Once</h4>
                    <p class="card-text">
                      Easy to schedule a meeting in less time at once.
                      <span style={{ visibility: "hidden" }}> Saving on</span>
                    </p>
                  </div>
                </Col>
              </div>
            </div>
          </div>
          <div className=" col-lg-6 col-md-6 col-sm-12 p-1">
            <div className="card col-12" style={{ margin: "1%" }}>
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
                  <div class="card-body pl-0">
                    <h4 class="card-title">Satisfaction</h4>
                    <p class="card-text">
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
        </div>
      </div>
    </Row>
  );
};

export default Section2;
