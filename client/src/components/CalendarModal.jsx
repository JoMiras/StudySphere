import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function CalendarModal({ selectedDate, handleAddEvent, setShowCalendarModal }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleSubmit = () => {
    const newEvent = {
      title,
      start: startDate,
      end: endDate,
    };
    handleAddEvent(newEvent);
  };

  return (
    <Modal show onHide={() => setShowCalendarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="eventTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="eventStartDate">
            <Form.Label>Start Date and Time</Form.Label>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </Form.Group>
          <Form.Group controlId="eventEndDate">
            <Form.Label>End Date and Time</Form.Label>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowCalendarModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Add Event
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CalendarModal;