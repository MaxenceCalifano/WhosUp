import { View, StyleSheet, FlatList, ActivityIndicator, Dimensions } from "react-native";
import ChatRoomListItem from "../../components/ChatRoomListItem";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState, useContext, useEffect } from "react";
import { supabase } from '../../config/supabase'
import { useUser } from "../../UserContext";
import styles from "../../styles";
import { NewMessagesContext } from '../../navigation/UserStack';



function ChatListScreen({ navigation }) {
    const { user } = useUser()
    const [chatUsers, setChatUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    //Message context
    const { newMessage } = useContext(NewMessagesContext)

    useEffect(() => {

        // Tests if the new message comes from a new chat or not
        const isNewChatRoom = chatUsers.some(room => room.chat_room_id === newMessage.chat_room_id)
        if (!isNewChatRoom) fetchData(user.id)

        //Gets the new messages from existing chat
        const chatRooms = chatUsers.map(room => {
            if (room.chat_room_id === newMessage.chat_room_id) {
                room.content = newMessage.content
                room.unread_messages_count = room.unread_messages_count + 1
            }
            return room
        })
        // console.log("🚀 ~ file: ChatListScreen.jsx:28 ~ chatRooms ~ chatRooms:", chatRooms)

        setChatUsers(chatRooms)

    }, [newMessage])


    const fetchData = async () => {
        setIsLoading(true)

        const { data, error } = await supabase.rpc('get_chats_data', { userid: user.id })
        let chatsArray = []
        if (data) {
            //Récupère un array d'objet : {"avatar_url": "d3845241-7c65-491f-bd5e-02d00b98c0a8.png", "chat_room_id": "04ce2057-37c1-4fcb-8b23-c285721ef4cf", "content": "Gg", "created_at": "2023-07-02T06:13:09.588629+00:00", "id": "20d4f55f-78f8-40fe-b1a4-ef9612c3f982", "username": "Rémi"}
            // Deux par discussion : l'user courant et l'autre participant
            //console.log("🚀 ~ file: ChatListScreen.jsx:20 ~ fetchData ~ data:", data)
            data.forEach(item => item.id !== user.id ? chatsArray.push(item) : "")

            // si il y a des discussion on ne veut charger que les nouvelles
            // trouver dans data les discussion qui ne se trouvaient pas déja dans le state
            /*  if (chatUsers.length !== 0) {
                 console.log('chat user length', chatUsers.length)
                 let filteredData = []
                 data.forEach(elem => {
                     if (chatUsers.findIndex(room => room.chat_room_id === elem.chat_room_id) === -1) filteredData.push(elem)
                 })
                 //chatUsers.filter(chat => data.every(elem => elem.chat_room_id !== chat.chat_room_id))
                 console.log("🚀 ~ file: ChatListScreen.jsx:56 ~ fetchData ~ filteredData:", filteredData)
             } */
            setChatUsers(chatsArray)
            setIsLoading(false)
        }
        if (error) console.log("🚀 ~ file: ChatListScreen.jsx:24 ~ fetchData ~ error:", error)
    }

    useFocusEffect(
        useCallback(() => {
            setChatUsers([])
            fetchData(user.id)
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