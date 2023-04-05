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
        <Pressable style={eventsScreenStyles.activityContainer} key={item.uid}>
            <Text style={eventsScreenStyles.activityTitle}>{item.activityTitle}</Text>
            <Text>{item.activityDescription.slice(0, 40)}</Text>
            <View style={eventsScreenStyles.dateAndParticipants}>
                <Text><Ionicons name="time-sharp" size={24} color="black" /> {item.date}</Text>
                <Text><Ionicons name="people" size={24} color="black" /> 0/{item.numberOfParticipants}</Text>
            </View>
        </Pressable>
    )

    useEffect(() => {
        fetchHostActivites()
    }, [])



    return (
        <View style={eventsScreenStyles.container}>
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

const eventsScreenStyles = StyleSheet.create({
    container: {
        padding: 10
    },
    activityContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 15,
        elevation: 10
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: "500"
    },
    dateAndParticipants: {
        flexDirection: "row"
    }
})