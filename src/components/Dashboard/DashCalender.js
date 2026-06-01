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


// This connects moment with react-big-calendar.
// Calendar needs a localizer to understand date/time format.
const localizer = momentLocalizer(moment);


// DashCalender component displays meetings in calendar view.
const DashCalender = (props) => {

  // Stores calendar events after formatting backend data.
  const [events, setevents] = useState([]);

  // Loading status. If true, calendar will not show.
  const [isLoading, setLoading] = useState(false);

  // Controls meeting details modal open/close.
  const [show, setShow] = useState(false);

  // Stores selected event details.
  const [event, setEvent] = useState(null);

  // Controls modal for multiple events in one day.
  const [multiShow, setMultiShow] = useState(false);

  // Stores all events available on selected day.
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);


  // Close meeting details modal.
  const handleClose = () => {
    setShow(false);
  };


  // Open meeting details modal.
  // Logic: when user clicks an event, save that event and show modal.
  const showDetails = (event) => {
    setEvent(event);
    setShow(true);
  };


  // This runs whenever props.events changes.
  // Logic: backend events may not be in calendar format,
  // so we rebuild/convert them using setEventz().
  useEffect(() => {
    setEventz();
  }, [props.events]);


  const setEventz = () => {
    // Check whether events are available from parent component.
    if (props.events != null && props.events.length > 0) {

      // Convert each backend event into react-big-calendar event format.
      const newEvents = props.events.map((element) => {

        // Extract year, month, and day from event date.
        const year = parseInt(element.date?.slice(0, 4));
        const month = parseInt(element.date?.slice(5, 7)) - 1;
        const day = parseInt(element.date?.slice(8, 10));

        // Extract start hour and minute from time.
        const startHour = parseInt(element.time?.slice(0, 2)) || 0;
        const startMin = parseInt(element.time?.slice(3, 5)) || 0;

        // Create JavaScript Date object for event start time.
        const start = new Date(year, month, day, startHour, startMin, 0);


        // Create event end time.
        let end;

        // If time has range like "09:00 - 10:00",
        // take the second part as end time.
        if (element.time && element.time.includes("-")) {
          const parts = element.time.split("-");
          const endPart = parts[1].trim().slice(0, 5);
          const endHour = parseInt(endPart.slice(0, 2)) || (startHour + 1);
          const endMin = parseInt(endPart.slice(3, 5)) || startMin;

          // Create JavaScript Date object for event end time.
          end = new Date(year, month, day, endHour, endMin, 0);
        } else {
          // If end time is not available, default duration is 1 hour.
          end = new Date(start.getTime() + 60 * 60 * 1000);
        }


        // Try to get development area/sector directly from event.
        let sector = element.sector || element.devArea || element.maxArea || null;

        // If sector is missing, calculate it from questions.
        // Logic: count question development areas and select the most repeated area.
        if (!sector && Array.isArray(element.questions) && element.questions.length > 0) {
          const counts = {};

          element.questions.forEach((q) => {
            const area = q.dArea || q.developmentArea || q.area || q.devArea || "Unknown";
            counts[area] = (counts[area] || 0) + 1;
          });

          // Pick development area with highest count.
          sector = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        }


        // Return calendar event object.
        // react-big-calendar needs title, start, and end fields.
        return {
          title: element.name,
          start,
          end,
          allDay: false,

          // Extra data used in EventDetails modal.
          questions: element.questions,
          members: element.members,
          name: element.name,
          venue: element.venue,
          location: element.location,
          time: element.time,
          sector,
        };
      });

      // Save formatted events to state.
      setevents(newEvents);
    } else {
      // If no events, clear calendar.
      setevents([]);
    }
  };


  // This helper compares two dates without checking time.
  // Logic: used to find all events on the clicked calendar day.
  const datesEqual = (d1, d2) => {
    const a = new Date(d1);
    const b = new Date(d2);

    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  };


  // This function styles days that have events.
  // Logic: if a day has at least one event, highlight that date cell.
  const dayPropGetter = (date) => {
    const dayStr = new Date(date).toDateString();

    // Check whether any event starts on this date.
    const has = events.some((ev) => new Date(ev.start).toDateString() === dayStr);

    if (has) {
      return {
        className: "has-event",
        style: { backgroundColor: "#0D97B9", color: "#fff", cursor: "pointer" },
      };
    }

    // If no event, return normal style.
    return {};
  };


  // This runs when user clicks a calendar day cell.
  // Logic:
  // 1. Find events on clicked day.
  // 2. If one event exists, open meeting details directly.
  // 3. If many events exist, show list modal first.
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
          {/* Main calendar view */}
          <Calendar
            className="dashboard-calendar-small"
            popup
            selectable
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"

            // Show month view by default.
            defaultView={Views.Month}

            // Only allow month view.
            views={["month"]}

            // When user clicks an event, show details modal.
            onSelectEvent={(event) => showDetails(event)}

            // When user clicks a date cell, check events on that day.
            onSelectSlot={(slotInfo) => handleDayClick(slotInfo)}

            // Highlight dates that have events.
            dayPropGetter={(date) => dayPropGetter(date)}

            // Calendar height comes from props, otherwise default is 260.
            style={{ height: props.height || 260 }}
          />

          {/* Modal to show selected meeting details */}
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
              {/* Pass selected event to EventDetails component */}
              <EventDetails close={handleClose} event={event} />
            </Modal.Body>
          </Modal>

          {/* Modal shown when selected date has multiple events */}
          <Modal
            show={multiShow}
            onHide={() => setMultiShow(false)}
            size="md"
            aria-labelledby="day-events-modal"
          >
            <Modal.Header closeButton>
              <h5>Events on this day</h5>
            </Modal.Header>

            <Modal.Body>
              {/* Display all events on selected day */}
              {selectedDayEvents.map((ev, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0"
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{ev.title}</div>

                  {/* Click View to open selected event details */}
                  <Button
                    variant="link"
                    onClick={() => {
                      setMultiShow(false);
                      showDetails(ev);
                    }}
                  >
                    View
                  </Button>
                </div>
              ))}
            </Modal.Body>
          </Modal>
        </>
      ) : null}
    </div>
  );
};


export default DashCalender;

