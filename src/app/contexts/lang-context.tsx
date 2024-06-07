import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useTranslation } from 'react-i18next'

import { currentLanguages } from "@/i18n/languages"

interface LangProviderProps {
  children: ReactNode
}

interface LangProviderState {
  langCode: string
  langNativeName: string
  flag: string
  setLang: (lang: string) => void
}

const initialState: LangProviderState = {
  langCode: 'en-US',
  langNativeName: 'English',
  flag: 'US',
  setLang: () => null,
}

const LangContext = createContext<LangProviderState>(initialState)

export function LangProvider({ children }: LangProviderProps) {
  const { i18n } = useTranslation();

  const [langCode, setLangCode] = useState(initialState.langCode)
  const [langNativeName, setLangNativeName] = useState(initialState.langNativeName)
  const [flag, setFlag] = useState(initialState.flag)

  useEffect(() => {
    const lang = i18n.resolvedLanguage
    if (lang) {
      setLangCode(lang)
      const langObject = currentLanguages.filter(language => language.langCode === lang)[0]
      setLangNativeName(langObject.nativeName)
      setFlag(langObject.flag)
    }
  }, [])

  function setLang(lang: string) {
    i18n.changeLanguage(lang)
    setLangCode(lang)
    const langObject = currentLanguages.filter(language => language.langCode === lang)[0]
    setLangNativeName(langObject.nativeName)
    setFlag(langObject.flag)
  }

  const value: LangProviderState = {
    langCode,
    langNativeName,
    flag,
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
