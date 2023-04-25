import { StyleSheet, View, Text, TextInput, Dimensions } from 'react-native';
import { useEffect } from 'react';
import { supabase } from '../config/supabase'
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import styles from "../styles";

function Chat({ route }) {

    let roomId = route.params.roomId
    console.log("🚀 ~ file: ChatScreen.jsx:6 ~ Chat ~ roomId:", roomId)
    const [messages, setMessages] = useState([])

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
        }
        if (error) console.log(error)
    }

    useEffect(() => {
        fetchMessages()
    }, [])
    return (
        <View style={chatStyles.main}>
            {
                messages.map(message => <Text key={message.id}>{message.content}</Text>)
            }
            <View style={chatStyles.send}>
                <TextInput style={chatStyles.messageInput} placeholder='Ecrivez un message...' />
                <Ionicons style={chatStyles.send_button} name="send" size={24} color={styles.color} />
            </View>
        </View>
    );
}

const chatStyles = StyleSheet.create({
    main: {
        height: '100%',
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
        //width: '80%',
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
    }
})

export default Chat;