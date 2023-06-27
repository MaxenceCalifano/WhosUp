import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, TextInput, Button } from 'react-native'
import styles from "../styles";
import { supabase } from '../config/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState()
    const [submitMessage, setSubmitMessage] = useState('')

    // const createAccount = () => {
    async function signUpWithEmail() {

        if (password !== repeatedPassword) setSubmitMessage("Les mots de passe ne sont pas identiques")
        if (password === repeatedPassword) {
            setSubmitMessage()
            const regex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/

            if (regex.test(password)) {
                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                })

                if (error) {
                    console.log("🚀 ~ file: SignUpScreen.jsx:29 ~ signUpWithEmail ~ error:", error)
                    setSubmitMessage("Une erreur est survenue, veuillez réessayer")
                }
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
            } else {
                setSubmitMessage("Votre mot de passe doit contenir au moins 8 caractères, un caractère spécial, et une majuscule")
            }
        }
        //setLoading(true)

        //setLoading(false)
    }

    const submit = () => {
        if (email === '' || password === '') {
            setSubmitMessage("Veuillez renseigner une adresse email et un mot de passe s'il vous plaît")
            return;
        } else {
            signUpWithEmail()
        }
    }
    return (
        <View style={styles.authContainer} >
            <Text style={{ fontWeight: 'bold', fontSize: 25, alignSelf: 'center', color: '#454545' }}>
                Bienvenu(e) !
            </Text>
            <TextInput
                value={email}
                keyboardType='email-address'
                autoComplete="email"
                onChangeText={(value) => setEmail(value)}
                style={styles.input} placeholder="e-mail" />
            <TextInput
                secureTextEntry
                value={password}
                autoComplete="password-new"
                onChangeText={(value) => setPassword(value.trim())}
                style={styles.input} placeholder="mot de passe" />
            <TextInput secureTextEntry style={styles.input} placeholder="Répetez le mot de passe" onChangeText={(value) => setRepeatedPassword(value.trim())} />

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