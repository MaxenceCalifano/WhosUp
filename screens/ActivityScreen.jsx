import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, Pressable, Dimensions } from "react-native";
import { Divider } from 'react-native-elements'
import { Ionicons, FontAwesome5, Entypo, AntDesign, Feather } from '@expo/vector-icons';
import { supabase } from '../config/supabase'
import styles from "../styles";
import { useUser } from "../UserContext";
import dayjs from "dayjs";


function Activity({ route, navigation }) {

    const [participateMessage, setParticipateMessage] = useState()
    const [isAttendee, setIsAttendee] = useState(false)
    const [attendees, setAttendees] = useState(0)
    const { user } = useUser()
    const [item, setItem] = useState(null)
    const [isHost, setIsHost] = useState(false)
    const [unsubscribing, setIsUnsubscribing] = useState(false)

    let { itemID } = route.params;
    //console.log("🚀 ~ file: ActivityScreen.jsx:14 ~ Activity ~ itemID:", itemID)

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('activities')
            .select(`*,
                    applicants(user_id, username, is_validated)`)
            .eq('uid', itemID)

        if (data) {
            setItem(data[0])
            const validatedAttendees = data[0].applicants.filter(elem => elem.is_validated)
            setAttendees(validatedAttendees)
            /*Compare current user with the id of the host of the activity */
            if (user.id === data[0].host_id) {
                //console.log('is host')
                setIsHost(true)

                // Check if the current user is included in the applicants array
            } else if (data[0].applicants.some(applicant => applicant.user_id === user.id)) {
                setIsAttendee(true)
            }

        }
        if (error) console.log(error)
    }

    function validateAttendee(userId, isValidated) {
        return new Promise(async (resolve, reject) => {

            const { status, error } = await supabase
                .from('applicants')
                .update({ is_validated: isValidated })
                .eq('user_id', userId)
                .eq('activity_id', item.uid)

            if (status === 204) {
                resolve()
            }
            if (error) reject(error)
        })
    }

    useEffect(() => {
        fetchData()
    }, []);

    // Component that returns applicants
    const Applicant = ({ applicant }) => {
        const [isValidated, setIsValidated] = useState(applicant.is_validated)
        const [validateUserMessage, setValidateUserMessage] = useState()

        return (
            <View key={applicant.user_id} style={{ flexDirection: 'row', alignItems: "center" }}>
                <Text>{applicant.username}</Text>
                {isValidated ?
                    <View>
                        <Pressable onPress={() => {
                            validateAttendee(applicant.user_id, false)
                                .then(() => setIsValidated(false))
                                .catch(error => {
                                    console.log(error)
                                    setValidateUserMessage("Une erreur est survenue")
                                })
                        }}>
                            <Feather name="x-circle" size={24} color="black" />
                        </Pressable>
                    </View>
                    :
                    <View style={{ flexDirection: "row" }}>
                        <Pressable onPress={() => {
                            validateAttendee(applicant.user_id, true)
                                .then(() => setIsValidated(true))
                                .catch(error => {
                                    console.log(error)
                                    setValidateUserMessage("Une erreur est survenue")
                                })
                        }}>
                            <AntDesign name="checkcircle" size={24} color="black" />
                        </Pressable>
                        <Text>(en attente de votre validation)</Text>
                    </View>
                }
                <Pressable onPress={async () => {
                    console.log(user.id, applicant.user_id)


                    const { data, error } = await supabase
                        .from('chat_rooms_profiles')
                        .select()
                        .in('user_id', [user.id, applicant.user_id])

                    //We fetched all the chats of the users, now we want to match the chat they have in common :
                    if (data) {
                        const filteredArr = data.filter(obj => {
                            const roomId = obj.room_id;
                            return data.some(otherObj => otherObj !== obj && otherObj.room_id === roomId);
                        });

                        if (filteredArr.length > 0) {
                            navigation.navigate('Chat', { roomId: filteredArr[0].room_id, profile: { username: applicant.username } })
                        }
                        if (filteredArr.length < 1) {
                            //Will create a new chat between the 2 users
                            console.log('no room')

                            const { data, error } = await supabase
                                .from('chat_rooms')
                                .insert({})
                                .select()
                            if (data) {
                                const { status, error } = await supabase
                                    .from('chat_rooms_profiles')
                                    .insert([
                                        { room_id: data[0].id, user_id: user.id },
                                        { room_id: data[0].id, user_id: applicant.user_id },
                                    ])
                                if (status === 201) navigation.navigate('Chat', { roomId: data[0].id, profile: { username: applicant.username } })
                                if (error) console.log(error)
                            }
                            if (error) console.log('ligne 135', error)
                        }

                    }
                    if (error) console.log(error)

                }}>
                    <Ionicons name="chatbox-ellipses" size={24} color="black" />
                </Pressable>
                {
                    /**
                     * Fetch chat_rooms where users_ids === host_id, applicant_id
                        * if doesn''t exit create new one
                        * if exists navigate to chat screen with the chat_room id
                     */
                }
                <Text>{validateUserMessage}</Text>
            </View>
        )
    }

    const unsubscribe = async () => {

        const { error, status, statusText } = await supabase
            .from('applicants')
            .delete()
            .eq('user_id', user.id)

        if (error) console.log("🚀 ~ file: ActivityScreen.jsx:69 ~ unsubscribe ~ error:", error)
        if (status === 204) {
            setParticipateMessage("Vous avez bien été désincrit(e) de l'activité")
            setIsAttendee(false)
            setIsUnsubscribing(false)
        }
        console.log(status, statusText, error)
    }

    const Unsubscribe = () => (
        <View style={{ flexDirection: "row" }}>
            <Pressable style={[activityStyles.unsubscribeButtons, { backgroundColor: 'rgba(214, 61, 57, 1)' }]} onPress={() => unsubscribe()}>
                <Text>Oui</Text>
                <AntDesign name="check" size={24} color="black" />
            </Pressable>
            <Pressable style={[activityStyles.unsubscribeButtons, { backgroundColor: 'rgba(127, 220, 103, 1)' }]} onPress={() => { setIsUnsubscribing(false); setParticipateMessage("") }}>
                <Text>Non</Text>
                <Feather name="x-circle" size={24} color="black" />
            </Pressable>
        </View>
    )

    const participate = async () => {

        if (isAttendee) return (
            setParticipateMessage("Vous avez déjà demandé à particier à cette activité, souhaitez-vous vous déinscrire ?"),
            setIsUnsubscribing(true)
        )

        //Get username of the current user
        let { data: profiles, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)

        await supabase
            .from('applicants')
            .insert({ activity_id: itemID, user_id: user.id, username: profiles[0].username })
            .then(() => {
                setParticipateMessage("Votre demande a bien été transmise à l'organisateur")
                setIsAttendee(true)
            })
            .catch(error => console.log('error', error))
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
                    <Text><FontAwesome5 name="clock" size={24} color="black" />{dayjs(item.date).format('DD MMM, YYYY h:mm A')}</Text>

                    <Text><Ionicons name="people" size={24} color="black" />{attendees.length}/{item.numberOfParticipants}</Text>
                    <View style={activityStyles.buttonsContainer}>
                        <Pressable style={[activityStyles.buttons, isAttendee ? activityStyles.validatedButton : '']} onPress={participate}>
                            <Text>Participer</Text>
                            <Text> {isAttendee ? <AntDesign name="checkcircle" size={24} color="black" /> : ""}</Text>
                        </Pressable>
                        <Pressable style={activityStyles.buttons}>
                            <Text>Intéressé(e)</Text>
                        </Pressable>
                        <Pressable style={activityStyles.buttons}>
                            <Entypo name="dots-three-vertical" size={24} color="black" />
                        </Pressable>
                    </View>
                    <Text>{participateMessage}</Text>
                    {unsubscribing ? <Unsubscribe /> : <></>}

                    <Text style={{ fontWeight: 'bold' }}>Description</Text>
                    <Text>{item.activityDescription}</Text>
                    {item.applicants && isHost ?
                        <View style={activityStyles.applicantsList}>
                            <Divider />
                            <Text style={{ fontWeight: '500', fontSize: 15 }}>Personnes souhaitant participer à votre activité:</Text>
                            {item.applicants.map(applicant => <Applicant key={applicant.user_id} applicant={applicant} />)}

                        </View>
                        : <></>}
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
    buttonsContainer: {
        flexDirection: 'row',
        gap: 15
    },
    buttons: {
        backgroundColor: styles.color,
        padding: 5,
        borderRadius: 5,
        marginRight: 5,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    validatedButton: {
        backgroundColor: styles.secondaryColor
    },
    unsubscribeButtons: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 15,
        marginVertical: 5
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
    applicantsList: {
        marginTop: 10
    }
})
export default Activity;