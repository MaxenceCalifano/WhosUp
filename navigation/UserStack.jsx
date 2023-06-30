import React, { createContext, useState } from "react";
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Main from '../components/Main'
import ConfigureAccount from '../screens/ConfigureAccount'
import Activity from "../screens/ActivityScreen";
import Chat from "../screens/ChatScreen";
import UpdateEventScreen from "../screens/UpdateEventScreen";

const Stack = createNativeStackNavigator();
export const UnreadMessagesContext = createContext({
    unreadMessages: null,
})

export default function UserStack() {
    const [unreadMessages, setUnreadMessages] = useState(0)
    return (
        <UnreadMessagesContext.Provider value={{ unreadMessages, setUnreadMessages }}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Group>
                        <Stack.Screen name='Carte' component={Main} options={{ headerShown: false }} />
                        <Stack.Screen name='Activité' component={Activity} options={{ headerShown: false }} />
                        <Stack.Screen name='Configurer le compte' component={ConfigureAccount} />
                        <Stack.Screen name='Chat' component={Chat} />
                        <Stack.Screen name="Modifier l'activité" component={UpdateEventScreen} />
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer>
        </UnreadMessagesContext.Provider>
    )
}