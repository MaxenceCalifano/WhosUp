import React, { useState, useEffect } from "react";

import AuthStack from "./navigation/AuthStack";
import UserStack from "./navigation/UserStack";
import { useUser, UserContextProvider } from "./UserContext";
import { StatusBar } from "expo-status-bar";
import "./Translations";
export default function App() {
  const Container = () => {
    //console.log("🚀 ~ file: App.js:27 ~ Container ~ user:", user)
    const { session } = useUser();
    console.log("🚀 ~ file: App.js:28 ~ Container ~ session:", session);

    //console.log('user', user)
    return session ? <UserStack /> : <AuthStack />;
  };

  return (
    <UserContextProvider>
      <StatusBar style="auto" />
      <Container />
    </UserContextProvider>
  );
}
