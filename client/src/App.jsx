// App.js
import React, {useContext, useState} from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/authContext';
// import { PhoneNumberContext } from './context/phoneNumberContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Components
import EmailConfirmation from './components/UserConfirmation';
import AdminStudents from './components/AdminStudents';
import AdminDashboard from './components/AdminDashboard';
import AdminCohorts from './components/AdminCohorts';
import AdminTeachers from './components/AdminTeachers'
import TopNavbar from './components/TopNavbar';
import DisplayAssignments from './components/DisplayAssignments';
import CohortInfo from './components/CohortInfo';
import NewCohort from './Pages/NewCohort';
import EditCohort from './components/EditCohort';
import CohortFiles from './components/CohortFiles';
import StudentProfile from './components/StudentProfile'
import TeacherProfile from './components/TeacherProfile'


// Pages
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import Home from './Pages/Home';
import NewHome from './Pages/philHome';
import Verify from './Pages/Verify';
import SubmitVerify from './Pages/SubmitVerify';
import LandingPage from './Pages/Landing'; 
import Settings from './Pages/Settings';
import ChangePassword from './Pages/ChangePassword';
import UpdateEmail from './Pages/UpdateEmail';
import UpdateUserProfile from './Pages/UpdateUserProfile';
import ConfirmEmail from './Pages/ConfirmEmail';
import DiscussionBoard from './components/DiscussionBoard';
import Post from './components/Post';
import StudentDashboard from './components/StudentDashboard';
import StudentCourses from './components/StudentCourses';
import LoginRegistration from './Pages/RegisterLogin';
import EditStudent from './components/EditStudent';
import EditTeacher from './components/EditTeacher';

const App = () => {
  const { currentUser, setIsLoggedIn } = useContext(AuthContext);
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/" />;
    }
    return children;
  };

  const SuperAdminRoute = ({ children }) => {
    if(currentUser.role !== 'SuperAdmin'){
      return <Navigate to="/"/>;
    }
    return children
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<LoginRegistration/>} />
          <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>}>
            <Route path="admindashboard" element={<SuperAdminRoute> <AdminDashboard /> </SuperAdminRoute>}/>  
            <Route path="adminstudents" element={<SuperAdminRoute><AdminStudents /></SuperAdminRoute>}/>
            <Route path="adminsteachers" element={<SuperAdminRoute><AdminTeachers /></SuperAdminRoute>}/>
            <Route path="admincohorts" element={<SuperAdminRoute><AdminCohorts /></SuperAdminRoute>}/>
            <Route path="editCohort" element={<EditCohort />}/>
            <Route path="cohortfiles" element={<CohortFiles />}>
              <Route path='' element={<CohortInfo />} />
              <Route path='assignments' element={<DisplayAssignments />} />
            </Route>
            <Route path="studentprofile" element={<StudentProfile />}/>
            <Route path="teacherprofile" element={<TeacherProfile />}/>
            <Route path="teacherprofile" element={<TeacherProfile />}/>
            <Route path="cohortfiles" element={<CohortFiles />}/>
            <Route path='discussionboard' element={<DiscussionBoard />}/> 
            <Route path='post' element={<Post />}/>
            <Route path="dashboard" element={<StudentDashboard />}/>
            <Route path="courses" element={<StudentCourses />}/>
            <Route path="edit-student" element={<EditStudent />} />
            <Route path="edit-teacher" element={<EditTeacher />} />
          </Route>
          <Route path="landing" element={<LandingPage />} />
          <Route path='confirmation/:token' element={<EmailConfirmation />} />
          <Route path='verify' element={<ProtectedRoute><Verify /></ProtectedRoute>} />
          <Route path='newCohort' element={<ProtectedRoute><NewCohort /></ProtectedRoute>} />
          <Route path='philHome' element={<ProtectedRoute><NewHome /></ProtectedRoute>} />
          <Route path="/TopNavbar" element={<TopNavbar />} />
          <Route path="/SubmitVerify" element={<SubmitVerify />} />
          <Route path="/Settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/ChangePassword" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/UpdateEmail" element={<ProtectedRoute><UpdateEmail /></ProtectedRoute>} />
          <Route path="/UpdateUserProfile" element={<ProtectedRoute><UpdateUserProfile /></ProtectedRoute>} />
          <Route path="/ConfirmEmail" element={<ProtectedRoute><ConfirmEmail /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
