import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);
const DashCalender = (props) => {
  const [events, setevents] = useState([]);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setEventz();
  }, []);
  const setEventz = () => {
    if (props.events != null) {
      props.events.forEach((element) => {
        const event = {
          title: element.name,
          start: new Date(),
          end: new Date(),
          allDay: false,
          resource: "sdsdsdsd",
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
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.Month}
          views={["month"]}
        />
      ) : null}
    </div>
  );
};

export default DashCalender;
