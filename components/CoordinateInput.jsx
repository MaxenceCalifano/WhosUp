import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Modal, Pressable, Dimensions } from 'react-native'

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import UserLocation from "./UserLocation";


export default function CoordinateInput({ setSelectedIndex, selectedIndex, setLocation, location, setPlace }) {

    switch (selectedIndex) {
        case 0:
            // User's position
            return <UserLocation setLocation={setLocation} setPlace={setPlace} />
        case 1:
            // Coordinate 
            const regex = /[^0-9.-]/
            const [errorMessage, setErrorMessage] = useState()

            return (
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }} >
                        <View style={pageStyles.coordinateCard} >
                            <Text style={pageStyles.labelColor}>Latitude</Text>
                            <TextInput keyboardType="numeric" placeholder="43.15656" onChangeText={(value) => {
                                if (regex.test(value)) setErrorMessage("Les coordonnées ne doivent inclure que des chiffres et un point")
                                if (!regex.test(value)) {
                                    setErrorMessage('')
                                    if (value <= 90 && value >= -90) setLocation({ ...location, latitude: value })
                                    else setErrorMessage("La latitude ne doit être inclue qu'entre -90 et 90 degrès")
                                }
                            }}></TextInput>
                        </View>
                        <View style={pageStyles.coordinateCard} >
                            <Text style={pageStyles.labelColor}>Longitude</Text>
                            <TextInput keyboardType="numeric" placeholder="43.15656" onChangeText={(value) => {
                                if (regex.test(value)) setErrorMessage("Les coordonnées ne doivent inclure que des chiffres et un point")
                                if (!regex.test(value)) {
                                    setErrorMessage('')
                                    if (value <= 180 && value >= -180) setLocation({ ...location, longitude: value })
                                    else setErrorMessage("La longitude ne doit être inclue qu'entre -180 et 180 degrès")
                                }
                            }}></TextInput>
                        </View>
                    </View>
                    <Text>{errorMessage}</Text>
                </View>
            )
        default:
            return <></>
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