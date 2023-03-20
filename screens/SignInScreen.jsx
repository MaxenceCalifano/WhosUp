import React, { useState } from "react";
import style from '../styles';
import { StyleSheet, View, TextInput, Pressable, Text } from 'react-native'
import { supabase } from '../config/supabase'

export default function SignInScreen() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const login = async () => {
        const { error, data } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) {
            setErrorMessage(error.message)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.text, { fontSize: 25 }]} >Bon retour parmis nous !</Text>
            <TextInput style={style.input} placeholder="e-mail" onChangeText={(value) => setEmail(value)} />
            <TextInput style={style.input} placeholder="mot de passe" onChangeText={(value) => setPassword(value)} />
            <Pressable style={[style.button, styles.button]} onPress={login}>
                <Text style={[styles.text, { color: style.color, fontSize: 20 }]}>Connexion</Text>
            </Pressable>
            <Text style={{ fontWeight: 'bold', alignSelf: 'flex-end' }} >Mot de passe oublié ?</Text>
            <Text>{errorMessage}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: style.color,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: 10,
    },

    text: {
        color: '#FFF',
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    button: {
        backgroundColor: '#FFF',
        alignSelf: 'center',
        width: '100%',
        margin: 10,
    }
})