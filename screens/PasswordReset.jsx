import React, { useState } from "react";
import { View } from "react-native";
import { Button, Icon } from '@rneui/themed';
import { TextInput } from "react-native-gesture-handler";
import styles from "../styles";

function PasswordReset() {

    const [email, setEmail] = useState()

    const sendResetPasswordEmail = () => {
        console.log('reset')
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