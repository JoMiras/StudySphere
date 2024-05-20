import React, { useState, useContext, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { ChatContext } from '../context/chatContext';
import axios from 'axios';
import Chat from './Chat';

function Messages() {
  const [users, setRefreshData, cohorts] = useOutletContext();
  const [content, setContent] = useState('');
  const { currentUser } = useContext(AuthContext);
  const [receiverId, setReceiverId] = useState('');
  const senderId =currentUser._id;
  const [myChats, setMyChats] = useState([]);
  const {setChat} = useContext(ChatContext);


  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:4000/get-chats', {
          params: { senderId }
        });
        setMyChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const startChat = async (id) => {
    setReceiverId(id);
    console.log(senderId, receiverId)
    await axios.post('http://localhost:4000/make-chat', {senderId, receiverId});
  }

  const displayUsers = users
    ? users.map((user, index) => {
        if (currentUser._id === user._id) return null;
        return (
          <div key={index}>
            <img style={{height:"5vh"}} src={user.profilePicture}  onClick={() => startChat(user._id)}/>
          </div>
        );
      })
    : null;


    const openChat = (chat) => {
      setChat(chat)
    };

    const showMyChats = myChats ? myChats.map((chat, index) => {
      return (
        <p onClick={() => openChat(chat)} >{chat._id}</p>
      )
    }) :null
    
  return (
    <div className='message-container'>
      {displayUsers}
      <div className="chat">
        <input 
        onChange={(e) => setContent(e.target.value)}
        type="text" />
      </div>
      <button onClick={() => sendMessage(content, senderId, receiverId)} >Send</button>
      {showMyChats}
      <Chat />
    </div>
  );
}

export default Messages;
