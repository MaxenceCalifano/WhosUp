import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

function ActivityCard({ index, activity, navigation }) {

    const thumbnail = activity.activitytype = "randonée" ? require('../assets/hiking_thumbnail.jpg') : require('../assets/tablegame_thumbnail.jpg')
    return (
        <Pressable style={styles.card}
            onPress={() => navigation.navigate('Activité', { itemID: activity.uid })}>
            <Image style={styles.image} source={thumbnail} />
            <View style={styles.textContent}>
                <View style={styles.firstColumn}>
                    <View>
                        <Text>{activity.activityTitle}</Text>
                        <Text>{activity.activityDescription.slice(0, 40)}</Text>
                    </View>
                    <View style={styles.date}>
                        <Ionicons name="time-sharp" size={24} color="black" />
                        <View>
                            {/* <Text>{activity.date.slice(4, 10)}</Text> */}
                            <Text>{dayjs(activity.date).format('DD MMM, YYYY')}</Text>
                            <Text>{dayjs(activity.date).format('h:mm A')}</Text>
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