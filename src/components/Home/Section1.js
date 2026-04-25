import React, { useEffect, useState } from "react";
import Carouselll from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Parser from "rss-parser";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import { BreadCrum, SideBar, Navbar, AdminCard } from "../";
import backImg from "../../assets/main_pg_img.png";
import govLogo from "../../assets/main logo.png";

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
        <div class="container landing-container" >


          <div class="text-section">
            <div className="d-flex  logo-wrapper">
              <img src={govLogo} className="pb-3 ml-0 pl-0 logo-login" />
            </div>
            <h1>Smart Scheduling,<br />Seamless Collaboration</h1>
            <p>
              Effortlessly manage meetings with automated scheduling, real-time notifications,
              and intelligent committee formation. Our system ensures that the right people
              are in the right meetings at the right time.
            </p>
            <Button
              className=" mx-auto btn-primary "
              href="login"
            >
              <span
                id="loginButton"
                className="pr-3 pl-3 pb-0 pt-0 mb-0 mt-0  font-weight-bold "
              >
                <h4
                  className=" pb-0 pt-0 mb-0 mt-0"
                  style={{ fontSize: "1.2em" }}
                >
                  <strong> Login</strong>
                </h4>
              </span>
            </Button>



          </div>

          <div class="image-section login-image-section">
            <div class="decor-shape"></div>
            <img src={backImg} alt="Meeting Image" class="meetingimg" />

          </div>


        </div>
      </>
    );
  }
};

export default Section1;
