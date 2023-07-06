import React, { useEffect, useState } from "react";
import { Divider } from "react-native-elements";
import { View, Text, Button, StyleSheet, TextInput, Pressable } from 'react-native'
import { decode } from 'base64-arraybuffer'
import { supabase } from "../config/supabase";
import { useUser } from "../UserContext";
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';


import styles from "../styles";

export default function UserProfile({ navigation }) {

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
        setUpdatingPhoto(true)
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })
        if (result.canceled) setUpdatingPhoto(false)
        if (!result.canceled) {
            setNewPhoto({
                name: result.assets[0].uri.split('/')[result.assets[0].uri.split('/').length - 1],
                uri: result.assets[0].uri,
                base64: result.assets[0].base64
            });
        }
    }

    const updateAvatar = async () => {

        let contentType;
        if (photo.name.split('.')[1] === 'jpeg' || photo.name.split('.')[1] === 'jpg') {
            contentType = 'image/jpg'
        }
        if (photo.name.split('.')[1] === 'png') {
            contentType = 'image/png'
        }
        await supabase
            .storage
            .from('avatars')
            .upload(photo.name, decode(photo.base64), {
                contentType: contentType
            })
            .then(async res => {
                console.log("🚀 ~ file: ConfigureAccount.jsx:85 ~ updateAccount ~ res:", res)
                if (res.error) console.log(res.error)
                const { error, status } = await supabase
                    .from('profiles')
                    .update({ avatar_url: res.data.path })
                    .eq('id', user.id)

                if (error) {
                    console.log(error)
                    setResponseMessage("Une erreur est survenue")
                }
                if (status) {
                    setResponseMessage("Votre photo de profil a bien été modifiée")
                    setUpdatingPhoto(false)
                }
            })
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
    const [photo, setNewPhoto] = useState()
    const [updatingPhoto, setUpdatingPhoto] = useState(false)
    const [responseMessage, setResponseMessage] = useState()

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
            {
                photo ? <Image
                    style={profileStyles.userAvatar}
                    source={{ uri: photo.uri }}
                    contentFit="cover"
                    transition={1000}
                />
                    : <Image
                        style={profileStyles.userAvatar}
                        source={`https://iwjnycngtfhluxibxjmd.supabase.co/storage/v1/object/public/avatars/${avatar}`}
                        contentFit="cover"
                        transition={1000}
                    />
            }



            {updatingPhoto ? <Button title="changer de photo" color={styles.color} onPress={updateAvatar} /> : <></>}
            {responseMessage ? <Text>{responseMessage}</Text> : ""}
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

            <Pressable onPress={() => navigation.navigate('A propos')}>
                <Text style={{ fontWeight: "bold", textAlign: "right", color: "#454545" }}>A propos de l'application</Text>
            </Pressable>
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