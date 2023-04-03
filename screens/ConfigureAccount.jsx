import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Text, Pressable, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';;
import styles from "../styles";
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function ConfigureAccountScreen({ navigation }) {
    const [name, setName] = useState()
    const [photoURL, setPhoto] = useState(null)

    useEffect(() => {
        /*   const storeData = async (value) => {
              try {
                  await AsyncStorage.setItem('welcomeScreenSeen', value)
              } catch (e) {
                  console.log("🚀 ~ file: ConfigureAccount.jsx:17 ~ storeData ~ e:", e)
                  // saving error
              }
          }
          storeData("true") */
    }, [])

    const imagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })

        if (!result.cancelled) {
            setPhoto(result.uri);
        }
    }

    const updateAccount = () => {
        /*  .then(() => navigation.navigate('Carte'))
              .catch(error => console.error(error)) */
    }

    return (
        <View style={styles.authContainer}>
            <Text>Configurer le profile</Text>
            <TextInput placeholder="pseudo" value={name} onChangeText={(value) => setName(value)} />
            <Text>type de name {typeof name}</Text>
            <Pressable style={[styles.button, { backgroundColor: 'rgba(54,54,54, 0.7)' }]} onPress={() => imagePicker()}>
                <Text>Choisir une photo</Text>
            </ Pressable>
            {photoURL &&
                <View>
                    <Image source={{ uri: photoURL }} style={{ width: 200, height: 200 }} />
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