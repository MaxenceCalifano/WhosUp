import React, { useState } from "react";
import { View } from "react-native";
import { Button, Icon } from '@rneui/themed';
import { TextInput } from "react-native-gesture-handler";
import styles from "../styles";
import { supabase } from '../config/supabase'


function PasswordReset() {

    const [email, setEmail] = useState()
    const [error, setErrorMessage] = useState()

    const sendResetPasswordEmail = async () => {
        console.log('reset')
        const { data, error } = await supabase.auth
            .resetPasswordForEmail(email)

        if (data) {
            console.log("🚀 ~ file: PasswordReset.jsx:20 ~ sendResetPasswordEmail ~ data:", data)

        }

        if (error) {
            console.log("🚀 ~ file: PasswordReset.jsx:18 ~ sendResetPasswordEmail ~ error:", error)
            setErrorMessage("Une erreur est survenue")
        }
    }

    return (
        <View style={{ flex: 1, alignItems: "stretch", justifyContent: "center", padding: 20, gap: 10 }}>
            <TextInput placeholder="e-mail" onChangeText={value => setEmail(value)} style={{ backgroundColor: "white", padding: 5 }} />
            <Button
                radius={'sm'}
                buttonStyle={{
                    backgroundColor: styles.color,
                }}
                onPress={sendResetPasswordEmail}
            >
                Réinitialiser le mot de passe
                <Icon name="send" color="white" />
            </Button>
        </View>
    );
}

export default PasswordReset;