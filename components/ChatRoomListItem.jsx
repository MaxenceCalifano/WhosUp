import React from "react";
import { StyleSheet, View, Text, Image } from 'react-native';
import dayjs from "dayjs";
import { Pressable } from 'react-native';

function ChatRoomListItem({ navigation, item }) {
    console.log("🚀 ~ file: ChatRoomListItem.jsx:7 ~ ChatRoomListItem ~ item:", item.roomId)

    return (
        <Pressable style={chatItemStyles.container} onPress={() => navigation.navigate('Chat', { roomId: item.roomId })}>
            <Image style={chatItemStyles.userAvatar} source={item.avatarUri} />
            <View style={chatItemStyles.textContent}>
                <Text style={chatItemStyles.textContent_username}>{item.item.profiles.username}</Text>
                <Text style={chatItemStyles.textContent_lastMessage}>{item.item.content}</Text>
            </View>

            <Text>{dayjs().hour()}:{dayjs().minute()} AM</Text>

        </Pressable>
    );
}
const chatItemStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 15,
        marginVertical: 5,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userAvatar: {
        borderRadius: 50,
        width: 70,
        height: 70
    },
    textContent: {
        marginHorizontal: 5,
        alignSelf: 'center'
    },
    textContent_username: {
        fontWeight: '700'
    },
    textContent_lastMessage: {
        color: 'grey'
    },
})
export default ChatRoomListItem;