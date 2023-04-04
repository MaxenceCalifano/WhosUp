import React, {useState, useEffect} from 'react';

import { supabase } from './config/supabase';
import AuthStack from './navigation/AuthStack';
import UserStack from './navigation/UserStack';

export default function App() {

  const [user,setUser] = useState(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      //console.log("user state changed", session)
      setUser(session)
    })
    
    //console.log("🚀 ~ file: App.js:39 ~ useEffect ~ user:", user)
    
  },[])
  
  return (
       user ? <UserStack user={user}/> : <AuthStack/>
  );
}


