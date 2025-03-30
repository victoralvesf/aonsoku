import merge from 'lodash/merge'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'
import { languages } from '@/i18n/languages'
import { ILangContext } from '@/types/langContext'

export const useLangStore = createWithEqualityFn<ILangContext>()(
  subscribeWithSelector(
    persist(
      devtools(
        immer((set) => ({
          langCode: '',
          langNativeName: '',
          flag: '',
          setLang: (lang: string) => {
            if (!lang) return

            const langObject = languages.filter(
              (language) => language.langCode === lang,
            )[0]

            set((state) => {
              state.langCode = lang
              state.langNativeName = langObject.nativeName
              state.flag = langObject.flag
            })
          },
        })),
        {
          name: 'lang_store',
        },
      ),
      {
        name: 'lang_store',
        version: 1,
        merge: (persistedState, currentState) => {
          return merge(currentState, persistedState)
        },
      },
    ),
  ),
  shallow,
)

export const useLang = () => useLangStore((state) => state)
