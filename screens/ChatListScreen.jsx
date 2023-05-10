import { View, Text, StyleSheet, FlatList, ActivityIndicator, Dimensions } from "react-native";
import ChatRoomListItem from "../components/ChatRoomListItem";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState, useEffect } from "react";
import { supabase } from '../config/supabase'
import { useUser } from "../UserContext";
import styles from "../styles";


function ChatListScreen({ navigation }) {
    const { user } = useUser()
    const [chatUsers, setChatUsers] = useState([])
    // const [chatRooms, setChatRooms] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    let roomData = [];

    useEffect(() => {

        // console.log('chatUsers', chatUsers)
    }, [chatUsers])

    //fetch all the ids of the chatrooms of the logged in user
    const fetchChatroomsIds = async () => {
        if (chatUsers.length === 0) setIsLoading(true)
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                        id,
                        chat_rooms (
                        id,
                        last_message_id
                        )
                    `)
            .eq('id', user.id)

        if (data) {
            //console.log("🚀 ~ file: ChatListScreen.jsx:36 ~ fetchChatroomsIds ~ data:", data)
            const chat_rooms = data[0].chat_rooms
            console.log("🚀 ~ file: ChatListScreen.jsx:39 ~ fetchChatroomsIds ~ chat_rooms:", chat_rooms)
            // setChatRooms(data[0].chat_rooms)
            chat_rooms.forEach(async room => await fetchRoomData(room.id, room.last_message_id))
            console.log('fin ici')
            // roomData
        }
    }

    const fetchRoomData = async (room, lastMessageId) => {

        let { data: chat_rooms_profiles, error } = await supabase
            .from('chat_rooms_profiles')
            .select(`user_id,
                     profiles (
                        username,
                        avatar_url
                     )        
            `)
            .eq('room_id', room)

        if (chat_rooms_profiles) {
            console.log("🚀 ~ file: ChatListScreen.jsx:59 ~ fetchRoomData ~ chat_rooms_profiles:", chat_rooms_profiles)
            chat_rooms_profiles.forEach(item => {
                //Don't fetch last message if conversation hasn't messages
                //console.log(lastMessageId)
                // if (lastMessageId === null && item.user_id !== user.id) setChatUsers(prevState => [...prevState, { item, roomId: room, lastMessage: "Cette conversation n'a pas de message" }])
                //   else {
                if (item.user_id !== user.id && lastMessageId !== null) {
                    //Fetch last message
                    supabase
                        .from('messages')
                        .select()
                        .eq('id', lastMessageId)
                        .then(res => console.log(res.data))
                    if (data) {
                        //console.log("🚀 ~ file: ChatListScreen.jsx:65 ~ fetchRoomData ~ data:", data[0])
                        // setChatUsers(prevState => [...prevState, { item, roomId: room, lastMessage: { content: data[0].content, createdAt: data[0].created_at } }])
                        new Promise((data, resolve) => {
                            console.log('77: ', data)
                            roomData.push({ item, roomId: room, lastMessage: { content: data[0].content, createdAt: data[0].created_at } })
                        })
                    }
                    if (error) console.log('ligne 63', error)
                }
                //   }

            })

            setIsLoading(false)
        }
        if (error) console.warn(error)
        // console.log("🚀 ~ file: ChatListScreen.jsx:73 ~ fetchRoomData ~ roomData:", roomData)

    }

    const test = async () => {
        fetchChatroomsIds().then(() => {
            console.log('fini', roomData)
            setChatUsers(roomData)
        })
    }
    useFocusEffect(
        useCallback(() => {
            setChatUsers([])
            test()
        }, []))

    return (
        <View style={chatStyles.container}>
            {
                isLoading ? <View style={chatStyles.loaderContainer}>
                    <ActivityIndicator color={styles.color} size={"large"} />
                </View>
                    : <FlatList
                        data={chatUsers}
                        renderItem={item => <ChatRoomListItem
                            navigation={navigation}
                            item={item.item}
                            keyExtractor={item => item.user_id} />}
                    />
            }

        </View>
    );
}

const chatStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    loaderContainer: {
        display: "flex",
        justifyContent: 'center',
        height: Dimensions.get('window').height,
    }
})
export default ChatListScreen;