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

    const updatePassword = async () => {
        if (password !== repeatedPassword) setErrorMessage("Les mots de passe ne sont pas identiques")
        if (password === repeatedPassword) {
            setErrorMessage()
            const regex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/

            if (regex.test(password)) {
                const { error } = await supabase.auth.updateUser({ password: 'new password' })
                if (error) setErrorMessage("Une erreur est survenue, veuillez réessayer")
                else {
                    setUpdatePassword(false)
                    setValidationMessage("Votre mot de passe a été mis à jour")
                }
            } else {
                setErrorMessage("Votre mot de passe doit contenir au moins 8 charactères, un charactères spécial, et une majuscule")
            }
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const [username, setUsername] = useState()
    const [newPassword, setUpdatePassword] = useState(false)
    const [password, setPassword] = useState()
    const [repeatedPassword, setRepeatedPassword] = useState()
    const [errorMessage, setErrorMessage] = useState()
    const [validationMessage, setValidationMessage] = useState()

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
                newPassword ?
                    <View style={{ flex: 1, gap: 15 }}>
                        <TextInput secureTextEntry style={styles.input} placeholder="mot de passe" onChangeText={(value) => setPassword(value.trim())} />
                        <TextInput secureTextEntry style={styles.input} placeholder="Répetez le mot de passe" onChangeText={(value) => setRepeatedPassword(value.trim())} />
                        <Text style={{ color: 'red' }}>{errorMessage}</Text>
                        <Button color={styles.tertiaryColor} title="valider" onPress={updatePassword} />
                        <Button color={'red'} title="annuler" onPress={() => setUpdatePassword(false)} />
                    </View>
                    : <Button color={styles.tertiaryColor} onPress={() => setUpdatePassword(true)} title="Changer de mot de passe" />
            }
            {validationMessage ? <Text>{validationMessage}</Text> : ""}
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