import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, TextInput, Button } from 'react-native'
import styles from "../styles";
import { supabase } from '../config/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitMessage, setSubmitMessage] = useState('')

    // const createAccount = () => {
    async function signUpWithEmail() {
        //setLoading(true)
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) console.log(error)//setSubmitMessage(error.message)
        if (data.session !== null) {
            const storeData = async (value) => {
                try {
                    await AsyncStorage.setItem('welcomeScreenSeen', value)
                } catch (e) {
                    console.log("🚀 ~ file: SignUpScreen.jsx:29 ~ storeData ~ e:", e)
                    // saving error

                }
            }
            storeData("false")
        }
        //setLoading(false)
    }

    const submit = () => {
        console.log("submit")
        if (email === '' || password === '') {
            setSubmitMessage("Veuillez renseigner une adresse email et un mot de passe s'il vous plaît")
            return;
        } else {
            signUpWithEmail()
        }
    }
    return (
        <View style={styles.authContainer} >
            <TextInput
                value={email}
                keyboardType='email-address'
                autoComplete="email"
                onChangeText={(value) => setEmail(value)}
                style={styles.input} placeholder="e-mail" />
            <TextInput
                value={password}
                autoComplete="password-new"
                onChangeText={(value) => setPassword(value)}
                style={styles.input} placeholder="mot de passe" />
            <Pressable onPress={() => submit()} style={[styles.button, { backgroundColor: '#FFF', }]}>
                <Text style={{ color: styles.color, alignSelf: 'center' }}>Créer un compte</Text>
            </Pressable>
            <Text style={{ alignSelf: 'center' }}>{submitMessage}</Text>
        </View>
    )
}

const signUpStyles = StyleSheet.create({
    button: {
        backgroundColor: '#FFF',
    }
})