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
    const [chatRooms, setChatRooms] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        console.log('chatUsers', chatUsers)

    }, [chatUsers])

    //fetch all the ids of the chatrooms of the logged in user
    const fetchChatroomsIds = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                        id,
                        chat_rooms (
                        id
                        )
                    `)
            .eq('id', user.id)

        if (data) {
            const chat_rooms = data[0].chat_rooms
            setChatRooms(data[0].chat_rooms)
            chat_rooms.forEach(room => fetchChatUser(room.id))
        }
    }

    const fetchChatUser = async (room) => {

        let { data: chat_rooms_profiles, error } = await supabase
            .from('chat_rooms_profiles')
            .select(`user_id,
                     profiles (
                        username
                     )        
            `)
            .eq('room_id', room)

        if (chat_rooms_profiles) {
            chat_rooms_profiles.forEach(item => {
                if (item.user_id !== user.id) setChatUsers(prevState => [...prevState, { item, roomId: room }])
            })
            setIsLoading(false)
        }
        if (error) console.warn(error)
    }


    useFocusEffect(
        useCallback(() => {
            setChatUsers([])
            fetchChatroomsIds()
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