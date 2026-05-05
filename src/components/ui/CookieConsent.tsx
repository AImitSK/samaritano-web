'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Settings, X } from 'lucide-react'
import { Button } from './Button'
import {
  type CookiePreferences,
  getConsent,
  setConsent,
  acceptAll,
  acceptNecessaryOnly,
} from '@/lib/cookies'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const existing = getConsent()
    if (!existing) {
      setVisible(true)
    }

    // Erneut öffnen wenn reset Event gefeuert wird (z.B. vom Footer)
    function handleReset() {
      setVisible(true)
      setShowDetails(false)
      setPreferences({ necessary: true, analytics: false, marketing: false })
    }

    window.addEventListener('cookie-consent-reset', handleReset)
    return () => window.removeEventListener('cookie-consent-reset', handleReset)
  }, [])

  function handleAcceptAll() {
    acceptAll()
    setVisible(false)
  }

  function handleAcceptNecessary() {
    acceptNecessaryOnly()
    setVisible(false)
  }

  function handleSaveCustom() {
    setConsent(preferences)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background p-4 shadow-lg sm:p-6"
        >
          <div className="container mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-base font-semibold">Cookie-Einstellungen</h3>
              </div>
              <button
                onClick={handleAcceptNecessary}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Schließen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Beschreibung */}
            <p className="mb-4 text-sm text-muted-foreground">
              Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer
              Website zu bieten. Sie können wählen, welche Kategorien Sie zulassen
              möchten.
            </p>

            {/* Detail-Einstellungen */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mb-4 space-y-3 rounded-lg border border-border bg-muted/50 p-4">
                    {/* Notwendig */}
                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">Notwendig</span>
                        <p className="text-xs text-muted-foreground">
                          Für die Grundfunktionen der Website erforderlich.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked
                        disabled
                        className="h-4 w-4 rounded accent-primary"
                      />
                    </label>

                    {/* Analyse */}
                    <label className="flex cursor-pointer items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">Analyse</span>
                        <p className="text-xs text-muted-foreground">
                          Helfen uns zu verstehen, wie Besucher die Website nutzen.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences((p) => ({ ...p, analytics: e.target.checked }))
                        }
                        className="h-4 w-4 cursor-pointer rounded accent-primary"
                      />
                    </label>

                    {/* Marketing */}
                    <label className="flex cursor-pointer items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">Marketing</span>
                        <p className="text-xs text-muted-foreground">
                          Werden verwendet, um relevante Werbung anzuzeigen.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) =>
                          setPreferences((p) => ({ ...p, marketing: e.target.checked }))
                        }
                        className="h-4 w-4 cursor-pointer rounded accent-primary"
                      />
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={handleAcceptAll} size="sm">
                Alle akzeptieren
              </Button>

              {showDetails ? (
                <Button onClick={handleSaveCustom} variant="secondary" size="sm">
                  Auswahl speichern
                </Button>
              ) : (
                <Button
                  onClick={() => setShowDetails(true)}
                  variant="outline"
                  size="sm"
                >
                  <Settings className="mr-1.5 h-3.5 w-3.5" />
                  Einstellungen
                </Button>
              )}

              <Button onClick={handleAcceptNecessary} variant="ghost" size="sm">
                Nur notwendige
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
