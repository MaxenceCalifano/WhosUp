import { CheckBox } from "@rneui/themed";
import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";
import { UserContext } from "../../UserContext";
import CountryFlag from "react-native-country-flag"
import Button from "../../components/Button";

const options = [
    {
        title: 'french',
        value: 'fr',
        icon:''
    },
    {
        title: 'english',
        value: 'gb',
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
    const { userLanguage } = useContext(UserContext)
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
                    	<CountryFlag className="mr-4" isoCode={option.value} size={25} />
                    	<Text>{t(`language.${option.title}`)}</Text>
                	</View>
                })
            }
            <Button title={t('button.validate')} onPress={() => console.log('test')} />
        </View>
    );
}

export default ChooseLanguage;