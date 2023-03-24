import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native'
import MapView from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import Carousel from 'react-native-reanimated-carousel';
import { StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '../config/supabase'
import * as Location from 'expo-location';

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
                            console.log(marker.activityDescription)
                            return (
                                < Marker
                                    key={index}
                                    coordinate={marker.location}
                                    title={marker.activityTitle}
                                    description={marker.activityDescription}
                                />
                            )
                        })
                    }
                </ MapView>
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