import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Carousel from 'react-native-reanimated-carousel';
import ActivityCard from './ActivityCard';
import { StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '../config/supabase'

export default function Map({ navigation }) {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [activities, setActivities] = useState([])


    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }


    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('activities')
                .select()

            if (data) {
                //console.log('data ligne 30 map.jsx', data)
                setActivities(data)
            }
            if (error) console.log("🚀 ~ file: Map.jsx:34 ~ fetchData ~ error:", error)
        }

        fetchData()
    }, [])


    return (
        <GestureHandlerRootView>
            < View >
                <MapView style={styles.map}>
                    {
                        activities.map((marker, index) => {
                            //Load icon corresponding with the type of activity
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
    }
});