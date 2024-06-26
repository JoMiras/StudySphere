import React, { useContext, useEffect, useState } from 'react';
import { CohortContext } from '../context/cohortContext';
import axios from 'axios';
import exam from "../img/exam.png"
import book from "../img/book.png"
import books from "../img/books.png"
import quiz from "../img/megaphone.png"
import events from "../img/upcoming.png"
import defaultPhoto from "../img/shark.png"
import { Outlet, useNavigate } from 'react-router-dom';
import { StudentContext } from '../context/studentContext';




function CohortFiles() {
  const { cohort, setCohort } = useContext(CohortContext);
  const [teacher, setTeacher] = useState(null);
  const Navigate = useNavigate();
  const [refresh, setRefresh] = useState(false)
  const {setStudent} = useContext(StudentContext);


  const readingMaterials = cohort ? cohort.cohortFiles.readingMaterial : null;
  const readingAssignments = cohort ? cohort.cohortFiles.assignments : null;
  const tests = cohort ? cohort.cohortFiles.tests : null;
  const teacherID = cohort ? cohort.instructorID : null;


  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.post("http://localhost:4000/get-teacher", { id: teacherID });
        setTeacher(response.data);
      } catch (error) {
        console.error("Error fetching teacher:", error);
      }
    };
    if (teacherID) {
      fetchTeacher();
    }
  }, [teacherID]);


  const removeFromCohort = async (id, cohortID) => {
    try {
      const response = await axios.post("http://localhost:4000/remove-user", {id, cohortID});
      localStorage.removeItem('cohort')
      setCohort(response.data.cohort);
      localStorage.setItem('cohort', JSON.stringify(response.data.cohort));
    } catch (error) {
      console.error(error);
    }
  };


  const goToProfile = async (id) => {
    const res = await axios.post("http://localhost:4000/get-student", {id});
    setStudent(res.data)
    localStorage.setItem('student', JSON.stringify(res.data))
    Navigate('../studentprofile');
}

const displayReadingMaterials = readingMaterials
    ? readingMaterials.map((material, index) => <p key={index}>{material}</p>)
    : null;

  const displayAssignments = readingAssignments
    ? readingAssignments.map((assignment, index) => <p key={index}>{assignment}</p>)
    : null;

  const displayTests = tests
    ? tests.map((test, index) => <p key={index}>{test}</p>)
    : null;

  const displayStudents = cohort.students
    ? cohort.students.map((student, index) => (
      <>
      <div className='cohort-students' key={student.id}>
          <img src={student.student.profilePicture || defaultPhoto} alt={`Student ${index + 1}`} />
          <strong>{student.student.username}</strong>
          <button onClick={() => goToProfile(student.student.id)} className='btn btn-primary btn-sm'>Profile</button>
          <button onClick={() => removeFromCohort(student.student.id, cohort._id)} className='btn btn-danger btn-sm' >Remove</button>
        </div>
      </>
      ))
    : null;


  return (
      <div className='files-container'>
        <div className="files-wrapper">
          <div className='files reading-material'>
            <img src={books} alt="" />
            <h4>Course Materials</h4>
            {displayReadingMaterials.length}
          </div>
          <div onClick={() => Navigate('assignments')} className="files assignments">
            <img src={book} alt="" />
            <h4>Homework and Tests</h4>
            {displayAssignments.length}
          </div>
          <div className="files events">
            <img src={events} alt="" />
            <h4>Upcoming Events</h4>
            0
          </div>
        </div>
        <div className='users'>
        <div className="students">
          <h3 style={{color:""}}>Students</h3>
          <hr style={{width:"95%", textAlign:"center"}}/>
            {displayStudents}
        </div>
        {teacher && (
          <div className='teacher'>
            <h3>Instructor</h3>
            <p>{teacher.username}</p>
            <img  className='instructor-photo' src={teacher.profilePicture === "" ? defaultPhoto : teacher.profilePicture} alt="" />
            <div className="information">
              <p>Email:{teacher.email}</p>
              <p>Phone:{teacher.phoneNumber}</p>
            </div>
            <button className='btn btn-primary'>Profile</button>
          </div>
        )}

        </div>
      </div>
  );
}

export default CohortFiles;

