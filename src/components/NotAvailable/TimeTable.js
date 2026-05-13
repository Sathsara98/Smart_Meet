import React, { useState, useEffect, H1 } from "react";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import "./TimeTable.css";
import Auth from "../../authentication/Auth";

function TimeTable() {
  const [days, setdays] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [page, setPage] = useState(1);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/register/` + Auth.getUserId(), {
      method: "GET",
      headers: new Headers({
        Accept: "application/vnd.github.cloak-preview",
        token: Auth.getToken(),
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.nat) setdays(response.nat);
        // setIsLoading(false);
        console.log(response);
      })
      .catch((error) => console.log(error));
  }, [page]);

  const CenText = (props) => {
    if (props.availability > 0) {
      return (
        <h5 className="m-auto text-white" cell={props.cell}>
          Available
        </h5>
      );
    } else {
      return (
        <h5 className="m-auto" cell={props.cell}>

        </h5>
      );
    }
  };

  const saveNat = async (event) => {
    // event.preventDefault();
    console.log(event);
    try {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Auth.getUserId(),
          nat: days,
        }),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/nat`,
        requestOptions
      );

      const data = await res.json();

      console.log(data);

      //show success dialog
      setShowSuccessDialog(true);
      // if (data.hasOwnProperty("error")) {
      //   setError(data.error);
      //   setShow(true);
      // } else {
      //   setError("");
      //   setShow(true);
      // }
    } catch (e) {
      console.log(e);
    }
  };

  function cellClick(props) {
    let items = [...days];
    if (items[props.target.attributes.cell.value - 1] == 0) {
      items[props.target.attributes.cell.value - 1] = 1;
      // parseInt(
      // props.target.attributes.cell.value
      // );
    } else {
      items[props.target.attributes.cell.value - 1] = 0;
    }
    setdays(items);
    console.log(items);
  }
  function name() { }
  return (
    <div className="">
      <div className="timetable w-100 ">

        <div className="week-names">
          <div>
            <b>monday</b>
          </div>
          <div>
            <b>tuesday</b>
          </div>
          <div>
            <b>wednesday</b>
          </div>
          <div>
            <b>thursday</b>
          </div>
          <div>
            <b>friday</b>
          </div>
        </div>
        <div className="time-interval">
          <div>
            <b>8:30 - 9:15</b>
          </div>
          <div>
            <b>9:15 - 10:00</b>
          </div>
          <div>
            <b>10:00 - 10:45</b>
          </div>
          <div>
            <b>10:45 - 11:30</b>
          </div>
          <div>
            <b>11:30 - 12:15</b>
          </div>
          <div>
            <b>12:15 - 13:00</b>
          </div>
          <div>
            <b>14:30 - 15:15</b>
          </div>
          <div>
            <b>15:15 - 16:00</b>
          </div>
        </div>
        <div className="content">
          {days.map((item, keyy) => {
            return (
              <div key={keyy}>
                <div
                  className={
                    item > 0
                      ? "accent-blue-gradient timetable-cell"
                      : "timetable-cell"
                  }
                  onClick={(params) => cellClick(params)}
                  day="Monday"
                  cell={keyy + 1}
                >
                  <CenText
                    availability={item}
                    cell={keyy + 1}
                    onClick={(params) => cellClick(params)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="d-flex justify-content-end mt-3">
        <Button className="btn-Primary " onClick={saveNat}>
          Save
        </Button>
      </div>
      <Modal show={showSuccessDialog} onHide={() => setShowSuccessDialog(false)}>
        <Modal.Body className="text-center p-4">
          <div
            style={{
              width: "85px",
              height: "85px",
              borderRadius: "50%",
              backgroundColor: "#006b1f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto",
            }}
          >
            <i
              className="fa fa-check"
              aria-hidden="true"
              style={{
                color: "white",
                fontSize: "45px",
              }}
            ></i>
          </div>


          <h5 style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Availability Updated
          </h5>


          <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
            Your weekly availability has been updated successfully.
          </p>


          <Button
            variant="primary"
            onClick={() => setShowSuccessDialog(false)}
            style={{
              padding: "6px 30px",
            }}
          >
            OK
          </Button>
        </Modal.Body>


      </Modal>
    </div>
  );
}

export default TimeTable;