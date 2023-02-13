import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import { useAuthentication } from '../utils/hooks/useAuthentication'
import '../config/firebase'
import { getFirestore, updateDoc, doc } from 'firebase/firestore';
const firestore = getFirestore();

//"Test_a5dd1a08-cb9a-46ac-a288-c8fc430423c8"

function Activity({ route, navigation }) {

    // Will provide informations from the user that request participating
    const { user } = useAuthentication()


    const { item } = route.params;
    let newApplicantsArray = []
    useEffect(() => {
        if (item && user) {
            newApplicantsArray = [...item.applicants]
            newApplicantsArray.push({
                userID: user.uid,
                displayName: user.providerData[0].displayName,
                photoURL: user.photoURL,
            })
        }

    })

    const participate = async () => {
        console.log('vous avez demandé à participer à cette activité')
        const activityRef = doc(firestore, "activities", item.id)


        try {
            await updateDoc(activityRef, {
                applicants: newApplicantsArray
            })
                .then(() => console.log("c'est bon"))
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text>{item.date}</Text>
                <Text>{item.activityTitle}</Text>
            </View>
            <Text>Nombre de participants {item.numberOfParticipants}</Text>
            <View style={styles.buttons}>
                <Button onPress={participate} title="Participer" />
                <Button title="Intéressé(e)" />
                <Button title="Plus" />
            </View>

            <Text>{item.activityDescription}</Text>



        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 40
    },
    header: {
        flexDirection: 'row',
    },
    buttons: {
        flexDirection: 'row'
    }
})
export default Activity;