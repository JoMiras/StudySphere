import React, { useContext, useState } from 'react';
import { ChatContext } from '../context/chatContext';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const Chat = () => {
    const { chat, setChat } = useContext(ChatContext);
    const { currentUser } = useContext(AuthContext);
    const [content, setContent] = useState('');
    const senderId = currentUser._id;
    const chatId = chat._id;

    const participantPhoto = chat.participants 
    ? chat.participants.find(participant => participant.id !== currentUser._id)?.picture 
    : null;
    const participantFirstName = chat.participants 
    ? chat.participants.find(participant => participant.id !== currentUser._id)?.firstName 
    : null;
    const participantLastName = chat.participants 
    ? chat.participants.find(participant => participant.id !== currentUser._id)?.lastName 
    : null;


    const sendMessage = async (senderId, content, receiverId) => {
        try {
            console.log(senderId, content, receiverId);
            const res = await axios.put('http://localhost:4000/send-message', { chatId, senderId, content });
            setContent('');
            setChat(res.data.chat)
        } catch (error) {
            console.error('Error sending message:', error);
            // Handle error (e.g., show a toast message)
        }
    };

    const receiverName = chat.participants ? chat.participants.map(participant => {
        if(participant.id !== currentUser._id){
            return(
                <>
                <img  src={participant.picture} alt="" />
                <h3>{participant.firstName} {participant.lastName}</h3>
                </>
            )
        }
    }) : null

    const displayMessages = chat.messages ? chat.messages.map(message => {
        if(message.sender === currentUser._id){
            return(
                <div className="message-owner">
                    <img src={currentUser.profilePicture} alt="" />
                    <strong>{currentUser.firstName} {currentUser.lastName}</strong>
                    <p>{message.content}</p>
                </div>
            )
        } else {
            return(
                <div className="recieved-message">
                    <img src={participantPhoto} alt="" />
                    <strong>{participantFirstName} {participantLastName}</strong>
                    <p>{message.content}</p>
                </div>
            )
        }
    }) : null;

    console.log(participantPhoto)
    


    return (
        <div className='chat-container'>
            <div className="chat-header">
                {receiverName}
            </div>
            <hr />
            <div className="chat-wrapper">
                {displayMessages}
            </div>
            <div className="message-input">
            <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                type="text" />
                <button className='btn btn-primary' onClick={() => sendMessage(senderId, content, chatId)}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
