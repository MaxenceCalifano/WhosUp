import React, { useEffect, useState } from "react";
import { View, Text, Button } from 'react-native'
import { getAuth, signOut } from "firebase/auth";
import { useAuthentication } from '../utils/hooks/useAuthentication'
import { supabase } from '../config/supabase'


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
            <Button onPress={async () => {

                const { error } = await supabase.auth.signOut()

            }
            } title="Se déconnecter" />
        </View>
    );
}