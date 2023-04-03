import React from "react";
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Main from '../components/Main'
import ConfigureAccount from '../screens/ConfigureAccount'
import Activity from "../screens/ActivityScreen";


const Stack = createNativeStackNavigator();

export default function UserStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Group>
                    <Stack.Screen name='Carte' component={Main} options={{ headerShown: false }} />
                    <Stack.Screen name='Activité' component={Activity} options={{ headerShown: false }} />
                    <Stack.Screen name='Configurer le compte' component={ConfigureAccount} />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    )
}