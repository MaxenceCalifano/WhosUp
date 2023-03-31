import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";


function Activity({ route, navigation }) {

    const [participateMessage, setParticipateMessage] = useState()

    let { itemID } = route.params;

    const [item, setItem] = useState(null)
    const [isHost, setIsHost] = useState(true)

    //TODO Si je ne suis pas l'hote ne pas RECEVOIR les infos applicants (dans les règles de sécurité)
    useEffect(() => {

    }, []);

    // Retourne les applicants, ne doit donc s'afficher que pour l'hote
    const Applicants = () => {
        if (item) {
            return item.applicants.map((applicant) => <Text>{applicant.displayName}</Text>)
        }
    }
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
    if (item) {
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
                {isHost ? <Applicants /> : <></>}
            </View>
        )
    } else {
        return (
            <Text>Loader</Text>
        )
    }
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