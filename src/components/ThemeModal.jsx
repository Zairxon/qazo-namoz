import Modal from './Modal'
import { useStore, setTheme } from '../lib/store'

// Темы наследуются из variables.css (те же, что в BuildFlow). Точка —
// это акцент темы; фон точки — её базовый фон.
const THEMES = [
  { id: 'dark',      label: 'Botanical',  dot: '#C4933F', bg: '#241E18' },
  { id: 'light',     label: 'Yorug‘',     dot: '#D08A52', bg: '#FFF8F0' },
  { id: 'buildflow', label: 'BuildFlow',  dot: '#17838A', bg: '#142631' },
  { id: 'oryzo',     label: 'Oryzo',      dot: '#DC5000', bg: '#382416' },
  { id: 'blueprint', label: 'Blueprint',  dot: '#3B82F6', bg: '#111726' },
  { id: 'fire',      label: 'Fire',       dot: '#FF6B35', bg: '#150C0A' },
  { id: 'terra',     label: 'Terra',      dot: '#79A03E', bg: '#E9EDD9' },
  { id: 'retro',     label: 'Retro',      dot: '#D9A032', bg: '#E8E0CE' },
]

export default function ThemeModal({ onClose }) {
  const theme = useStore(s => s.settings.theme)
  return (
    <Modal title="Mavzu (tema)" onClose={onClose}>
      <div className="theme-list">
        {THEMES.map(t => (
          <div
            key={t.id}
            className={'theme-item' + (theme === t.id ? ' act' : '')}
            onClick={() => setTheme(t.id)}
          >
            <span className="theme-dot" style={{ background: t.dot, borderColor: t.bg }} />
            <span className="theme-label">{t.label}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}
