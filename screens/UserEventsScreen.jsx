import React, { useEffect, useState } from "react";
import { View, Text } from 'react-native'
import { Divider } from 'react-native-elements'
import { supabase } from '../config/supabase'


function UserEventScreen() {
    const [userId, setUserId] = useState()

    const fetchHostActivites = async () => {
        const { data, error } = await supabase
            .from('activities')
            .select()
            .eq('host_id', userId)

        if (data) {
            console.log(data)
        }
        if (error) console.log(error)
    }

    const fetchUserId = async () => {
        const { data, error } = await supabase.auth.getSession()
        if (data) setUserId(data.session.user.id)
        if (error) console.log("🚀 ~ file: UserEventsScreen.jsx:27 ~ useEffect ~ error:", error)
    }

    useEffect(() => {
        fetchUserId()
        fetchHostActivites()
    }, [])



    return (
        <View style={{ flex: 1 }}>
            <Text>Mes événements</Text>
            <Divider />
            <Text>J'organise</Text>
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