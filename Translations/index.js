import * as resources from "./resources";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");

  if (!savedLanguage) {
    savedLanguage = getLocales()[0].languageCode;
    await AsyncStorage.setItem("language", savedLanguage);
  }
  console.log("🚀 ~ initI18n ~ savedLanguage:", savedLanguage);
  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources: {
      ...Object.entries(resources).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: {
            translation: value,
          },
        }),
        {}
      ),
    },
    lng: savedLanguage,
    fallBackLng: "en",
  });
};

initI18n();

export default i18n;
