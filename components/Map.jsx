
import React from 'react';
import { View, Text } from 'react-native'
import MapView from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ActivityCard from './ActivityCard';

import * as Location from 'expo-location';

import app from '../config/firebase';
import { getFirestore, setDoc, doc, collection, getDocs } from 'firebase/firestore';
const db = getFirestore(app);

export default function Map() {

    const [location, setLocation] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState(null);
    const [markers, setMarkers] = React.useState([]);

    const fetchActivities = async () => {
        const activities = await getDocs(collection(db, "activities"))
        const allMarkers = []
        activities.forEach(doc => {
            //console.log(doc.data())
            //setMarkers(prevState => prevState.push(doc.data()))
            // console.log(markers)
            allMarkers.push(doc.data())
        })

        setMarkers(allMarkers)
        console.log(markers)
    }

    React.useEffect(() => {
        fetchActivities()//.then(console.log("markers", markers))
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <GestureHandlerRootView>
            < View >
                <MapView style={styles.map}>
                    {markers.map((marker, index) => {
                        console.log(marker.a)
                        if (marker.activityType == "randonée") {
                            return (
                                < Marker key={index}
                                    coordinate={marker.location}
                                    title={marker.activityTitle}
                                    description={marker.activityDescription}
                                    image={require('../assets/hike.png')}
                                />
                            )
                        } if (marker.activityType == "jeux de société") {
                            return (
                                < Marker key={index}
                                    coordinate={marker.location}
                                    title={marker.activityTitle}
                                    description={marker.activityDescription}
                                    image={require('../assets/games.png')}
                                />
                            )
                        }
                    })}

                </ MapView>
                <Carousel
                    style={styles.carousel}
                    loop
                    width={Dimensions.get('window').width}
                    height={100}
                    autoPlay={false}
                    data={markers}
                    scrollAnimationDuration={1000}
                    onSnapToItem={(index) => console.log('current index:', index)}
                    renderItem={({ index, item }) => (
                        <ActivityCard index={index} item={item} />
                    )}
                />

                <Text style={{
                    position: 'absolute',
                }}>{text}</Text>
            </View >
        </GestureHandlerRootView>

    )
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    carousel: {
        position: 'absolute',
        bottom: 150,
        backgroundColor: 'white',
        left: 0,
        borderRadius: 20,
        padding: 10
    }
});