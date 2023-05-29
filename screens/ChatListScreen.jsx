import { View, StyleSheet, FlatList, ActivityIndicator, Dimensions } from "react-native";
import ChatRoomListItem from "../components/ChatRoomListItem";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from "react";
import { supabase } from '../config/supabase'
import { useUser } from "../UserContext";
import styles from "../styles";


function ChatListScreen({ navigation }) {
    const { user } = useUser()
    console.log("🚀 ~ file: ChatListScreen.jsx:12 ~ ChatListScreen ~ user:", user.id)
    const [chatUsers, setChatUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async () => {
        setIsLoading(true)
        const { data, error } = await supabase.rpc('get_chats_data', { userid: user.id })
        let chatsArray = []
        if (data) {
            console.log("🚀 ~ file: ChatListScreen.jsx:20 ~ fetchData ~ data:", data)
            data.forEach(item => item.id !== user.id ? chatsArray.push(item) : "")
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