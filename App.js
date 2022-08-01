import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import './config/firebase'
import {getAuth, onAuthStateChanged,signOut} from 'firebase/auth'
import {useAuthentication} from './utils/hooks/useAuthentication'

import AuthStack from './navigation/AuthStack';
import UserStack from './navigation/UserStack';

export default function App() {
 
  const auth = getAuth()
  //const [user,setUser] = useState(null)
  const {user} = useAuthentication()
  const [isNew, setIsNew] = useState();


  useEffect( () => {
   /*  signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });  */

    if(user) {

    if(user.metadata.lastLoginAt - user.metadata.createdAt <= 1000) {
      //console.log(user.metadata.lastLoginAt - user.metadata.createdAt)

        console.log('user is new')
        setIsNew(true)
      } else {
        console.log('not new')
        setIsNew(false)
      }
    }
  },[user])
  
  return (
       user ? <UserStack isNew = {isNew} /> : <AuthStack />
  );
}


