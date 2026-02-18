import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { queries } from '../api'
import { loadTranslationsFromBackend } from '../utils/i18n-loader'

const LANGUAGE_STORAGE_KEY = 'selected_language'

export const useLanguageInitializer = () => {
  const { i18n } = useTranslation()
  const [isLanguageReady, setIsLanguageReady] = useState(false)
  const [selectedLocale, setSelectedLocale] = useState<string | null>(null)

  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)

    if (savedLanguage && savedLanguage !== 'en') {
      if (i18n.hasResourceBundle(savedLanguage, 'translations')) {
        i18n.changeLanguage(savedLanguage).then(() => {
          i18n.reloadResources(savedLanguage, 'translations')
          setIsLanguageReady(true)
        })
      } else {
        setSelectedLocale(savedLanguage)
      }
    } else {
      setIsLanguageReady(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    data: translationData,
    isLoading: isLoadingTranslation,
    isError: isTranslationError,
  } = queries.useGetTranslation(selectedLocale || '', !!selectedLocale)

  useEffect(() => {
    if (!selectedLocale) return

    if (isTranslationError) {
      setIsLanguageReady(true)
      setSelectedLocale(null)
      return
    }

    if (!isLoadingTranslation && translationData?.translation?.translation_json) {
      try {
        loadTranslationsFromBackend(selectedLocale, translationData.translation.translation_json)
        i18n.changeLanguage(selectedLocale).then(() => {
          i18n.reloadResources(selectedLocale, 'translations')
          setIsLanguageReady(true)
          setSelectedLocale(null)
        })
      } catch {
        setIsLanguageReady(true)
        setSelectedLocale(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translationData, selectedLocale, isLoadingTranslation, isTranslationError])

  return isLanguageReady
}
