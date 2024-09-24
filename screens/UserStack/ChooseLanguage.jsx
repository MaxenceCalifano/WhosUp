import { CheckBox } from "@rneui/themed";
import { useState, useContext, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";
import { UserContext } from "../../UserContext";
import CountryFlag from "react-native-country-flag"
import Button from "../../components/Button";
import i18next from "i18next";
const options = [
    {
        title: 'french',
        value: 'fr',
        icon:<CountryFlag className="mr-4" isoCode={'fr'} size={25} />
    },
    {
        title: 'english',
        value: 'en',
        icon:<CountryFlag className="mr-4" isoCode={'gb'} size={25} />
    },
    {
        title: 'spanish',
        value: 'es',
        icon:<CountryFlag className="mr-4" isoCode={'es'} size={25} />
    },
]

function ChooseLanguage() {
    const {t} = useTranslation()
    const [selectedLanguage, setSelectedLanguage] = useState(userLanguage)
    const { userLanguage, setUserLanguage } = useContext(UserContext)
    const changeLanguage = useCallback(() => {
        i18next
        .changeLanguage(selectedLanguage)
        .then((t) => {
            t('key');
            setUserLanguage(selectedLanguage)
        });
})
    useEffect(() => setSelectedLanguage(userLanguage),[])
    return (
        <View style={{ gap: 50, padding: 20 }}>
            {
                options.map(option => {
                    return <View className="flex-row content-center items-center">
                    	<CheckBox key={option.value} iconType="material-community"
                    	onPress={() => setSelectedLanguage(option.value)}
                    	checkedIcon="checkbox-outline"
                    	uncheckedIcon={'checkbox-blank-outline'}
                    	checked={option.value === selectedLanguage}
                    	checkedColor="grey"
                    	/>
                    	{option.icon}
                    	<Text>{t(`language.${option.title}`)}</Text>
                	</View>
                })
            }
            <Button title={t('button.validate')} onPress={() => changeLanguage()} />
        </View>
    );
}

export default ChooseLanguage;