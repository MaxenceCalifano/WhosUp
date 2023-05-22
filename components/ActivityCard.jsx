import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

function ActivityCard({ index, activity, navigation }) {
    // console.log("🚀 ~ file: ActivityCard.jsx:6 ~ ActivityCard ~ activity:", activity.activity_type === 'randonée')

    return (
        <Pressable style={styles.card}
            onPress={() => navigation.navigate('Activité', { itemID: activity.uid })}>
            <Image style={styles.image} source={activity.activity_type === "randonée" ? require('../assets/hiking_thumbnail.jpg') : activity.activity_type === "jeux de société" ? require('../assets/tablegame_thumbnail.jpg') : require('../assets/drinks_thumbnail.jpg')} />
            <View style={styles.textContent}>
                <View style={styles.firstColumn}>
                    <View>
                        <Text>{activity.activity_title}</Text>
                        <Text>{activity.activity_description.slice(0, 40)}</Text>
                    </View>
                    <View style={styles.date}>
                        <Ionicons name="time-sharp" size={24} color="black" />
                        <View>
                            {/* <Text>{activity.date.slice(4, 10)}</Text> */}
                            <Text>{dayjs(activity.date).format('DD MMM, YYYY')}</Text>
                            <Text>{dayjs(activity.date).format('HH:mm')}</Text>
                            <Text>{activity.activity_type}</Text>
                        </View>
                    </View>
                </View>

                <Text><Ionicons name="people" size={24} color="black" />{activity.number_of_participants}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        marginLeft: "2.5%",
        // flex: 1,
        flexDirection: 'row',
        borderRadius: 20,
        backgroundColor: 'white',
        minHeight: 100
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