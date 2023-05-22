import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Text, Pressable, Image, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer'
import styles from "../styles";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../config/supabase'



export default function ConfigureAccountScreen({ navigation }) {
    const [name, setName] = useState()
    const [photo, setPhoto] = useState()
    const [userId, setUserId] = useState()
    const [responseMessage, setResponseMessage] = useState('')

    const getCurrentUser = async => {
        supabase.auth.getSession()
            .then(res => {
                setUserId(res.data.session.user.id)
            })
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    const imagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })

        if (!result.cancelled) {
            // const filePath = `${Math.random()}.${fileExt}`
            setPhoto({
                name: result.assets[0].uri.split('/')[result.assets[0].uri.split('/').length - 1],
                uri: result.assets[0].uri,
                base64: result.assets[0].base64
            });
        }
    }

    const updateAccount = async () => {
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
                    .update({ username: name, avatar_url: res.data.path })
                    .eq('id', userId)

                if (error) {
                    console.log(error)
                    setResponseMessage(error.message)
                }
                if (status === 204) {
                    setResponseMessage("Votre compte a été mis à jour, redirection vers la page principale")
                    setTimeout(() => navigation.navigate('Carte'), 2000)
                    const storeData = async (value) => {
                        try {
                            await AsyncStorage.setItem('welcomeScreenSeen', value)
                        } catch (e) {
                            console.log("🚀 ~ file: ConfigureAccount.jsx:17 ~ storeData ~ e:", e)
                            // saving error
                        }
                    }
                    storeData("true")
                }
            })
    }
    return (
        <View style={styles.authContainer}>
            <Text>Configurer le profile</Text>
            <TextInput placeholder="pseudo" value={name} onChangeText={(value) => setName(value)} />
            <Pressable style={[styles.button, { backgroundColor: 'rgba(54,54,54, 0.7)' }]} onPress={() => imagePicker()}>
                <Text>Choisir une photo</Text>
            </ Pressable>
            {photo &&
                <View>
                    <Image source={{ uri: photo.uri }} style={{ width: 200, height: 200 }} />
                    <Pressable style={accountStyles.imageButton} onPress={() => setPhoto(null)}>
                        <Text style={{ color: '#FFF', alignSelf: 'center' }}>X</Text>
                    </Pressable>
                </View>
            }
            <Button title='valider' onPress={() => updateAccount()} />

        </View>
    )
}

const accountStyles = StyleSheet.create({
    imageButton: {
        backgroundColor: 'red',
        borderRadius: 50,
        width: 20,
        position: 'absolute',
    }
})