import React, { useEffect, useState } from "react";
import { View, Text, Button } from 'react-native'
import { supabase } from "../config/supabase";

export default function UserProfile() {

    const fetchUser = async () => {
        const { data, error } = await supabase.auth.getSession()
        if (data) {
            setUser(data.session.user)
            console.log(data.session.user)
        }
        if (error) console.log("🚀 ~ file: UserProfile.jsx:12 ~ fetchUser ~ error:", error)

        const fetchProfile = async () => {
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)

            if (profiles) console.log(profiles)
            if (error) console.log("🚀 ~ file: UserProfile.jsx:24 ~ fetchUser ~ error:", error)
        }

        //fetchProfile()

    }

    useEffect(() => {
        fetchUser()
    }, [])

    const [username, setUsername] = useState()
    const [user, setUser] = useState()

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