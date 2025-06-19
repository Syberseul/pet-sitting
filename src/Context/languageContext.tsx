import { SAVED_LANGUAGE_PREFERENCE } from "@/util/const";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { enLanguage, zhLanguage } from "./languages";

const resources = {
  en: enLanguage,
  zh: zhLanguage,
} as const;

type Language = keyof typeof resources;
type Translations = (typeof resources)[Language];

interface I18nContextValue {
  t: Translations;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<I18nContextValue | null>(null);

export const LanguageProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguagePreference = localStorage.getItem(
      SAVED_LANGUAGE_PREFERENCE
    );

    if (!savedLanguagePreference) setLanguage("zh");
    else setLanguage(savedLanguagePreference as Language);
  }, []);

  const t: Translations = resources[language];

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useI18n = (): I18nContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useI18n must be used within the LanguageProvider");
  }
  return context;
};
