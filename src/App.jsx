import { useEffect, useRef, useState } from 'react'
import { App as CapApp } from '@capacitor/app'
import Icon from './components/Icon'
import Dashboard from './pages/Dashboard'
import Journal from './pages/Journal'
import Calculator from './pages/Calculator'
import ThemeModal from './components/ThemeModal'
import { useStore } from './lib/store'
import { fmtLongDate } from './lib/format'
import { handleBack } from './lib/backstack'
import { useT } from './lib/i18n'

const SCREENS = {
  journal: { titleKey: 'screen.journal', icon: 'history' },
  calc: { titleKey: 'screen.calc', icon: 'calculator' },
}

export default function App() {
  const [screen, setScreen] = useState('home')  // 'home' | 'journal' | 'calc'
  const [showTheme, setShowTheme] = useState(false)
  const theme = useStore(s => s.settings.theme)
  const t = useT()

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme) }, [theme])
  useEffect(() => { document.documentElement.lang = { uz: 'uz', uzc: 'uz-Cyrl', ru: 'ru', en: 'en' }[t.lang] }, [t.lang])

  // Аппаратная/жестовая кнопка «назад» на Android: сначала закрыть открытую
  // модалку (backstack), затем вернуться с экрана на главный, и только на
  // главном экране — выйти из приложения. Раньше без обработчика «назад»
  // сразу закрывал всё приложение.
  const screenRef = useRef(screen)
  useEffect(() => { screenRef.current = screen }, [screen])
  useEffect(() => {
    const sub = CapApp.addListener('backButton', () => {
      if (handleBack()) return           // закрыли модалку
      if (screenRef.current !== 'home') { setScreen('home'); return }
      CapApp.exitApp()
    })
    return () => { sub.then(s => s.remove()) }
  }, [])

  const isHome = screen === 'home'
  const meta = SCREENS[screen]

  return (
    <div className="app">
      {isHome ? (
        <header className="home-header">
          <button className="appbar-btn home-palette" title={t('settings.title')} onClick={() => setShowTheme(true)}><Icon name="palette" /></button>
          <div className="home-logo"><img src="/logo.png" alt="Qazo Namoz" /></div>
          <h1 className="home-title">Qazo Namoz</h1>
          <div className="home-date">{fmtLongDate()}</div>
        </header>
      ) : (
        <header className="appbar">
          <button className="appbar-btn" title={t('back')} onClick={() => setScreen('home')}><Icon name="chevron-right" style={{ transform: 'rotate(180deg)' }} /></button>
          <div className="appbar-titles">
            <div className="appbar-title">{t(meta.titleKey)}</div>
            <div className="appbar-sub">Qazo Namoz</div>
          </div>
          <button className="appbar-btn" title={t('settings.title')} onClick={() => setShowTheme(true)}><Icon name="palette" /></button>
        </header>
      )}

      {isHome && <Dashboard onOpenCalc={() => setScreen('calc')} onOpenJournal={() => setScreen('journal')} />}
      {screen === 'journal' && <Journal />}
      {screen === 'calc' && <Calculator />}

      {showTheme && <ThemeModal onClose={() => setShowTheme(false)} />}
    </div>
  )
}
