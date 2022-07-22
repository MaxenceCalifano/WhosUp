import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import './config/firebase'
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'

import AuthStack from './navigation/AuthStack';

export default function App() {
 
  const auth = getAuth()

  return (
       <AuthStack />
  );
}


