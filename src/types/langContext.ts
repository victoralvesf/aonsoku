export interface ILangContext {
  langCode: string
  langNativeName: string
  flag: string
  setLang: (lang: string) => void
}
