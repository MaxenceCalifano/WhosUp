import { View, Text, StyleSheet } from "react-native";
import ChatRoomListItem from "../components/ChatRoomListItem";
function Chats() {
    return (
        <View style={chatStyles.container}>
            <ChatRoomListItem />
            <ChatRoomListItem />
            <ChatRoomListItem />
            <ChatRoomListItem />
        </View>
    );
}

const chatStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    }
})
export default Chat;