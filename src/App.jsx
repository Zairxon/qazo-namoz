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

const SCREENS = {
  journal: { title: 'Jurnal', icon: 'history' },
  calc: { title: 'Qazo hisoblagich', icon: 'calculator' },
}

export default function App() {
  const [screen, setScreen] = useState('home')  // 'home' | 'journal' | 'calc'
  const [showTheme, setShowTheme] = useState(false)
  const theme = useStore(s => s.settings.theme)

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme) }, [theme])

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
          <button className="appbar-btn home-palette" title="Mavzu" onClick={() => setShowTheme(true)}><Icon name="palette" /></button>
          <div className="home-logo"><img src="/logo.png" alt="Qazo Namoz" /></div>
          <h1 className="home-title">Qazo Namoz</h1>
          <div className="home-date">{fmtLongDate()}</div>
        </header>
      ) : (
        <header className="appbar">
          <button className="appbar-btn" title="Orqaga" onClick={() => setScreen('home')}><Icon name="chevron-right" style={{ transform: 'rotate(180deg)' }} /></button>
          <div className="appbar-titles">
            <div className="appbar-title">{meta.title}</div>
            <div className="appbar-sub">Qazo Namoz</div>
          </div>
          <button className="appbar-btn" title="Mavzu" onClick={() => setShowTheme(true)}><Icon name="palette" /></button>
        </header>
      )}

      {isHome && <Dashboard onOpenCalc={() => setScreen('calc')} onOpenJournal={() => setScreen('journal')} />}
      {screen === 'journal' && <Journal />}
      {screen === 'calc' && <Calculator />}

      {showTheme && <ThemeModal onClose={() => setShowTheme(false)} />}
    </div>
  )
}
