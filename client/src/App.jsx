// App.js
import React, { useState, useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import Home from './Pages/Home';
import { AuthContext } from './context/authContext';
import handiCapToolbar from '../../server/StudySphere/client/src/components/handicapToolbar';

const App = () => {
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

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      {handiCapToolbar()}
      <Routes>
        <Route path="/">
          <Route index element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        </Route>
      </Routes>

      {/* Video chat elements */}
      {localStream && <video id="localVideo" srcObject={localStream} autoPlay muted></video>}
      {remoteStream && <video id="remoteVideo" srcObject={remoteStream} autoPlay></video>}
      <button onClick={startVideoChat}>Start Video Chat</button>
      <button onClick={stopVideoChat}>Stop Video Chat</button>
    </BrowserRouter>
  );
};

export default App;
