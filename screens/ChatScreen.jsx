import { StyleSheet, View, Text, TextInput, Dimensions } from 'react-native';
import { useEffect } from 'react';
import { supabase } from '../config/supabase'
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from "../UserContext";
import dayjs from "dayjs";

import styles from "../styles";

function Chat({ route, navigation }) {

    let roomId = route.params.roomId
    let username = route.params.username
    const { user } = useUser()
    console.log("🚀 ~ file: ChatScreen.jsx:6 ~ Chat ~ roomId:", roomId)
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')

    const fetchMessages = async () => {

        supabase.channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'messages' },
                (payload) => {
                    console.log('Change received!', payload)
                    setMessages(prevState => [...prevState, payload.new])
                }
            )
            .subscribe()

        const { data, error } = await supabase
            .from('messages')
            .select()
            .eq('chat_room_id', roomId)

        if (data) {
            console.log('messages', data)
            setMessages(data)
            console.log(dayjs(data[0].created_at).format('h:mm'))
        }
        if (error) console.log(error)
    }

    const postMessage = async () => {
        const { error } = await supabase
            .from('messages')
            .insert({ content: message, chat_room_id: roomId, user_id: "78a36907-bf45-4d67-9ad1-a9e700cbdf2b" })

        if (error) console.log(error)
    }
    useEffect(() => {
        navigation.setOptions({ title: username })
        fetchMessages()
    }, [])
    return (
        <View style={chatStyles.main}>
            {
                messages.map(message => < Text key={message.id}
                    style={message.user_id === user.id ?
                        [chatStyles.message, chatStyles.ownerMessage]
                        : [chatStyles.message, chatStyles.contactMessage]
                    }>{message.content}</Text>
                )
            }
            <View style={chatStyles.send}>
                <TextInput
                    style={chatStyles.messageInput}
                    placeholder='Ecrivez un message...'
                    onChangeText={setMessage}
                />
                <Ionicons onPress={postMessage} style={chatStyles.send_button} name="send" size={24} color={styles.color} />
            </View>
        </View >
    );
}

const chatStyles = StyleSheet.create({
    main: {
        height: '100%',
        flexDirection: 'column',
    },
    send: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    messageInput: {
        padding: 5,
        backgroundColor: 'white',
        flex: 2,
        marginRight: 5,
        borderRadius: 10,
        elevation: 1
    },
    send_button: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 50,
        elevation: 1
    },
    message: {
        padding: 10,
        marginVertical: 10,
        borderRadius: 15,
        marginHorizontal: 10
    },
    ownerMessage: {
        alignSelf: 'flex-end',
        backgroundColor: styles.color,
        color: 'white'
    },
    contactMessage: {
        alignSelf: 'flex-start',
        backgroundColor: 'white'
    },
})

export default Chat;