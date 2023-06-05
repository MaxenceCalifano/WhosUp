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
        case 2:
            // Place selected with Google maps
            const [modalVisible, setModalVisible] = useState(true)

            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}>

                    <View style={{ flex: 1, backgroundColor: 'rgba(200, 200, 200, 0.5)' }}>
                        {/**Input and closing button */}
                        <View style={{ flexDirection: 'row', alignItems: "flex-start", margin: 10 }}>
                            <GooglePlacesAutocomplete
                                fetchDetails
                                suppressDefaultStyles={true}
                                enablePoweredByContainer={false}
                                placeholder='Rechercher'
                                styles={{
                                    textInput: {
                                        borderBottomRightRadius: 0,
                                        borderTopRightRadius: 0,
                                        backgroundColor: 'white',
                                        height: 50,
                                        padding: 10
                                    },
                                    container: {
                                        flex: 1,
                                    },
                                    listView: {
                                        backgroundColor: "white",
                                        width: Dimensions.get('window').width - 20,
                                        padding: 10
                                    }
                                }}
                                onPress={(data, details = null) => {
                                    setModalVisible(false)
                                    // Get coordinate of theplace selecter by user
                                    setLocation({ latitude: details.geometry.location.lat, longitude: details.geometry.location.lng })
                                    console.log("🚀 ~ file: CoordinateInput.jsx:66 ~ CoordinateInput ~ details.geometry.location:", details.geometry.location)
                                    //Get the name of the place selected by user
                                    setPlace(data.description)
                                }}
                                query={{
                                    key: 'AIzaSyC2y8jzrQcwMvNhm0P273F-4elbS5kTFp0',
                                    language: 'fr',
                                }}
                            />
                            <Pressable
                                style={{ width: '10%', backgroundColor: 'white' }}
                                onPress={() => {
                                    setModalVisible(!modalVisible)
                                    setSelectedIndex()
                                }
                                }
                            >
                                <Text style={{ textAlign: 'center', textAlignVertical: 'center', height: 50 }}>X</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal >
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