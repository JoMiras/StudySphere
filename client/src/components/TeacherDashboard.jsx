import React, { useState } from 'react';
import student from "../img/reading.png";
import teacher from "../img/teacher.png";
import cohort from "../img/teamwork.png";
import eventIcon from "../img/event.png";
import LineGraphTeacher from './LineGraphTeacher';
import CalendarModal from './CalendarModal';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function TeacherDashboard() {
  const [showCalendar, setShowCalendar] = useState(true); // big calendar
  const [showSmallCalendarModal, setShowSmallCalendarModal] = useState(false); // the small edit calendar 
  const [selectedDate, setSelectedDate] = useState(null); // store the selected date
  const [events, setEvents] = useState([]);

  const handleToggleView = () => {
    setShowCalendar(!showCalendar);
  };

  const handleToggleSmallCalendarModal = () => {
    setShowSmallCalendarModal(!showSmallCalendarModal);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowSmallCalendarModal(true);
  };

  const handleAddEvent = (event) => {
    setEvents([...events, event]);
    setShowSmallCalendarModal(false);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h2>Teacher Dashboard</h2>
        <button type="button" className="btn btn-primary" onClick={handleToggleView}>
          {showCalendar ? 'Show Line Graph' : 'Show Calendar'}
        </button>
        <button type="button" className="btn btn-primary">Edit courses</button>
        <button type="button" className="btn btn-primary">View students</button>
        <button type="button" className="btn btn-primary" onClick={handleToggleSmallCalendarModal}>
          Edit Calendar Modal
        </button>
      </div>
      <div className="admin-dashboard-body">
        <div className="top-portion">
          <div className="statistics">
            <div className="info">
              <p>0</p>
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
              <p>{events.length}</p>
              <p>Events</p>
            </div>
            <div className="stats-picture">
              <img src={eventIcon} alt="" />
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
            onSelectEvent={(event) => console.log(event)}
          />
        </div>
      ) : null}
      {!showCalendar ? (
        <div className="middle-portion" style={{ width: '98%', height: '300px' }}>
          <LineGraphTeacher />
        </div>
      ) : null}
      <div>
        {showSmallCalendarModal && (
          <CalendarModal
            selectedDate={selectedDate}
            handleAddEvent={handleAddEvent}
            setShowCalendarModal={setShowSmallCalendarModal}
          />
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;
