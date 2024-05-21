import React, { useState, useContext, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { ChatContext } from '../context/chatContext';
import axios from 'axios';
import Chat from './Chat';
import add from "../img/add.png"

function Messages() {
  const [users, setRefreshData, cohorts] = useOutletContext();
  const [content, setContent] = useState('');
  const { currentUser } = useContext(AuthContext);
  const [receiverId, setReceiverId] = useState('');
  const senderId =currentUser._id;
  const senderPhoto = currentUser.profilePicture;
  const senderFirstName = currentUser.firstName;
  const senderLastName = currentUser.lastName;
  const [myChats, setMyChats] = useState([]);
  const {setChat} = useContext(ChatContext);
  const [showAllUsers, setShowAllUsers] = useState(false);


  const toggleShowAllUsers = () => {
    setShowAllUsers(!showAllUsers);
  };


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

  const startChat = async (contact) => {
    const contactId = contact.id;
    const receiverPhoto = contact.photo;
    const receiverFirstName = contact.firstName;
    const receiverLastName = contact.lastName;
    console.log(contactId, receiverPhoto, senderPhoto);
    
    try {
      await axios.post('http://localhost:4000/make-chat', {
        senderId,
        senderPhoto,
        receiverId: contactId, 
        receiverPhoto,
        receiverFirstName,
        receiverLastName,
        senderFirstName,
        senderLastName
      });
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };
  

  const displayUsers = users
  ? users.slice(0, showAllUsers ? users.length : 8).map((user, index) => {
      if (currentUser._id === user._id) return null;
      return (
        <div key={index}>
          <img style={{height:"5vh"}} src={user.profilePicture} onClick={() => startChat(user._id)} />
        </div>
      );
    })
  : null;


    const openChat = (chat) => {
      setChat(chat)
    };

    const showMyChats = myChats ? myChats.map((chat, index) => {
      // Find the other participant
      const otherParticipant = chat.participants.find(p => p.id !== currentUser._id);
  
      // Get the first and last message
      const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : 'No messages yet';
  
      return (
        <div key={index} onClick={() => openChat(chat)} className="chat-item">
          <img src={otherParticipant.picture} alt={`${otherParticipant.firstName} ${otherParticipant.lastName}'s profile`} className="participant-photo" />
          <div className="chat-info">
            <p className="participant-name">{`${otherParticipant.firstName} ${otherParticipant.lastName}`}</p>
            <p className="last-message">{lastMessage}</p>
          </div>
        </div>
      );
    }) : null;
  

    const displayContacts = currentUser.contacts && currentUser.contacts.length > 0 ? currentUser.contacts.map(contact => {return (
     <img onClick={() => startChat(contact.contact)} className='contact-photo' src={contact.contact.photo}/>
    )}) : null;

   console.log(currentUser._id)
    
    return (
      <div className="message-container">
        <div className="left-side">
          <div className="search-conversation">
            <input placeholder='Search here...' type="text" />
            <img src={add} alt="" />
          </div>
          <div className="contacts">
            <div className="header">
              <h3>Contacts</h3>
            </div>
            <div className="users">
              {displayContacts}
            </div>
          </div>
          <div className="chats">
            <div className="header">
              <h3>Chats</h3>
              {showMyChats}
            </div>
          </div>
        </div>
        <div className="right-side">
          <Chat />
        </div>
      </div>
    );    
}

export default Messages;
