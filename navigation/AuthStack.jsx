import React from "react";
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as Linking from "expo-linking";

import WelcomeScreen from "../screens/WelcomeScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ConfigureAccount from "../screens/ConfigureAccount"
import AskPasswordReset from "../screens/AskPasswordReset";
import PasswordReset from "../screens/PasswordReset";

const Stack = createNativeStackNavigator();
const prefix = Linking.createURL("/");

const getInitialURL = async () => {
    const url = await Linking.getInitialURL();
    if (url !== null) {
        return parseSupabaseUrl(url);
    }
    return url;
};

const parseSupabaseUrl = (url) => {
    let parsedUrl = url;
    if (url.includes("#")) {
        parsedUrl = url.replace("#", "?");
    }

    return parsedUrl;
};

const subscribe = (listener) => {
    const onReceiveURL = (url) => {
        console.log("🚀 ~ file: AuthStack.jsx:35 ~ onReceiveURL ~ url:", url.url)

        const transformedUrl = parseSupabaseUrl(url.url);
        const parsedUrl = Linking.parse(transformedUrl);

        const access_token = parsedUrl.queryParams.access_token;
        const refresh_token = parsedUrl.queryParams.refresh_token;

        if (
            typeof access_token === "string" &&
            typeof refresh_token === "string"
        ) {
            console.log('login')
            //loginWithToken({ access_token, refresh_token });
        }

        listener(transformedUrl);
    };
    const subscription = Linking.addEventListener("url", onReceiveURL);

    return () => {
        subscription.remove();
    };
};

const linking = {
    prefixes: [prefix],
    config: {
        screens: {
            PasswordReset: "/ResetPassword",
        },
    },
    getInitialURL,
    subscribe,
};

export default function AuthStack() {
    return (

        <NavigationContainer linking={linking}>
            <Stack.Navigator>
                <Stack.Screen name='Bienvenu(e)' component={WelcomeScreen} />
                <Stack.Screen name='Se connecter' component={SignInScreen} />
                <Stack.Screen name='Créer un compte' component={SignUpScreen} />
                <Stack.Screen name='Configurer le compte' component={ConfigureAccount} />
                <Stack.Screen name='Réinitialiser le mot de passe' component={AskPasswordReset} />
                <Stack.Screen name='Choisir le nouveau mot de passe' component={PasswordReset} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

