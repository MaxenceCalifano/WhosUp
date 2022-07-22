import React from "react";
import style from '../styles';
import { StyleSheet, View, TextInput, Pressable, Text } from 'react-native'

export default function SignInScreen() {
    return (
        <View style={styles.container}>
            <Text style={[styles.text, { fontSize: 25 }]} >Bon retour parmis nous !</Text>
            <TextInput style={style.input} placeholder="e-mail" />
            <TextInput style={style.input} placeholder="mot de passe" />
            <Pressable style={[style.button, styles.button]}>
                <Text style={[styles.text, { color: style.color, fontSize: 20 }]}>Connexion</Text>
            </Pressable>
            <Text style={{ fontWeight: 'bold', alignSelf: 'flex-end' }} >Mot de passe oublié ?</Text>
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