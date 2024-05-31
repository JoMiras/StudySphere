import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { CohortContext } from '../context/cohortContext';
import NewAssignment from './NewAssignment';
import '../style.scss';

const DisplayAssignments = () => {
  const { currentUser } = useContext(AuthContext);
  const [newAssignmentPanel, setNewAssignmentPanel] = useState(false);
  const { cohort } = useContext(CohortContext);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [studentAnswers, setStudentAnswers] = useState([]);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
    const questionsArray = Array.isArray(assignment.questions) ? assignment.questions : [];
    setStudentAnswers(
      questionsArray.map((question) => ({
        questionId: question._id,
        answer: ''
      }))
    );
    setIsPanelOpen(true);
  };

  const handleAnswerChange = (questionIndex, event) => {
    const newAnswers = [...studentAnswers];
    newAnswers[questionIndex].answer = event.target.value;
    setStudentAnswers(newAnswers);
  };

  const handleOptionChange = (questionIndex, optionIndex) => {
    const newAnswers = [...studentAnswers];
    newAnswers[questionIndex].answer = optionIndex;
    setStudentAnswers(newAnswers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Submitting answers:', studentAnswers);
    // Add your form submission logic here
  };

  const displayCohort = cohort.cohortFiles.assignments.map((assignment, index) => {
    const questionCount = Array.isArray(assignment.questions) ? assignment.questions.length : 0;
    return (
      <div
        key={index}
        className="assignment-tab"
        onClick={() => handleAssignmentClick(assignment)}
      >
        <div className="assignment-name">{assignment.assignmentName}</div>
        <div className="assignment-type">Type: {assignment.assignmentType}</div>
        <div className="number-of-questions">Questions: {questionCount}</div>
        <div className="students-submitted">Students submitted: {assignment.submitted}</div>
        {currentUser.role === 'student' && (
          <button className="btn btn-outline-primary btn-sm">
            Submit Assignment
          </button>
        )}
      </div>
    );
  });

  return (
    <div className='assignments-container'>
      {currentUser.role === 'SuperAdmin' && (
        <>
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setNewAssignmentPanel(true)}>
            New Assignment
          </button>
          <div className={`overlay ${newAssignmentPanel ? 'show' : ''}`} onClick={() => setNewAssignmentPanel(false)}></div>
          <div className={`panel ${newAssignmentPanel ? 'open' : ''}`}>
            <button className="close-btn" onClick={() => setNewAssignmentPanel(false)}>&times;</button>
            <h2>Create New Assignment</h2>
            <NewAssignment />
          </div>
        </>
      )}
      <div className="assignments">
        {displayCohort}
      </div>
      <div className={`overlay ${isPanelOpen ? 'show' : ''}`} onClick={togglePanel}></div>
      <div className={`assignment-panel ${isPanelOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={togglePanel}>&times;</button>
        <h2>Submit Assignment</h2>
        {selectedAssignment && (
          <div className="formWrapper">
            <form onSubmit={handleSubmit}>
              {Array.isArray(selectedAssignment.questions) && selectedAssignment.questions.map((question, index) => (
                <div key={index} className="question">
                  <label htmlFor={`question-${index}`}>{question.questionText}</label>
                  {question.type === 'multiple-choice' && question.answers.map((answer, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        type="radio"
                        id={`question-${index}-option-${optionIndex}`}
                        name={`question-${index}`}
                        value={optionIndex}
                        checked={studentAnswers[index]?.answer === optionIndex}
                        onChange={() => handleOptionChange(index, optionIndex)}
                      />
                      <label htmlFor={`question-${index}-option-${optionIndex}`}>{answer.text}</label>
                    </div>
                  ))}
                  {question.type === 'true-false' && (
                    <div>
                      <input
                        type="radio"
                        id={`question-${index}-true`}
                        name={`question-${index}`}
                        value="true"
                        checked={studentAnswers[index]?.answer === 'true'}
                        onChange={(e) => handleAnswerChange(index, e)}
                      />
                      <label htmlFor={`question-${index}-true`}>True</label>
                      <input
                        type="radio"
                        id={`question-${index}-false`}
                        name={`question-${index}`}
                        value="false"
                        checked={studentAnswers[index]?.answer === 'false'}
                        onChange={(e) => handleAnswerChange(index, e)}
                      />
                      <label htmlFor={`question-${index}-false`}>False</label>
                    </div>
                  )}
                  {question.type === 'written-response' && (
                    <input
                      type="text"
                      id={`question-${index}`}
                      value={studentAnswers[index]?.answer || ''}
                      onChange={(e) => handleAnswerChange(index, e)}
                      required
                    />
                  )}
                </div>
              ))}
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayAssignments;
