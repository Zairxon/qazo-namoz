import { useState } from 'react'
import Modal from './Modal'
import Icon from './Icon'
import DatePicker from './DatePicker'
import { useT } from '../lib/i18n'
import { PRAYER_MAP, QASR_ELIGIBLE, addEntry } from '../lib/store'

const todayISO = () => new Date().toISOString().slice(0, 10)

// Popup кнопки «+» на карточке намоза: намоз уже выбран (prayer), остаётся
// указать дату и (для 4-ракатных) отметить каср. Записывает qazo namoz.
export default function AddEntryModal({ prayer, onClose }) {
  const p = PRAYER_MAP[prayer]
  const t = useT()
  const [date, setDate] = useState(todayISO())
  const [qasr, setQasr] = useState(false)
  const qasrOk = QASR_ELIGIBLE.has(prayer)

  const save = () => { addEntry({ prayer, date, qasr: qasr && qasrOk }); onClose() }

  return (
    <Modal
      title={<><Icon name={p.icon} style={{ color: p.color }} /> {t('add.heading', { name: t('p.' + p.id) })}</>}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>{t('cancel')}</button>
          <button className="btn btn-primary btn-block" onClick={save}><Icon name="plus" /> {t('add.btn')}</button>
        </>
      }
    >
      <div className="fld">
        <label>{t('add.date')}</label>
        <DatePicker value={date} max={todayISO()} onChange={setDate} />
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
