import { View, Text, StyleSheet, Image } from 'react-native'

function ActivityCard({ index, item }) {
    let thumbnail;
    if (item.activityType = "randonée") thumbnail = require('../assets/hiking_thumbnail.jpg')
    //if (item.activityType = "jeux de société") thumbnail = require('../assets/tablegame_thumbnail.jpg')
    return (
        <View style={styles.card}>
            <Image style={styles.image} source={thumbnail} />
            <Text>{item.activityTitle} {index}</Text>
            <Text>Nombre de participants {item.numberOfParticipants}</Text>
            <Text>Date {item.date}</Text>
            <Text>{item.activityDescription}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        borderRadius: 20,
        height: '100%',
        backgroundColor: 'white',
    },
    image: {
        height: '100%',
        width: '30%',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    }
});

export default ActivityCard;