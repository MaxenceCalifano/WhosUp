import { StyleSheet, View, Text, TextInput, FlatList } from 'react-native';
import { useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../config/supabase'
import { Ionicons } from '@expo/vector-icons';
import { useUser } from "../UserContext";
import { NewMessagesContext } from '../navigation/UserStack';
import dayjs from "dayjs";

import styles from "../styles";

function Chat({ route, navigation }) {
    let chatViewRef = useRef()

    let roomId = route.params.chat_room_id
    let username = route.params.profile.username
    let avatarUrl = route.params.profile.avatarUrl
    const { user } = useUser()
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const { newMessage } = useContext(NewMessagesContext)

    /*     supabase.channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'messages' },
                async (payload) => {
                    console.log('Change received!', messages)
                    setMessages((prevState) => [payload.new, ...prevState])
                    const { count, error: messageError } = await supabase
                        .from('messages')
                        .select('*', { count: 'exact', head: true })
                        .eq('chat_room_id', roomId)
                        .neq('user_id', user.id)
                        .eq('read', false)
                    if (messageError) console.log("🚀 ~ file: ChatScreen.jsx:37 ~ messageError:", messageError)
                    if (count) {
                        console.log("🚀 ~ file: ChatScreen.jsx:38 ~ count:", count)
                        setUnreadMessages(count)
                    }
                }
            )
            .subscribe() */

    const fetchMessages = async () => {

        const { data, error } = await supabase
            .from('messages')
            .select()
            .eq('chat_room_id', roomId)
            .order('created_at', { ascending: false })

        if (data) {
            //console.log("🚀 ~ file: ChatScreen.jsx:54 ~ fetchMessages ~ data:", data)

            setMessages(data)
            setIsLoading(false)
            // Set all the messages as read
            const { error: messagesError } = await supabase
                .from('messages')
                .update({ read: true })
                .eq('chat_room_id', roomId)

            if (messagesError) console.log("🚀 ~ file: ChatScreen.jsx:45 ~ fetchMessages ~ error:", error)
        }

    }


    const postMessage = async () => {
        /**
         * Post the message, then add his id to the chat_room table to know that this the last message
         */
        setMessage('')

        supabase
            .from('messages')
            .insert({ content: message, chat_room_id: roomId, user_id: user.id })
            .select()
            .then(res => {
                // console.log(res.data)
                supabase
                    .from('chat_rooms')
                    .update({ last_message_id: res.data[0].id })
                    .eq('id', res.data[0].chat_room_id)
                    .then(response => {
                        console.log(response)
                        //chatViewRef.current.scrollToEnd({ animated: true })
                    })
                    .catch(error => console.log("🚀 ~ file: ChatScreen.jsx:75 ~ postMessage ~ error:", error))
            })
            .catch(error => console.log("🚀 ~ file: ChatScreen.jsx:64 ~ postMessage ~ error:", error))
    }

    useEffect(() => {
        navigation.setOptions({ title: username })
        fetchMessages()
        //chatViewRef.current.scrollToEnd({ animated: true })
    }, [])

    useEffect(() => {
        console.log("🚀 ~ file: ChatScreen.jsx:98 ~ Chat ~ newMessage:", newMessage)
        setMessages((prevState) => [newMessage, ...prevState])
    }, [newMessage])

    return (
        <View style={chatStyles.main}>
            {
                isLoading ? <></>
                    :
                    messages.length > 0 ?
                        <FlatList
                            ref={chatViewRef}
                            inverted
                            renderItem={(message) => <View key={message.item.id}
                                style={message.item.user_id === user.id ?
                                    [chatStyles.message, chatStyles.ownerMessage]
                                    : [chatStyles.message, chatStyles.contactMessage]
                                }>
                                <Text>{message.item.content}</Text>
                                <Text style={chatStyles.messageTime}>
                                    {dayjs().format('DD/MM') === dayjs(message.item.created_at).format('DD/MM')
                                        ? dayjs(message.item.created_at).format('HH:mm')
                                        : dayjs(message.item.created_at).format('DD/MM')}
                                </Text>
                            </View>
                            }
                            data={messages} />
                        //messages.map(message => )
                        : <View style={{ height: '100%', justifyContent: 'center' }}>
                            <Text style={{ width: '70%', alignSelf: 'center', padding: 10, backgroundColor: styles.tertiaryColor, borderRadius: 15 }}>Cette discussion ne contient aucun message, écrivez quelque chose à {username}</Text>
                        </View>
            }

            <View style={chatStyles.send}>
                <TextInput
                    style={chatStyles.messageInput}
                    placeholder='Ecrivez un message...'
                    onChangeText={setMessage}
                    value={message}
                />
                <Ionicons onPress={postMessage} style={chatStyles.send_button} name="send" size={24} color={styles.color} />
            </View>
        </View >
    );
}

const chatStyles = StyleSheet.create({
    main: {
        height: '100%',
        paddingBottom: 60
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
        marginHorizontal: 10,
        display: 'flex',
    },
    ownerMessage: {
        alignSelf: 'flex-end',
        backgroundColor: styles.tertiaryColor,
    },
    contactMessage: {
        alignSelf: 'flex-start',
        backgroundColor: 'white'
    },
    messageTime: {
        alignSelf: 'flex-end',
        color: "#4A4A4A",
        fontSize: 10,
    }
})

export default Chat;