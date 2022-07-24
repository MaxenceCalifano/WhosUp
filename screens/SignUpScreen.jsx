import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native'
import styles from "../styles";

const auth = getAuth()

export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [submitMessage, setSubmitMessage] = useState('')

    const createAccount = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user
                setSubmitMessage('Votre compte a été créé avec succès !')
                navigation.navigate('Configurer le compte')
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
            })
    }
    const submit = () => {
        if (email === '' || password === '') {
            setSubmitMessage("Veuillez renseigner une adresse email et un mot de passe s'il vous plaît")
            return;
        } else {
            createAccount()
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