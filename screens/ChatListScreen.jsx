import { View, Text, StyleSheet } from "react-native";
import ChatRoomListItem from "../components/ChatRoomListItem";
function ChatListScreen({ navigation }) {
    return (
        <View style={chatStyles.container}>
            <ChatRoomListItem navigation={navigation} />
            <ChatRoomListItem navigation={navigation} />
            <ChatRoomListItem navigation={navigation} />
            <ChatRoomListItem navigation={navigation} />
        </View>
    );
}

const chatStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    }
})
export default ChatListScreen;