import { useState } from 'react'
import Modal from './Modal'
import Icon from './Icon'
import AddEntryModal from './AddEntryModal'
import { useStore, PRAYER_MAP, remainingByPrayer, readEntry, readOneFromCount, adjustCount } from '../lib/store'
import { fmtDate } from '../lib/format'
import { useT, rich } from '../lib/i18n'

// Детали намоза: массовый счётчик (из калькулятора) + список отмеченных
// намозов с датами. Здесь можно прочитать/удалить конкретную дату и добавить.
export default function PrayerDetailModal({ prayer, onClose }) {
  const state = useStore()
  const t = useT()
  const p = PRAYER_MAP[prayer]
  const [showAdd, setShowAdd] = useState(false)
  const entries = state.entries.filter(e => e.prayer === prayer)
  const bulk = state.counts[prayer] || 0
  const total = remainingByPrayer(state, prayer)

  return (
    <>
      <Modal
        title={<><Icon name={p.icon} style={{ color: p.color }} /> {t('p.' + p.id)} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 'var(--text-xs)' }}>· {t('pa.' + p.id)}</span></>}
        onClose={onClose}
        footer={<button className="btn btn-primary btn-block" onClick={() => setShowAdd(true)}><Icon name="plus" /> {t('add.title')}</button>}
      >
        <div className="info-card" style={{ '--pc-accent': p.color }}>
          <Icon name="pray" />
          <span>{rich(t('detail.total', { total }))}{bulk > 0 && rich(t('detail.bulk', { bulk }))}</span>
        </div>

        {/* Массовый счётчик из калькулятора — регулировать/читать по одному */}
        {bulk > 0 && (
          <div className="calc-count-card" style={{ '--pc-accent': p.color }}>
            <div className="ccc-head">
              <div className="entry-ico"><Icon name="calculator" /></div>
              <div className="entry-main">
                <div className="entry-title">{t('detail.calcTitle')}</div>
                <div className="entry-meta">{t('detail.calcSub')}</div>
              </div>
              <button className="btn btn-read btn-sm" onClick={() => readOneFromCount(prayer)}><Icon name="check" /> {t('read')}</button>
            </div>
            <div className="stepper">
              <button className="icon-btn step" title="−1" onClick={() => adjustCount(prayer, -1)}>−</button>
              <span className="stepper-val">{bulk}</span>
              <button className="icon-btn step" title="+1" onClick={() => adjustCount(prayer, 1)}>+</button>
            </div>
          </div>
        )}

        {entries.length === 0 && bulk === 0 ? (
          <div className="empty">
            <Icon name="calendar" />
            <div className="empty-title">{t('empty.title')}</div>
            <p>{t('empty.text')}</p>
          </div>
        ) : (
          <div className="entry-list">
            {entries.map(e => (
              <div key={e.id} className="entry-card" style={{ '--pc-accent': p.color }}>
                <div className="entry-ico"><Icon name={p.icon} /></div>
                <div className="entry-main">
                  <div className="entry-title">{t('p.' + p.id)}{e.qasr && <span className="badge badge-qasr">{t('qasr.badge')}</span>}</div>
                  <div className="entry-meta"><Icon name="clock" /> {fmtDate(e.date)}</div>
                </div>
                <button className="btn btn-read btn-sm" onClick={() => readEntry(e.id)}><Icon name="check" /> {t('read')}</button>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {showAdd && <AddEntryModal prayer={prayer} onClose={() => setShowAdd(false)} />}
    </>
  )
}
