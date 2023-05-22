import React, { useEffect, useState } from "react";
import { Divider } from "react-native-elements";
import { View, Text, Button, StyleSheet, TextInput, Pressable } from 'react-native'
import { supabase } from "../config/supabase";
import { useUser } from "../UserContext";
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';


import styles from "../styles";

export default function UserProfile() {

    const { user } = useUser()

    const fetchProfile = async () => {
        let { data: profiles, error } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)

        if (profiles) {
            setUsername(profiles[0].username)
            setAvatar(profiles[0].avatar_url)
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
    const imagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })

        if (!result.canceled) {
            // const filePath = `${Math.random()}.${fileExt}`
            setNewPhoto({
                name: result.assets[0].uri.split('/')[result.assets[0].uri.split('/').length - 1],
                uri: result.assets[0].uri,
                base64: result.assets[0].base64
            });
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const [username, setUsername] = useState()
    const [avatar, setAvatar] = useState()
    const [newPassword, setUpdatePassword] = useState(false)
    const [password, setPassword] = useState()
    const [repeatedPassword, setRepeatedPassword] = useState()
    const [errorMessage, setErrorMessage] = useState()
    const [validationMessage, setValidationMessage] = useState()

    return (
        <View style={{ flex: 1, padding: 10, gap: 15 }}>
            <View>
                <Text>Adresse e-mail:</Text>
                <Text>{user.email}</Text>
            </View>
            <Divider />
            <View>
                <Text>Pseudo:</Text>
                <Text>{username}</Text>
            </View>
            <Divider />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text>Photo de profil</Text>
                <Pressable onPress={imagePicker}>
                    <Text style={{ fontWeight: "bold", color: '#3879d4' }}>Modifier</Text>
                </Pressable>
            </View>
            <Image
                style={profileStyles.userAvatar}
                source={`https://iwjnycngtfhluxibxjmd.supabase.co/storage/v1/object/public/avatars/${avatar}`}
                contentFit="cover"
                transition={1000}
            />



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

    },
    userAvatar: {
        borderRadius: 50,
        width: 70,
        height: 70,
        alignSelf: "center"
    },
})