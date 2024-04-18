import React, { useState, useEffect } from 'react';

const VideoChatRoom = () => {
  // State to manage local video stream
  const [localStream, setLocalStream] = useState(null);

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
            {localStream && <video srcObject={localstream} autoPlay muted />}
        </div>
        <div className="remote-videos"> 
        {/* Display remote participants' video streams here */} 
        </div>
    </div>
  );
};
