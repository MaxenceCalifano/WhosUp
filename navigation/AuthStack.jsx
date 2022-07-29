import React from "react";
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'


import WelcomeScreen from "../screens/WelcomeScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ConfigureAccountScreen from "../screens/ConfigureAccount";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (

        <NavigationContainer>
            <Stack.Navigator>
                {/* <Stack.Screen name='Configurer le compte' component={ConfigureAccountScreen} /> */}
                <Stack.Screen name='Bienvenu(e)' component={WelcomeScreen} />
                <Stack.Screen name='Se connecter' component={SignInScreen} />
                <Stack.Screen name='Créer un compte' component={SignUpScreen} />
                <Stack.Screen name='Configurer le compte' component={ConfigureAccountScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

