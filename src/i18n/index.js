import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en";
import fa from "./fa";
import it from "./it";
import ar from "./ar";
import zh from "./zh";


const resources = {
  en: {
    translation: en,
  },
  fa: {
    translation: fa,
  },
  it: {
    translation: it,
  },
  ar: {
    translation: ar,
  },
  zh: {
    translation: zh,
  }

};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
    },
  });

export default i18n;
