import React, { useState } from "react";
import style from '../styles';
import { StyleSheet, View, TextInput, Pressable, Text, ActivityIndicator, Modal } from 'react-native'
import { supabase } from '../config/supabase'

export default function SignInScreen({ navigation }) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setIsloading] = useState(false)

    const login = async ({ navigation }) => {
        setIsloading(true)
        const { error, data } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (data) setIsloading(false)
        if (error) {
            setErrorMessage(error.message)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.text, { fontSize: 25 }]} >Bon retour parmis nous !</Text>
            <TextInput keyboardType="email-address" style={style.input} placeholder="e-mail" onChangeText={(value) => setEmail(value)} />
            <TextInput secureTextEntry style={style.input} placeholder="mot de passe" onChangeText={(value) => setPassword(value)} />
            <Pressable style={[style.button, styles.button]} onPress={login}>
                <Text style={[styles.text, { color: style.color, fontSize: 20 }]}>Connexion</Text>
            </Pressable>
            <Pressable>
                <Text onPress={() => navigation.navigate('Réinitialiser le mot de passe')} style={{ fontWeight: 'bold', alignSelf: 'flex-end' }} >Mot de passe oublié ?</Text>
            </Pressable>
            <Text>{errorMessage}</Text>
            <Modal
                visible={isLoading}
                animationType="fade"
                transparent={true}
            >
                <View style={styles.modal}>
                    <ActivityIndicator color={style.color} size={"large"} />
                </View>
            </Modal>
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
    },
    modal: {
        position: "absolute",
        width: 200,
        height: 200,
        top: '50%',
        left: '50%',
        marginLeft: -100,
        marginTop: -100,
        borderRadius: 15,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        display: "flex",
        justifyContent: "center"
    }
})