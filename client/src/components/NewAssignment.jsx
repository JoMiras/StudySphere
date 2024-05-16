import React, { useContext, useState } from 'react';
import axios from 'axios';
import { CohortContext } from '../context/cohortContext.jsx';

const NewAssignment = () => {
    const [questions, setQuestions] = useState([{ type: 'multiple-choice', questionText: '', answers: [{ text: '', correct: false }] }]);
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentType, setAssignmentType] = useState('');
    const { cohort } = useContext(CohortContext);
    const cohortID = cohort._id;

    const addQuestion = () => {
        setQuestions([...questions, { type: 'multiple-choice', questionText: '', answers: [{ text: '', correct: false }] }]);
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
            console.log(cohortID);
            const res = await axios.post('http://localhost:4000/newAssignment', {
                cohortID: cohortID,
                assignmentName: assignmentName,
                questions: questions
            });
            console.log(res.data); // Handle successful registration
            alert('Assignment was successfully created');
        } catch (err) {
            console.error('Assignment creation error:', err.response);
        }
    };

    const toggleCorrect = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers[answerIndex].correct = !newQuestions[questionIndex].answers[answerIndex].correct;
        setQuestions(newQuestions);
    };

    const handleQuestionTypeChange = (index, type) => {
        const newQuestions = [...questions];
        newQuestions[index] = { type, questionText: '', answers: type === 'written-response' || type === 'essay' ? [] : [{ text: '', correct: false }] };
        setQuestions(newQuestions);
    };

    return (
        <div className='new-assignment-container'>
            <div className='modal-content'>
                <div className='formWrapper'>
                    <span>New Assignment</span>
                    <form onSubmit={onSubmit}>
                        <div className="assignment-info">
                            <div className="inputWrapper">
                                <label htmlFor="assignmentName">Assignment Title:</label>
                                <input type="text" id="assignmentName" name="assignmentName" value={assignmentName} onChange={onChangeName} required />
                                <label htmlFor="assignmentType">Assignment Type:</label>
                                <select id="assignmentType" name="assignmentType" value={assignmentType} onChange={onChangeType} required>
                                    <option value="multiple-choice">Multi Choice</option>
                                    <option value="true-false">True/False</option>
                                    <option value="written-response">Response</option>
                                    <option value="essay">Essay</option>
                                </select>
                            </div>
                        </div>

                        {questions.map((question, questionIndex) => (
                            <div key={questionIndex}>
                                <select
                                    value={question.type}
                                    onChange={(e) => handleQuestionTypeChange(questionIndex, e.target.value)}
                                >
                                    <option value="multiple-choice">Multiple Choice</option>
                                    <option value="true-false">True/False</option>
                                    <option value="written-response">Written Response</option>
                                    <option value="essay">Essay</option>
                                </select>
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
                                <button type="button" onClick={() => removeQuestion(questionIndex)}>Remove Question</button>

                                {question.type === 'multiple-choice' && question.answers.map((answer, answerIndex) => (
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
                                        <button type="button" onClick={() => removeAnswer(questionIndex, answerIndex)}>Remove Answer</button>
                                    </div>
                                ))}
                                {question.type === 'multiple-choice' && (
                                    <button type="button" onClick={() => addAnswer(questionIndex)}>Add Answer</button>
                                )}

                                {question.type === 'true-false' && (
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`trueFalse-${questionIndex}`}
                                                value="true"
                                                checked={question.answers[0]?.correct === true}
                                                onChange={() => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[questionIndex].answers = [{ text: 'True', correct: true }, { text: 'False', correct: false }];
                                                    setQuestions(newQuestions);
                                                }}
                                            />
                                            True
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`trueFalse-${questionIndex}`}
                                                value="false"
                                                checked={question.answers[0]?.correct === false}
                                                onChange={() => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[questionIndex].answers = [{ text: 'True', correct: false }, { text: 'False', correct: true }];
                                                    setQuestions(newQuestions);
                                                }}
                                            />
                                            False
                                        </label>
                                    </div>
                                )}

                                {question.type === 'written-response' && (
                                    <textarea
                                        value={question.answers[0]?.text || ''}
                                        onChange={(e) => {
                                            const newQuestions = [...questions];
                                            newQuestions[questionIndex].answers = [{ text: e.target.value }];
                                            setQuestions(newQuestions);
                                        }}
                                        placeholder="Enter the written response here"
                                    />
                                )}

                                {question.type === 'essay' && (
                                    <textarea
                                        value={question.answers[0]?.text || ''}
                                        onChange={(e) => {
                                            const newQuestions = [...questions];
                                            newQuestions[questionIndex].answers = [{ text: e.target.value }];
                                            setQuestions(newQuestions);
                                        }}
                                        placeholder="Enter the essay response here"
                                    />
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addQuestion}>Add Question</button>
                        <button type="submit">Create Assignment</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewAssignment;





// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Sphere from "../img/globe.png"
// import { AuthContext } from '../context/authContext.jsx';
// import { CohortContext } from '../context/cohortContext.jsx';

// const NewAssignment = () => {
//     const [ questions, setQuestions ] = useState([{ questionText: '', answers: [{ text: '', correct: false }] }]);
//     const [ assignmentName, setAssignmentName ] = useState('');
//     const [ assignmentType, setAssignmentType ] = useState('');
//     const { cohort } = useContext(CohortContext)
//     const cohortID = cohort._id;

//     const addQuestion = () => {
//         setQuestions([...questions, { questionText: '', answers: [{ text: '', correct: false }] }]);
//       };
      
//     const removeQuestion = (questionIndex) => {
//         setQuestions(questions.filter((_, index) => index !== questionIndex));
//       };    
  
//     const addAnswer = (questionIndex) => {
//     const newQuestions = [...questions];
//     newQuestions[questionIndex].answers.push({ text: '', correct: false });
//     setQuestions(newQuestions);
//     };
    
//     const removeAnswer = (questionIndex, answerIndex) => {
//         const newQuestions = [...questions];
//         newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.filter((_, index) => index !== answerIndex);
//         setQuestions(newQuestions);
//       };
    
//     const onChangeType = (e) => {
//         setAssignmentType(e.target.value);
//     };

//     const onChangeName = (e) => {
//         setAssignmentName(e.target.value);
//     };

    
//   const onSubmit = async (e) => {
//     e.preventDefault();
//       try {
//         console.log(cohortID)
//         const res = await axios.post('http://localhost:4000/newAssignment', {
//           cohortID: cohortID, 
//           assignmentName: assignmentName, 
//           questions: questions
//         });
//         console.log(res.data); // Handle successful registration
//         alert('Assignment was successfully created')
//       } catch (err) {
//         console.error('Assignment creation error:', err.response);
//       }
//   };

//   const toggleCorrect = (questionIndex, answerIndex) => {
//     const newQuestions = [...questions];
//     newQuestions[questionIndex].answers[answerIndex].correct = !newQuestions[questionIndex].answers[answerIndex].correct;
//     setQuestions(newQuestions);
//   };

//   return (
//     <div className='new-assignment-container'>
//         <div className='formWrapper'>
//           <span >New Assignment</span>
//           <form >
//             <div className="assignment-info">
//               <div className="inputWrapper">
//                 <label htmlFor="assignmentName">Assignment Title:</label>
//                 <input type="text" id="assignmentName" name="assignmentName" value={assignmentName} onChange={e => onChangeName(e)} required />
//                 <label ></label>
//                 <select type="text" id="assignmentType" name="assignmentType" value={assignmentType} onChange={e => onChangeType(e)} required>
//                   <option value="multiple-choice">Multi Choice</option>
//                   <option value="true-false">True/False</option>
//                   <option value="written-response">Response</option>
//                   <option value="essay">Essay</option>
//                 </select>
//               </div>
//             </div>

//             {/* <div className="inputWrapper">
//                 <label htmlFor="question-text">Question # 1:</label>
//                 <input type="text" id="question-text" name="question-text" value={questionText} onChange={e => onChange(e)} />
//             </div> */}

//             {questions.map((question, questionIndex) => (
//               <div key={questionIndex}>
//                 <input
//                   type="text"
//                   value={question.questionText}
//                   onChange={(e) => {
//                     const newQuestions = [...questions];
//                     newQuestions[questionIndex].questionText = e.target.value;
//                     setQuestions(newQuestions);
//                   }}
//                   placeholder={`Question #${questionIndex + 1}`}
//                 />
//                 <button onClick={() => removeQuestion(questionIndex)}>Remove Question</button>
//                 {question.answers.map((answer, answerIndex) => (
//                   <div key={answerIndex}>
//                     <input
//                       type="text"
//                       value={answer.text}
//                       onChange={(e) => {
//                         const newQuestions = [...questions];
//                         newQuestions[questionIndex].answers[answerIndex].text = e.target.value;
//                         setQuestions(newQuestions);
//                       }}
//                       placeholder={`Answer #${answerIndex + 1}`}
//                     />
//                     <input
//                       type="checkbox"
//                       checked={answer.correct}
//                       onChange={() => toggleCorrect(questionIndex, answerIndex)}
//                     />
//                     <button onClick={() => removeAnswer(questionIndex, answerIndex)}>Remove Answer</button>
//                   </div>
//                 ))}
//                 <button onClick={() => addAnswer(questionIndex)}>Add Answer</button>
//               </div>
//             ))}
//             <button onClick={addQuestion}>Add Question</button>
//             <button onClick={onSubmit}>Create Assignment</button>
//           </form>
//         </div>
//     </div>
//   );
// };

// export default NewAssignment;
