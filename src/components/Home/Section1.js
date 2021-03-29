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

  useEffect(() => {}, []);

  return (
    <>
      <div className="row mx-auto align-items-center">
        <Carouselll className=" w-100 caro" controls={false}>
          <Carouselll.Item interval={7000} className="caro h-100">
            <img
              className="d-block w-100 h-100 caro"
              src="https://image.freepik.com/free-photo/cutting-metal-with-plasma-equipment_176420-4832.jpg"
              alt="First slide"
              style={{ objectFit: "cover" }}
            />
          </Carouselll.Item>
          <Carouselll.Item interval={7000} className="caro">
            <img
              className="d-block w-100 h-100 caro"
              src="https://image.freepik.com/free-photo/cutting-metal-with-plasma-equipment_176420-4787.jpg"
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
          </Carouselll.Item>
        </Carouselll>

        <div className="float-right col-lg-6 w-100 position-absolute ">
          <div className="row">
            <img className="w-50 mx-auto" src={logo} />
          </div>

          <h4 className="text-center text-white" style={{ fontSize: "1.3em" }}>
            <strong>
              The official meeting scheduler of advisory committee of <br />{" "}
              Ministry of industry
            </strong>
          </h4>
          <div className="row">
            <Button
              className=" mx-auto btnPrimary "
              variant="info"
              href="login"
            >
              <span
                className="pt-1 pb-1 pr-2 pl-2 text-strong font-weight-bold"
                style={{ fontSize: "1.2em" }}
              >
                <strong> Login</strong>
              </span>
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
