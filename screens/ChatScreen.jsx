import { StyleSheet, View, Text } from 'react-native';
import { Input, Icon } from '@rneui/themed';
import { useEffect } from 'react';
import { supabase } from '../config/supabase'
import { useState } from 'react';

function Chat({ route }) {

    let roomId = route.params.chatId
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
        <View>
            {
                messages.map(message => <Text key={message.id}>{message.content}</Text>)
            }
            <Input placeholder='Ecrivez un message...'
                rightIcon={{ type: 'font-awesome', name: 'paper-plane' }}
            />
        </View>
    );
}

export default Chat;