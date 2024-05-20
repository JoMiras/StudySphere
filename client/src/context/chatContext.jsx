import React, { createContext, useState, useEffect } from 'react';

const ChatContext = createContext();

const ChatContextProvider = ({children}) => {
    const [chat, setChat] = useState('')

    console.log(chat)

    return(
        <ChatContext.Provider value={{setChat, chat}}>
            {children}
        </ChatContext.Provider>
    )
}

export {ChatContextProvider, ChatContext}