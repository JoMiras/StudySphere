import React, { useState, useContext } from 'react';
import { MessageContext } from '../context/messageContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { v4 as uuidv4 } from 'uuid';
import '../style.scss';


function Messages() {
    const { messages, addMessage, removeMessage, updateMessage } = useContext(MessageContext);
    const [newMessage, setNewMessage] = useState({ id: null, text: '' });
    const [showModal, setShowModal] = useState(false);
    const [editedMessage, setEditedMessage] = useState({});
    const [editedMessageText, setEditedMessageText] = useState('');

    const handleChange = (e) => {
        setNewMessage({ ...newMessage, [e.target.name]: e.target.value });
    };

    // const generateUniqueId = () => {
    //     return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        const id = generateUniqueId();
        addMessage({ id, ...newMessage });
        setNewMessage({ id: '', text: '' });
    };

    const handleDelete = (messageId) => {
        // Remove the message with the specified messageId
        removeMessage(messageId);
    };

    const handleShowModal = (messageId) => {
        const messageToEdit = messages.find(message => message.id === messageId);
        setEditedMessage(messageToEdit);
        setEditedMessageText(messageToEdit.text);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleUpdate = () => {
        updateMessage({ ...editedMessage, text: editedMessageText });
        setShowModal(false);
    };

    const generateUniqueId = () => {
        return uuidv4();
    };
    

    return (
        <div className="message-container">
            <h2>Messages</h2>
            <ul className="message-list">
                {messages.map((message) => (
                    <li key={message.id} className="message-item">
                        {message.text}
                        <button onClick={() => handleDelete(message.id)}>Delete</button>
                        <button onClick={() => handleShowModal(message.id)}>Edit</button>
                    </li>
                ))}
            </ul>
            <form className="message-form" onSubmit={handleSubmit}>
                <input type="text" name="text" value={newMessage.text} onChange={handleChange} />
                <button type="submit">Add Message</button>
            </form>

            {/* Modal for editing message */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Message</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea value={editedMessageText} onChange={(e) => setEditedMessageText(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Messages;




