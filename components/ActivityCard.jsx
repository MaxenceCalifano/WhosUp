import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

function ActivityCard({ index, item, navigation }) {
    /* let thumbnail;
    if (item.activityType = "randonée") thumbnail = require('../assets/hiking_thumbnail.jpg')
    if (item.activityType = "jeux de société") thumbnail = require('../assets/tablegame_thumbnail.jpg') 
     navigation.navigate('Activité')
    */
    const thumbnail = item.activityType = "randonée" ? require('../assets/hiking_thumbnail.jpg') : require('../assets/tablegame_thumbnail.jpg')

    return (
        <Pressable style={styles.card}
            onPress={() => navigation.navigate('Activité', { item: item })}>
            <Image style={styles.image} source={thumbnail} />
            <View style={styles.textContent}>
                <View style={styles.firstColumn}>
                    <View>
                        <Text>{item.activityTitle}</Text>
                        <Text>{item.activityDescription}</Text>
                    </View>
                    <View style={styles.date}>
                        <Ionicons name="time-sharp" size={24} color="black" />
                        <View>
                            <Text>{item.date.slice(4, 10)}</Text>
                            <Text>{item.date.slice(11, item.date.length)}</Text>
                        </View>
                    </View>
                </View>

                <Text><Ionicons name="people" size={24} color="black" />{item.numberOfParticipants}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        //padding: 10,
        flexDirection: 'row',
        // width: '100%',
        borderRadius: 20,
        // height: '100%',
        backgroundColor: 'white',
    },
    image: {
        height: '100%',
        width: '30%',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    },
    textContent: {
        padding: 7
    },
    firstColumn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 5
    },
    date: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#FFFF',
        borderRadius: 5,
        alignItems: 'center'
    }
});

export default ActivityCard;