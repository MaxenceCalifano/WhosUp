
import React from 'react';
import { View, Text } from 'react-native'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';

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

    const returnParsedMarker = (marker) => {
        const latLng = {
            latitude: parseInt(marker.location.latitude),
            longitude: parseInt(marker.location.longitude)
        }

    }

    return (
        < View >
            <MapView style={styles.map}>
                {markers.map((marker, index) => (

                    <Marker key={index}
                        coordinate={marker.location}
                        title={marker.activityTitle}
                        description={marker.activityDescription} />
                ))}
            </ MapView>
            <Text>{text}</Text>
        </View >
    )
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});