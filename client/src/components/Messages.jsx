import React, { useState, useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useSocket } from '../context/socketContext';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

function Messages() {
  const [users, setRefreshData, cohorts, messages] = useOutletContext();
  const [content, setContent] = useState('');
  const { currentUser } = useContext(AuthContext);
  const socket = useSocket();
  const [receiverID, setReceiverID] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = () => {
    const senderId = currentUser._id; // Replace with actual sender ID
    const receiverId = receiverID; // Replace with actual receiver ID

    if (content.trim() === '') return; // Prevent sending empty messages

    const messageData = {
      senderId,
      receiverId,
      content,
    };

    socket.emit('message', messageData, (response) => {
      if (response.success) {
        setMessageSent(true);
        setContent('');
        setReceiverID('');
      } else {
        // Handle message sending failure
        console.error('Failed to send message:', response.error);
      }
    });
  };

  const displayUsers = users
    ? users.map((user, index) => {
        if (currentUser._id === user._id) return null;
        return (
          <div key={index}>
            <p>{user.username}</p>
            <p onClick={() => setReceiverID(user._id)}>{user._id}</p>
          </div>
        );
      })
    : null;

    


  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>{message.content}</div>
      ))}
      <input
        onChange={(e) => setContent(e.target.value)}
        value={content}
        type="text"
        placeholder="Type your message here"
      />
      <button onClick={handleSendMessage}>Send message</button>
      {messageSent && <p>Message sent successfully!</p>}
      {displayUsers}
    </div>
  );
}

export default Messages;
