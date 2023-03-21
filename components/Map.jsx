import React from 'react';
import { View, Text } from 'react-native'
import MapView from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import * as Location from 'expo-location';

export default function Map({ navigation }) {

    const [location, setLocation] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState(null);


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