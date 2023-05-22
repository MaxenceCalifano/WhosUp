import React, { useEffect, useState } from "react";
import { Divider } from "react-native-elements";
import { View, Text, Button, StyleSheet, TextInput } from 'react-native'
import { supabase } from "../config/supabase";
import { useUser } from "../UserContext";

import styles from "../styles";

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
    const [updatePassword, setUpdatePassword] = useState(false)
    const [password, setPassword] = useState()

    return (
        <View style={{ flex: 1, padding: 10, gap: 15 }}>
            <View>
                <Text>Votre adresse e-mail:</Text>
                <Text>{user.email}</Text>
            </View>
            <Divider />
            <View>
                <Text>Votre pseudo:</Text>
                <Text>{username}</Text>
            </View>
            <Divider />

            {
                updatePassword ?
                    <View style={{ flex: 1, gap: 15 }}>
                        <TextInput secureTextEntry style={styles.input} placeholder="mot de passe" onChangeText={(value) => setPassword(value)} />
                        <Button color={styles.secondaryColor} title="valider" />
                        <Button color={'red'} title="annuler" onPress={() => setUpdatePassword(false)} />
                    </View>
                    : <Button color={styles.tertiaryColor} onPress={() => setUpdatePassword(true)} title="Changer de mot de passe" />
            }

            <Button color={styles.tertiaryColor} onPress={async () => {
                const { error } = await supabase.auth.signOut()
            }
            } title="Se déconnecter" />
        </View>
    );
}

const profileStyles = StyleSheet.create({
    signout_button: {

    }
})