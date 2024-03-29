import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Button, Icon } from '@rneui/themed';
import styles from "../../styles";
import { supabase } from '../../config/supabase'

function AskPasswordReset() {

    const [email, setEmail] = useState()
    const [response, setResponseMessage] = useState()

    const sendResetPasswordEmail = async () => {
        const { data, error } = await supabase.auth
            .resetPasswordForEmail(email, { redirectTo: "https://vantivities.maxencecalifano.tech/password-reset/" })

        if (data) {
            setResponseMessage("Vous allez recevoir un e-mail de réinitialisation dans quelques instants")
            console.log("🚀 ~ file: PasswordReset.jsx:20 ~ sendResetPasswordEmail ~ data:", data)
        }

        if (error) {
            if (error.status === 422) {
                console.log("🚀 ~ file: AskPasswordReset.jsx:18 ~ sendResetPasswordEmail ~ error:", error.status)
                setResponseMessage("L'adresse e-mail est invalide")
            } else {
                console.log("🚀 ~ file: AskPasswordReset.jsx:27 ~ sendResetPasswordEmail ~ error:", error)
                setResponseMessage("Une erreur est survenue")
            }
        }
    }

    return (
        <View style={{ flex: 1, alignItems: "stretch", justifyContent: "center", padding: 20, gap: 30, backgroundColor: styles.color }}>
            <TextInput placeholder="e-mail" onChangeText={value => setEmail(value)} style={{ backgroundColor: "white", padding: 5, borderRadius: 5 }} />
            <Button
                buttonStyle={{
                    backgroundColor: "#454545",
                    borderRadius: 15,
                    padding: 15,
                    gap: 10
                }}
                titleStyle={{
                    color: "white"
                }}
                onPress={sendResetPasswordEmail}
            >
                Réinitialiser le mot de passe
                <Icon name="send" color="white" />
            </Button>
            <Text style={{ alignSelf: "center", fontWeight: "bold" }}>{response}</Text>
        </View>
    );
}

export default AskPasswordReset;