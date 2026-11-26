import { useState } from 'react'
import Modal from './Modal'
import Icon from './Icon'
import DatePicker from './DatePicker'
import { useT } from '../lib/i18n'
import { useStore, PRAYER_MAP, QASR_ELIGIBLE, addEntry, hasEntryOn } from '../lib/store'

const todayISO = () => new Date().toISOString().slice(0, 10)

// Popup кнопки «+» на карточке намоза: намоз уже выбран (prayer), остаётся
// указать дату и (для 4-ракатных) отметить каср. Записывает qazo namoz.
export default function AddEntryModal({ prayer, onClose }) {
  const p = PRAYER_MAP[prayer]
  const t = useT()
  const [date, setDate] = useState(todayISO())
  const [qasr, setQasr] = useState(false)
  const qasrOk = QASR_ELIGIBLE.has(prayer)
  // Повтор: этот намаз за выбранную дату уже добавлен — предупреждаем и не даём сохранить.
  const dup = useStore(s => hasEntryOn(s, prayer, date))

  const save = () => { if (!dup && addEntry({ prayer, date, qasr: qasr && qasrOk })) onClose() }

  return (
    <Modal
      title={<><Icon name={p.icon} style={{ color: p.color }} /> {t('add.heading', { name: t('p.' + p.id) })}</>}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>{t('cancel')}</button>
          <button className="btn btn-primary btn-block" onClick={save} disabled={dup}><Icon name="plus" /> {t('add.btn')}</button>
        </>
      }
    >
      <div className="fld">
        <label>{t('add.date')}</label>
        <DatePicker value={date} max={todayISO()} onChange={setDate} />
        {dup && <div className="fld-error"><Icon name="info" /> {t('add.dup', { name: t('p.' + p.id) })}</div>}
      </div>

      <div className={'switch-row' + (qasrOk ? '' : ' disabled')} style={{ '--pc-accent': p.color }} onClick={() => qasrOk && setQasr(v => !v)}>
        <div>
          <div className="switch-label">{t('qasr')}</div>
          <div className="switch-hint">{qasrOk ? t('qasr.ok') : t('qasr.no')}</div>
        </div>
        <button type="button" className={'switch' + (qasr && qasrOk ? ' on' : '')} disabled={!qasrOk} />
      </div>
    </Modal>
  )
}
