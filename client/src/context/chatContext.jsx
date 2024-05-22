import React, { createContext, useState, useEffect } from 'react';

const ChatContext = createContext();

const ChatContextProvider = ({children}) => {
    const [chat, setChat] = useState('')
    const [userOnline, setUserOnline] =useState(false)

    console.log(chat)

    return(
        <ChatContext.Provider value={{setChat, chat, setUserOnline, userOnline}}>
            {children}
        </ChatContext.Provider>
    )
}

export {ChatContextProvider, ChatContext}