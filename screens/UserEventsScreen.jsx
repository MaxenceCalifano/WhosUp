import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { Divider } from 'react-native-elements'
import { supabase } from '../config/supabase'
import { useUser } from "../UserContext";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from "dayjs";
import styles from "../styles"

function UserEventScreen({ navigation }) {

    const { user } = useUser()
    const [hostActivities, setHostActivities] = useState([])
    const [userActivities, setUserActivities] = useState([])
    const [hostActivitiesIsLoading, setHostActivitiesIsLoading] = useState(true)
    const [userActivitiesIsLoading, setUserActivitiesIsLoading] = useState(true)

    const fetchHostActivites = async () => {
        const { data, error } = await supabase.functions.invoke('fetchHostActivities', {
            body: {
                userId: user.id
            },
        })

        if (data) {
            //console.log("🚀 ~ file: UserEventsScreen.jsx:21 ~ fetchHostActivites ~ data:", data.data)
            setHostActivities(data.data)
            setHostActivitiesIsLoading(false)
        }
        if (error) console.log("🚀 ~ file: UserEventsScreen.jsx:21 ~ fetchHostActivites ~ error:", error)
    }

    const fetchUserActivities = async () => {
        const { data, error } = await supabase.functions.invoke('fetchUserActivities', {
            body: {
                userId: user.id
            },
        })

        if (data) {
            setUserActivities(data.data)
            setUserActivitiesIsLoading(false)
        }
        if (error) console.log("🚀 ~ file: UserEventsScreen.jsx:39 ~ fetchuserActivities ~ error:", error)
    }

    const Activity = ({ item, isValidated }) => (
        <Pressable
            style={eventsScreenStyles.activityContainer}
            key={item.uid}
            onPress={() => navigation.navigate('Activité', { itemID: item.uid })}>

            <Text style={eventsScreenStyles.activityTitle}>{item.activity_title}</Text>
            {isValidated ? "" : <Text>(En attente de validation par l'organisateur)</Text>}
            <Text>{item.activity_description.slice(0, 40)}</Text>
            <View style={eventsScreenStyles.dateAndParticipants}>
                <Text><Ionicons name="time-sharp" size={24} color="black" /> {dayjs(item.date).format('DD MMM, YYYY hh:mm')}</Text>
            </View>
        </Pressable>
    )

    useFocusEffect(
        React.useCallback(() => {
            fetchHostActivites()
            fetchUserActivities()
        }, []))



    return (
        <View style={eventsScreenStyles.container}>
            <ScrollView>
                <Text style={eventsScreenStyles.titles}>Mes événements</Text>
                <Divider style={eventsScreenStyles.dividers} />

                <Text style={eventsScreenStyles.titles}>J'organise</Text>
                {
                    hostActivitiesIsLoading ? <ActivityIndicator color={styles.color} size="large" />
                        : hostActivities.length > 0 ? hostActivities.map(item => <Activity key={item.uid} item={item} isValidated />) : <Text>Vous n'avez pas encore créé d'activité</Text>
                }
                <Divider style={eventsScreenStyles.dividers} />

                <Text style={eventsScreenStyles.titles}>Je participe</Text>
                {
                    userActivitiesIsLoading ? <ActivityIndicator color={styles.color} size="large" /> :
                        userActivities.length > 0 ? userActivities.map(item => <Activity key={item.activities.uid} item={item.activities} isValidated={item.is_validated} />)
                            : <Text>Vous n'avez pas encore demandé à participer à une activité</Text>
                }
                <Divider style={eventsScreenStyles.dividers} />
            </ScrollView>

        </View>
    );
}

export default UserEventScreen;

const eventsScreenStyles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
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
    },
    dividers: {
        marginBottom: 5
    },
    titles: {
        fontSize: 15,
        fontWeight: 500
    }
})