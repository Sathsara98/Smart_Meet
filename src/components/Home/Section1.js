import React, { useEffect, useState } from "react";
import Carousell from "re-carousel";
import Carouselll from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Parser from "rss-parser";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import { BreadCrum, SideBar, Navbar, AdminCard } from "../";

const Section1 = () => {
  const [axis, setaxis] = useState("y");
  const [items, setItems] = useState([]);
  const images = [
    {
      url:
        "https://image.freepik.com/free-photo/group-business-people-having-meeting_53876-14819.jpg",
    },
    {
      url:
        "https://image.freepik.com/free-photo/closeup-computer-laptop-screen-showing-calenda-with-date-month_53876-30070.jpg",
    },
    {
      url:
        "https://image.freepik.com/free-photo/bearded-male-organizing-his-tasks-using-sticky-notes_273609-37359.jpg",
    },
    {
      url:
        "https://image.freepik.com/free-photo/scheduling-agenda_53876-88433.jpg",
    },
  ];
  useEffect(() => {}, []);

  return (
    <>
      <div className="row mx-auto align-items-center ">
        <Carouselll className=" w-100 caro">
          <Carouselll.Item interval={3000} fade>
            <img
              className="d-block w-100"
              src="https://image.freepik.com/free-photo/cutting-metal-with-plasma-equipment_176420-4832.jpg"
              alt="First slide"
            />
          </Carouselll.Item>
          <Carouselll.Item interval={3000} fade>
            <img
              className="d-block w-100"
              src="https://image.freepik.com/free-photo/cutting-metal-with-plasma-equipment_176420-4787.jpg"
              alt="Third slide"
            />
          </Carouselll.Item>
          <Carouselll.Item interval={3000} fade={true}>
            <img
              className="d-block w-100"
              src="https://image.freepik.com/free-photo/mechanic-with-lamp-checks-car-brake-hoses_266732-7301.jpg"
              alt="Third slide"
            />
          </Carouselll.Item>
        </Carouselll>

        <div className="float-right col-lg-8 w-100 position-absolute">
          <h1 className="text-center text-white">
            <strong>Scheduler</strong>
          </h1>
          <h6 className="text-center text-white">
            THE OFFICIAL MEETING SCHEDULER OF ADVISORY COMMITTEE OF MINISTRY OF
            INDUSTRY
          </h6>
          <div className="row">
            <Button className=" mx-auto btnPrimary" variant="info">
              Login
            </Button>
          </div>
        </div>
        <div className="float-right col-xs-12 col-lg-5">
          <div></div>
        </div>
      </div>
    </>
  );
};

export default Section1;
