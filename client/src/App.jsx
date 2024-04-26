// App.js
import React, {useContext, useState} from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import EmailConfirmation from './components/UserConfirmation';
import AdminStudents from './components/AdminStudents';
import AdminDashboard from './components/AdminDashboard';
import AdminCohorts from './components/AdminCohorts';
import AdminTeachers from './components/AdminTeachers'
import Registration from './Pages/Registration';
import TopNavbar from './components/TopNavbar';


// Pages
import Login from './Pages/Login';
import Home from './Pages/Home';
import NewHome from './Pages/philHome';
import NewCohort from './Pages/NewCohort';
import Verify from './Pages/Verify';
import LandingPage from './Pages/Landing'; 
import SubmitVerify from './Pages/SubmitVerify';
import PhoneNumberContext from './context/phoneNumberContext';
import Settings from './Pages/Settings';
import ChangePassword from './Pages/ChangePassword';
import UpdateEmail from './Pages/UpdateEmail';
import UpdateUserProfile from './Pages/UpdateUserProfile';
import ConfirmEmail from './Pages/ConfirmEmail';
import EditCohort from './components/EditCohort';
import CohortFiles from './components/CohortFiles';
import StudentClasses from './components/StudentClasses';



const App = () => {
  const { currentUser, setIsLoggedIn } = useContext(AuthContext);
  const [phoneNumber, setPhoneNumber] = useState('');


  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <PhoneNumberContext.Provider value={{ phoneNumber, setPhoneNumber }}>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Registration />} />
          <Route path="login" element={<Login />} />
          <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>}>
            <Route path="admindashboard" element={<AdminDashboard />}/>  
            <Route path="adminstudents" element={<AdminStudents />}/>
            <Route path="adminsteachers" element={<AdminTeachers />}/>
            <Route path="admincohorts" element={<AdminCohorts />}/>
            <Route path="editCohort" element={<EditCohort />}/>
            <Route path="cohortfiles" element={<CohortFiles />}/>
            <Route path="studentclasses" element={<StudentClasses />}/>
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
    </PhoneNumberContext.Provider>
  );
};

export default App;