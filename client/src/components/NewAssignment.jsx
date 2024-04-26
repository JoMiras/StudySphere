import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sphere from "../img/globe.png"
import { AuthContext } from '../context/authContext.jsx';
import { CohortContext } from '../context/cohortContext.jsx';

const NewAssignment = () => {
    const [ questions, setQuestions ] = useState([{ questionText: '', answers: [{ text: '', correct: false }] }]);
    const [ assignmentName, setAssignmentName ] = useState('');
    const [ assignmentType, setAssignmentType ] = useState('');
    const { cohort } = useContext(CohortContext)
    const cohortID = cohort._id;

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', answers: [{ text: '', correct: false }] }]);
      };
      
    const removeQuestion = (questionIndex) => {
        setQuestions(questions.filter((_, index) => index !== questionIndex));
      };    
  
    const addAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({ text: '', correct: false });
    setQuestions(newQuestions);
    };
    
    const removeAnswer = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.filter((_, index) => index !== answerIndex);
        setQuestions(newQuestions);
      };
    
    const onChangeType = (e) => {
        setAssignmentType(e.target.value);
    };

    const onChangeName = (e) => {
        setAssignmentName(e.target.value);
    };

    
  const onSubmit = async (e) => {
    e.preventDefault();
      try {
        console.log(cohortID)
        const res = await axios.post('http://localhost:4000/newAssignment', {
          cohortID: cohortID, 
          assignmentName: assignmentName, 
          questions: questions
        });
        console.log(res.data); // Handle successful registration
        alert('Assignment was successfully created')
      } catch (err) {
        console.error('Assignment creation error:', err.response);
      }
  };

  const toggleCorrect = (questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].correct = !newQuestions[questionIndex].answers[answerIndex].correct;
    setQuestions(newQuestions);
  };

  return (
    <div className='new-assignment-container'>
      <div className='modal-content'>
        <div className='formWrapper'>
          <span >New Assignment</span>
          <form onSubmit={e => onSubmit(e)}>
            <div className="assignment-info">
              <div className="inputWrapper">
                <label htmlFor="assignmentName">Assignment Title:</label>
                <input type="text" id="assignmentName" name="assignmentName" value={assignmentName} onChange={e => onChangeName(e)} required />
                <label ></label>
                <select type="text" id="assignmentType" name="assignmentType" value={assignmentType} onChange={e => onChangeType(e)} required>
                  <option value="multiple-choice">Multi</option>
                  <option value="true-false">True/False</option>
                  <option value="written-response">Response</option>
                  <option value="essay">Essay</option>
                </select>
              </div>
            </div>

            {/* <div className="inputWrapper">
                <label htmlFor="question-text">Question # 1:</label>
                <input type="text" id="question-text" name="question-text" value={questionText} onChange={e => onChange(e)} />
            </div> */}

{questions.map((question, questionIndex) => (
        <div key={questionIndex}>
          <input
            type="text"
            value={question.questionText}
            onChange={(e) => {
              const newQuestions = [...questions];
              newQuestions[questionIndex].questionText = e.target.value;
              setQuestions(newQuestions);
            }}
            placeholder={`Question #${questionIndex + 1}`}
          />
          <button onClick={() => removeQuestion(questionIndex)}>Remove Question</button>
          {question.answers.map((answer, answerIndex) => (
            <div key={answerIndex}>
              <input
                type="text"
                value={answer.text}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[questionIndex].answers[answerIndex].text = e.target.value;
                  setQuestions(newQuestions);
                }}
                placeholder={`Answer #${answerIndex + 1}`}
              />
              <input
                type="checkbox"
                checked={answer.correct}
                onChange={() => toggleCorrect(questionIndex, answerIndex)}
              />
              <button onClick={() => removeAnswer(questionIndex, answerIndex)}>Remove Answer</button>
            </div>
          ))}
          <button onClick={() => addAnswer(questionIndex)}>Add Answer</button>
        </div>
      ))}
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={onSubmit}>Create Assignment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewAssignment;
