import React, { useContext, useState } from 'react';
import axios from 'axios';
import { CohortContext } from '../context/cohortContext.jsx';


export default function TakeAssessment() {
    const { cohort } = useContext(CohortContext);

    // fetch assignment questions
        // Use assignmentID as reference
    // Display questions 1 by 1 with the ability to answer them
    // Send the completed 
}