import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { queries } from '../../../api'
import { loadTranslationsFromBackend } from '../../../utils/i18n-loader'
import type { ChangeLngType } from '../../../types/layout'
import type { SingleLanguage } from '../../../types/api'
import { toaster } from '../../../utils/custom-functions'
import { ImageBaseUrl } from '../../../constants'
import { Image } from '../../../shared/image'

const LANGUAGE_STORAGE_KEY = 'selected_language'

const Language = () => {
  const { i18n, t } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage || 'en'

  const [dropdownShow, setDropdownShow] = useState(false)
  const [selectedLocale, setSelectedLocale] = useState<string | null>(null)
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false)
  const [isInitialMount, setIsInitialMount] = useState(true)

  const { data: languagesData, isLoading: isLoadingLanguages } = queries.useGetLanguages({
    page: 1,
    limit: 100,
  })

  const { data: settingsData } = queries.useGetSettings()

  const {
    data: translationData,
    isLoading: isLoadingTranslationData,
    isError: isTranslationError,
    error: translationError,
  } = queries.useGetTranslation(selectedLocale || '', !!selectedLocale)

  const availableLanguages = useMemo<ChangeLngType[]>(() => {
    if (!languagesData?.data?.pages) return []

    return languagesData.data.pages
      .filter((lang: SingleLanguage) => lang.is_active)
      .map((lang: SingleLanguage) => {
        const isEmoji = lang.flag && typeof lang.flag === 'string' && /[\u{1F1E6}-\u{1F1FF}]{2}/u.test(lang.flag)
        const flagUrl = lang.flag
          ? isEmoji
            ? null
            : lang.flag.startsWith('http')
            ? lang.flag
            : `${ImageBaseUrl}${lang.flag}`
          : null

        return {
          data: lang.locale,
          language: lang.name,
          countryCode: '',
          flagUrl,
          flagEmoji: isEmoji ? lang.flag : null,
        }
      })
  }, [languagesData])

  const currentLanguageInfo = useMemo(() => {
    const found = availableLanguages.find((lang) => lang.data === currentLanguage)
    if (found) return found

    return {
      data: currentLanguage,
      language: currentLanguage.toUpperCase(),
      countryCode: '',
      flagUrl: null,
      flagEmoji: null,
    }
  }, [availableLanguages, currentLanguage])

  const changeLanguageAndSave = useCallback(
    async (locale: string, showNotification = true) => {
      try {
        if (i18n.resolvedLanguage === locale) return

        await i18n.changeLanguage(locale)
        localStorage.setItem(LANGUAGE_STORAGE_KEY, locale)
        await i18n.reloadResources(locale, 'translations')

        if (showNotification && !isInitialMount) {
          const languageName = availableLanguages.find((l) => l.data === locale)?.language || locale
          toaster('success', `Language changed to ${languageName}`)
        }
      } catch {
        toaster('error', 'Failed to change language')
      }
    },
    [i18n, isInitialMount, availableLanguages],
  )

  useEffect(() => {
    setTimeout(() => setIsInitialMount(false), 1000)
  }, [])

  useEffect(() => {
    if (isLoadingLanguages || !languagesData?.data?.pages || !settingsData?.settings) return

    const currentLanguageExists = languagesData.data.pages.some(
      (lang: SingleLanguage) => lang.locale === currentLanguage,
    )

    const isCurrentLanguageActive = languagesData.data.pages.some(
      (lang: SingleLanguage) => lang.locale === currentLanguage && lang.is_active,
    )

    const defaultLanguage = settingsData.settings.default_language || 'en'

    if (!currentLanguageExists) {
      const defaultLangExists = languagesData.data.pages.some(
        (lang: SingleLanguage) => lang.locale === defaultLanguage && lang.is_active,
      )

      if (defaultLangExists) {
        changeLanguageAndSave(defaultLanguage, false)
        toaster('warn', `The selected language has been deleted. Switched to default language (${defaultLanguage.toUpperCase()}).`)
      } else {
        const firstActiveLanguage = languagesData.data.pages.find(
          (lang: SingleLanguage) => lang.is_active,
        )
        if (firstActiveLanguage) {
          changeLanguageAndSave(firstActiveLanguage.locale, false)
          toaster('warn', `The selected language has been deleted. Switched to ${firstActiveLanguage.locale.toUpperCase()}.`)
        } else {
          if (currentLanguage !== 'en') {
            changeLanguageAndSave('en', false)
            toaster('warn', 'The selected language has been deleted. Switched to English.')
          }
        }
      }
    } else if (!isCurrentLanguageActive) {
      if (currentLanguage === defaultLanguage) {
        const firstActiveLanguage = languagesData.data.pages.find(
          (lang: SingleLanguage) => lang.is_active && lang.locale !== defaultLanguage,
        )
        if (firstActiveLanguage) {
          changeLanguageAndSave(firstActiveLanguage.locale, false)
          toaster('warn', `The default language has been deactivated. Switched to ${firstActiveLanguage.locale.toUpperCase()}.`)
        }
      } else {
        const defaultLangExists = languagesData.data.pages.some(
          (lang: SingleLanguage) => lang.locale === defaultLanguage && lang.is_active,
        )

        if (defaultLangExists) {
          changeLanguageAndSave(defaultLanguage, false)
          toaster('warn', `The selected language has been deactivated. Switched to default language (${defaultLanguage.toUpperCase()}).`)
        } else {
          const firstActiveLanguage = languagesData.data.pages.find(
            (lang: SingleLanguage) => lang.is_active,
          )
          if (firstActiveLanguage) {
            changeLanguageAndSave(firstActiveLanguage.locale, false)
            toaster('warn', `The selected language has been deactivated. Switched to ${firstActiveLanguage.locale.toUpperCase()}.`)
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languagesData, currentLanguage, isLoadingLanguages, settingsData])

  useEffect(() => {
    if (isTranslationError && selectedLocale) {
      toaster('error', translationError?.message || 'Failed to load translations. Please try again later.')
      setSelectedLocale(null)
      setIsLoadingTranslation(false)
    }
  }, [isTranslationError, translationError, selectedLocale])

  useEffect(() => {
    if (!selectedLocale || isTranslationError || isLoadingTranslationData || !translationData) return

    const translationJson = translationData.translation?.translation_json
    if (!translationJson) {
      toaster('error', 'Translation data not found')
      setSelectedLocale(null)
      setIsLoadingTranslation(false)
      return
    }

    try {
      loadTranslationsFromBackend(selectedLocale, translationJson)

      if (i18n.hasResourceBundle(selectedLocale, 'translations')) {
        changeLanguageAndSave(selectedLocale).finally(() => {
          setSelectedLocale(null)
          setIsLoadingTranslation(false)
        })
      } else {
        toaster('error', 'Failed to load translations')
        setSelectedLocale(null)
        setIsLoadingTranslation(false)
      }
    } catch {
      toaster('error', 'Failed to load translations')
      setSelectedLocale(null)
      setIsLoadingTranslation(false)
    }
  }, [translationData, selectedLocale, isTranslationError, isLoadingTranslationData, i18n, changeLanguageAndSave])

  const changeLng = (item: ChangeLngType) => {
    if (item.data === currentLanguage) {
      setDropdownShow(false)
      return
    }

    const hasTranslation = i18n.hasResourceBundle(item.data, 'translations') || item.data === 'en'

    if (hasTranslation) {
      changeLanguageAndSave(item.data)
      setDropdownShow(false)
    } else {
      setIsLoadingTranslation(true)
      setSelectedLocale(item.data)
      setDropdownShow(false)
    }
  }

  const isLoading = isLoadingTranslation || isLoadingTranslationData

  return (
    <>
      {availableLanguages.length !== 0 && (
        <li className="language-nav">
          <div className={`translate_wrapper ${dropdownShow ? 'active' : ''}`}>
            <div className="current_lang">
              <div className="lang" onClick={() => setDropdownShow((prev) => !prev)}>
                {currentLanguageInfo.flagEmoji ? (
                  <span className="me-1" style={{ fontSize: '1.2rem' }}>{currentLanguageInfo.flagEmoji}</span>
                ) : currentLanguageInfo.flagUrl ? (
                  <Image
                    src={currentLanguageInfo.flagUrl}
                    alt={currentLanguageInfo.language}
                    className="flag-image me-1"
                  />
                ) : (
                  <i className="flag-icon flag-icon-us"></i>
                )}
                <span className="lang-txt">
                  {currentLanguageInfo.data?.toUpperCase() || currentLanguage?.toUpperCase()}
                  {isLoading && <span className="ms-1">...</span>}
                </span>
              </div>
            </div>

            <div className={`more_lang ${dropdownShow ? 'active' : ''}`}>
              {isLoadingLanguages ? (
                <div className="lang">
                  <span className="lang-txt">Loading languages...</span>
                </div>
              ) : availableLanguages.length === 0 ? (
                <div className="lang">
                  <span className="lang-txt">No languages available</span>
                </div>
              ) : (
                availableLanguages.map((item, index) => (
                  <div
                    key={`${item.data}-${index}`}
                    className={`lang ${currentLanguage === item.data ? 'selected' : ''} ${
                      isLoading && selectedLocale === item.data ? 'loading' : ''
                    }`}
                    onClick={() => !isLoading && changeLng(item)}
                  >
                    {item.flagEmoji ? (
                      <span className="me-2" style={{ fontSize: '1.2rem' }}>{item.flagEmoji}</span>
                    ) : item.flagUrl ? (
                      <Image src={item.flagUrl} alt={item.language} className="flag-image me-2" />
                    ) : (
                      <i className="flag-icon flag-icon-us"></i>
                    )}
                    <span className="lang-txt">
                      {item.language}
                      {item.subtitle && <span> {item.subtitle}</span>}
                      {isLoading && selectedLocale === item.data && <span className="ms-1">...</span>}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </li>
      )}
    </>
  )
}

export default Language
