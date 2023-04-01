import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from '../config/supabase'
import styles from "../styles";



function Activity({ route, navigation }) {

    const [participateMessage, setParticipateMessage] = useState()

    let { itemID } = route.params;

    const [item, setItem] = useState(null)
    const [isHost, setIsHost] = useState(false)
    const [user, setUser] = useState()

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('activities')
            .select()
            .eq('id', itemID)

        if (data) {
            setItem(data[0])
            /*Get the id of the current user and compare it with the id of the host of the activity */
            supabase.auth.getSession()
                .then(res => {
                    setUser(res.data.session.user)
                    if (res.data.session.user.id === data[0].hostId) {
                        console.log('is host')
                        setIsHost(true)
                    }
                })
        }
    }

    //TODO Si je ne suis pas l'hote ne pas RECEVOIR les infos applicants (dans les règles de sécurité)
    useEffect(() => {
        fetchData()
    }, []);

    // Retourne les applicants, ne doit donc s'afficher que pour l'hote
    const Applicants = () => {
        if (item) {
            return item.applicants.map((applicant) => <Text>{applicant.displayName}</Text>)
        }
    }

    //Check if id of user is already in the provided array
    const userHasAlreadyApplied = (arr) => (
        arr.some((elem) => elem.userID === user.id)
    )

    const participate = () => {
        console.log(item.applicants)
        let newApplicantsArray = [...item.applicants]
        if (userHasAlreadyApplied(item.applicants)) {
            console.log('existe déja')
            setParticipateMessage("Vous avez déjà demandé à participer et votre demande a bien été envoyée")
        } else {
            newApplicantsArray.push({
                userID: user.ui,
                //photoURL: user.photoURL,
            })

            //Mettre a jour la liste des "applicants"
        }
    }
    if (item) {
        return (
            <View style={activityStyles.container}>
                <View style={activityStyles.header}>
                    <Text>{item.activityTitle}</Text>
                    <Text>{item.date}</Text>
                </View>
                <Text>Nombre de participants {item.numberOfParticipants}</Text>
                <View style={activityStyles.buttons}>
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
            <ActivityIndicator color={styles.color} size={"large"} />
        )
    }
}


const activityStyles = StyleSheet.create({
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