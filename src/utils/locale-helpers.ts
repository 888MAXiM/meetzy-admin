/**
 * Maps locale code to country code for flag icons
 * @param locale - The locale code (e.g., 'en', 'en-us', 'fr')
 * @returns The country code for the flag icon
 */
export const getCountryCodeFromLocale = (locale: string): string => {
  if (!locale) return 'us'

  // Normalize locale to lowercase
  const normalizedLocale = locale.toLowerCase()

  // Map common locales to country codes
  const localeToCountryMap: Record<string, string> = {
    en: 'us',
    'en-us': 'us',
    'en-gb': 'gb',
    ar: 'sa', // Arabic - Saudi Arabia
    de: 'de',
    es: 'es',
    fr: 'fr',
    'fr-ca': 'ca',
    pt: 'pt',
    'pt-br': 'br',
    cn: 'cn',
    'zh-cn': 'cn',
    'zh-tw': 'tw',
    ae: 'ae',
    it: 'it',
    ja: 'jp',
    ko: 'kr',
    ru: 'ru',
    hi: 'in',
    nl: 'nl',
    pl: 'pl',
    tr: 'tr',
    vi: 'vn',
    th: 'th',
    id: 'id',
    ms: 'my',
    sv: 'se',
    da: 'dk',
    no: 'no',
    fi: 'fi',
    cs: 'cz',
    sk: 'sk',
    hu: 'hu',
    ro: 'ro',
    bg: 'bg',
    hr: 'hr',
    el: 'gr',
    he: 'il',
    fa: 'ir',
    uk: 'ua',
    be: 'by',
    kk: 'kz',
    uz: 'uz',
    az: 'az',
    ka: 'ge',
    hy: 'am',
    et: 'ee',
    lv: 'lv',
    lt: 'lt',
    is: 'is',
    mt: 'mt',
    cy: 'cy',
    ga: 'ie',
    gd: 'gb',
    eu: 'es',
    ca: 'es',
    gl: 'es',
    af: 'za',
    sq: 'al',
    am: 'et',
    as: 'in',
    bn: 'bd',
    bs: 'ba',
    my: 'mm',
    fil: 'ph',
    gu: 'in',
    kn: 'in',
    ml: 'in',
    mr: 'in',
    ne: 'np',
    pa: 'in',
    si: 'lk',
    ta: 'in',
    te: 'in',
    ur: 'pk',
    sw: 'ke',
    zu: 'za',
  }

  // Check exact match first
  if (localeToCountryMap[normalizedLocale]) {
    return localeToCountryMap[normalizedLocale]
  }

  // Check if locale starts with a known prefix (e.g., 'en-' -> 'us')
  const prefix = normalizedLocale.split('-')[0]
  if (localeToCountryMap[prefix]) {
    return localeToCountryMap[prefix]
  }

  // Default fallback
  return normalizedLocale.length === 2 ? normalizedLocale : 'us'
}

