import React from "react";
import { StyleSheet, View, Text, Image } from 'react-native';
import dayjs from "dayjs";
import { Pressable } from 'react-native';

function ChatRoomListItem({ navigation }) {
    return (
        <Pressable style={chatItemStyles.container} onPress={() => navigation.navigate('Chat')}>
            <Image style={chatItemStyles.userAvatar} source={require('../assets/AvatarMaker.png')} />
            <View style={chatItemStyles.textContent}>
                <Text style={chatItemStyles.textContent_username}>Jean Michel</Text>
                <Text style={chatItemStyles.textContent_lastMessage}>Content of the last message</Text>
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