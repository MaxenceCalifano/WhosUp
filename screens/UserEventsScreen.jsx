import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Divider } from 'react-native-elements'
import { supabase } from '../config/supabase'
import { useUser } from "../UserContext";
import { Ionicons } from '@expo/vector-icons';


function UserEventScreen({ navigation }) {

    const { user } = useUser()
    const [hostActivities, setHostActivities] = useState([])
    const [participationNotConfirmed, setParticipationNotConfirmed] = useState([])
    const [participationConfirmed, setParticipationConfirmed] = useState([])

    const fetchHostActivites = async () => {
        const { data, error } = await supabase
            .from('activities')
            .select()
            .eq('host_id', user.id)

        if (data) {
            //console.log("🚀 ~ file: UserEventsScreen.jsx:21 ~ fetchHostActivites ~ data:", data)
            setHostActivities(data)
        }
        if (error) console.log("🚀 ~ file: UserEventsScreen.jsx:21 ~ fetchHostActivites ~ error:", error)
    }

    const fetchUserActivities = async () => {
        const { data, error } = await supabase
            .from('applicants')
            .select(`*,
                    activities(*)`)
            .eq('user_id', user.id)

        if (data) {
            setParticipationNotConfirmed(data)
        }
        if (error) console.log("🚀 ~ file: UserEventsScreen.jsx:39 ~ fetchuserActivities ~ error:", error)
    }
    const fetchAttendeeActivities = async () => {
        const { data, error } = await supabase
            .from('attendees')
            .select(`*,
                    activities(*)`)
            .eq('user_id', user.id)

        if (data) {
            setParticipationConfirmed(data)
        }
        if (error) console.log("🚀 ~ file: UserEventsScreen.jsx:51 ~ fetchuserActivities ~ error:", error)
    }

    const Activity = ({ item, isValidated }) => (
        <Pressable
            style={eventsScreenStyles.activityContainer}
            key={item.uid}
            onPress={() => navigation.navigate('Activité', { itemID: item.uid })}>

            <Text style={eventsScreenStyles.activityTitle}>{item.activityTitle}</Text>
            {isValidated ? "" : <Text>(En attente de validation par l'organisateur)</Text>}
            <Text>{item.activityDescription.slice(0, 40)}</Text>
            <View style={eventsScreenStyles.dateAndParticipants}>
                <Text><Ionicons name="time-sharp" size={24} color="black" /> {item.date}</Text>
                <Text><Ionicons name="people" size={24} color="black" /> 0/{item.numberOfParticipants}</Text>
            </View>
        </Pressable>
    )

    useEffect(() => {
        fetchHostActivites()
        fetchUserActivities()
        fetchAttendeeActivities()
    }, [])



    return (
        <View style={eventsScreenStyles.container}>
            <Text>Mes événements</Text>
            <Divider />
            <Text>J'organise</Text>
            {hostActivities.length > 0 ? hostActivities.map(item => <Activity key={item.uid} item={item} isValidated />) : <></>}
            <Divider />
            <Text>Je participe</Text>
            {participationNotConfirmed.length > 0 ? participationNotConfirmed.map(item => <Activity key={item.activities.uid} item={item.activities} isValidated={false} />) : <></>}
            {participationConfirmed.length > 0 ? participationConfirmed.map(item => <Activity key={item.activities.uid} item={item.activities} isValidated />) : <></>}
            <Divider />
        </View>
    );
}

export default UserEventScreen;

const eventsScreenStyles = StyleSheet.create({
    container: {
        padding: 10
    },
    activityContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        elevation: 5,
        marginVertical: 10
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: "500"
    },
    dateAndParticipants: {
        flexDirection: "row"
    }
})