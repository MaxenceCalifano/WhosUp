import React, { useEffect, useState } from "react";
import { View, Text } from 'react-native'
import { Divider } from 'react-native-elements'
import { useAuthentication } from '../utils/hooks/useAuthentication'
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

import app from '../config/firebase';
import ActivityCard from "../components/ActivityCard";

function UserEventScreen({ navigation }) {
    //console.log("🚀 ~ file: UserEventsScreen.jsx:10 ~ UserEventScreen ~ user", user.uid)
    const [test, setTest] = useState([])

    const db = getFirestore(app);
    const { user } = useAuthentication()
    const getDocuments = async () => {
        const q = query(collection(db, "activities"), where("hostId", "==", user.uid));

        const querySnapshot = await getDocs(q);
        let interTest = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            interTest.push(doc.data())
        });
        setTest(interTest)
    }
    useEffect(() => {
        if (user) {
            getDocuments()
        }
    }, [user])


    return (
        <View style={{ flex: 1 }}>
            <Text>Mes événements</Text>
            <Divider />
            <Text>J'organise</Text>
            <Divider />
            {test.map((doc, index) => <ActivityCard key={index} navigation={navigation} item={doc} />)}
            <Text>Je participe</Text>
            <Divider />
        </View>
        /**
         * Charger toutes les activités auquels participe l'utilisateur et celles dont il est
         */
    );
}

export default UserEventScreen;