import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Carousel from 'react-native-reanimated-carousel';
import ActivityCard from './ActivityCard';
import { StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '../config/supabase'
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from "../UserContext";

export default function Map({ navigation }) {

    const [location, setLocation] = useState(
        {
            "latitude": 42.56896371693217,
            "latitudeDelta": 38.061143345741286,
            "longitude": 0.08388038724660962,
            "longitudeDelta": 26.660386472940445
        }
    );

    const [activities, setActivities] = useState([])
    const [showSearchIsthisArea, setShowSearchInthisArea] = useState(false)
    const { session } = useUser()


    const mapViewRef = useRef()
    // Used to move carousel on press on Markers
    const ref = useRef(null)

    const edgeFetchActivities = async () => {

        //Arbitraries values to loads activities in a not too big perimeter
        // Makes sure that the value is a number
        const minimalLatitude = parseInt(location.latitude - 8)
        const maximalLatitude = parseInt(location.latitude + 8)
        const minimalLongitude = parseInt(location.longitude - 7.5)
        const maximalLongitude = parseInt(location.longitude + 7.5)

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
        //console.log('map ligne 52', 'location: ', location, 'mapregion: ', mapRegion)
        //console.log(Math.floor(mapRegion.latitude), Math.floor(location.latitude))
        setLocation(mapRegion)
        setShowSearchInthisArea(true)
    }

    const displayConfigureAccount = async () => {

        let { data, error } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', session.user.id)

        console.log("🚀 ~ file: Map.jsx:65 ~ displayConfigureAccount ~ data:", data)
        console.log("🚀 ~ file: Map.jsx:62 ~ displayConfigureAccount ~ error:", error)


        data[0].avatar_url === null || data[0].username === null ? navigation.navigate("Configurer le compte")
            : null
    }

    const scrollToCard = (currentIndex, markerIndex) => {
        currentIndex < markerIndex ?
            ref.current.scrollTo(currentIndex + markerIndex)
            : ref.current.scrollTo(currentIndex - markerIndex)
    }

    useEffect(() => {
        displayConfigureAccount()
        edgeFetchActivities()
    }, [])


    return (
        <GestureHandlerRootView>

            <MapView
                style={styles.map}
                ref={mapViewRef}
                loadingEnabled
                loadingIndicatorColor="#F5DF4D"
                loadingBackgroundColor="#fffff"
                provider={PROVIDER_GOOGLE}
                onRegionChangeComplete={(region, gesture) => {
                    if (!gesture.isGesture) return
                    handleRegionChangeComplete(region)
                }}
                region={location}
            >
                {
                    activities.length > 0 ? activities.map((marker, index) => {
                        let markerIcon;
                        if (marker.activity_type === "apéro") { markerIcon = require('../assets/drink_icon_approximate.png') }
                        if (marker.activity_type === "randonée") { markerIcon = require('../assets/hike_icon_approximate.png') }
                        if (marker.activity_type === "jeux de société") { markerIcon = require('../assets/game_icon_approximate.png') }
                        if (marker.activity_type === "autre") { markerIcon = require('../assets/other_icon_approximate.png') }
                        return (
                            < Marker
                                key={index}
                                coordinate={marker.location}
                                title={marker.activity_title}
                                description={marker.activity_type}
                                image={markerIcon}
                                tracksViewChanges={false}
                                onPress={() => {
                                    //console.log(activities[index].activity_title)

                                    //Passer la différence entre index courant et l'endroit souhaiter
                                    //console.log("index du marqueur cliqué: ", index);
                                    //console.log("index du carousel au mometn du clic", ref.current.getCurrentIndex());


                                    const difference = index - ref.current.getCurrentIndex()
                                    if (ref.current.getCurrentIndex() > index) {
                                        //console.log("🚀 ~ file: Map.jsx:134 ~ activities?activities.map ~ difference:", difference)
                                        ref.current.scrollTo({ count: difference, animated: true })
                                    } else {
                                        //console.log("🚀 ~ file: Map.jsx:139 ~ activities?activities.map ~ difference:", difference)
                                        ref.current.scrollTo({ count: difference, animated: true })
                                    }
                                }}
                            />
                        )
                    }) : null
                }

            </ MapView>
            {
                activities.length > 0 ? <View style={styles.carouselContainer}>
                    <Carousel
                        style={styles.carousel}
                        loop={false}
                        width={Dimensions.get('window').width - 10}
                        height={150}
                        autoPlay={false}
                        data={activities}
                        scrollAnimationDuration={1000}
                        ref={ref}
                        onSnapToItem={index => {
                            const newLocation = {
                                ...location,
                                latitude: activities[index].location.latitude,
                                longitude: activities[index].location.longitude
                            }
                            mapViewRef.current.animateToRegion(
                                newLocation,
                                //Duration
                                300
                            )
                        }}
                        renderItem={({ index, item }) => (
                            <ActivityCard navigation={navigation} index={index} activity={item} />
                        )}
                    />
                </View> : null
            }


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

        </GestureHandlerRootView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: "100%",
        height: "100%"
    },
    carouselContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        zIndex: 2,
        position: 'absolute',
        bottom: 0,
        gap: 15,
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