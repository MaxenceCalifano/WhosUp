import { View, Text, StyleSheet, FlatList } from "react-native";
import ChatRoomListItem from "../components/ChatRoomListItem";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState, useEffect } from "react";
import { supabase } from '../config/supabase'
import { useUser } from "../UserContext";

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
    const { user } = useUser()
    const [chatUsers, setChatUsers] = useState([])

    useEffect(() => {
        console.log('chatUsers', chatUsers)

    }, [chatUsers])

    //fetch all the ids of the chatrooms of the logged in user
    const fetchChatroomsIds = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                        id,
                        chat_rooms (
                        id
                        )
                    `)
            .eq('id', user.id)

        if (data) console.log(data[0])
    }

    const fetchChatUser = async () => {

        let { data: chat_rooms_profiles, error } = await supabase
            .from('chat_rooms_profiles')
            .select(`user_id,
                     profiles (
                        username
                     )        
            `)
            .eq('room_id', "1952faec-9516-449e-b7e7-933a35305bf8")

        if (chat_rooms_profiles) {
            chat_rooms_profiles.forEach(item => {
                if (item.user_id !== user.id) setChatUsers(prevState => [...prevState, item])
            })

        }
    }


    useFocusEffect(
        useCallback(() => {
            setChatUsers([])
            fetchChatroomsIds()
            fetchChatUser()
        }, []))

    return (
        <View style={chatStyles.container}>
            <FlatList
                data={chatUsers}
                renderItem={item => <ChatRoomListItem
                    navigation={navigation}
                    item={item.item}
                    keyExtractor={item => item.user_id} />}
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