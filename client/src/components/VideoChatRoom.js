import React, { useState, useEffect } from 'react';
import ParticipantVideo from './ParticipantVideo';

const VideoChatRoom = () => {
  // State to manage local video stream
  const [localStream, setLocalStream] = useState(null); // Define localStream state variable

  // State to manage remote video streams
  const [remoteStreams, setRemoteStreams] = useState([]);

  // Function to add a new remote stream
  const addRemoteStream = (stream) => {
    setRemoteStreams(prevStreams => [...prevStreams, stream]);
  };

  // Function to initialize local video stream
  const initLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
    } catch (error) {
      console.error('Error accessing local media devices:', error);
    }
  };

  // Effect to initialize local video stream when component mounts
  useEffect(() => {
    initLocalStream();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="video-chat-room">
      <div className="local-video">
        {localStream && <video srcObject={localStream} autoPlay muted />}
      </div>
      <div className="remote-videos">
        {/* Display remote participants' video streams here */}
        {remoteStreams.map((stream, index) => {
          <ParticipantVideo key={index} stream={stream} /> 
        })}
      </div>
    </div>
  );
};

export default VideoChatRoom;
