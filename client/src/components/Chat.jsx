import React, { useContext, useState } from 'react';
import { ChatContext } from '../context/chatContext';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const Chat = () => {
    const { chat } = useContext(ChatContext);
    const { currentUser } = useContext(AuthContext);
    const [content, setContent] = useState('');
    const senderId = currentUser._id;
    const chatId = chat._id;

    const sendMessage = async (senderId, content, receiverId) => {
        try {
            console.log(senderId, content, receiverId);
            await axios.put('http://localhost:4000/send-message', { chatId, senderId, content });
            // Clear input field after sending message
            setContent('');
        } catch (error) {
            console.error('Error sending message:', error);
            // Handle error (e.g., show a toast message)
        }
    };

    

    return (
        <div className='chat-container'>
            {chat._id}
            <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                type="text" />
            <button onClick={() => sendMessage(senderId, content, chatId)}>Send</button>
        </div>
    );
};

export default Chat;
