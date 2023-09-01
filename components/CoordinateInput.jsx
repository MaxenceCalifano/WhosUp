import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Modal, Pressable } from 'react-native'

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import UserLocation from "./UserLocation";


export default function CoordinateInput({ selectedIndex, setLocation, location, setPlace }) {

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
                        <View style={{ flexDirection: 'row', }}>
                            <GooglePlacesAutocomplete
                                suppressDefaultStyles={true}
                                placeholder='Rechercher'
                                styles={{
                                    textInput: {
                                        borderBottomRightRadius: 0,
                                        borderTopRightRadius: 0
                                    }
                                }}
                                onPress={(data, details = null) => {
                                    // 'details' is provided when fetchDetails = true
                                    setModalVisible(false)

                                    setLocation(data.description)
                                    setPlace(data.description)
                                    console.log('date', data, details);
                                }}
                                query={{
                                    key:
                                    language: 'fr',
                                }}
                            />
                            <Pressable
                                style={{ width: '10%', backgroundColor: 'white' }}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={{ textAlign: 'center', textAlignVertical: 'center', paddingVertical: 10 }}>X</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
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
