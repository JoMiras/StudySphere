import React, { useContext, useEffect, useState } from 'react';
import student from "../img/reading.png";
import { useOutletContext } from "react-router-dom";
import teacher from "../img/teacher.png";
import cohort from "../img/teamwork.png";
import event from "../img/event.png";
import LineGraphTeacher from './LineGraphTeacher';
import CalendarModal from './CalendarModal';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function TeacherDashboard() {
  const [users, refreshData] = useOutletContext();
  const [showCalendar, setShowCalendar] = useState(false);

  const students = users ? users.filter(user => user.role === "student") : [];
  const gpa = users ? users.filter(user => user.role === "gpa") : [];
  const timeSpent = users ? users.filter(user => user.role === "time") : [];
  const Attendancetime = users ? users.filter(user => user.role === "Attendancetime") : [];

  const handleToggleView = () => {
    setShowCalendar(!showCalendar);
  };

  const events = [
    {
      title: 'Meeting with students',
      start: new Date(),
      end: new Date(),
    },
    
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h2>Teacher Dashboard</h2>
        <button type="button" className="btn btn-primary" onClick={handleToggleView}>
          {showCalendar ? 'Show Line Graph' : 'Show Calendar'}
        </button>
        <button type="button" className="btn btn-primary">Edit courses</button>
        <button type="button" className="btn btn-primary">View students</button>
      </div>
      <div className="admin-dashboard-body">
        <div className="top-portion">
          <div className="statistics">
            <div className="info">
              <p>{students.length}</p>
              <p>Total Students</p>
            </div>
            <div className="stats-picture">
              <img src={student} alt="" />
            </div>
          </div>
          <div className="statistics">
            <div className="info">
              <p>0</p>
              <p>Total Cohorts</p>
            </div>
            <div className="stats-picture">
              <img src={cohort} alt="" />
            </div>
          </div>
          <div className="statistics">
            <div className="info">
              <p>0</p>
              <p>Events</p>
            </div>
            <div className="stats-picture">
              <img src={event} alt="" />
            </div>
          </div>
        </div>
      </div>
      {showCalendar ? (
        <div className="middle-portion" style={{ width: '98%', height: '300px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
      ) : (
        <div className="middle-portion" style={{ width: '98%', height: '300px' }}>
          <LineGraphTeacher refreshData={refreshData} />
        </div>
      )}
      <div>
        {/* Calendar modal */}
        {showCalendar && <CalendarModal setShowCalendarModal={setShowCalendar} />}
      </div>
    </div>
  );
}

export default TeacherDashboard;
