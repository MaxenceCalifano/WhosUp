import { View, Text, StyleSheet, FlatList } from "react-native";
import ChatRoomListItem from "../components/ChatRoomListItem";

const data = [
    {
        id: 1,
        content: "coucou",
        username: 'Jean-Michel',
        avatarUri: require('../assets/AvatarMaker.png')
    },
    {
        id: 2,
        content: "Salut, ça va ?",
        username: 'Jean-Luc',
        avatarUri: require('../assets/AvatarMaker2.png')
    },
    {
        id: 3,
        content: "A la prochaine",
        username: 'Jean-Claude',
        avatarUri: require('../assets/AvatarMaker3.png')
    },
    {
        id: 4,
        content: "azertyui",
        username: 'Jean-Pascal',
        avatarUri: require('../assets/AvatarMaker4.png')
    },
]
function ChatListScreen({ navigation }) {
    return (
        <View style={chatStyles.container}>
            <FlatList
                data={data}
                renderItem={item => <ChatRoomListItem
                    navigation={navigation}
                    item={item.item}
                    keyExtractor={item => item.id} />}
            />
        </View>
    );
}

const chatStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    }
})
export default ChatListScreen;