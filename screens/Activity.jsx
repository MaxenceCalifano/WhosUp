import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

//"Test_a5dd1a08-cb9a-46ac-a288-c8fc430423c8"


function Activity({ route, navigation }) {

    const { item } = route.params;
    console.log(item)

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text>{item.date}</Text>
                <Text>{item.activityTitle}</Text>
            </View>
            <Text>Nombre de participants {item.numberOfParticipants}</Text>
            <View style={styles.buttons}>
                <Button title="Participer" />
                <Button title="Intéressé(e)" />
                <Button title="Plus" />
            </View>

            <Text>{item.activityDescription}</Text>



        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 40
    },
    header: {
        flexDirection: 'row',
    },
    buttons: {
        flexDirection: 'row'
    }
})
export default Activity;