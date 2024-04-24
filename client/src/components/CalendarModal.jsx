import React from 'react';
import { Modal } from 'react-bootstrap'; 
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);

function CalendarModal({ setShowCalendarModal }) {
  

  return (
    <Modal show onHide={() => setShowCalendarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Calendar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BigCalendar
          localizer={localizer}
          events={[]} // I have to go to work I will try to mess with this before we merge tomorrow 
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </Modal.Body>
      {/* Additional modal footer or controls */}
    </Modal>
  );
}

export default CalendarModal;
