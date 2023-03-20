import React from "react";
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import WelcomeScreen from "../screens/WelcomeScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack({ setIsNew }) {
    return (

        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Bienvenu(e)' component={WelcomeScreen} />
                <Stack.Screen name='Se connecter' component={SignInScreen} />
                <Stack.Screen name='Créer un compte' component={SignUpScreen} setIsNew={setIsNew} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

