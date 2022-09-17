import React, { useEffect } from "react";
import { View, Text } from 'react-native'


/* Used to get user location */
import * as Location from 'expo-location';


function UserLocation(location, setLocation) {

    useEffect(() => {
        (async () => {


            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            () => setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
            console.log(location.coords.latitude)
        })();
    }, [])
    return (
        <View>
            <Text>Les coordonnées de votre position actuelle seront utilisées</Text>
        </View>
    );
}

export default UserLocation;