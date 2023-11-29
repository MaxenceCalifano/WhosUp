import { View, StyleSheet, FlatList, ActivityIndicator, Dimensions, Text } from "react-native";
import ChatRoomListItem from "../../components/ChatRoomListItem";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState, useContext, useEffect } from "react";
import { supabase } from '../../config/supabase'
import { useUser } from "../../UserContext";
import styles from "../../styles";
import { NewMessagesContext } from '../../navigation/UserStack';



function ChatListScreen({ navigation }) {
    const { user } = useUser()
    const [chatRooms, setChatRooms] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    //Message context
    const { newMessage } = useContext(NewMessagesContext)

    useEffect(() => {

        // Tests if the new message comes from a new chat or not
        const isNewChatRoom = chatRooms.some(room => room.chat_room_id === newMessage.chat_room_id)
        if (!isNewChatRoom) fetchData(user.id)

        //Gets the new messages from existing chat
        const rooms = chatRooms.map(room => {
            if (room.chat_room_id === newMessage.chat_room_id) {
                room.content = newMessage.content
                room.unread_messages_count = room.unread_messages_count + 1
            }
            return room
        })
        // console.log("🚀 ~ file: ChatListScreen.jsx:28 ~ chatRooms ~ chatRooms:", chatRooms)

        setChatRooms(rooms)

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
            /*  if (chatRoom.length !== 0) {
                 console.log('chat user length', chatRoom.length)
                 let filteredData = []
                 data.forEach(elem => {
                     if (chatRoom.findIndex(room => room.chat_room_id === elem.chat_room_id) === -1) filteredData.push(elem)
                 })
                 //chatRoom.filter(chat => data.every(elem => elem.chat_room_id !== chat.chat_room_id))
                 console.log("🚀 ~ file: ChatListScreen.jsx:56 ~ fetchData ~ filteredData:", filteredData)
             } */
            setChatRooms(chatsArray)
            setIsLoading(false)
        }
        if (error) console.log("🚀 ~ file: ChatListScreen.jsx:24 ~ fetchData ~ error:", error)
    }

    useFocusEffect(
        useCallback(() => {
            setChatRooms([])
            fetchData(user.id)
        }, []))

    return (
        <View style={chatStyles.wrapper}>
            {
                isLoading ? <View style={chatStyles.container}>
                    <ActivityIndicator color={styles.color} size={"large"} />
                </View>
                    : chatRooms.length > 0 ?
                        <FlatList
                        data={chatRooms}
                        renderItem={item => <ChatRoomListItem
                            navigation={navigation}
                            item={item.item}
                            keyExtractor={item => item.user_id} />}
                    />
                : <View style={chatStyles.container}>
                    <Text style={chatStyles.noDiscussions}>Vous n'avez pas encore de discussion</Text>
                </View>
            }

        </View>
    );
}

const chatStyles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 10,
    },
    container: {
        display: "flex",
        justifyContent: 'center',
        height: Dimensions.get('window').height,
    },
    noDiscussions: {
        textAlign:'center'
    }
})
export default ChatListScreen;