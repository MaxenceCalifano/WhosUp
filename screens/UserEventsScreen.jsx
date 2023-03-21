import React, { useEffect, useState } from "react";
import { View, Text } from 'react-native'
import { Divider } from 'react-native-elements'

function UserEventScreen({ navigation }) {
    //console.log("🚀 ~ file: UserEventsScreen.jsx:10 ~ UserEventScreen ~ user", user.uid)
    const [test, setTest] = useState([])

    useEffect(() => {
        if (user) {

        }
    }, [user])


    return (
        <View style={{ flex: 1 }}>
            <Text>Mes événements</Text>
            <Divider />
            <Text>J'organise</Text>
            <Divider />
            <Text>Je participe</Text>
            <Divider />
        </View>
        /**
         * Charger toutes les activités auquels participe l'utilisateur et celles dont il est
         */
    );
}

export default UserEventScreen;