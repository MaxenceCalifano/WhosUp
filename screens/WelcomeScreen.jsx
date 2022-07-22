
import { StatusBar } from 'expo-status-bar';
import React from "react";
import reactDom from 'react-dom';
import styles from '../styles';

import { StyleSheet, View, Text, Pressable } from 'react-native'

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.authContainer}>
            <View style={{ borderBottomColor: 'white', borderBottomWidth: 3, width: '50%', alignSelf: 'center' }} />
            <Text style={{ fontWeight: 'bold', fontSize: 25, alignSelf: 'center', color: '#454545' }}>
                Rencontrez des voyageurs !
            </Text>
            <View style={style.buttonsContainer}>
                <Pressable onPress={() => navigation.navigate('Créer un compte')} style={[style.buttons, style.registerButton]}>
                    <Text style={[style.buttonsText, { color: '#F5DF4D' }]}>Créer un compte</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Se connecter')} style={[style.buttons, style.siginInButton]}>
                    <Text style={[style.buttonsText, { color: '#FFFF' }]} >Connexion</Text>
                </Pressable>
            </View>
        </View >
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#F5DF4D',
    },
    buttons: {
        borderRadius: 15,
        padding: 20,
        margin: 10,
    },
    registerButton: {
        backgroundColor: 'white'
    },
    siginInButton: {
        backgroundColor: '#454545'

    },
    buttonsText: {
        textAlign: 'center',
        fontWeight: '600'
    }

})