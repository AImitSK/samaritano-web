export interface CookiePreferences {
  necessary: true
  analytics: boolean
  marketing: boolean
}

const STORAGE_KEY = 'cookie-consent'

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
}

export function getConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as CookiePreferences
  } catch {
    return null
  }
}

export function setConsent(preferences: CookiePreferences): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  window.dispatchEvent(new CustomEvent('cookie-consent-change', { detail: preferences }))
}

export function hasConsent(): boolean {
  return getConsent() !== null
}

export function acceptAll(): CookiePreferences {
  const prefs: CookiePreferences = { necessary: true, analytics: true, marketing: true }
  setConsent(prefs)
  return prefs
}

export function acceptNecessaryOnly(): CookiePreferences {
  const prefs = { ...defaultPreferences }
  setConsent(prefs)
  return prefs
}

export function resetConsent(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('cookie-consent-reset'))
}
