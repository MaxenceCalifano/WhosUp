import React, { useEffect, useState } from "react";
import { View, Text } from 'react-native'

function UserLocation({ userLocation, setPlace, setLocation }) {
    const locationGranted = userLocation !== null ? true : false;
    useEffect(() => {
        if (locationGranted) {
            setPlace(userLocation.latitude + ' ' + userLocation.longitude);
            setLocation({ latitude: userLocation.latitude, longitude: userLocation.longitude });
        }

    }, [])
    return (
        <View>
            <Text>{locationGranted ? "Les coordonnées de votre position actuelle seront utilisées" : "Vous devez autoriser l'application à accéder à la position de l'appareil"}</Text>
        </View>
    );
}

export default UserLocation;