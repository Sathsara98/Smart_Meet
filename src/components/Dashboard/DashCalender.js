import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventDetails from "../EventDetails";
import {
  Container,
  Card,
  Col,
  Row,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";

const localizer = momentLocalizer(moment);
const DashCalender = (props) => {
  const [events, setevents] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [event, setEvent] = useState(null);
  const handleClose = () => {
    setShow(false);
  };
  const showDetails = (event) => {
    setEvent(event);
    setShow(true);
  };
  useEffect(() => {
    setEventz();
  }, []);
  const setEventz = () => {
    if (props.events != null) {
      props.events.forEach((element) => {
        const event = {
          title: element.name,
          start: new Date(
            element.date?.slice(0, 4),
            element.date?.slice(5, 7) - 1,
            element.date?.slice(8, 10),
            element.time?.slice(0, 2),
            element.time?.slice(3, 5),
            0,
            0
          ),
          end: new Date(
            element.date?.slice(0, 4),
            element.date?.slice(5, 7) - 1,
            element.date?.slice(8, 10),
            element.time?.slice(8, 10),
            element.time?.slice(11, 13),
            0,
            0
          ),
          allDay: false,
          questions: element.questions,
          members: element.members,
          name: element.name,
          venue: element.venue,
          location: element.location,
          time: element.time,
        };
        events.push(event);
      });
      console.log(events);
      setevents(events);
    }
  };

  return (
    <div>
      {!isLoading ? (
        <>
          <Calendar
            popup
            selectable
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView={Views.Month}
            views={["month"]}
            onSelectEvent={(event) => showDetails(event)}
          />
          <Modal
            show={show}
            size="lg"
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            scrollable={true}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header closeButton onClick={handleClose}>
              <h2>View Event Details</h2>
            </Modal.Header>
            <Modal.Body>
              <EventDetails close={handleClose} event={event} />
            </Modal.Body>
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export default DashCalender;
