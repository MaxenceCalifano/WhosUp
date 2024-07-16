import { CheckBox } from "@rneui/themed";
import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { UserContext } from "../../UserContext";

const options = [
    {
        title: 'french',
        value: 'fr',
        icon:''
    },
    {
        title: 'english',
        value: 'en',
        icon:''
    },
    {
        title: 'spanish',
        value: 'es',
        icon:''
    },
]

function ChooseLanguage() {
    const {t} = useTranslation()
    const [selectedLanguage, setSelectedLanguage] = useState(userLanguage)
    console.log("🚀 ~ ChooseLanguage ~ selectedLanguage:", selectedLanguage)
    const { userLanguage } = useContext(UserContext)
    useEffect(() => setSelectedLanguage(userLanguage),[])
    return (
        <View style={{ gap: 50, padding: 20 }}>
            {
                options.map(option => <CheckBox key={option.value} iconType="material-community"
                onPress={() => setSelectedLanguage(option.value)}
                checkedIcon="checkbox-outline"
                uncheckedIcon={'checkbox-blank-outline'} 
                checked={option.value === selectedLanguage} 
                title={t(`language.${option.title}`)}
                checkedColor="grey" />)
            }
        </View>
    );
}

export default ChooseLanguage;