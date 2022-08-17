import React from "react";
import { View, Text } from 'react-native'
import { Input, Slider, Icon, ListItem } from 'react-native-elements'
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import styles from "../styles";


export default function AddEventScreen() {
    const [people, setPeople] = React.useState(1);

    const [selectedActivityType, setSelectedActivityType] = React.useState();

    const eventTypes = [
        'randonée',
        'jeux de société',
        'sport',
        'apéro',
    ]

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

            <Picker
                selectedValue={selectedActivityType}
                onValueChange={(itemValue, itemIndex) =>
                    setSelectedActivityType(itemValue)
                }>
                <Picker.Item label="jeux de société" value="jeux de société" />
                <Picker.Item label="apéro" value="apéro" />
                <Picker.Item label="randonée" value="randonée" />
            </Picker>
        </View>
    );
}