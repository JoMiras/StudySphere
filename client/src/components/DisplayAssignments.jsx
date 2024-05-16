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
    const [newAssignmentPanel, setNewAssignmentPanel] = useState(false);
    const { cohort } = useContext(CohortContext);
    const navigate = useNavigate();
  
    
    const toggleNewAssignmentPanel = () => {
        setNewAssignmentPanel(!newAssignmentPanel);
    };
console.log(cohort)
  
    const displayCohort = cohort.cohortFiles.assignments.map((assignment, index) => {
        console.log(assignment);  // This will log each assignment to the console.
        const questionCount = assignment.questions ? Object.keys(assignment.questions).length : 0;
        return (
            <React.Fragment key={index}>
                <div className="assignment">
                    <div className='name-and-type'>
                        <div className='name'>
                            <p><strong>{assignment.assignmentName}</strong></p>
                        </div>
                        <div className='type'>
                            <p>Type: </p>
                            <p>FILLER TEXT</p>
                        </div>
                    </div>
                    <div className='content'>
                        <div className='questions'>
                            <p><strong># of Questions: </strong>{questionCount}</p>
                        </div>
                        <div className='student-submissions'>
                            <p><strong>Students Submitted: </strong> FILLER TEXT</p>
                        </div>
                    </div>
                </div>
                <hr />
            </React.Fragment>
        );
    });

    return (
        <div className='assignments'>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={toggleNewAssignmentPanel}>New Assignment</button>
            <div>
                {displayCohort}
            </div>
            <div className={`overlay ${newAssignmentPanel ? 'show' : ''}`} onClick={toggleNewAssignmentPanel}></div>
            <div className={`panel ${newAssignmentPanel ? 'open' : ''}`}>
                <button className="close-btn" onClick={toggleNewAssignmentPanel}>&times;</button>
                <h2>Create New Assignment</h2>
                <NewAssignment />
            </div>
        </div>
    );
}
  