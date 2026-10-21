import { useEffect } from 'react'
import Icon from './Icon'
import { pushBack } from '../lib/backstack'
import { useT } from '../lib/i18n'

// Универсальная модалка — оверлей + карточка. Закрытие по клику на фон, Esc,
// крестику и аппаратной кнопке «назад» (через backstack). Стили .modal-*.
export default function Modal({ title, onClose, children, footer }) {
  const t = useT()
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    const popBack = pushBack(onClose)  // закрытие по «назад» на телефоне
    return () => { window.removeEventListener('keydown', h); popBack() }
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <div className="modal-head">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose} title={t('close')}><Icon name="x" /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}
