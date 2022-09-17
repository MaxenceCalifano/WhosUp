import React, { useEffect } from "react";
import { View, Text } from 'react-native'


/* Used to get user location */
import * as Location from 'expo-location';


function UserLocation({ setPlace, setLocation }) {

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            setPlace(location.coords.latitude + ' ' + location.coords.longitude);

            setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });

            console.log('test dans user location ' + JSON.stringify(location))
        })();
    }, [])
    return (
        <View>
            <Text>Les coordonnées de votre position actuelle seront utilisées</Text>
        </View>
    );
}

export default UserLocation;