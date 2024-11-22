import { CheckBox } from "@rneui/themed";
import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, Pressable } from "react-native";
import CountryFlag from "react-native-country-flag"
import Button from "../../components/Button";
import i18next from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from '@expo/vector-icons/AntDesign';

const options = [
    {
        title: 'french',
        value: 'fr',
        icon:<CountryFlag className="mr-4 rounded" isoCode={'fr'} size={25} />
    },
    {
        title: 'english',
        value: 'en',
        icon:<CountryFlag className="mr-4 rounded" isoCode={'gb'} size={25} />
    },
    {
        title: 'spanish',
        value: 'es',
        icon:<CountryFlag className="mr-4 rounded" isoCode={'es'} size={25} />
    },
]

function ChooseLanguage() {
    const {t} = useTranslation()
    const [selectedLanguage, setSelectedLanguage] = useState(null)

    const changeLanguage = useCallback(async () => {
        await AsyncStorage.setItem("language", selectedLanguage);
        i18next
        .changeLanguage(selectedLanguage)
        .then((t) => {
            t('key');
        });
})
useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("language");
      if (savedLanguage) {
       setSelectedLanguage(savedLanguage)
      }
    };
    loadLanguage();
  }, []);
    return (
        <View style={{ gap: 50, padding: 20 }}>
            {
                options.map(option => {
                    return <Pressable key={option.value} onPress={() => setSelectedLanguage(option.value)} className="flex-row content-center items-center">
                    	{option.icon}
                    	<Text className="mr-3">{t(`language.${option.title}`)}</Text>
                        {selectedLanguage === option.value && <AntDesign name="check" size={24} color="#52563a" />}
                	</Pressable>
                })
            }
            <Button title={t('button.validate')} onPress={() => changeLanguage()} />
        </View>
    );
                
}

export default ChooseLanguage;