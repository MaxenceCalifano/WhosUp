import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import { useAuthentication } from '../utils/hooks/useAuthentication'
import '../config/firebase'
import { getFirestore, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import app from '../config/firebase';
const firestore = getFirestore(app);


function Activity({ route, navigation }) {

    const [participateMessage, setParticipateMessage] = useState()

    // Will provide informations from the user that request participating
    const { user } = useAuthentication()

    let { item } = route.params;

    onSnapshot(doc(firestore, "activities", item.id), (doc) => {
        item = { ...doc.data(), id: doc.id }
    });

    const userHasAlreadyApplied = (arr) => (
        arr.some((elem) => elem.userID === user.uid)
    )

    const participate = async () => {
        let newApplicantsArray = []

        if (user) {
            newApplicantsArray = [...item.applicants]
            if (userHasAlreadyApplied(item.applicants)) {
                console.log('existe déja')
                setParticipateMessage("Vous avez déjà demandé à participer et votre demande a bien été envoyée")
            } else {
                newApplicantsArray.push({
                    userID: user.uid,
                    displayName: user.providerData[0].displayName,
                    photoURL: user.photoURL,
                })

                const activityRef = doc(firestore, "activities", item.id)
                try {
                    await updateDoc(activityRef, {
                        applicants: newApplicantsArray
                    })
                        .then(() => setParticipateMessage("Votre demande a bien été envoyée, l'organisateur la vérifiera très vite"))
                }
                catch (err) {
                    console.log(err)
                }
            }

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
            <Text>{participateMessage}</Text>

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