import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useTranslation } from 'react-i18next'

import { currentLanguages } from "@/i18n/languages"

interface LangProviderProps {
  children: ReactNode
}

interface LangProviderState {
  langCode: string
  langNativeName: string
  setLang: (lang: string) => void
}

const initialState: LangProviderState = {
  langCode: 'en',
  langNativeName: 'English',
  setLang: () => null,
}

const LangContext = createContext<LangProviderState>(initialState)

export function LangProvider({ children }: LangProviderProps) {
  const { i18n } = useTranslation();

  const [langCode, setLangCode] = useState<string>(initialState.langCode)
  const [langNativeName, setLangNativeName] = useState<string>(initialState.langNativeName)

  useEffect(() => {
    const lang = i18n.resolvedLanguage
    if (lang) {
      setLangCode(lang)
      const langKey = lang as keyof typeof currentLanguages
      setLangNativeName(currentLanguages[langKey].nativeName)
    }
  }, [])

  function setLang(lang: string) {
    i18n.changeLanguage(lang)
    setLangCode(lang)
    const langKey = lang as keyof typeof currentLanguages
    setLangNativeName(currentLanguages[langKey].nativeName)
  }

  const value: LangProviderState = {
    langCode,
    langNativeName,
    setLang
  }

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => {
  const context = useContext(LangContext)

  if (context === undefined)
    throw new Error("useLang must be used within a LangProvider")

  return context
}
