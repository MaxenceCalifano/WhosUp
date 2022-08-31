
import React from 'react';
import { View, Text } from 'react-native'
import MapView from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';

import * as Location from 'expo-location';

import '../config/firebase'
import { getFirestore, setDoc, doc } from 'firebase/firestore';
const firestore = getFirestore();

export default function Map() {

    const [location, setLocation] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState(null);

    React.useEffect(() => {


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