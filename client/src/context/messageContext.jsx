import React, { createContext, useState, useContext } from 'react';

// Create a context object
const MessageContext = createContext();

// Create a provider component
export const MessageProvider = ({ children }) => {
    // State to hold messages
    const [messages, setMessages] = useState([]);

    // Method to add a new message
    const addMessage = (newMessage) => {
        setMessages([...messages, newMessage]);
    };

    // Method to remove a message
    const removeMessage = (messageId) => {
        setMessages(messages.filter(message => message.id !== messageId));
    };

    // Method to update a message
    const updateMessage = (updatedMessage) => {
        setMessages(messages.map(message =>
            message.id === updatedMessage.id ? updatedMessage : message
        ));
    };

    // Return the context provider
    return (
        <MessageContext.Provider
            value={{
                messages,
                addMessage,
                removeMessage,
                updateMessage
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};

// Export both MessageContext and MessageProvider
export { MessageContext, MessageProvider as MessageContextProvider };
