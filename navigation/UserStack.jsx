import React from "react";
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Main from '../components/Main'
import ConfigureAccount from '../screens/ConfigureAccount'


const Stack = createNativeStackNavigator();

export default function UserStack(props) {
    console.log(props.isNew)
    return (

        <NavigationContainer>
            <Stack.Navigator>
                {props.isNew ?
                    <Stack.Group>
                        <Stack.Screen name='Configurer le compte' component={ConfigureAccount} />
                        <Stack.Screen name='Carte' component={Main} options={{ headerShown: false }} />
                    </Stack.Group>

                    : <Stack.Screen name='Carte' component={Main} options={{ headerShown: false }} />}

            </Stack.Navigator>
        </NavigationContainer>
    )
}