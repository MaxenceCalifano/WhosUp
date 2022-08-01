import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import './config/firebase'
import {getAuth, onAuthStateChanged} from 'firebase/auth'

import AuthStack from './navigation/AuthStack';
import Main from './navigation/Main'

export default function App() {
 
  const auth = getAuth()
  const [user,setUser] = useState(null)

  useEffect ( () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log('user')
        setUser(user)
      } else {
        console.log('user is not connected')
      }
    })
  },[user])
  return (
       user!==null ? <Main /> : <AuthStack />
  );
}


