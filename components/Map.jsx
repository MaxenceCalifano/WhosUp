
import React from 'react';
import { View, Text } from 'react-native'
import MapView from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';

import * as Location from 'expo-location';

import app from '../config/firebase';
import { getFirestore, setDoc, doc, collection, getDocs } from 'firebase/firestore';
const db = getFirestore(app);

export default function Map() {

    const [location, setLocation] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState(null);

    const fetchActivities = async () => {
        const activities = await getDocs(collection(db, "activities"))
        activities.forEach(doc => console.log(doc.data()))

        //console.log(test)
    }

    React.useEffect(() => {
        fetchActivities()

        /* (async () => {


            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            console.log(location.coords.latitude)
        })(); */
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }
    return (
        <View>
            <MapView style={styles.map} />
            <Text>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});