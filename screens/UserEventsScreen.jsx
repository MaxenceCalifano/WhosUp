import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Divider } from 'react-native-elements'
import { supabase } from '../config/supabase'
import { useUser } from "../UserContext";
import { Ionicons } from '@expo/vector-icons';



function UserEventScreen() {

    const { user } = useUser()
    const [hostActivities, setHostActivities] = useState([])

    const fetchHostActivites = async () => {
        const { data, error } = await supabase
            .from('activities')
            .select()
            .eq('host_id', user.id)

        if (data) {
            console.log("🚀 ~ file: UserEventsScreen.jsx:17 ~ fetchHostActivites ~ data:", data)
            setHostActivities(data)
        }
        if (error) console.log("🚀 ~ file: UserEventsScreen.jsx:21 ~ fetchHostActivites ~ error:", error)
    }

    const Activity = ({ item }) => (
        <Pressable style={userEventStyle.activity}>
            <Text style={userEventStyle.activityTitle}>{item.activityTitle}</Text>
            <Text>{item.activityDescription.slice(0, 40)}</Text>
            <View style={userEventStyle.dateAndAttendees}>
                <Text><Ionicons name="time-sharp" size={24} color="black" /> {item.date}</Text>
                <Text><Ionicons name="people" size={24} color="black" /> 0/{item.numberOfParticipants}</Text>
            </View>
        </Pressable>
    )

    useEffect(() => {
        fetchHostActivites()
    }, [])



    return (
        <View style={userEventStyle.container}>
            <Text>Mes événements</Text>
            <Divider />
            <Text>J'organise</Text>
            {hostActivities.length > 0 ? hostActivities.map(item => <Activity key={item.uid} item={item} />) : <></>}
            <Divider />
            <Text>Je participe</Text>
            <Divider />
        </View>
        /**
         * Charger toutes les activités auquels participe l'utilisateur et celles dont il est
         */
    );
}

export default UserEventScreen;

const userEventStyle = StyleSheet.create({
    activity: {
        backgroundColor: "white",
        marginVertical: 10,
        elevation: 10,
        padding: 10,
        borderRadius: 15
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: "500"
    },
    dateAndAttendees: {
        display: "flex",
        flexDirection: "row",
        rowGap: 18
    },
    container: {
        flex: 1,
        padding: 10
    }
})