import React, { useContext, useEffect, useState } from 'react';
import { CohortContext } from '../context/cohortContext';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import exam from "../img/exam.png"
import book from "../img/book.png"
import books from "../img/books.png"
import quiz from "../img/megaphone.png"
import events from "../img/upcoming.png"
import defaultPhoto from "../img/shark.png"
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NewAssignment from './NewAssignment';



export default function DisplayAssignments() {
    const [newAssignmentModal, setNewAssignmentModal] = useState(false);
    const { cohort } = useContext(CohortContext);
    const navigate = useNavigate();
  
    
    const toggleNewAssignmentModal = () => {
        setNewAssignmentModal(!newAssignmentModal);
    };
console.log(cohort)
  
    const displayCohort = cohort.cohortFiles.assignments.map((assignment, index) => {
        console.log(assignment);  // This will log each assignment to the console.
        const questionCount = assignment.questions ? Object.keys(assignment.questions).length : 0;
        return (
            <>
            <div className="assignment" key={index}>  
                <p><strong>Name: </strong>{assignment.assignmentName}</p>
                <p><strong>Length: </strong>{questionCount}</p>
            </div>
            <hr />
            </>
        );
    });

    return (
        <>
                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={toggleNewAssignmentModal}>New Assignment</button>
        <div className='assignments'>
            {displayCohort}
        </div>
            <Modal className="modal-container" show={newAssignmentModal} onHide={toggleNewAssignmentModal}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Assignment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <NewAssignment />
            </Modal.Body>
        </Modal>
</>
    );
}
  