import { View } from "react-native";
import styles from "../styles";

function Loader() {
    return (
        <View style={loaderStyles.loader}>

        </View>
    );
}

const loaderStyles = {
    loader: {
        borderTopColor: styles.color,
        borderTopWidth: 5,
        borderRadius: 50
    }
}
export default Loader;