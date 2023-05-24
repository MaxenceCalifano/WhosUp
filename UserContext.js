import React, { useEffect, useState, createContext, useContext } from 'react'
import { supabase } from './config/supabase'


export const UserContext = createContext({
    user: null,
  })

  export const UserContextProvider = (props) => {
    const [session, setSession] = useState(null)
    const [user, setUser] = useState(null)

    const updateUser = async () => {
      const session = await supabase.auth.getSession()
      
      setSession(session)
      setUser(session.data.session.user)
      
      const{data:authListener}= supabase.auth.onAuthStateChange((event, session) => {
        
        console.log(`Supabase auth event: ${event}`)

        if(event ==='SIGNED_OUT') {
          console.log('signed out')
          setSession(null)
          setUser(null)
        } 
        else {
            setSession(session)
            setUser(session.data.session.user)
        }
        
      })
       // console.log("🚀 ~ file: UserContext.js:22 ~ const{data:authListener}=supabase.auth.onAuthStateChange ~ session:", session)
  
      return () => {
        authListener.unsubscribe()
      }
    }
  
    useEffect(() => {
      updateUser()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    const value = {
      session,
      user,
    }
    return <UserContext.Provider value={value} {...props} />
  }
  
  export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
      throw new Error(`useUser must be used within a UserContextProvider.`)
    }
    return context
  }