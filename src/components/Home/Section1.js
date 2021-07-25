import React, { useEffect, useState } from "react";
import Carouselll from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Parser from "rss-parser";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import { BreadCrum, SideBar, Navbar, AdminCard } from "../";
import backImg from "../../assets/home_page/metal.jpg";

import logo from "../../assets/logo.png";
const Section1 = () => {
  const [axis, setaxis] = useState("y");
  const [items, setItems] = useState([]);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAboutUsNext, setIsAboutUsNext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div>
          <img
            className=""
            src={`${process.env.PUBLIC_URL}/assets/img/pre_loader.svg`}
          />
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="row mx-auto align-items-center">
          <Carouselll className=" w-100 caro" controls={false}>
            <Carouselll.Item interval={7000} className="caro h-100">
              <img
                className="d-block w-100 h-100 caro"
                src={`${process.env.PUBLIC_URL}/assets/img/first_slide.jpg`}
                alt="First slide"
                style={{ objectFit: "cover" }}
              />
            </Carouselll.Item>
            {/* <Carouselll.Item interval={7000} className="caro">
              <img
                className="d-block w-100 h-100 caro"
                src={`${process.env.PUBLIC_URL}/assets/img/second_slide.jpg`}
                alt="Third slide"
                style={{ objectFit: "cover" }}
              />
            </Carouselll.Item>
            <Carouselll.Item interval={7000} className="caro">
              <img
                className="d-block w-100 h-100 caro"
                src={backImg}
                alt="Third slide"
                style={{ objectFit: "cover" }}
              />
            </Carouselll.Item> */}
          </Carouselll>
          {/* View on mobile screens */}
          <div className="d-flex flex-column align-items-center justify-content-around position-absolute d-block d-sm-none z-index-5">
            <div>
              <img className="w-100 px-5 pt-5 pb-3 mx-auto" src={logo} />
            </div>
            <div className="mb-5 ">
              <h4
                className="text-center text-white mb-5"
                style={{ fontSize: "1em" }}
              >
                <strong>
                  The official meeting scheduler of advisory <br /> committee of
                  Ministry of industry
                </strong>
              </h4>
            </div>
            <div className="my-5"></div>
            <div className="mt-5 ">
              <Button
                className="mt-5 mx-auto btnPrimary login-button"
                href="login"
              >
                <span
                  id="loginButton"
                  className="pr-5 pl-5 pb-0 pt-0 mb-0 mt-0 text-strong font-weight-bold "
                >
                  <h4
                    className="text-shadow pb-0 pt-0 mb-0 mt-0"
                    style={{ fontSize: "1.4em" }}
                  >
                    <strong> Login</strong>
                  </h4>
                </span>
              </Button>
            </div>
          </div>

          <div
            className=" position-absolute d-block d-sm-none  z-index-0"
            style={{ right: "0" }}
          >
            {isAboutUsOpen ? (
              <div
                className={`d-flex justify-content-between align-items-center mr-0 pr-0 col-xs-12 col-md-6 `}
              >
                <div> </div>
                <div className=" d-flex flex-column  align-items-end  justify-items-end">
                  <div>
                    <Button
                      className="mt-4 mx-auto mr-0 pl-4 pr-3 index-right-buttons1 "
                      style={{}}
                      onClick={() => setIsAboutUsOpen(false)}
                    >
                      <span
                        id="loginButton"
                        className="  pb-0  mt-0 text-strong font-weight-bold "
                        style={{ fontSize: "1.4em" }}
                      >
                        <strong> About </strong>
                        <strong style={{ color: "#14A9FF" }}>Us</strong>
                      </span>
                    </Button>
                  </div>
                  <div
                    className={`p-4 ${isAboutUsOpen ? "fadeIn" : " fadeOut"}`}
                    style={{
                      backgroundColor: "#ffffff",
                      maxWidth: "400px",
                      padding: "20px",
                      borderRadius: "25px 0px 0px 25px",
                    }}
                  >
                    {isAboutUsNext ? (
                      <div>
                        <h4>
                          <strong>Advisory Committee Activities</strong>
                        </h4>
                        <p>
                          Ministry is in the process of setting up the sector
                          Advisory committees for the identified potential
                          Sectors. Chairman and the Secretary of these
                          committees will be selected from the Private Sector.
                          The Directors of the Development Divisions will act as
                          Coordinators to these Committees. The objective of
                          these Committees are to get the industry leaders'
                          inputs for the preparation of development plans and
                          recommendations based on the new budget proposals to
                          upgrade the technology and develop these value chains
                          to compete in the global market with the available
                          foreign and local assistance programs.
                        </p>
                        <i
                          type="button"
                          onClick={() => setIsAboutUsNext(false)}
                          className="fa fa-arrow-left"
                        ></i>
                      </div>
                    ) : (
                      <div className={isAboutUsNext ? "" : "fadeIn"}>
                        <h4>
                          <strong>Value Chain Development Programmes</strong>
                        </h4>
                        <p>
                          The ministry has initiated value chain development
                          programmes to increase the value addition in
                          manufacturing industry. These programmes are focused
                          on the improvement of different levels of production
                          process up to the marketing of products. Technological
                          institutes, Universities and training institutes are
                          linked with these programmes to provide services to
                          industry.
                        </p>
                        <i
                          type="button"
                          onClick={() => setIsAboutUsNext(true)}
                          className="fa fa-arrow-right"
                        ></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <Button
                      className="mt-4 mx-auto mr-0 pl-4 pr-3 index-right-buttons "
                      onClick={() => {
                        setIsServicesOpen(true);
                        setIsAboutUsOpen(false);
                      }}
                    >
                      <span
                        id="loginButton"
                        className="  pb-0 mt-0 text-strong font-weight-bold "
                        style={{ fontSize: "1.4em" }}
                      >
                        <i class="fas fa-cogs"></i>
                        <strong>&nbsp;&nbsp;&nbsp; Service</strong>
                        <strong style={{ color: "#14A9FF" }}>s &nbsp;</strong>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

            {isServicesOpen ? (
              <div
                className={`d-flex justify-content-between align-items-center mr-0 pr-0 col-xs-12 col-md-6 `}
              >
                <div> </div>
                <div className=" d-flex flex-column  align-items-end  justify-items-end">
                  <div>
                    <Button
                      className="mt-4 mx-auto mr-0 pl-4 pr-3 index-right-buttons1 "
                      onClick={() => {
                        setIsServicesOpen(false);
                        setIsAboutUsOpen(false);
                      }}
                    >
                      <span
                        id="loginButton"
                        className="  pb-0 mt-0 text-strong font-weight-bold "
                        style={{ fontSize: "1.4em" }}
                      >
                        <strong> Service</strong>
                        <strong style={{ color: "#14A9FF" }}>s &nbsp;</strong>
                      </span>
                    </Button>
                  </div>
                  <div
                    className={`${isServicesOpen ? "fadeIn" : ""}`}
                    style={{
                      backgroundColor: "transparent",
                      maxWidth: "400px",

                      paddingRight: "0px",
                      paddingTop: "0px",
                      borderRadius: "25px 0px 0px 25px",
                    }}
                  >
                    <div
                      className="row align-items-center p-0 m-0 "
                      style={{
                        backgroundColor: "rgba(255,255,255,0.8)",
                        marginBottom: "5px",
                        borderRadius: "15px 0px 0px 15px",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center p-0 m-0 ">
                        <div className="col-2 p-0">
                          <img
                            className="ml-0 pl-2 pr-0 "
                            src={`${process.env.PUBLIC_URL}/assets/img/service_1.png`}
                            alt="Card image cap"
                          />
                        </div>

                        <div className="pl-3 mt-3 mb-3 col-10 pt-2 pb-2 index-right-services box-shadow1">
                          <h5 className="m-0 p-0">
                            <strong
                              style={{ fontWeight: "700", fontSize: "1.1em" }}
                            >
                              Time Saving
                            </strong>
                          </h5>
                          <p
                            className="card-text"
                            style={{ fontSize: "1.1em" }}
                          >
                            Saving valuable time on writing, printing,
                            distributing
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className=""
                      style={{
                        backgroundColor: "rgba(255,255,255,0.8)",
                        marginTop: "5px",
                        marginBottom: "5px",
                        borderRadius: "15px 0px 0px 15px",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center p-0 m-0 ">
                        <div className="col-2 p-0">
                          <img
                            className="ml-0 pl-2 pr-0 "
                            src={`${process.env.PUBLIC_URL}/assets/img/service_2.png`}
                            alt="Card image cap"
                          />
                        </div>

                        <div className="pl-3 mt-3 mb-3 col-10 pt-2 pb-2 index-right-services box-shadow1">
                          <h5 className="m-0 p-0">
                            <strong
                              style={{ fontWeight: "700", fontSize: "1.1em" }}
                            >
                              Cost Saving
                            </strong>
                          </h5>
                          <p
                            className="card-text"
                            style={{ fontSize: "1.1em" }}
                          >
                            Saving money on too much of papers <h5></h5>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className=""
                      style={{
                        backgroundColor: "rgba(255,255,255,0.8)",
                        marginTop: "5px",
                        marginBottom: "5px",
                        borderRadius: "15px 0px 0px 15px",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center p-0 m-0 ">
                        <div className="col-2 p-0">
                          <img
                            className="ml-0 pl-2 pr-0 "
                            src={`${process.env.PUBLIC_URL}/assets/img/service_3.png`}
                            alt="Card image cap"
                          />
                        </div>

                        <div className="pl-3 mt-3 mb-3 col-10 pt-2 pb-2 index-right-services box-shadow1">
                          <h5 className="m-0 p-0">
                            <strong
                              style={{ fontWeight: "700", fontSize: "1.1em" }}
                            >
                              Schedule Once
                            </strong>
                          </h5>
                          <p
                            className="card-text"
                            style={{ fontSize: "1.1em" }}
                          >
                            Easy to schedule a meeting in less time at once
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className=""
                      style={{
                        backgroundColor: "rgba(255,255,255,0.8)",
                        marginTop: "5px",
                        marginBottom: "5px",
                        borderRadius: "15px 0px 0px 15px",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center p-0 m-0 ">
                        <div className="col-2 p-0">
                          <img
                            className="ml-0 pl-2 pr-0 "
                            src={`${process.env.PUBLIC_URL}/assets/img/service_4.png`}
                            alt="Card image cap"
                          />
                        </div>

                        <div className="pl-3 mt-3 mb-3 col-10 pt-2 pb-2 index-right-services box-shadow1">
                          <h5 className="m-0 p-0">
                            <strong
                              style={{ fontWeight: "700", fontSize: "1.1em" }}
                            >
                              Satisfaction
                            </strong>
                          </h5>
                          <p
                            className="card-text"
                            style={{ fontSize: "1.1em" }}
                          >
                            Acceleration in time to engagement <h5></h5>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      className="mt-2 mx-auto mr-0 pl-4 pr-3 index-right-buttons "
                      style={{}}
                      onClick={() => {
                        setIsAboutUsOpen(true);
                        setIsServicesOpen(false);
                      }}
                    >
                      <span
                        id="loginButton"
                        className="  pb-0  mt-0 text-strong font-weight-bold overflow-hidden"
                        style={{ fontSize: "1.4em" }}
                      >
                        <i class="fas fa-info-circle"></i>
                        <strong>&nbsp; About </strong>
                        <strong style={{ color: "#14A9FF" }}>Us</strong>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

            {!isServicesOpen && !isAboutUsOpen ? (
              <div className="d-flex flex-column justify-content-center align-items-end">
                <div className="my-5"></div>
                <div className="my-5"></div>
                <div>
                  <Button
                    className="mt-4 mx-auto mr-0 pl-4 pr-3 pt-3 pb-3 index-right-buttons"
                    onClick={() => {
                      setIsAboutUsOpen(true);
                      setIsServicesOpen(false);
                    }}
                  >
                    <span
                      id="loginButton"
                      className="  pb-0  mt-0 text-strong font-weight-bold overflow-hidden"
                      style={{ fontSize: "1.4em" }}
                    >
                      <i class="fas fa-info-circle"></i>
                      <strong>&nbsp; About </strong>
                      <strong style={{ color: "#14A9FF" }}>Us</strong>
                    </span>
                  </Button>
                </div>
                <div>
                  <Button
                    className="mt-4 mx-auto mr-0 pl-4 pr-3 pt-3 pb-3  index-right-buttons"
                    onClick={() => {
                      setIsServicesOpen(true);
                      setIsAboutUsOpen(false);
                    }}
                  >
                    <span
                      id="loginButton"
                      className="  pb-0 mt-0 text-strong font-weight-bold "
                      style={{ fontSize: "1.4em" }}
                    >
                      <i class="fas fa-cogs"></i>
                      <strong>&nbsp;&nbsp;&nbsp; Service</strong>
                      <strong style={{ color: "#14A9FF" }}>s &nbsp;</strong>
                    </span>
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          {/*display only on large screens */}
          <div className="col-12 w-100 vh-100 position-absolute d-md-flex  justify-content-md-between mr-0 pr-0 d-none d-md-block ">
            <div className="col-xs-12  mr-md-5 d-flex flex-column justify-content-center">
              <div className="row fadeIn">
                <img className="w-50 mx-auto" src={logo} />
              </div>

              <h4
                className="text-center text-white"
                style={{ fontSize: "1em" }}
              >
                <strong>
                  The official meeting scheduler of advisory <br /> committee of
                  Ministry of industry
                </strong>
              </h4>
              <div className="row ">
                <Button
                  className="mt-4 mx-auto btnPrimary login-button"
                  href="login"
                >
                  <span
                    id="loginButton"
                    className="pr-5 pl-5 pb-0 pt-0 mb-0 mt-0 text-strong font-weight-bold "
                  >
                    <h4
                      className="text-shadow pb-0 pt-0 mb-0 mt-0"
                      style={{ fontSize: "1.4em" }}
                    >
                      <strong> Login</strong>
                    </h4>
                  </span>
                </Button>
              </div>
            </div>
            {/* */}
            {isAboutUsOpen ? (
              <div
                className={`d-flex justify-content-between align-items-center mr-0 pr-0 col-xs-12 col-md-6 `}
              >
                <div> </div>
                <div className=" d-flex flex-column  align-items-end  justify-items-end">
                  <div>
                    <Button
                      className="mt-4 mx-auto mr-0 pl-4 pr-3 index-right-buttons1 "
                      style={{}}
                      onClick={() => setIsAboutUsOpen(false)}
                    >
                      <span
                        id="loginButton"
                        className="  pb-0  mt-0 text-strong font-weight-bold "
                        style={{ fontSize: "1.4em" }}
                      >
                        <strong> About </strong>
                        <strong style={{ color: "#14A9FF" }}>Us</strong>
                      </span>
                    </Button>
                  </div>
                  <div
                    className={`p-4 ${isAboutUsOpen ? "fadeIn" : " fadeOut"}`}
                    style={{
                      backgroundColor: "#ffffff",
                      maxWidth: "400px",
                      padding: "20px",
                      borderRadius: "25px 0px 0px 25px",
                    }}
                  >
                    {isAboutUsNext ? (
                      <div>
                        <h4>
                          <strong>Advisory Committee Activities</strong>
                        </h4>
                        <p>
                          Ministry is in the process of setting up the sector
                          Advisory committees for the identified potential
                          Sectors. Chairman and the Secretary of these
                          committees will be selected from the Private Sector.
                          The Directors of the Development Divisions will act as
                          Coordinators to these Committees. The objective of
                          these Committees are to get the industry leaders'
                          inputs for the preparation of development plans and
                          recommendations based on the new budget proposals to
                          upgrade the technology and develop these value chains
                          to compete in the global market with the available
                          foreign and local assistance programs.
                        </p>
                        <i
                          type="button"
                          onClick={() => setIsAboutUsNext(false)}
                          className="fa fa-arrow-left"
                        ></i>
                      </div>
                    ) : (
                      <div className={isAboutUsNext ? "" : "fadeIn"}>
                        <h4>
                          <strong>Value Chain Development Programmes</strong>
                        </h4>
                        <p>
                          The ministry has initiated value chain development
                          programmes to increase the value addition in
                          manufacturing industry. These programmes are focused
                          on the improvement of different levels of production
                          process up to the marketing of products. Technological
                          institutes, Universities and training institutes are
                          linked with these programmes to provide services to
                          industry.
                        </p>
                        <i
                          type="button"
                          onClick={() => setIsAboutUsNext(true)}
                          className="fa fa-arrow-right"
                        ></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <Button
                      className="mt-4 mx-auto mr-0 pl-4 pr-3 index-right-buttons "
                      onClick={() => {
                        setIsServicesOpen(true);
                        setIsAboutUsOpen(false);
                      }}
                    >
                      <span
                        id="loginButton"
                        className="  pb-0 mt-0 text-strong font-weight-bold "
                        style={{ fontSize: "1.4em" }}
                      >
                        <i class="fas fa-cogs"></i>
                        <strong>&nbsp;&nbsp;&nbsp; Service</strong>
                        <strong style={{ color: "#14A9FF" }}>s &nbsp;</strong>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

            {isServicesOpen ? (
              <div
                className={`d-flex justify-content-between align-items-center mr-0 pr-0 col-xs-12 col-md-6 `}
              >
                <div> </div>
                <div className=" d-flex flex-column  align-items-end  justify-items-end">
                  <div>
                    <Button
                      className="mt-4 mx-auto mr-0 pl-4 pr-3 index-right-buttons1 "
                      onClick={() => {
                        setIsServicesOpen(false);
                        setIsAboutUsOpen(false);
                      }}
                    >
                      <span
                        id="loginButton"
                        className="  pb-0 mt-0 text-strong font-weight-bold "
                        style={{ fontSize: "1.4em" }}
                      >
                        <strong> Service</strong>
                        <strong style={{ color: "#14A9FF" }}>s &nbsp;</strong>
                      </span>
                    </Button>
                  </div>
                  <div
                    className={`${isServicesOpen ? "fadeIn" : ""}`}
                    style={{
                      backgroundColor: "transparent",
                      maxWidth: "400px",

                      paddingRight: "0px",
                      paddingTop: "0px",
                      borderRadius: "25px 0px 0px 25px",
                    }}
                  >
                    <div
                      className="row align-items-center p-0 m-0 "
                      style={{
                        backgroundColor: "rgba(255,255,255,0.8)",
                        marginBottom: "5px",
                        borderRadius: "15px 0px 0px 15px",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center p-0 m-0 ">
                        <div className="col-2 p-0">
                          <img
                            className="ml-0 pl-2 pr-0 "
                            src={`${process.env.PUBLIC_URL}/assets/img/service_1.png`}
                            alt="Card image cap"
                          />
                        </div>

                        <div className="pl-3 mt-3 mb-3 col-10 pt-2 pb-2 index-right-services box-shadow1">
                          <h5 className="m-0 p-0">
                            <strong
                              style={{ fontWeight: "700", fontSize: "1.1em" }}
                            >
                              Time Saving
                            </strong>
                          </h5>
                          <p
                            className="card-text"
                            style={{ fontSize: "1.1em" }}
                          >
                            Saving valuable time on writing, printing,
                            distributing
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className=""
                      style={{
                        backgroundColor: "rgba(255,255,255,0.8)",
                        marginTop: "5px",
                        marginBottom: "5px",
                        borderRadius: "15px 0px 0px 15px",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center p-0 m-0 ">
                        <div className="col-2 p-0">
                          <img
                            className="ml-0 pl-2 pr-0 "
                            src={`${process.env.PUBLIC_URL}/assets/img/service_2.png`}
                            alt="Card image cap"
                          />
                        </div>

                        <div className="pl-3 mt-3 mb-3 col-10 pt-2 pb-2 index-right-services box-shadow1">
                          <h5 className="m-0 p-0">
                            <strong
                              style={{ fontWeight: "700", fontSize: "1.1em" }}
                            >
                              Cost Saving
                            </strong>
                          </h5>
                          <p
                            className="card-text"
                            style={{ fontSize: "1.1em" }}
                          >
                            Saving money on too much of papers <h5></h5>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className=""
                      style={{
                        backgroundColor: "rgba(255,255,255,0.8)",
                        marginTop: "5px",
                        marginBottom: "5px",
                        borderRadius: "15px 0px 0px 15px",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center p-0 m-0 ">
                        <div className="col-2 p-0">
                          <img
                            className="ml-0 pl-2 pr-0 "
                            src={`${process.env.PUBLIC_URL}/assets/img/service_3.png`}
                            alt="Card image cap"
                          />
                        </div>

                        <div className="pl-3 mt-3 mb-3 col-10 pt-2 pb-2 index-right-services box-shadow1">
                          <h5 className="m-0 p-0">
                            <strong
                              style={{ fontWeight: "700", fontSize: "1.1em" }}
                            >
                              Schedule Once
                            </strong>
                          </h5>
                          <p
                            className="card-text"
                            style={{ fontSize: "1.1em" }}
                          >
                            Easy to schedule a meeting in less time at once
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className=""
                      style={{
                        backgroundColor: "rgba(255,255,255,0.8)",
                        marginTop: "5px",
                        marginBottom: "5px",
                        borderRadius: "15px 0px 0px 15px",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center p-0 m-0 ">
                        <div className="col-2 p-0">
                          <img
                            className="ml-0 pl-2 pr-0 "
                            src={`${process.env.PUBLIC_URL}/assets/img/service_4.png`}
                            alt="Card image cap"
                          />
                        </div>

                        <div className="pl-3 mt-3 mb-3 col-10 pt-2 pb-2 index-right-services box-shadow1">
                          <h5 className="m-0 p-0">
                            <strong
                              style={{ fontWeight: "700", fontSize: "1.1em" }}
                            >
                              Satisfaction
                            </strong>
                          </h5>
                          <p
                            className="card-text"
                            style={{ fontSize: "1.1em" }}
                          >
                            Acceleration in time to engagement <h5></h5>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      className="mt-2 mx-auto mr-0 pl-4 pr-3 index-right-buttons "
                      style={{}}
                      onClick={() => {
                        setIsAboutUsOpen(true);
                        setIsServicesOpen(false);
                      }}
                    >
                      <span
                        id="loginButton"
                        className="  pb-0  mt-0 text-strong font-weight-bold overflow-hidden"
                        style={{ fontSize: "1.4em" }}
                      >
                        <i class="fas fa-info-circle"></i>
                        <strong>&nbsp; About </strong>
                        <strong style={{ color: "#14A9FF" }}>Us</strong>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

            {!isServicesOpen && !isAboutUsOpen ? (
              <div className=" d-flex justify-content-between mr-0 pr-0 col-xs-12 col-md-6 ">
                <div className="col"> </div>
                <div className="col d-flex flex-column  align-items-end justify-content-center p-0">
                  <div>
                    <Button
                      className="mt-4 mx-auto mr-0 pl-4 pr-3 pt-3 pb-3 index-right-buttons"
                      onClick={() => {
                        setIsAboutUsOpen(true);
                        setIsServicesOpen(false);
                      }}
                    >
                      <span
                        id="loginButton"
                        className="  pb-0  mt-0 text-strong font-weight-bold overflow-hidden"
                        style={{ fontSize: "1.4em" }}
                      >
                        <i class="fas fa-info-circle"></i>
                        <strong>&nbsp; About </strong>
                        <strong style={{ color: "#14A9FF" }}>Us</strong>
                      </span>
                    </Button>
                  </div>
                  <div>
                    {" "}
                    <Button
                      className="mt-4 mx-auto mr-0 pl-4 pr-3 pt-3 pb-3  index-right-buttons"
                      onClick={() => {
                        setIsServicesOpen(true);
                        setIsAboutUsOpen(false);
                      }}
                    >
                      <span
                        id="loginButton"
                        className="  pb-0 mt-0 text-strong font-weight-bold "
                        style={{ fontSize: "1.4em" }}
                      >
                        <i class="fas fa-cogs"></i>
                        <strong>&nbsp;&nbsp;&nbsp; Service</strong>
                        <strong style={{ color: "#14A9FF" }}>s &nbsp;</strong>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  }
};

export default Section1;
