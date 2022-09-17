import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Dimensions, ScrollView } from 'react-native'
import { Input, Slider, Icon, Divider } from 'react-native-elements'
import { Button, ButtonGroup, lightColors } from "@rneui/themed";
import { Picker } from '@react-native-picker/picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';

import { useAuthentication } from '../utils/hooks/useAuthentication'



import '../config/firebase'
import { getFirestore, setDoc, doc } from 'firebase/firestore';
const firestore = getFirestore();


import CoordinateInput from "../components/CoordinateInput";

import styles from "../styles";


export default function AddEventScreen() {

    const { user } = useAuthentication()

    /* All event informations */
    const [people, setPeople] = useState(1);
    const [activityTitle, setActivityTitle] = useState();
    const [activityDescription, setActivityDescription] = useState();
    const [selectedActivityType, setSelectedActivityType] = useState('apéro');
    const [date, setDate] = useState(new Date());
    const [location, setLocation] = useState({ latitude: '', longitude: '' })

    const [selectedIndex, setSelectedIndex] = useState()

    const [responseMessage, setResponseMessage] = useState('')

    const [place, setPlace] = useState('') // Used to display the place selected by the google place picker

    /* Related with date picker*/
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
    /* End of date picker dependencies */

    const eventTypes = [
        'randonée',
        'jeux de société',
        'sport',
        'apéro',
    ]

    const createNewActivity = async () => {
        try {
            await setDoc(doc(firestore, "activities", activityTitle + '_' + uuid.v4()), {
                hostId: user.uid,
                activityTitle: activityTitle,
                activityDescription: activityDescription,
                activityType: selectedActivityType,
                numberOfParticipants: people,
                date: date.toLocaleString().slice(0, date.toLocaleString().lastIndexOf(':')),
                location: location
            }).then(() => setResponseMessage('Votre événement a bien été créé !'))
        }

        catch (err) {
            console.log('erreur ' + err)
            setResponseMessage('Une erreur a été détéctée, veuillez remplir tous les champs du formulaire s\'il vous plait')
        }
    }

    useEffect(() => {
        console.log('location ' + location)
    }, [location])
    return (
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always' listViewDisplayed={false}>
            <View style={{ flex: 1, backgroundColor: pageStyles.backgroundColor, paddingHorizontal: 20 }}>

                {/*Activity title*/}
                <Input placeholder="Titre de l'activité" containerStyle={{ paddingHorizontal: 0, marginTop: pageStyles.marginTop }} onChangeText={(value) => setActivityTitle(value)} />

                {/*Number of antendees input*/}
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

                {/*Activity type input */}
                <Text style={{ marginTop: pageStyles.marginTop }}>Quel type d'activité proposez-vous ?</Text>
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

                {/*Calendar */}
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

                {/*Activity description*/}
                <Text style={{ marginTop: pageStyles.marginTop }}>Description de l'activité</Text>
                <TextInput placeholder="Décrivez l'activité en quelques mots" onChangeText={value => setActivityDescription(value)} />
                <Divider />

                {/*Place input*/}
                <Text style={{ marginTop: pageStyles.marginTop }}>Lieu: {place}</Text>
                <ButtonGroup
                    buttons={['Ma position', 'Coordonnées', "Autour d'un lieu"]}
                    selectedIndex={selectedIndex}
                    onPress={(value) => {
                        setSelectedIndex(value);
                    }}
                    selectedButtonStyle={{ backgroundColor: styles.color }} selectedTextStyle={{ color: "#454545" }}
                />
                <CoordinateInput selectedIndex={selectedIndex} setLocation={setLocation} location={location} setPlace={setPlace} />

                <Button title="Créer une activité" onPress={createNewActivity} buttonStyle={{ backgroundColor: styles.color }} />
                <Text>{responseMessage}</Text>
            </View>
        </ScrollView>
    );

}
const pageStyles = StyleSheet.create({
    backgroundColor: '#FFF',
    marginTop: 10,
    map: {
        width: Dimensions.get('window').width - 40,
        height: Dimensions.get('window').height,
    },
    coordinateCard: {
        backgroundColor: '#959595',
        width: '50%',
        padding: '5'
    }
})