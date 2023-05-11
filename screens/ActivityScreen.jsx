import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, Pressable, Dimensions, ScrollView } from "react-native";
import { Divider } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
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
    const [region, setRegion] = useState({ latitude: 40.4167754, longitude: -3.7037902, latitudeDelta: 0.05, longitudeDelta: 0.05 })
    const [marker, setMarker] = useState()
    const [currentUserIsValidated, setCurrentUserIsValidated] = useState()

    let { itemID } = route.params;

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

    const edgeFecthActivity = async () => {
        const { data, error } = await supabase.functions.invoke('fetchActivityCoordinate', {
            body: {
                activityId: itemID,
                user: user
            },
        })
        if (data) {
            console.log('edge data', data.data.applicants)
            setItem(data.data)
            const validatedAttendees = data.data.applicants.filter(elem => elem.is_validated)
            setAttendees(validatedAttendees)
            /*Compare current user with the id of the host of the activity */
            if (user.id === data.data.host_id) {
                //console.log('is host')
                setIsHost(true)

                // Check if the current user is included in the applicants array
            } else if (data.data.applicants.some(applicant => {
                setCurrentUserIsValidated(applicant.is_validated)
                return applicant.user_id === user.id
            })) {
                setIsAttendee(true)
            }
            setRegion({ latitude: data.data.location.latitude, longitude: data.data.location.longitude })
        }
        if (error) console.log("🚀 ~ file: Map.jsx:63 ~ edgeFetchActivities ~ error:", error)
    }

    useEffect(() => {
        edgeFecthActivity()
    }, []);

    useEffect(() => {
        if (item) {
            if (currentUserIsValidated || isHost) {
                if (item.activity_type === "apéro") { setMarker(require('../assets/drink_icon.png')) }
                if (item.activity_type === "randonée") { setMarker(require('../assets/hike_icon.png')) }
                if (item.activity_type === "jeux de société") { setMarker(require('../assets/games_icon.png')) }
            } else {
                if (item.activity_type === "apéro") { setMarker(require('../assets/drink_icon_approximate.png')) }
                if (item.activity_type === "randonée") { setMarker(require('../assets/hike_icon_approximate.png')) }
                if (item.activity_type === "jeux de société") { setMarker(require('../assets/game_icon_approximate.png')) }
            }
        }

    }, [isAttendee, isHost, item]);

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
                <ScrollView style={activityStyles.scrollView}>
                    <Pressable style={activityStyles.backIcon} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={24} color="black" />
                    </Pressable>
                    <Image style={activityStyles.image} source={item.activity_type === "randonée" ? require('../assets/hiking_thumbnail.jpg') : item.activity_type === "jeux de société" ? require('../assets/tablegame_thumbnail.jpg') : require('../assets/drinks_thumbnail.jpg')} />

                    <View style={activityStyles.dataContainer} >

                        <Text style={activityStyles.title}>{item.activity_title}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <FontAwesome5 style={{ marginHorizontal: 2 }} name="clock" size={24} color="black" />
                            <Text>{dayjs(item.date).format('DD MMM, YYYY h:mm A')}</Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons style={{ marginHorizontal: 2 }} name="people" size={24} color="black" />
                            <Text>{attendees.length}/{item.number_of_participants}</Text>
                        </View>
                        <View style={activityStyles.buttonsContainer}>
                            {
                                isHost ? <Text>Vous êtes l'organisateur de cette activité</Text>
                                    : <Pressable style={[activityStyles.buttons, isAttendee ? activityStyles.validatedButton : '']} onPress={participate}>
                                        <Text>Participer</Text>
                                        <Text> {isAttendee ? <AntDesign name="checkcircle" size={24} color="black" /> : ""}</Text>
                                    </Pressable>
                            }
                            {/* <Pressable style={activityStyles.buttons}>
                                <Text>Intéressé(e)</Text>
                            </Pressable>
                            <Pressable style={activityStyles.buttons}>
                                <Entypo name="dots-three-vertical" size={24} color="black" />
                            </Pressable> */}
                        </View>
                        <Text>{participateMessage}</Text>
                        {unsubscribing ? <Unsubscribe /> : <></>}

                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Description</Text>
                        <Text>{item.activity_description}</Text>
                        {item.applicants && isHost ?
                            <View style={activityStyles.applicantsList}>
                                <Divider />
                                <Text style={{ fontWeight: '500', fontSize: 15 }}>Personnes souhaitant participer à votre activité:</Text>
                                {item.applicants.map(applicant => <Applicant key={applicant.user_id} applicant={applicant} />)}

                            </View>
                            : <></>}
                        <Divider />
                        <Text style={activityStyles.location_title}>Emplacement :</Text>
                        <View style={activityStyles.mapContainer}>

                            <MapView style={activityStyles.map} region={{ ...region, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
                                {item ?
                                    currentUserIsValidated || isHost ?
                                        < Marker
                                            coordinate={region}
                                            title={item.activity_title}
                                            description={`${region.latitude}, ${region.longitude}`}
                                            image={marker}
                                        />
                                        :
                                        < Marker
                                            coordinate={region}
                                            title={item.activity_title}
                                            description={"L'emplacement exact sera visible une fois votre participation validée"}
                                            image={marker}
                                        />
                                    : <></>}
                            </MapView>
                        </View>
                        {currentUserIsValidated || isHost ? <></> : <Text>L'emplacement exact vous sera communiquée lorsque votre participation sera validée</Text>}
                    </View>
                </ScrollView >
            </View >
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
        flex: 1,
        height: Dimensions.get('window').height

    },
    scrollView: {
        // flex: 1
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
        height: 200,
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
    },
    mapContainer: {
        borderRadius: 15,
        overflow: "hidden"
    },
    location_title: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 2
    },
    map: {
        width: Dimensions.get('window').width - Dimensions.get('window').width * 100 / 10,
        height: 200,
    }
})
export default Activity;