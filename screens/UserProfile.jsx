import React, { useEffect, useState } from "react";
import { View, Text, Button } from 'react-native'
import { supabase } from "../config/supabase";

export default function UserProfile() {

    const [username, setUsername] = useState()

    return (
        <View style={{ flex: 1 }}>
            <Text>Page profile</Text>
            <Text>{username}</Text>
            <Button onPress={async () => {

                const { error } = await supabase.auth.signOut()

            }
            } title="Se déconnecter" />
        </View>
    );
}