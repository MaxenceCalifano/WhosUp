//Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/auth'
import Constants  from "expo-constants";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey:
    authDomain: "whosup-25c37.firebaseapp.com",
    projectId: "whosup-25c37",
    storageBucket: "whosup-25c37.appspot.com",
    messagingSenderId: "40358879547",
    appId: "1:40358879547:web:51e8bc250ee35d8e16d71e"
  };
/* const firebaseConfig = {
    apiKey: Constants.manifest.extra.firebaseApiKey,
    authDomain: Constants.manifest.extra.firebaseAuthDomain,
    projectId: Constants.manifest.extra.firebaseProjectId,
    storageBucket: Constants.manifest.extra.firebaseStorageBucket,
    messagingSenderId: Constants.manifest.extra.firebaseMessagingSenderId,
    appId: Constants.manifest.extra.firebaseAppId,
  }; */

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
