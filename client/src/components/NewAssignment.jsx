import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { CohortContext } from '../context/cohortContext.jsx';
import '../style.scss'; // Ensure you have the correct path to your SCSS file

const NewAssignment = ({ onClose }) => {
  const { cohort } = useContext(CohortContext);
  const cohortID = cohort._id;

  const [formData, setFormData] = useState({
    cohortID: cohortID,
    assignmentName: '',
    assignmentType: 'q-and-a',
    questions: [{ type: 'multiple-choice', questionText: '', answers: [{ text: '', correct: false }] }],
    rubricFileUrl: null,
    submissions: 0
  });

  const { assignmentName, assignmentType, questions } = formData;
  const [rubricFile, setRubricFile] = useState(null);

  useEffect(() => {
    setFormData({ ...formData, cohortID: cohort._id });
  }, [cohort]);

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...questions, { type: 'multiple-choice', questionText: '', answers: [{ text: '', correct: false }] }]
    });
  };

  const removeQuestion = (questionIndex) => {
    setFormData({
      ...formData,
      questions: questions.filter((_, index) => index !== questionIndex)
    });
  };

  const addAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({ text: '', correct: false });
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeAnswer = (questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.filter((_, index) => index !== answerIndex);
    setFormData({ ...formData, questions: newQuestions });
  };

  const onChangeType = (e) => {
    setFormData({ ...formData, assignmentType: e.target.value });
  };

  const onChangeName = (e) => {
    setFormData({ ...formData, assignmentName: e.target.value });
  };

  const onRubricFileChange = (e) => {
    setRubricFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      let updatedFormData = { ...formData };

      if (assignmentType === 'essay' && rubricFile) {
        const fileData = new FormData();
        fileData.append('rubricFile', rubricFile);
        const fileUploadResponse = await axios.post('http://localhost:4000/uploadFile', fileData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        updatedFormData.rubricFileUrl = fileUploadResponse.data.fileUrl;
      }

      // Log the form data before sending
      console.log("Form Data to be sent:", updatedFormData);
      const res = await axios.post('http://localhost:4000/newAssignment', updatedFormData);
      console.log("Response from server:", res.data); // Handle successful registration
      alert('Assignment was successfully created');
      onClose(); // Close the panel
    } catch (err) {
      console.error('Assignment creation error:', err.response.data);
      alert(`Error: ${err.response.data.message}`);
    }
  };

  const toggleCorrect = (questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].correct = !newQuestions[questionIndex].answers[answerIndex].correct;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleQuestionTypeChange = (index, type) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      type,
      questionText: '',
      answers: type === 'written-response' || type === 'essay' ? [] :
               type === 'true-false' ? [{ text: 'True', correct: false }, { text: 'False', correct: false }] :
               [{ text: '', correct: false }]
    };
    setFormData({ ...formData, questions: newQuestions });
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
                  <option value="q-and-a">Q and A</option>
                  <option value="essay">Essay</option>
                </select>
              </div>
            </div>

            {assignmentType === 'essay' && (
              <div className="rubric-upload">
                <label htmlFor="rubricFile">Upload Rubric (PDF/TXT/DOC):</label>
                <input type="file" id="rubricFile" accept=".pdf,.txt,.doc,.docx" onChange={onRubricFileChange} />
              </div>
            )}

            {assignmentType !== 'essay' && questions.map((question, questionIndex) => (
              <div key={questionIndex} className="question-block">
                <select
                  value={question.type}
                  onChange={(e) => handleQuestionTypeChange(questionIndex, e.target.value)}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="written-response">Written Response</option>
                </select>
                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[questionIndex].questionText = e.target.value;
                    setFormData({ ...formData, questions: newQuestions });
                  }}
                  placeholder={`Question #${questionIndex + 1}`}
                />
                <button type="button" className="remove-button" onClick={() => removeQuestion(questionIndex)}>Remove Question</button>

                {question.type === 'multiple-choice' && question.answers.map((answer, answerIndex) => (
                  <div key={answerIndex} className="answer-block">
                    <input
                      type="text"
                      value={answer.text}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[questionIndex].answers[answerIndex].text = e.target.value;
                        setFormData({ ...formData, questions: newQuestions });
                      }}
                      placeholder={`Answer #${answerIndex + 1}`}
                    />
                    <input
                      type="checkbox"
                      checked={answer.correct}
                      onChange={() => toggleCorrect(questionIndex, answerIndex)}
                    />
                    <button type="button" className="remove-button" onClick={() => removeAnswer(questionIndex, answerIndex)}>Remove Answer</button>
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
                          setFormData({ ...formData, questions: newQuestions });
                        }}
                      />
                      True
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`trueFalse-${questionIndex}`}
                        value="false"
                        checked={question.answers[1]?.correct === true}
                        onChange={() => {
                          const newQuestions = [...questions];
                          newQuestions[questionIndex].answers = [{ text: 'True', correct: false }, { text: 'False', correct: true }];
                          setFormData({ ...formData, questions: newQuestions });
                        }}
                      />
                      False
                    </label>
                  </div>
                )}
              </div>
            ))}
            {assignmentType !== 'essay' && <button type="button" onClick={addQuestion}>Add Question</button>}
            <button type="submit">Create Assignment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewAssignment;
