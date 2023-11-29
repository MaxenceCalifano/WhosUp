import React, { useEffect, useState, createContext, useContext } from 'react'

export const UnreadMessagesContext = createContext({
    unreadMessages: null,
  })

  export const UnreadMessagesProvider = (props) => {

    const [unreadMessages, setUnreadMessages] = useState(0)
    return <UnreadMessagesContext.Provider value={unreadMessages} {...props} />
  }
  
  export const useUnreadMessages = () => {
    const context = useContext(UnreadMessagesContext)
    if (context === undefined) {
      throw new Error(`useUnreadMessages must be used within a UserContextProvider.`)
    }
    return context
  }