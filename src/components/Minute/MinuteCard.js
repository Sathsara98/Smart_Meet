import React from "react";
import {
  Container,
  Card,
  Col,
  Row,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";

import "./Minute.css";


// MinuteCard component displays one meeting minute as a card.
// props contains data sent from the parent component.
// Example: props.minute, props.more, props.isLatest
function MinuteCard(props) {
  return (
    // Card is the main container for one minute record.
    <Card
      className="card-minutes"

      // Inline styles are used to control card spacing and appearance.
      style={{
        margin: "2% 10px 0%",
        borderRadius: "15px",
        marginLeft: "10px",
        marginRight: "10px",
        boxShadow: "none"
      }}
    >
      {/* Row is used to arrange content inside the card */}
      <Row>
        {/* Card.Body contains the actual card content */}
        <Card.Body
          style={{
            // Adds soft shadow around the card body.
            boxShadow: "-2px 3px 14px -4px rgba(74, 74, 74, 0.4)",

            // Makes card corners rounded.
            borderRadius: "10px"
          }}
        >

          {/*
           Old image section is commented.
           WHY: This was probably used before to show a minute image,
           but currently the card uses only text details.
         */}
          {/* <div
           className=" col-2 float-left"
           style={{
             borderRadius: "20px",
             overflow: "auto",
           }}
         >
           <img className="  " width="150px" src={`${process.env.PUBLIC_URL}/assets/img/minute.jpg`} alt="Card image cap"></img>
         </div> */}

          {/*
           Old layout section is commented.
           WHY: This was an older design for showing meeting name,
           date, venue, and view button.
           New design below is cleaner and responsive.
         */}
          {/* <div className=" d-flex justify-content-between align-items-center p-3" style={{ fontWeight: "bolder" }}>
           <div style={{ textAlign: "left", marginLeft: "0" }}>
             <h4 style={{ fontWeight: "bold" }}>
               Meeting Name : <span style={{ textTransform: 'uppercase' }}>{props.minute.meeting_name}</span>
             </h4>
             <h4 style={{ fontWeight: "bold" }}>
               Meeting Date<span style={{ color: "transparent" }}>d</span> :{" "}
               {props.minute.meeting_date}
             </h4>
             <h4 style={{ fontWeight: "bold" }}>
               Meeting Venue : {props.minute.meeting_venue}
             </h4>
           </div>
           <div className="align-self-end">
             <Button
               variant="light"
               className="btnPrimary float-right"
               type="submit"
               onClick={() => props.more(props.minute)}
             >
               View
             </Button>
           </div>
         </div> */}

          {/* Old text area is commented */}
          {/* <Card.Text>sss</Card.Text> */}


          {/* Main active card layout */}
          <div className="row">

            {/* Left side: meeting details */}
            <div className="col-md-10 d-flex flex-column justify-content-center">

              {/* Display meeting name */}
              <h4 className="meeting-name">
                {props.minute.meeting_name}
              </h4>

              {/* Display meeting date, time, and venue in one row */}
              <div className="d-flex meeting-detail-wrap">

                {/* Meeting date from minute object */}
                <div className="col-md-4 pl-0">
                  Date :{" "}{props.minute.meeting_date}
                </div>

                {/* Meeting time from minute object */}
                <div className="col-md-4">
                  Time :{" "}{props.minute.meeting_time}
                </div>

                {/* Meeting venue from minute object */}
                <div className="col-md-4">
                  Venue :{" "}{props.minute.meeting_venue}
                </div>
              </div>
            </div>


            {/* Right side: View button */}
            <div className="col-md-2 minute-view-btn">

              <Button
                // If this is the latest minute, add glowing style.
                // WHY: This helps users quickly identify the latest minute.
                className={`btn btn-primary float-right ${props.isLatest ? "latest-glow-btn" : ""}`}

                // When user clicks View button.
                onClick={() => {
                  // If minute is not finalized, open minute details.
                  if (!props.minute.isFinalized) {
                    props.more(props.minute);
                  } else {
                    // If minute is finalized, show message.
                    alert("This minute is finalized and cannot be edited");
                  }
                }}
              >
                View
              </Button>

            </div>
          </div>
        </Card.Body>
      </Row>
    </Card>
  );
}


export default MinuteCard;

