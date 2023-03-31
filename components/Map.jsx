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

export default function Map({ navigation }) {

    const [location, setLocation] = useState({
        "latitude": 1.4113178344796395,
        "latitudeDelta": 114.87415842507339,
        "longitude": 0.6542491167783702,
        "longitudeDelta": 69.03412833809853
    });
    const [errorMsg, setErrorMsg] = useState(null);
    const [activities, setActivities] = useState([])


    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }


    useEffect(() => {
        const minimalLatitude = location.latitude - location.latitudeDelta / 2
        const maximalLatitude = location.latitude + location.latitudeDelta / 2
        const minimalLongitude = location.longitude - location.longitudeDelta / 2
        const maximalLongitude = location.longitude + location.longitudeDelta / 2

        const fetchData = async () => {
            const { data, error } = await supabase
                .from('activities')
                .select()
                .lte("location -> latitude", maximalLatitude)
                .gte("location -> latitude", minimalLatitude)
                .lte("location -> longitude", maximalLongitude)
                .gte("location -> longitude", minimalLongitude)

            if (data) {
                data.forEach(data => console.log("id des activités chargées, fetch data map.jsx", data.id))
                setActivities(data)
            }
            if (error) console.log("🚀 ~ file: Map.jsx:34 ~ fetchData ~ error:", error)
        }

        fetchData()
    }, [])


    return (
        <GestureHandlerRootView>
            < View >
                <MapView
                    style={styles.map}
                    onRegionChangeComplete={e => {
                        setLocation(e)
                        console.log(e)
                    }}
                >
                    {
                        activities.map((marker, index) => {
                            let markerIcon;
                            if (marker.activityType === "apéro") { markerIcon = require('../assets/drink_icon.png') }
                            if (marker.activityType === "randonée") { markerIcon = require('../assets/hike_icon.png') }
                            if (marker.activityType === "jeux de société") { markerIcon = require('../assets/games_icon.png') }

                            return (
                                < Marker
                                    key={index}
                                    coordinate={marker.location}
                                    title={marker.activityTitle}
                                    description={marker.activityDescription}
                                    image={markerIcon}
                                />
                            )
                        })
                    }

                </ MapView>
                <View style={styles.carouselContainer}>
                    <Carousel
                        style={styles.carousel}
                        loop
                        width={Dimensions.get('window').width - 10}
                        height={150}
                        autoPlay={false}
                        data={activities}
                        scrollAnimationDuration={1000}
                        onSnapToItem={(index) => console.log('déclencher onSnaptoItem, ligne 69 map.jsx', index)}
                        renderItem={({ index, item }) => (
                            <ActivityCard navigation={navigation} style={{ flex: 1, marginHorizontal: "2.5%" }} index={index} item={item} />
                        )}
                    />
                </View>
                <View style={styles.regionChangedButton_container}>
                    <Pressable style={styles.regionChangedButton}>
                        <Text><FontAwesome name="search" size={24} color="black" /> </Text><Text>Rechercher dans cette zone</Text>
                    </Pressable>
                </View>

                <Text>{text}</Text>
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
        bottom: 0,
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