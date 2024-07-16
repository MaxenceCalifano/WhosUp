import React, { createContext, useState } from "react";
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Main from '../components/Main'
import ConfigureAccount from '../screens/UserStack/ConfigureAccount'
import Activity from "../screens/UserStack/ActivityScreen";
import Chat from "../screens/UserStack/ChatScreen";
import UpdateEventScreen from "../screens/UserStack/UpdateEventScreen";
import About from "../screens/UserStack/About";
import chooseLanguage from "../screens/UserStack/ChooseLanguage";
import { useTranslation } from "react-i18next";

const Stack = createNativeStackNavigator();
export const NewMessagesContext = createContext({
    unreadMessages: null,
})

export default function UserStack() {
    const [newMessage, setNewMessage] = useState("")
    const {t} = useTranslation()
    return (
        <NewMessagesContext.Provider value={{ newMessage, setNewMessage }}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Group>
                        <Stack.Screen name='Carte' component={Main} options={{ headerShown: false }} />
                        <Stack.Screen name='Activité' component={Activity} options={{ headerShown: false }} />
                        <Stack.Screen name='Chat' component={Chat} />
                        <Stack.Screen name="Modifier l'activité" component={UpdateEventScreen} />
                        <Stack.Screen name="A propos" component={About} />
                        <Stack.Screen
                            name='Configurer le compte'
                            component={ConfigureAccount}
                            options={{
                                headerBackVisible: false,
                                gestureEnabled: false,
                                headerLeft: () => (<></>),
                            }} />
                        <Stack.Screen name="chooseLanguage" options={{title: t('pages.chooseLanguage')}} component={chooseLanguage} />
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer>
        </NewMessagesContext.Provider>
    )
}