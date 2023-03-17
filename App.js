import React, {useState, useEffect} from 'react';
import './config/firebase'
import {getAuth, onAuthStateChanged,signOut} from 'firebase/auth'
import {useAuthentication} from './utils/hooks/useAuthentication'

import { supabase } from './config/supabase';
import { Session } from '@supabase/supabase-js'

import AuthStack from './navigation/AuthStack';
import UserStack from './navigation/UserStack';

export default function App() {
 
  const auth = getAuth()
  //const {user} = useAuthentication()
  const [user,setUser] = useState(null)
  const [isNew, setIsNew] = useState();


  useEffect( () => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("session: ",session)
      setUser(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session)
    })

    if(user) {

    if(user.user.last_sign_in_at - user.user.created_at <= 1000) {
        console.log('user is new')
        setIsNew(true)
      } else {
        console.log('not new')
        setIsNew(false)
      }
    }
  },[])
  
  return (
       user ? <UserStack user={user} isNew = {false} /> : <AuthStack />
  );
}


