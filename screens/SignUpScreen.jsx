import React, { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native'
import styles from "../styles";

export default function SignUpScreen() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const createAccount = () => {
        createUserWithEmailAndPassword(auth, 'test2@mail.fr', 'password')
            .then((userCredentials) => {
                const user = userCredentials.user
                console.log(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            })
    }

    return (
        <View style={styles.authContainer} >
            <TextInput style={styles.input} placeholder="e-mail" />
            <TextInput style={styles.input} placeholder="mot de passe" />
            <Pressable style={[styles.button, { backgroundColor: '#FFF', }]}>
                <Text style={{ color: styles.color, alignSelf: 'center' }}>Créer un compte</Text>
            </Pressable>
        </View>
    )
}

const signUpStyles = StyleSheet.create({
    button: {
        backgroundColor: '#FFF',
    }
})