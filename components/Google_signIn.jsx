import React, { useEffect } from "react";
import * as WebBrowser from 'expo-web-browser';
import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { View, Button, Text } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function Google_SignIn() {

    /* const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
         {
             clientId: '40358879547-i3ikmd9qpr9926fbu6rs6tb9v4ea27tk.apps.googleusercontent.com',
         },
     );
 
     const [errorMessage, setErrorMessage] = React.useState('');
 
     useEffect(() => {
 
         if (response?.type === 'success') {
             const { id_token } = response.params;
 
             const auth = getAuth();
             const credential = GoogleAuthProvider.credential(id_token)
             signInWithCredential(auth, credential)
         }  else {
             setErrorMessage('Une erreur est survenue, veuillez réeesayer ou choisir un autre moyen de connexion')
         } 
     }, [response]);
  */

    return (
        <View>
            <Button title="signin with google" onPress={() => promptAsync()} />
            <Text>{errorMessage}</Text>
        </View>
    )
}