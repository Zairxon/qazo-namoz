import Modal from './Modal'
import { useStore, setTheme, setLang } from '../lib/store'
import { useT, LANGS } from '../lib/i18n'

// Темы наследуются из variables.css (те же, что в BuildFlow). Точка —
// это акцент темы; фон точки — её базовый фон.
const THEMES = [
  { id: 'dark',      label: 'Botanical',  dot: '#C4933F', bg: '#241E18' },
  { id: 'light',     label: null, labelKey: 'theme.light',     dot: '#D08A52', bg: '#FFF8F0' },
  { id: 'buildflow', label: 'BuildFlow',  dot: '#17838A', bg: '#142631' },
  { id: 'oryzo',     label: 'Oryzo',      dot: '#DC5000', bg: '#382416' },
  { id: 'blueprint', label: 'Blueprint',  dot: '#3B82F6', bg: '#111726' },
  { id: 'fire',      label: 'Fire',       dot: '#FF6B35', bg: '#150C0A' },
  { id: 'terra',     label: 'Terra',      dot: '#79A03E', bg: '#E9EDD9' },
  { id: 'retro',     label: 'Retro',      dot: '#D9A032', bg: '#E8E0CE' },
]

export default function ThemeModal({ onClose }) {
  const theme = useStore(s => s.settings.theme)
  const t = useT()
  return (
    <Modal title={t('settings.title')} onClose={onClose}>
      <div className="fld"><label>{t('lang.title')}</label></div>
      <div className="theme-list">
        {LANGS.map(l => (
          <div key={l.id} className={'theme-item' + (t.lang === l.id ? ' act' : '')} onClick={() => setLang(l.id)}>
            <span className="theme-label">{l.label}</span>
          </div>
        ))}
      </div>

      <div className="fld" style={{ marginTop: 16 }}><label>{t('theme.title')}</label></div>
      <div className="theme-list">
        {THEMES.map(th => (
          <div
            key={th.id}
            className={'theme-item' + (theme === th.id ? ' act' : '')}
            onClick={() => setTheme(th.id)}
          >
            <span className="theme-dot" style={{ background: th.dot, borderColor: th.bg }} />
            <span className="theme-label">{th.labelKey ? t(th.labelKey) : th.label}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}
