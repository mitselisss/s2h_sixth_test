import React, { useState, useEffect } from "react";
import "./calendar.css";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const daysMobile = ["M", "T", "W", "T", "F", "S", "S"];

function WeeklyCalendar() {
  const [week, setWeek] = useState(1);

  const handleNextWeek = () => {
    setWeek(week + 1);
  };

  const handlePreviousWeek = () => {
    setWeek(week - 1);
  };

  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      forceUpdate();
    };

    window.addEventListener("resize", handleResize); // Add event listener for window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up the event listener
    };
  }, []);

  const forceUpdate = () => {
    setSelectedDay(null);
  };

  return (
    <div className="calendar">
      <div className="controls">
        <button
          className="previousweek"
          onClick={handlePreviousWeek}
          disabled={week === 1}
        ></button>
        <h1
          className="meal-type-font"
          style={{ color: "#ffe27d", fontSize: "45px" }}
        >
          Week {week}
        </h1>
        <button className="nextweek" onClick={handleNextWeek}></button>
      </div>
      <div className="days">
        {days.map((day, index) => (
          <div
            className={`day ${selectedDay === day ? "selected" : ""}`}
            key={day}
            onClick={() => setSelectedDay(day)}
          >
            <h1 className="custom-font">
              {window.innerWidth <= 600 ? daysMobile[index] : day}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyCalendar;
