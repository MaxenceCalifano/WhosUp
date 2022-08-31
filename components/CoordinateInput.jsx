import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from 'react-native'

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

/* Used to get user location */
import * as Location from 'expo-location';


export default function CoordinateInput({ selectedIndex, setLocation, location }) {
    if (selectedIndex === 0) {

        useEffect(() => {
            (async () => {


                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
                console.log(location.coords.latitude)
            })();
        }, [])

        return (
            <View>
                <Text>Les coordonnées de votre position actuelle seront utilisées</Text>
            </View>

        )
    } else if (selectedIndex === 1) {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }} >
                <View style={pageStyles.coordinateCard} >
                    <Text style={pageStyles.labelColor}>Latitude</Text>
                    <TextInput keyboardType="numeric" placeholder="43.15656" onChangeText={(value) => setLocation({ ...location, latitude: value })}></TextInput>
                </View>
                <View style={pageStyles.coordinateCard} >
                    <Text style={pageStyles.labelColor}>Longitude</Text>
                    <TextInput keyboardType="numeric" placeholder="43.15656" onChangeText={(value) => setLocation({ ...location, longitude: value })}></TextInput>
                </View>
            </View>
        )
    } else {
        return (
            <GooglePlacesAutocomplete
                placeholder='Rechercher'
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log(data, details);
                }}
                query={{
                    key: '',
                    language: 'fr',
                }}
            />
        )
    }

}

const pageStyles = StyleSheet.create({
    backgroundColor: '#FFF',
    labelColor: {
        color: '#555555'
    },
    coordinateCard: {
        backgroundColor: '#DFDFDF',
        /* flexGrow: 1, */
        padding: 5,
        width: '48%',
        borderRadius: 5
    }
})