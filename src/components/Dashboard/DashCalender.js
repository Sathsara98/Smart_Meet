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
  const [multiShow, setMultiShow] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const handleClose = () => {
    setShow(false);
  };
  const showDetails = (event) => {
    setEvent(event);
    setShow(true);
  };
  // Rebuild events whenever props.events changes
  useEffect(() => {
    setEventz();
  }, [props.events]);


  const setEventz = () => {
    if (props.events != null && props.events.length > 0) {
      const newEvents = props.events.map((element) => {
        // parse start
        const year = parseInt(element.date?.slice(0, 4));
        const month = parseInt(element.date?.slice(5, 7)) - 1;
        const day = parseInt(element.date?.slice(8, 10));
        const startHour = parseInt(element.time?.slice(0, 2)) || 0;
        const startMin = parseInt(element.time?.slice(3, 5)) || 0;
        const start = new Date(year, month, day, startHour, startMin, 0);


        // try to parse end time if provided (e.g., "09:00 - 10:00"), otherwise default to +1 hour
        let end;
        if (element.time && element.time.includes("-")) {
          const parts = element.time.split("-");
          const endPart = parts[1].trim().slice(0, 5);
          const endHour = parseInt(endPart.slice(0, 2)) || (startHour + 1);
          const endMin = parseInt(endPart.slice(3, 5)) || startMin;
          end = new Date(year, month, day, endHour, endMin, 0);
        } else {
          end = new Date(start.getTime() + 60 * 60 * 1000); // default 1 hour
        }


        // try to determine a development area / sector for display
        let sector = element.sector || element.devArea || element.maxArea || null;
        if (!sector && Array.isArray(element.questions) && element.questions.length > 0) {
          const counts = {};
          element.questions.forEach((q) => {
            const area = q.dArea || q.developmentArea || q.area || q.devArea || "Unknown";
            counts[area] = (counts[area] || 0) + 1;
          });
          // pick the most frequent area
          sector = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        }


        return {
          title: element.name,
          start,
          end,
          allDay: false,
          questions: element.questions,
          members: element.members,
          name: element.name,
          venue: element.venue,
          location: element.location,
          time: element.time,
          sector,
        };
      });
      setevents(newEvents);
    } else {
      setevents([]);
    }
  };


  // helper: compare dates ignoring time
  const datesEqual = (d1, d2) => {
    const a = new Date(d1);
    const b = new Date(d2);
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };


  // add a class/style to days that have events so we can highlight them
  const dayPropGetter = (date) => {
    const dayStr = new Date(date).toDateString();
    const has = events.some((ev) => new Date(ev.start).toDateString() === dayStr);
    if (has) {
      // debug
      // console.debug("highlighting day:", dayStr);
      return {
        className: "has-event",
        style: { backgroundColor: "#0D97B9", color: "#fff", cursor: "pointer" },
      };
    }
    return {};
  };


  // when user clicks a day cell, open event(s) on that day
  const handleDayClick = (slotInfo) => {
    const clicked = events.filter((ev) => datesEqual(ev.start, slotInfo.start));
    if (clicked.length === 1) {
      showDetails(clicked[0]);
    } else if (clicked.length > 1) {
      setSelectedDayEvents(clicked);
      setMultiShow(true);
    }
  };


  return (
    <div>
      {!isLoading ? (
        <>
          <Calendar
            className="dashboard-calendar-small"
            popup
            selectable
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView={Views.Month}
            views={["month"]}
            onSelectEvent={(event) => showDetails(event)}
            onSelectSlot={(slotInfo) => handleDayClick(slotInfo)}
            dayPropGetter={(date) => dayPropGetter(date)}
            style={{ height: props.height || 260 }}
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
              <h2>View Meeting Details</h2>
            </Modal.Header>
            <Modal.Body>
              <EventDetails close={handleClose} event={event} />
            </Modal.Body>
          </Modal>
          {/* small modal for multiple events on the selected day */}
          <Modal show={multiShow} onHide={() => setMultiShow(false)} size="md" aria-labelledby="day-events-modal">
            <Modal.Header closeButton>
              <h5>Events on this day</h5>
            </Modal.Header>
            <Modal.Body>
              {selectedDayEvents.map((ev, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                  <div style={{ fontWeight: 600 }}>{ev.title}</div>
                  <Button variant="link" onClick={() => { setMultiShow(false); showDetails(ev); }}>
                    View
                  </Button>
                </div>
              ))}
            </Modal.Body>
          </Modal>        </>
      ) : null}
    </div>
  );
};


export default DashCalender;





