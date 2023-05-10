import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Carousel from 'react-native-reanimated-carousel';
import ActivityCard from './ActivityCard';
import { StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '../config/supabase'
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function Map({ navigation }) {

    const [location, setLocation] = useState({
        "latitude": 1.4113178344796395,
        "latitudeDelta": 114.87415842507339,
        "longitude": 0.6542491167783702,
        "longitudeDelta": 69.03412833809853
    });

    const [activities, setActivities] = useState()
    const [showSearchIsthisArea, setShowSearchInthisArea] = useState(false)

    const edgeFetchActivities = async () => {

        //Arbitraries values to loads activities in a not too big perimeter
        const minimalLatitude = location.latitude - 8
        const maximalLatitude = location.latitude + 8
        const minimalLongitude = location.longitude - 7.5
        const maximalLongitude = location.longitude + 7.5

        const { data, error } = await supabase.functions.invoke('fetchActivities', {
            body: {
                minimalLatitude: minimalLatitude,
                maximalLatitude: maximalLatitude,
                minimalLongitude: minimalLongitude,
                maximalLongitude: maximalLongitude
            },
        })
        if (data) setActivities(data.data)
        if (error) console.log("🚀 ~ file: Map.jsx:63 ~ edgeFetchActivities ~ error:", error)
    }
    const handleRegionChangeComplete = (mapRegion) => {
        console.log(mapRegion)
        setLocation(mapRegion)
        setShowSearchInthisArea(true)
    }

    const displayConfigureAccount = async () => {
        //console.log('display configure account')
        try {
            const value = await AsyncStorage.getItem("welcomeScreenSeen")
            if (value === 'false') {
                // value previously stored
                navigation.navigate("Configurer le compte")
            }
        } catch (e) {
            // error reading value
            console.log(e)
        }
    }
    displayConfigureAccount()

    useEffect(() => {
        edgeFetchActivities()
    }, [])


    return (
        <GestureHandlerRootView>
            < View >
                <MapView
                    style={styles.map}
                    onRegionChangeComplete={handleRegionChangeComplete}
                >
                    {
                        activities ? activities.map((marker, index) => {
                            let markerIcon;
                            if (marker.activity_type === "apéro") { markerIcon = require('../assets/drink_icon_approximate.png') }
                            if (marker.activity_type === "randonée") { markerIcon = require('../assets/hike_icon_approximate.png') }
                            if (marker.activity_type === "jeux de société") { markerIcon = require('../assets/game_icon_approximate.png') }
                            return (
                                < Marker
                                    key={index}
                                    coordinate={marker.location}
                                    title={marker.activity_title}
                                    description={marker.activity_type}
                                    image={markerIcon}
                                />
                            )
                        }) : ""
                    }

                </ MapView>
                <View style={styles.carouselContainer}>
                    <Carousel
                        style={styles.carousel}
                        loop={false}
                        width={Dimensions.get('window').width - 10}
                        height={150}
                        autoPlay={false}
                        data={activities}
                        scrollAnimationDuration={1000}
                        onSnapToItem={(index, item) => console.log('déclencher onSnaptoItem, ligne 69 map.jsx', index)}
                        renderItem={({ index, item }) => (
                            <ActivityCard navigation={navigation} style={{ flex: 1, marginHorizontal: "2.5%" }} index={index} activity={item} />
                        )}
                    />
                </View>

                {
                    /* Search in this area button */
                    showSearchIsthisArea ?
                        <View style={styles.regionChangedButton_container}>
                            <Pressable onPress={() => {
                                setShowSearchInthisArea(false)
                                edgeFetchActivities()
                            }} style={styles.regionChangedButton}>
                                <Text><FontAwesome name="search" size={24} color="black" /> </Text><Text>Rechercher dans cette zone</Text>
                            </Pressable>
                        </View>
                        : ''
                }
            </View >
        </GestureHandlerRootView>

    )
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    carouselContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    carousel: {
        position: 'absolute',
        bottom: 15,
        gap: 15
    },
    regionChangedButton_container: {
        position: "absolute",
        width: "100%",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    regionChangedButton: {
        top: 50,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 35,
        flexDirection: 'row',
        alignItems: 'center'
    }
});