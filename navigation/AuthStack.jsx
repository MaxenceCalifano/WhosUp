import React from "react";
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import WelcomeScreen from "../screens/WelcomeScreen";
import SignInScreen from "../screens/AuthStack/SignInScreen";
import SignUpScreen from "../screens/AuthStack/SignUpScreen";
import AskPasswordReset from "../screens/AuthStack/AskPasswordReset";
import PasswordReset from "../screens/AuthStack/PasswordReset";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (

        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Bienvenue' component={WelcomeScreen} />
                <Stack.Screen name='Se connecter' component={SignInScreen} />
                <Stack.Screen name='Créer un compte' component={SignUpScreen} />
                <Stack.Screen name='Réinitialiser le mot de passe' component={AskPasswordReset} />
                <Stack.Screen name='Choisir le nouveau mot de passe' component={PasswordReset} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

