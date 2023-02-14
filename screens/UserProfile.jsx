import React, { useEffect, useState } from "react";
import { View, Text, Button } from 'react-native'
import { getAuth, signOut } from "firebase/auth";
import { useAuthentication } from '../utils/hooks/useAuthentication'



export default function UserProfile() {
    const auth = getAuth();
    const { user } = useAuthentication()
    const [username, setUsername] = useState()

    // We have to wait for user to have a value
    useEffect(() => {
        if (user) {
            setUsername(user.providerData[0].displayName)
        }

    }, [user])

    return (
        <View style={{ flex: 1 }}>
            <Text>Page profile</Text>
            <Text>{username}</Text>
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