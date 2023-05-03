import { Text } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

// ...


function ChatHeader(props) {
    const headerHeight = useHeaderHeight();
    console.log("🚀 ~ file: ChatHeader.jsx:7 ~ headerHeight:", headerHeight)
    console.log(props)
    return (
        <Text>
            Test
        </Text>
    );
}

export default ChatHeader;