import React from "react";
import { View, Text, Button } from 'react-native'
import { getAuth, signOut } from "firebase/auth";


export default function UserProfile() {
    const auth = getAuth();

    return (
        <View style={{ flex: 1 }}>
            <Text>Page profile</Text>
            <Button onPress={() => {
                signOut(auth).then(() => {
                    // Sign-out successful.
                }).catch((error) => {
                    // An error happened.
                })
            }
            } title="Se déconnecter" />
        </View>
    );
}