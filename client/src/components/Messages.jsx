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
    console.log(contactId, receiverPhoto, senderPhoto);
    
    try {
      await axios.post('http://localhost:4000/make-chat', {
        senderId,
        senderPhoto,
        receiverId: contactId, 
        receiverPhoto
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
      return (
        <p onClick={() => openChat(chat)} >{chat._id}</p>
      )
    }) :null

    const displayContacts = currentUser.contacts && currentUser.contacts.length > 0 ? currentUser.contacts.map(contact => {return (
     <img onClick={() => startChat(contact.contact)} className='contact-photo' src={contact.contact.photo}/>
    )}) : null;

    // <p onClick={toggleShowAllUsers} style={{ cursor: 'pointer' }}>
    //             {showAllUsers ? 'Show Less' : 'View All'}
    //           </p>
   
    console.log(myChats)
    
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
          <div className="group-chats">
            <div className="header">
              <h3>Groups</h3>
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
