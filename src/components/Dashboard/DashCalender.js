import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);
const DashCalender = (props) => {
  const myEventsList = [
    {
      title: "Event 1 This is the first event that always change",
      start: new Date(),
      end: new Date(),
      allDay: false,
      resource: "sdsdsdsd",
    },
  ];
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.Month}
        views={["month"]}
      />
    </div>
  );
};

export default DashCalender;
