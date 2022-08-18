import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import { Input, Slider, Icon, Divider } from 'react-native-elements'
import { Button } from "@rneui/themed";
import { Picker } from '@react-native-picker/picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import '../config/firebase'
import { getFirestore, setDoc, doc } from 'firebase/firestore';
const firestore = getFirestore();

import styles from "../styles";


export default function AddEventScreen() {

    const [people, setPeople] = useState(1);
    const [activityTitle, setActivityTitle] = useState();
    const [activityDescription, setActivityDescription] = useState();

    const [selectedActivityType, setSelectedActivityType] = useState();

    const [date, setDate] = useState(new Date())

    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    }

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        DateTimePickerAndroid.open({
            value: date,
            onChange: onTimeChange,
            mode: 'time',
            is24Hour: true,
        })
        setDate(currentDate);
    };

    const showPicker = () => {

        DateTimePickerAndroid.open({
            value: date,
            onChange: onDateChange,
            mode: 'date',
            is24Hour: true,
        })
    }

    const eventTypes = [
        'randonée',
        'jeux de société',
        'sport',
        'apéro',
    ]

    const createNewActivity = async () => {
        await setDoc(doc(firestore, "activities", activityTitle), {
            activityTitle: activityTitle,
            activityDescription: activityDescription,
            activityType: selectedActivityType,
            numberOfParticipants: people,
            date: date.toLocaleString().slice(0, date.toLocaleString().lastIndexOf(':')),
        });
    }
    /*
         */
    return (
        <View style={{ flex: 1, backgroundColor: pageStyles.backgroundColor, paddingHorizontal: 20 }}>

            <Input placeholder="Titre de l'activité" containerStyle={{ paddingHorizontal: 0, marginTop: 10 }} onChangeText={(value) => setActivityTitle(value)} />

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
            <Divider />

            <Text style={{ marginTop: 20 }}>Quel type d'activité proposez-vous ?</Text>
            <Picker
                selectedValue={selectedActivityType}
                onValueChange={(itemValue, itemIndex) =>
                    setSelectedActivityType(itemValue)
                }>
                <Picker.Item icon={() => <Icon
                    name="calendar"
                    type="font-awesome"
                    size={20}
                    color="#454545"
                    onPress={showPicker}

                />} label="jeux de société" value="jeux de société" />
                <Picker.Item label="apéro" value="apéro" />
                <Picker.Item label="randonée" value="randonée" />
            </Picker>
            <Divider />

            <Pressable style={{ flexDirection: 'row', marginVertical: 20, paddingHorizontal: 0 }} titleStyle={{ color: '#454545' }} onPress={showPicker}>
                <Icon
                    name="calendar"
                    type="font-awesome"
                    size={20}
                    color="#454545"
                    onPress={showPicker}
                />
                <Text> {' '} {date.toLocaleString().slice(0, date.toLocaleString().lastIndexOf(':'))}</Text>
            </Pressable>
            <Divider />

            <TextInput placeholder="Décrivez l'activité en quelques mots" onChangeText={value => setActivityDescription(value)} />

            <Button title="Créer une activité" onPress={createNewActivity} buttonStyle={{ backgroundColor: styles.color }} />
        </View>
    );

}
const pageStyles = StyleSheet.create({
    backgroundColor: '#FFF'
})