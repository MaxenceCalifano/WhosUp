import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, TextInput, Button, ActivityIndicator, Modal, } from 'react-native'
import styles from "../../styles";
import { supabase } from '../../config/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState()
    const [submitMessage, setSubmitMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [userCreated, setUserCreated] = useState(false)


    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem('welcomeScreenSeen', value)
        } catch (e) {
            console.log("🚀 ~ file: SignUpScreen.jsx:29 ~ storeData ~ e:", e)
            // saving error
        }
    }

    async function signUpWithEmail() {

        if (password !== repeatedPassword) {
            setSubmitMessage("Les mots de passe ne sont pas identiques")
            return
        }
        setLoading(true)
        setSubmitMessage()
        const regex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/

        if (regex.test(password)) {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: 'https://vantivities.maxencecalifano.tech/confirm-signup/'
                }
            })

            if (error) {
                console.log("🚀 ~ file: SignUpScreen.jsx:29 ~ signUpWithEmail ~ error:", error)
                setSubmitMessage("Une erreur est survenue, veuillez réessayer")
            }
            if (data.user !== null) {
                //If identities is empty user has already an account
                if (data.user.identities && data.user.identities.length > 0) {
                    setLoading(false)
                    setUserCreated(true)
                    setTimeout(() => {
                        setUserCreated(false)
                        navigation.navigate("Se connecter")
                    }, 5000)
                    storeData("false")
                } else {
                    setLoading(false)
                    setSubmitMessage("Une erreur est survenue, veuillez vérifier que l'adresse e-mail n'est pas déjà utilisée")
                }
            }
        } else {
            setSubmitMessage("Votre mot de passe doit contenir au moins 8 caractères, un caractère spécial, et une majuscule")
        }
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

            {
                loading &&
                <Modal animationType="fade" transparent={true}>
                    <View style={signUpStyles.modalView}>
                        <View style={signUpStyles.loaderContainer}>
                            <ActivityIndicator color={styles.color} size={"large"} />
                        </View>
                    </View>
                </Modal>
            }

            {
                userCreated &&
                <Modal animationType="fade" transparent={true}>
                    <View style={signUpStyles.modalView}>
                        <View style={signUpStyles.loaderContainer}>
                            <Text>Votre compte à été créé, vous allez recevoir un e-mail de validation dans quelques instants</Text>
                        </View>
                    </View>
                </Modal>
            }
            <Text style={{ fontWeight: 'bold', fontSize: 25, alignSelf: 'center', color: '#454545' }}>
                Bienvenue !
            </Text>
            <TextInput
                value={email}
                keyboardType='email-address'
                autoComplete="email"
                onChangeText={(value) => setEmail(value)}
                style={styles.input} placeholder="e-mail" />
            <Text style={signUpStyles.passwordCondition}>Le mot de passe doit contenir au moins 8 caractères, un caractère spécial, et une majuscule</Text>
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
    passwordCondition: {
        alignSelf: "center",
        color: styles.input.color,
        borderRadius: 10,
        padding: 5,
        width: "100%"
    },
})