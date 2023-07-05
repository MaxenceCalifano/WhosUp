import React from "react";
import { StyleSheet, View, Text } from 'react-native';
import dayjs from "dayjs";
import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import styles from "../styles";

function ChatRoomListItem({ navigation, item }) {
    const { chat_room_id } = item
    /* const { profiles } = item.item
     const lastMessage = item.lastMessage */

    return (
        <Pressable style={chatItemStyles.container} onPress={() => navigation.navigate('Chat', {
            chat_room_id,
            profile: {
                username: item.username,
                avatarUrl: item.avatar_url
            }
        })}>
            <Image
                style={chatItemStyles.userAvatar}
                source={`https://iwjnycngtfhluxibxjmd.supabase.co/storage/v1/object/public/avatars/${item.avatar_url}`}
                contentFit="cover"
                transition={1000}
            />
            <View style={chatItemStyles.textContent}>
                <Text style={chatItemStyles.textContent_username}>{item.username}</Text>
                <Text style={chatItemStyles.textContent_lastMessage}>{item.content}</Text>
            </View>

            <View style={{
                justifyContent: 'center',
                alignItems: "center"
            }}>
                <Text>{dayjs().format('DD/MM') === dayjs(item.created_at).format('DD/MM')
                    ? dayjs(item.created_at).format('HH:mm')
                    : dayjs(item.created_at).format('DD/MM')}</Text>
                {
                    item.unread_messages_count > 0 ? <View style={chatItemStyles.unreadMessagesCount}><Text style={{ color: "#FFFFFF" }}>{item.unread_messages_count}</Text></View> : null
                }

            </View>


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
    unreadMessagesCount: {
        backgroundColor: styles.color,
        borderRadius: 50,
        width: 25,
        height: 25,
        fontWeight: "bold",
        justifyContent: 'center',
        alignItems: "center",
    }
})
export default ChatRoomListItem;