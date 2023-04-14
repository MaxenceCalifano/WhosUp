import { StyleSheet, View } from 'react-native';
import { Input, Icon } from '@rneui/themed';
function Chat() {
    return (
        <View>
            <Input placeholder='Ecrivez un message...'
                rightIcon={{ type: 'font-awesome', name: 'paper-plane' }}
            />
        </View>
    );
}

export default Chat;