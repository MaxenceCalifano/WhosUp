import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, Modal, Pressable, Dimensions, Button } from 'react-native'
import MapView from 'react-native-maps';
import { Icon } from 'react-native-elements'
import { UserContext } from "../UserContext";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import UserLocation from "./UserLocation";
import styles from "../styles";


export default function CoordinateInput({ setSelectedIndex, selectedIndex, setLocation, location, setPlace }) {
    const { userLocation } = useContext(UserContext)
    console.log("🚀 ~ file: CoordinateInput.jsx:14 ~ CoordinateInput ~ userLocation:", userLocation)
    switch (selectedIndex) {
        case 0:
            // User's position
            return <UserLocation userLocation={userLocation} setLocation={setLocation} setPlace={setPlace} />
        case 1:
            // Coordinate
            const validateLocation = () => {
                console.log(region)
                setLocation(region)
                setPlace(region.latitude + ', ' + region.longitude)
                setMapModalVisible(!mapModal)
                setSelectedIndex(null)
            }
            const windowWidth = Dimensions.get('window').width;
            const windowheight = Dimensions.get('window').height;
            const [mapModal, setMapModalVisible] = useState(true)
            const [region, setRegion] = useState({
                latitude: 42.391,
                longitude: 2.18,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            })
            const getUserLocation = async () => {
                const locationGranted = userLocation !== null ? true : false;
                if (locationGranted !== true) {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }

                const newLocation = {
                    ...region,
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude
                }
                console.log("🚀 ~ file: CoordinateInput.jsx:46 ~ getUserLocation ~ newLocation:", newLocation)
                setRegion(newLocation)
            }
            useEffect(() => {
                getUserLocation()
            }, [])

            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={mapModal}>
                    <View style={{ flex: 1 }}>
                        <MapView
                            region={region}
                            onRegionChangeComplete={(region, gesture) => {
                                if (!gesture.isGesture) return
                                setRegion(region)
                            }}
                            loadingEnabled
                            loadingIndicatorColor="#F5DF4D"
                            loadingBackgroundColor="#fffff"
                            style={pageStyles.map}
                        />
                        <Button accessibilityLabel="Valider la localisation de l'activité"
                            title="Valider" onPress={() => validateLocation()}
                            color={styles.color}
                            buttonStyle={{ backgroundColor: styles.color, position: "absolute", bottom: 150, width: '50%' }} />

                        <Pressable
                            style={{ width: '10%', backgroundColor: 'red', position: 'absolute', right: 10, top: 20, borderRadius: 50 }}
                            onPress={() => {
                                setMapModalVisible(!mapModal)
                                setSelectedIndex(null)
                            }
                            }
                        >
                            <Text style={{ textAlign: 'center', textAlignVertical: 'center', height: 35, color: "white" }}>X</Text>
                        </Pressable>
                        <View style={{ position: "absolute", top: windowheight / 2 - 50, left: windowWidth / 2 - 25, zIndex: 2 }}>
                            <Icon name="crosshairs-gps" type="material-community" size={50} color={"black"} />
                        </View>
                        <View style={{ width: '100%', flex: 1, alignContent: "center", justifyContent: "center", alignItems: "center", position: "absolute", bottom: 100 }}>
                            <Text style={{ width: '70%', backgroundColor: "lightgrey", padding: 10, borderRadius: 5 }}>Latitude:{Math.round(region.latitude * 1000) / 1000}, Longitude:{Math.round(region.longitude * 1000) / 1000}</Text>
                        </View>
                    </View>

                </Modal>
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
                                        width: Dimensions.get('screen').width - 20,
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
                                    key: process.env.EXPO_PUBLIC_PLACES,
                                    language: 'fr',
                                }}
                            />
                            <Pressable
                                style={{ width: '10%', backgroundColor: 'white' }}
                                onPress={() => {
                                    setModalVisible(!modalVisible)
                                    setSelectedIndex(null)
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
    },
    map: {
        /*  width: "100%",
         height: "100%" */
        flex: 1
    }
})
