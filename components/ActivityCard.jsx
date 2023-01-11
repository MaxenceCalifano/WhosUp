import { View, Text } from 'react-native'


function ActivityCard({ index, item }) {
    return (
        <View>
            <Text>{item.activityTitle} {index}</Text>
            <Text>Nombre de participants {item.numberOfParticipants}</Text>
            <Text>Date {item.date}</Text>
            <Text>{item.activityDescription}</Text>
        </View>
    );
}

export default ActivityCard;