import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import mainStyles from '../styles';
import { FontAwesome, Ionicons, AntDesign } from '@expo/vector-icons';
import UserProfile from '../screens/UserStack/UserProfile';
import AddEventScreen from '../screens/UserStack/AddEventScreen';
import UserEventScreen from '../screens/UserStack/UserEventsScreen';
import Map from './Map';
import ChatListScreen from '../screens/UserStack/ChatListScreen';
import { supabase } from '../config/supabase'
import { NewMessagesContext } from '../navigation/UserStack';
import { useUser } from "../UserContext";

export default function Main() {

    const { session } = useUser()
    const Tab = createBottomTabNavigator();
    const { setNewMessage } = useContext(NewMessagesContext)
    const [unreadMessages, setUnreadMeassages] = useState(0)

    const getUnreadMessages = async () => {
        const { data, error } = await supabase.rpc('get_unread_messages_count', { p_user_id: session.user.id })
        if (error) console.log("🚀 ~ file: Main.jsx:40 ~ error:", error)
        // if (data) {
        setUnreadMeassages(data)
        //  }
    }

    //Load one first time the number of unread messages 
    useEffect(() => {
        getUnreadMessages()
    }, [])
    /*
    quand il y a un changement, envoyer le payload dans le context
    * Ensuite il faut charger le total du nmbre de messages non lus
    * il faut aussi connaître le détail pour chaque discussion
    */

    // Listen for changes on messages table, and reloads the total number of unread messages
    supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'messages' },
            async (payload) => {
                if (payload.eventType === "INSERT") {
                    setNewMessage({ chat_room_id: payload.new.chat_room_id, content: payload.new.content, user_id: payload.new.user_id })
                    getUnreadMessages()
                }
                if (payload.eventType === 'UPDATE') {
                    //console.log("les messages sont lus")
                    getUnreadMessages()
                }
            }
        )
        .subscribe()

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: 'black'
            })}
        >
            <Tab.Screen name="carte" component={Map} options={{
                title: 'Carte',
                tabBarIcon: ({ focused, color, size }) => (
                    focused ?
                        <FontAwesome name="map" size={24} color={mainStyles.color} />
                        : <FontAwesome name="map-o" size={24} color="#454545" />

                ),
                headerShown: false
            }} />
            <Tab.Screen name="Calendrier" component={UserEventScreen} options={{
                title: 'Evénements',
                tabBarIcon: ({ focused, color, size }) => (
                    focused ?
                        <FontAwesome name="calendar" size={24} color={mainStyles.color} />
                        : <FontAwesome name="calendar-o" size={24} color={mainStyles.input.color} />
                )
            }} />
            <Tab.Screen name="+" component={AddEventScreen} options={{
                title: 'Créer une activité',
                tabBarIcon: ({ focused, color, size }) => (
                    focused ?
                        <AntDesign name="pluscircle" size={24} color={mainStyles.color} />
                        : <AntDesign name="pluscircle" size={24} color="black" />
                )
            }} />

            <Tab.Screen name="Chats" component={ChatListScreen} options={{
                title: 'Chats',
                tabBarBadge: unreadMessages > 0 ? unreadMessages : null,
                tabBarIcon: ({ focused, color, size }) => (
                    focused ?
                        <Ionicons name="chatbox-ellipses" size={24} color={mainStyles.color} />
                        : <Ionicons name="chatbox-ellipses-outline" size={24} color="#454545" />
                )
            }} />
            <Tab.Screen name="Profil" component={UserProfile} options={{
                title: 'Profil',
                tabBarIcon: ({ focused, color, size }) => (
                    focused ?
                        <FontAwesome name="user" size={24} color={mainStyles.color} />
                        : <FontAwesome name="user-o" size={24} color="#454545" />

                )
            }} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});