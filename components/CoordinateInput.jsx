import React from "react";
import { View, Text, TextInput, StyleSheet } from 'react-native'

export default function CoordinateInput() {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }} >
            <View style={pageStyles.coordinateCard} >
                <Text style={pageStyles.labelColor}>Latitude</Text>
                <TextInput keyboardType="numeric" placeholder="43.15656"></TextInput>
            </View>
            <View style={pageStyles.coordinateCard} >
                <Text style={pageStyles.labelColor}>Longitude</Text>
                <TextInput keyboardType="numeric" placeholder="43.15656"></TextInput>
            </View>
        </View>
    )
}

const pageStyles = StyleSheet.create({
    backgroundColor: '#FFF',
    labelColor: {
        color: '#555555'
    },
    coordinateCard: {
        backgroundColor: '#DFDFDF',
        /* flexGrow: 1, */
        padding: 5,
        width: '48%',
        borderRadius: 5
    }
})