import React, { useContext, useState, useEffect, useRef } from 'react';
import { ChatContext } from '../context/chatContext';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { SocketContext } from '../context/socketContext';

const Chat = () => {
    const { chat, setChat, userOnline } = useContext(ChatContext);
    const { currentUser } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);
    const [content, setContent] = useState('');
    const chatWrapperRef = useRef(null);

    const senderId = currentUser._id;
    const chatId = chat._id;
    const participant = chat && chat.participants.find(p => p.id !== currentUser._id);
    const participantId = participant?.id;
    const participantPhoto = chat && chat.participants 
      ? chat.participants.find(participant => participant.id !== currentUser._id)?.picture 
      : null;
    const participantFirstName = chat && chat.participants 
      ? chat.participants.find(participant => participant.id !== currentUser._id)?.firstName 
      : null;
    const participantLastName = chat && chat.participants 
      ? chat.participants.find(participant => participant.id !== currentUser._id)?.lastName 
      : null;
  
      useEffect(() => {
        if (socket) {
            socket.emit('join', currentUser._id);
    
            socket.on('message', (message) => {
                if (message.chatId === chatId) {
                    setChat(prevChat => ({
                        ...prevChat,
                        messages: [...prevChat.messages, message]
                    }));
                }
            });
    
            return () => {
                socket.off('message');
            };
        }
    }, [socket, chatId, setChat, currentUser._id]);
    

    useEffect(() => {
        if (chatWrapperRef.current) {
            chatWrapperRef.current.scrollTo({
                top: chatWrapperRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [chat]);

    const sendMessage = async (content) => {
        const message = { chatId, senderId, content, receiverId: participantId };

        if (userOnline) {
            socket.emit('chatMessage', message);
            setChat(prevChat => ({
                ...prevChat,
                messages: [...prevChat.messages, { ...message, sender: senderId }]
            }));
            setContent('');
        } else {
            try {
                const res = await axios.put('http://localhost:4000/send-message', message);
                setContent('');
                setChat(res.data.chat);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const receiverName = participant ? (
        <div className="receiver-info">
            <div className="receiver-photo-wrapper">
                <img src={participantPhoto} alt="" className="participant-photo" />
                <div className={`status-dot ${userOnline ? 'online' : 'offline'}`}></div>
            </div>
            <h3>{participantFirstName} {participantLastName}</h3>
        </div>
    ) : null;

    const displayMessages = chat.messages ? chat.messages.map(message => (
        message.sender === currentUser._id ? (
            <div className="message-owner" key={message._id}>
                <div className="content">
                    <strong>{currentUser.firstName} {currentUser.lastName}</strong>
                    <p>{message.content}</p>
                </div>
                <img src={currentUser.profilePicture} alt="" />
            </div>
        ) : (
            <div className="received-message" key={message._id}>
                <img src={participantPhoto} alt="" />
                <div className="content">
                    <strong>{participantFirstName} {participantLastName}</strong>
                    <p>{message.content}</p>
                </div>
            </div>
        )
    )) : null;

    return (
        <div className='chat-container'>
            <div className="chat-header">
                {receiverName}
            </div>
            <hr />
            <div className="chat-wrapper" ref={chatWrapperRef}>
                {displayMessages}
            </div>
            <div className="message-input">
                <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    type="text"
                />
                <button className='btn btn-primary' onClick={() => sendMessage(content)}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
