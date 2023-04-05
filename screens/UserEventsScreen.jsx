import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from 'react-native'
import { Divider } from 'react-native-elements'
import { supabase } from '../config/supabase'
import { useUser } from "../UserContext";


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
        <Pressable key={item.uid}>
            <Text>{item.activityTitle}</Text>
            <Text>{item.date}</Text>
            <Text>{item.activityDescription.slice(0, 40)}</Text>
        </Pressable>
    )

    useEffect(() => {
        fetchHostActivites()
    }, [])



    return (
        <View style={{ flex: 1 }}>
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