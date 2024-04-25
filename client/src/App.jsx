<<<<<<< HEAD
<<<<<<< HEAD
// App.js
import React, { useState, useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import Home from './Pages/Home';
=======
import React, {useContext} from 'react';
import Registration from './Pages/Registration';
=======
// App.js
import React, {useContext, useState} from 'react';
>>>>>>> e8375ef523d4e4de42b00335da08a38e533347cc
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
>>>>>>> a9cf4d2a8fdeec2b8eee623d4f9ae2e2b669f8d8
import { AuthContext } from './context/authContext';
<<<<<<< HEAD
import handiCapToolbar from '../../server/StudySphere/client/src/components/handicapToolbar';
=======
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import EmailConfirmation from './components/UserConfirmation';
import AdminStudents from './components/AdminStudents';
import AdminDashboard from './components/AdminDashboard';
import AdminCohorts from './components/AdminCohorts';
import AdminTeachers from './components/AdminTeachers'
import Registration from './Pages/Registration';
import TopNavbar from './components/TopNavbar';

>>>>>>> e8375ef523d4e4de42b00335da08a38e533347cc

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
<<<<<<< HEAD
  const { currentUser } = useContext(AuthContext);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  const startVideoChat = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      createPeerConnection();
    } catch (error) {
      console.error('Error accessing local media devices:', error);
    }
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection();
    pc.ontrack = handleTrackEvent;
    pc.onicecandidate = handleIceCandidateEvent;
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    setPeerConnection(pc);
  };

  const handleTrackEvent = (event) => {
    setRemoteStream(event.streams[0]);
  };

  const handleIceCandidateEvent = (event) => {
    if (event.candidate) {
      // Send ICE candidate to remote peer
    }
  };

  const stopVideoChat = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
  };
=======
  const { currentUser, setIsLoggedIn } = useContext(AuthContext);
<<<<<<< HEAD
>>>>>>> a9cf4d2a8fdeec2b8eee623d4f9ae2e2b669f8d8
=======
  const [phoneNumber, setPhoneNumber] = useState('');

>>>>>>> e8375ef523d4e4de42b00335da08a38e533347cc

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <PhoneNumberContext.Provider value={{ phoneNumber, setPhoneNumber }}>
    <BrowserRouter>
      {handiCapToolbar()}
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

      {/* Video chat elements */}
      {localStream && <video id="localVideo" srcObject={localStream} autoPlay muted></video>}
      {remoteStream && <video id="remoteVideo" srcObject={remoteStream} autoPlay></video>}
      <button onClick={startVideoChat}>Start Video Chat</button>
      <button onClick={stopVideoChat}>Stop Video Chat</button>
    </BrowserRouter>
    </PhoneNumberContext.Provider>
  );
};

export default App;