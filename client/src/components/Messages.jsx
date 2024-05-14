import React, { useState, useContext } from 'react';
// import React, { useContext, useState, useEffect } from 'react';
// import { MessageContext } from '../context/messageContext';
import { MessageContext } from '../context/messageContext';
// import { Modal, Button } from 'react-bootstrap';
import { AuthContext } from '../context/authContext';


function Messages() {
    const { messages, addMessage, removeMessage, updateMessage } = useContext(MessageContext);
    const [newMessage, setNewMessage] = useState({ id: '', text: '' });

    const handleChange = (e) => {
        setNewMessage({ ...newMessage, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addMessage(newMessage);
        setNewMessage({ id: '', text: '' });
    };

    const handleDelete = (messageId) => {
        removeMessage(messageId);
    };

    const handleUpdate = (updatedMessage) => {
        updateMessage(updatedMessage);
    };

    return (
        <div>
            <h2>Messages</h2>
            <ul>
                {messages.map((message) => (
                    <li key={message.id}>
                        {message.text}
                        <button onClick={() => handleDelete(message.id)}>Delete</button>
                        <button onClick={() => handleUpdate({ ...message, text: 'Updated message' })}>Update</button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input type="text" name="text" value={newMessage.text} onChange={handleChange} />
                <button type="submit">Add Message</button>
            </form>
        </div>
    );
}


export default Messages;


// import React, { useContext, useState, useEffect } from 'react';


// function Messages () {

//     const {cohort, setCohort} = useContext(CohortContext);


//     return (
//         <div>
//             <h1>hello</h1>
//         </div>
//     );
// }

// export default Messages;