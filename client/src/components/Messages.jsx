// App.js
import React, { useState, useEffect } from 'react';
import io from "socket.io-client"

function Messages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    
    socket.on('message', (data =>{
      setMessages(prevData => [...prevData, data])
    }))


    return(() => {
      socket.disconnect();
    })
  }, [])

  return (
    <div>
     {messages}
    </div>
  );
}

export default Messages;
