import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Text, Pressable, Image, Button, Modal, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { Divider } from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer'
import styles from "../styles";
import { supabase } from '../config/supabase'
import { useUser } from "../UserContext";

export default function ConfigureAccountScreen({ navigation }) {
    const [name, setName] = useState()
    const [photo, setPhoto] = useState()
    const [responseMessage, setResponseMessage] = useState('')
    const [loading, setIsLoading] = useState(false)
    const [profileUpdated, setProfileUpdated] = useState(false)
    const { user } = useUser()

    useEffect(
        () =>
            navigation.addListener('beforeRemove', (e) => {
                if (!profileUpdated) {
                    // Prevent default behavior of leaving the screen
                    e.preventDefault();

                    // Prompt the user before leaving the screen
                    Alert.alert(
                        'Vous devez choisir un pseudo et une photo de profil', 'pour finaliser votre inscription',
                    );
                }


            }),
        [navigation, profileUpdated]
    );

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
            setPhoto({
                name: result.assets[0].uri.split('/')[result.assets[0].uri.split('/').length - 1],
                uri: result.assets[0].uri,
                base64: result.assets[0].base64
            });
        }
    }

    const updateAccount = async () => {
        if (name === undefined || photo === undefined) {
            return setResponseMessage("Vous devez renseigner un pseudo et choisir une image de profil")
        }
        setIsLoading(true)
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
                    .eq('id', user.id)


                if (error) {
                    setIsLoading(false)

                    if (error.code === 23505) {
                        console.log(error)
                        setResponseMessage("Ce pseudo est déjà pris")
                    } else {
                        console.log(error)
                        setResponseMessage("Une erreur est survenue")
                    }
                }
                if (status === 204) {
                    setProfileUpdated(true)
                    setIsLoading(false)
                    setResponseMessage("Votre compte a été mis à jour, redirection vers la page principale")
                    setTimeout(() => navigation.navigate('Carte'), 2000)
                }
            })
    }
    return (
        <View style={styles.authContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 25, color: "#454545" }}>Configurer le profil :</Text>
            <Text>Choisir un pseudo :</Text>
            <TextInput style={{ backgroundColor: '#f0f0f0', padding: 5, borderRadius: 5 }} placeholder="pseudo" value={name} onChangeText={(value) => setName(value)} />
            <Divider color="white" inset insetType="middle" />
            <Button color='rgba(54,54,54, 0.7)' title="choisir une photo" onPress={() => imagePicker()} />
            <Divider color="white" inset insetType="middle" />
            {photo &&
                <View style={{ alignItems: "center", width: 200, alignSelf: "center" }}>
                    <Image source={{ uri: photo.uri }} style={{ width: 200, height: 200 }} />
                    <Pressable style={accountStyles.imageButton} onPress={() => setPhoto(null)}>
                        <Text style={{ color: '#FFF', alignSelf: 'center' }}>X</Text>
                    </Pressable>
                </View>
            }
            <Button color='#454545' title='valider' onPress={() => updateAccount()} />
            <Text style={{ fontWeight: 'bold' }}>{responseMessage}</Text>
            {loading ?
                <View style={accountStyles.modalContainer}>
                    <Modal animationType="fade" transparent={true}>
                        <View style={accountStyles.modalView}>
                            <View style={accountStyles.loaderContainer}>
                                <ActivityIndicator color={styles.color} size={"large"} />
                                <Text style={{ marginTop: 10 }}>Mise à jour de votre compte..</Text>
                            </View>
                        </View>
                    </Modal>
                </View>
                : <></>
            }
        </View>
    )
}

const accountStyles = StyleSheet.create({
    imageButton: {
        backgroundColor: 'red',
        borderRadius: 50,
        width: 20,
        position: 'absolute',
        right: -10,
        top: -10,
    },

    modalContainer: {
        display: "flex",
        position: "absolute",
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    loaderContainer: {
        height: 250,
        width: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
})