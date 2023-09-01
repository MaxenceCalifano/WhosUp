import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Modal, Pressable, Dimensions } from 'react-native'

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import UserLocation from "./UserLocation";


export default function CoordinateInput({ setSelectedIndex, selectedIndex, setLocation, location, setPlace }) {

    switch (selectedIndex) {
        case 0:
            return <UserLocation setLocation={setLocation} setPlace={setPlace} />

        case 1:
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
        case 2:
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
                                    key:
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
