import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Dimensions, ActivityIndicator, Modal } from 'react-native'
import { Input, Slider, Icon, Divider } from 'react-native-elements'
import { Button, ButtonGroup } from "@rneui/themed";
import { Picker } from '@react-native-picker/picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { supabase } from '../config/supabase'

import CoordinateInput from "../components/CoordinateInput";

import styles from "../styles";
import dayjs from "dayjs";

const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)


export default function AddEventScreen({ navigation }) {

    /*Get the id of the current user */
    supabase.auth.getSession()
        .then(res => { setHostId(res.data.session.user.id) })


    /* All event informations */
    const [hostId, setHostId] = useState();
    const [people, setPeople] = useState(1);
    const [activityTitle, setActivityTitle] = useState();
    const [activityDescription, setActivityDescription] = useState();
    const [selectedActivityType, setSelectedActivityType] = useState('apéro');
    const [date, setDate] = useState(dayjs());
    //const [day, setDay] = useState();
    const [location, setLocation] = useState({ latitude: '', longitude: '' })

    const [selectedIndex, setSelectedIndex] = useState()
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [responseMessage, setResponseMessage] = useState('')

    const [place, setPlace] = useState('') // Used to display the place selected by the google place picker

    /* Related with date picker*/
    let day;

    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate.toString().slice(16, 25);
        const fullDate = dayjs(day + ' ' + currentDate, "YYYY-MM-DD HHmm")
        setDate(fullDate);
    }

    const onDateChange = (event, selectedDate) => {
        const getDateString = dayjs(selectedDate).format()
        const getDayString = getDateString.toString().split('T')[0]
        day = getDayString

        DateTimePickerAndroid.open({
            value: new Date(),
            onChange: onTimeChange,
            mode: 'time',
            is24Hour: true,
        })
        setDate(currentDate);
    };

    const showPicker = () => {

        DateTimePickerAndroid.open({
            value: new Date(),
            onChange: onDateChange,
            mode: 'date',
            is24Hour: true,
        })
    }
    /* End of date picker dependencies */

    const createNewActivity = async () => {
        setLoading(true)
        const { error, status } = await supabase
            .from('activities')
            .insert({
                host_id: hostId,
                activityTitle: activityTitle,
                activityDescription: activityDescription,
                activityType: selectedActivityType,
                numberOfParticipants: people,
                date: date,
                location: location
            })

        if (error) {
            console.log(error)
            setLoading(false)
            if (status === 400) setResponseMessage("Une erreur est survenue, veuillez érifier les informations que vous avez renseignées")
            if (status === 401) setResponseMessage("Vous devez être connecté pour créer une activité")
            if (status >= 500) setResponseMessage("Le serveur ne répond pas, veuillez réessayer plus tard")
        }
        // TO DO créer une modale qui s'affiche quelques secondes puis rediriger vers la carte ou vers la page "mes activitées"
        if (status === 201) {
            setIsSuccess(true)
            setLoading(false)
            setTimeout(() => {
                navigation.navigate("Calendrier")
            }, 5000)
        }
    }

    useEffect(() => {
        console.log('location ' + location)
    }, [location])

    return (
        //   <ScrollView contentContainerStyle={{ minHeight: '100%' }} keyboardShouldPersistTaps='always' listViewDisplayed={false}>
        <View style={pageStyles.container}>
            {loading ?
                <View style={pageStyles.modalContainer}>
                    <Modal animationType="fade" transparent={true}>
                        <View style={pageStyles.modalView}>
                            <View style={pageStyles.loaderContainer}>
                                <ActivityIndicator color={styles.color} size={"large"} />
                                <Text style={{ marginTop: 10 }}>Création de votre activité..</Text>
                            </View>
                        </View>
                    </Modal>
                </View>
                : <></>
            }
            {isSuccess ?
                <View style={pageStyles.modalContainer}>
                    <Modal animationType="fade" transparent={true}>
                        <View style={pageStyles.modalView}>
                            <View style={pageStyles.loaderContainer}>
                                <Text style={{ marginTop: 10 }}>Votre activité a été créée !</Text>
                                <Text style={{ marginTop: 10, textAlign: "center" }}>Vous allez être redirigé vers la page de vos évènements dans quelques secondes</Text>
                            </View>
                        </View>
                    </Modal>
                </View>
                : <></>
            }

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
            <CoordinateInput setSelectedIndex={setSelectedIndex} selectedIndex={selectedIndex} setLocation={setLocation} location={location} setPlace={setPlace} />

            <Button title="Créer une activité" onPress={createNewActivity} buttonStyle={{ backgroundColor: styles.color }} />
            <Text>{responseMessage}</Text>
        </View>
        //   </ScrollView>
    );

}
const pageStyles = StyleSheet.create({
    backgroundColor: '#FFF',
    marginTop: 10,
    container: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        height: Dimensions.get('window').height - 150,
        flexDirection: "column",
        justifyContent: "space-between"
    },
    modalContainer: {
        display: "flex",
        position: "absolute",
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    loaderContainer: {
        height: 250,
        width: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
})