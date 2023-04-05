import React, { useEffect, useState } from "react";
import { View, Text, Button } from 'react-native'
import { supabase } from "../config/supabase";
import { useUser } from "../UserContext";

export default function UserProfile() {

    const { user } = useUser()

    const fetchProfile = async () => {
        let { data: profiles, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)

        if (profiles) {
            setUsername(profiles[0].username)
        }
        if (error) console.log("🚀 ~ file: UserProfile.jsx:24 ~ fetchUser ~ error:", error)
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const [username, setUsername] = useState()
    //const [user, setUser] = useState()

    return (
        <View style={{ flex: 1 }}>
            <Text>Page profile</Text>
            <Text>Votre adresse e-mail:</Text>
            <Text>{user.email}</Text>
            <Text>Votre pseudo</Text>
            <Text>{username}</Text>

            <Button onPress={async () => {

                const { error } = await supabase.auth.signOut()

            }
            } title="Se déconnecter" />
        </View>
    );
}