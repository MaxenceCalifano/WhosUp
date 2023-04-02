import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

function ActivityCard({ index, activity, navigation }) {
    /* let thumbnail;
    if (item.activityType = "randonée") thumbnail = require('../assets/hiking_thumbnail.jpg')
    if (item.activityType = "jeux de société") thumbnail = require('../assets/tablegame_thumbnail.jpg') 
     navigation.navigate('Activité')
    */
    const thumbnail = activity.activitytype = "randonée" ? require('../assets/hiking_thumbnail.jpg') : require('../assets/tablegame_thumbnail.jpg')
    console.log(activity, 'item dans activity card')
    return (
        <Pressable style={styles.card}
            onPress={() => navigation.navigate('Activité', { itemID: activity.id })}>
            <Image style={styles.image} source={thumbnail} />
            <View style={styles.textContent}>
                <View style={styles.firstColumn}>
                    <View>
                        <Text>{activity.activityTitle}</Text>
                        <Text>{activity.activityDescription}</Text>
                    </View>
                    <View style={styles.date}>
                        <Ionicons name="time-sharp" size={24} color="black" />
                        <View>
                            {/* <Text>{activity.date.slice(4, 10)}</Text> */}
                            <Text>{activity.date.slice(11, activity.date.length)}</Text>
                            <Text>{activity.activityType}</Text>
                        </View>
                    </View>
                </View>

                <Text><Ionicons name="people" size={24} color="black" />{activity.numberOfParticipants}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        // padding: 10,
        flexDirection: 'row',
        width: '100%',
        borderRadius: 20,
        //height: 400,
        backgroundColor: 'white',
    },
    image: {
        height: '100%',
        width: '30%',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    },
    textContent: {
        padding: 7,
        flexWrap: 'nowrap'
    },
    firstColumn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
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