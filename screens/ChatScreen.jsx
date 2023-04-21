import { StyleSheet, View } from 'react-native';
import { Input, Icon } from '@rneui/themed';
function Chat({ route }) {

    let roomId = route.params
    console.log("🚀 ~ file: ChatScreen.jsx:6 ~ Chat ~ roomId:", roomId)
    return (
        <View>
            <Input placeholder='Ecrivez un message...'
                rightIcon={{ type: 'font-awesome', name: 'paper-plane' }}
            />
        </View>
    );
}

export default Chat;