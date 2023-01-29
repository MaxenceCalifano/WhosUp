import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { doc, getDocs, getFirestore, collection, query, where } from 'firebase/firestore';


import app from '../config/firebase';
import { useEffect } from "react";
const db = getFirestore(app);

//"Test_a5dd1a08-cb9a-46ac-a288-c8fc430423c8"


function Activity({ route, navigation }) {

    const { item } = route.params;
    console.log(item)

    return (
        <View style={styles.container}>
            <Text>{item.activityTitle}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default Activity;