import React from 'react'; 

const ParticipantVideo = ({stream}) => {
    return (
        <div className="participant-video">
            <video srcObject={stream} autoPlay /> 
        </div>
    );
};

export default ParticipantVideo;