import React, { useState } from "react";
import { StyleSheet, View, TextInput, Text, Button } from 'react-native';
import { getAuth, updateProfile } from "firebase/auth";
import styles from "../styles";

const auth = getAuth();

export default function ConfigureAccountScreen() {
    const [name, setName] = useState('')
    const [photoURL, setPhoto] = useState('')

    return (
        <View style={styles.authContainer}>
            <Text>Configurer le profile</Text>
            <TextInput placeholder="pseudo" value={name} onChangeText={(value) => setName(value)} />
        </View>
    )
}