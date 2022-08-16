import React from "react";
import { View, Text } from 'react-native'
import { Input, Slider, Icon } from 'react-native-elements'

import styles from "../styles";


export default function AddEventScreen() {
    const [people, setPeople] = React.useState(1);

    return (
        <View style={{ flex: 1 }}>

            <Input placeholder="Titre de l'activité" />
            <Text>Nombre de participants: {people}</Text>

            <Slider
                value={people}
                onValueChange={setPeople}
                maximumValue={10}
                minimumValue={1}
                step={1}
                thumbStyle={{ height: 30, width: 30, backgroundColor: styles.color, justifyContent: 'center' }}
                thumbProps={{
                    children: (
                        <Icon
                            name="people"
                            type="material"
                            size={20}
                            color="#757575"
                            containerStyle={{ bottom: 0, right: 0 }}
                        />
                    )
                }}
            />
        </View>
    );
}