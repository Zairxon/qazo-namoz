import { useState } from 'react'
import Modal from './Modal'
import Icon from './Icon'
import { PRAYER_MAP, QASR_ELIGIBLE, addEntry } from '../lib/store'

const todayISO = () => new Date().toISOString().slice(0, 10)

// Popup кнопки «+» на карточке намоза: намоз уже выбран (prayer), остаётся
// указать дату и (для 4-ракатных) отметить каср. Записывает qazo namoz.
export default function AddEntryModal({ prayer, onClose }) {
  const p = PRAYER_MAP[prayer]
  const [date, setDate] = useState(todayISO())
  const [qasr, setQasr] = useState(false)
  const qasrOk = QASR_ELIGIBLE.has(prayer)

  const save = () => { addEntry({ prayer, date, qasr: qasr && qasrOk }); onClose() }

  return (
    <Modal
      title={<><Icon name={p.icon} style={{ color: p.color }} /> {p.name} — qazo qo‘shish</>}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Bekor</button>
          <button className="btn btn-primary btn-block" onClick={save}><Icon name="plus" /> Qo‘shish</button>
        </>
      }
    >
      <div className="fld">
        <label>Qachon o‘tkazilgan (sana)</label>
        <input type="date" value={date} max={todayISO()} onChange={e => setDate(e.target.value)} />
      </div>

      <div className={'switch-row' + (qasrOk ? '' : ' disabled')} style={{ '--pc-accent': p.color }} onClick={() => qasrOk && setQasr(v => !v)}>
        <div>
          <div className="switch-label">Qasr namoz</div>
          <div className="switch-hint">{qasrOk ? 'Safarda 2 rakat o‘qiladigan namoz' : 'Bu namoz qasrga qisqarmaydi'}</div>
        </div>
        <button type="button" className={'switch' + (qasr && qasrOk ? ' on' : '')} disabled={!qasrOk} />
      </div>
    </Modal>
  )
}
