import { useState } from 'react'
import Icon from '../components/Icon'
import PrayerDetailModal from '../components/PrayerDetailModal'
import AddEntryModal from '../components/AddEntryModal'
import {
  useStore, PRAYERS, remainingByPrayer, totalRemaining,
  readEntry, readOneFromCount,
} from '../lib/store'

// «Прочитать один» по намозу: сначала самый ПОСЛЕДНИЙ добавленный отмеченный
// намоз (с датой), а если таких нет — массовый счётчик из калькулятора.
function readOne(state, prayerId) {
  const list = state.entries.filter(e => e.prayer === prayerId)
  if (list.length) {
    const newest = list.reduce((a, b) => (a.createdAt >= b.createdAt ? a : b))
    readEntry(newest.id)
    return
  }
  if ((state.counts[prayerId] || 0) > 0) readOneFromCount(prayerId)
}

export default function Dashboard({ onOpenCalc, onOpenJournal }) {
  const state = useStore()
  const total = totalRemaining(state)
  const readCount = state.journal.length
  const [detail, setDetail] = useState(null)  // id намоза для модалки деталей
  const [addFor, setAddFor] = useState(null)  // id намоза для popup «+»

  return (
    <div className="page">
      {/* Hero: Jami qolgan (→ kalkulyator) / O'qilgan (→ jurnal) */}
      <div className="hero-grid">
        <div className="kpi-card" style={{ '--accent-bar': 'var(--accent)' }} onClick={onOpenCalc}>
          <div className="kpi-top">
            <div className="kpi-ico" style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)' }}><Icon name="pray" /></div>
            <div className="kpi-lbl">Jami qolgan</div>
          </div>
          <div className="kpi-val">{total}</div>
          <div className="kpi-sub"><Icon name="calculator" /> Hisoblagich →</div>
        </div>
        <div className="kpi-card" style={{ '--accent-bar': 'var(--success)' }} onClick={onOpenJournal}>
          <div className="kpi-top">
            <div className="kpi-ico" style={{ background: 'color-mix(in srgb, var(--success) 14%, transparent)', color: 'var(--success)' }}><Icon name="circle-check" /></div>
            <div className="kpi-lbl">O‘qilgan</div>
          </div>
          <div className="kpi-val">{readCount}</div>
          <div className="kpi-sub"><Icon name="history" /> Jurnal →</div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title"><Icon name="mosque" /> Namozlar</h2>
      </div>

      <div className="prayer-grid">
        {PRAYERS.map(p => {
          const rem = remainingByPrayer(state, p.id)
          return (
            <div key={p.id} className="prayer-card" style={{ '--pc-accent': p.color }} onClick={() => setDetail(p.id)}>
              <div className="prayer-card-head">
                <div className="prayer-ico"><Icon name={p.icon} /></div>
                <div className="prayer-names">
                  <div className="prayer-name">{p.name}</div>
                  <div className="prayer-ar">{p.arabic}</div>
                </div>
              </div>
              <div className="prayer-count-row">
                <span className={'prayer-count' + (rem === 0 ? ' zero' : '')}>{rem === 0 ? '✓' : rem}</span>
                <span className="prayer-count-unit">{rem === 0 ? 'qolmadi' : 'qoldi'}</span>
              </div>
              <div className="prayer-actions" onClick={e => e.stopPropagation()}>
                <button className="btn btn-read btn-sm" disabled={rem === 0} onClick={() => readOne(state, p.id)}>
                  <Icon name="check" /> O‘qidim
                </button>
                <button className="icon-btn step" title="Qazo qo‘shish" onClick={() => setAddFor(p.id)}>+</button>
              </div>
            </div>
          )
        })}
      </div>
      <div className="spacer-lg" />

      {detail && <PrayerDetailModal prayer={detail} onClose={() => setDetail(null)} />}
      {addFor && <AddEntryModal prayer={addFor} onClose={() => setAddFor(null)} />}
    </div>
  )
}
