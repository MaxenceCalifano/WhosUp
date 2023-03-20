import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, TextInput, Button } from 'react-native'
import styles from "../styles";
import Google_SignIn from "../components/Google_signIn";
import { supabase } from '../config/supabase'

export default function SignUpScreen({ navigation, setIsNew }) {
    console.log("🚀 ~ file: SignUpScreen.jsx:8 ~ SignUpScreen ~ setIsNew:", setIsNew)
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

        if (error) setSubmitMessage(error.message)
        if (data) {
            setIsNew(true)
        }
        //setLoading(false)
    }
    /* createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            const user = userCredentials.user
            setSubmitMessage('Votre compte a été créé avec succès !')
        })
        .catch((error) => {
            const errorCode = error.code;

            switch (errorCode) {
                case 'auth/invalid-email':
                    setSubmitMessage("L'adresse email est invalide");
                    break;
                case 'auth/admin-restricted-operation':
                    setSubmitMessage('Erreur lors de la création du compte, veuillez véifier que tous les champs sont remplis');
                    break;
                case 'auth/weak-password':
                    setSubmitMessage('Veuillez renseigner un mot de passe de minimum 6 charactères');
                    break;
                case 'auth/email-already-in-use':
                    setSubmitMessage('Cette adresse e-mail est déja utilisée');
                    break;
                default:
                    setSubmitMessage('Erreur lors de la création du compte')
            }
        }) */
    //  }
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

            <Google_SignIn />
        </View>
    )
}

const signUpStyles = StyleSheet.create({
    button: {
        backgroundColor: '#FFF',
    }
})