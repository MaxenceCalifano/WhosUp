import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import mainStyles from '../styles';

import { FontAwesome, Ionicons, AntDesign } from '@expo/vector-icons';

import UserProfile from '../screens/UserProfile';
import AddEventScreen from '../screens/AddEventScreen';
import UserEventScreen from '../screens/UserEventsScreen';
import Map from './Map';
import ChatListScreen from '../screens/ChatListScreen';

export default function Main() {

    const Tab = createBottomTabNavigator();

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