import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "~/locales/fr";

i18next.use(initReactI18next).init({
    fallbackLng: "fr",
    resources: { 
        fr
    },
    defaultNS: "common",
    debug: import.meta.env.DEV,
    interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
    },
});

export default i18next;
