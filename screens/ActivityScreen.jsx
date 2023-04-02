import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator, Image, Pressable, Dimensions } from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
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
                <Pressable style={activityStyles.backIcon} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </Pressable>
                <Image style={activityStyles.image} source={require('../assets/hiking_thumbnail.jpg')} />

                <View style={activityStyles.dataContainer} >

                    <Text style={activityStyles.title}>{item.activityTitle}</Text>
                    <Text><FontAwesome5 name="clock" size={24} color="black" /> {item.date}</Text>

                    <Text><Ionicons name="people" size={24} color="black" /> {item.numberOfParticipants}</Text>
                    <View style={activityStyles.buttons}>
                        <Button onPress={participate} title="Participer" />
                        <Button title="Intéressé(e)" />
                        <Button title="Plus" />
                    </View>
                    <Text>{participateMessage}</Text>

                    <Text style={{ fontWeight: 'bold' }}>Description</Text>
                    <Text>{item.activityDescription}</Text>
                    {isHost ? <Applicants /> : <></>}
                </View>

            </View>
        )
    } else {
        return (
            <View style={activityStyles.loaderContainer}>
                <ActivityIndicator color={styles.color} size={"large"} />
            </View>
        )
    }
}


const activityStyles = StyleSheet.create({
    container: {
        // marginTop: 40
    },
    header: {
        flexDirection: 'row',
    },
    buttons: {
        flexDirection: 'row'
    },
    image: {
        width: '100%',
        height: '40%',
    },
    backIcon: {
        position: 'absolute',
        top: 50,
        left: 15,
        zIndex: 2,
        backgroundColor: 'white',
        borderRadius: 50
    },
    dataContainer: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        position: "relative",
        top: -15,
        backgroundColor: "#F2F2F2",
        padding: 15

    },
    title: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    loaderContainer: {
        display: "flex",
        justifyContent: 'center',
        height: Dimensions.get('window').height,
    },
})
export default Activity;