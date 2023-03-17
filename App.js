import React, {useState, useEffect} from 'react';
import {useAuthentication} from './utils/hooks/useAuthentication'

import { supabase } from './config/supabase';
import AuthStack from './navigation/AuthStack';
import UserStack from './navigation/UserStack';

export default function App() {

  //const {user} = useAuthentication()
  const [user,setUser] = useState(null)
  const [isNew, setIsNew] = useState();


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("session: ")
      setUser(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("user state changed", session)
      setUser(session)
      if(user) {

        if(user.user.last_sign_in_at - user.user.created_at <= 1000) {
            console.log('user is new')
            setIsNew(true)
          } else {
            console.log("🚀 ~ file: App.js:38 ~ useEffect ~ user.user.last_sign_in_at - user.user.created_at:", user.user.last_sign_in_at - user.user.created_at)
            
            console.log('not new')
            setIsNew(false)
          }
        }
      //console.log(user)
    })
    
    console.log("🚀 ~ file: App.js:39 ~ useEffect ~ user:", user)
    
  },[])
  
  return (
       user ? <UserStack user={user} isNew = {isNew} /> : <AuthStack />
  );
}


