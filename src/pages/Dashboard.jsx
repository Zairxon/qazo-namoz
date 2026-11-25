import { useState } from 'react'
import Icon from '../components/Icon'
import PrayerDetailModal from '../components/PrayerDetailModal'
import AddEntryModal from '../components/AddEntryModal'
import { useT } from '../lib/i18n'
import { fmtDate } from '../lib/format'
import {
  useStore, PRAYERS, PRAYER_MAP, remainingByPrayer, totalRemaining,
  readEntry, readOneFromCount,
} from '../lib/store'

// Порядок намозов внутри дня: Бомдод → … → Хуфтон (для сортировки «последние сверху»).
const ORDER = Object.fromEntries(['fajr', 'zuhr', 'asr', 'maghrib', 'isha', 'vitr'].map((id, i) => [id, i]))

// Список каза: сверху самые поздние даты, внутри дня — Хуфтон, Шом, Аср, Пешин, Бомдод.
function sortEntries(entries) {
  return [...entries].sort((a, b) =>
    b.date.localeCompare(a.date) || (ORDER[b.prayer] - ORDER[a.prayer]) || (b.createdAt - a.createdAt))
}

// «Прочитал» на карточке намоза = самый верхний в списке каза этого намоза
// (самая поздняя дата); если отмеченных нет — массовый счётчик из калькулятора.
function readOne(state, prayerId) {
  const list = sortEntries(state.entries.filter(e => e.prayer === prayerId))
  if (list.length) { readEntry(list[0].id); return }
  if ((state.counts[prayerId] || 0) > 0) readOneFromCount(prayerId)
}

export default function Dashboard({ onOpenCalc, onOpenJournal }) {
  const state = useStore()
  const t = useT()
  const total = totalRemaining(state)
  const readCount = state.journal.length
  const [detail, setDetail] = useState(null)  // id намоза для модалки деталей
  const [addFor, setAddFor] = useState(null)  // id намоза для popup «+»
  const sorted = sortEntries(state.entries)
  // Массовый счёт из калькулятора (без дат) — внизу списка, Хуфтон → Бомдод.
  const bulk = [...PRAYERS].reverse().filter(p => (state.counts[p.id] || 0) > 0)

  return (
    <div className="page">
      {/* Hero: Jami qolgan (→ kalkulyator) / O'qilgan (→ jurnal) */}
      <div className="hero-grid">
        <div className="kpi-card" style={{ '--accent-bar': 'var(--accent)' }} onClick={onOpenCalc}>
          <div className="kpi-top">
            <div className="kpi-ico" style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)' }}><Icon name="pray" /></div>
            <div className="kpi-lbl">{t('kpi.total')}</div>
          </div>
          <div className="kpi-val">{total}</div>
          <div className="kpi-sub"><Icon name="calculator" /> {t('kpi.calc')}</div>
        </div>
        <div className="kpi-card" style={{ '--accent-bar': 'var(--success)' }} onClick={onOpenJournal}>
          <div className="kpi-top">
            <div className="kpi-ico" style={{ background: 'color-mix(in srgb, var(--success) 14%, transparent)', color: 'var(--success)' }}><Icon name="circle-check" /></div>
            <div className="kpi-lbl">{t('kpi.read')}</div>
          </div>
          <div className="kpi-val">{readCount}</div>
          <div className="kpi-sub"><Icon name="history" /> {t('kpi.journal')}</div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title"><Icon name="mosque" /> {t('prayers.title')}</h2>
      </div>

      <div className="prayer-grid">
        {PRAYERS.map(p => {
          const rem = remainingByPrayer(state, p.id)
          return (
            <div key={p.id} className="prayer-card" style={{ '--pc-accent': p.color }} onClick={() => setDetail(p.id)}>
              <div className="prayer-card-head">
                <div className="prayer-ico"><Icon name={p.icon} /></div>
                <div className="prayer-names">
                  <div className="prayer-name">{t('p.' + p.id)}</div>
                  <div className="prayer-ar">{t('pa.' + p.id)}</div>
                </div>
              </div>
              <div className="prayer-count-row">
                <span className={'prayer-count' + (rem === 0 ? ' zero' : '')}>{rem === 0 ? '✓' : rem}</span>
                <span className="prayer-count-unit">{rem === 0 ? t('none') : t('left')}</span>
              </div>
              <div className="prayer-actions" onClick={e => e.stopPropagation()}>
                <button className="btn btn-read btn-sm" disabled={rem === 0} onClick={() => readOne(state, p.id)}>
                  <Icon name="check" /> {t('read')}
                </button>
                <button className="icon-btn step" title={t('add.title')} onClick={() => setAddFor(p.id)}>+</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Список каза: что и за какие даты пропущено; «Ўқидим» убирает запись из списка */}
      <div className="section-header">
        <h2 className="section-title"><Icon name="calendar" /> {t('list.title')}</h2>
      </div>
      <div className="entry-list qlist">
        {sorted.map(e => {
          const p = PRAYER_MAP[e.prayer]
          return (
            <div key={e.id} className="entry-card" style={{ '--pc-accent': p.color }}>
              <div className="entry-ico"><Icon name={p.icon} /></div>
              <div className="entry-main">
                <div className="entry-title">{t('p.' + p.id)}{e.qasr && <span className="badge badge-qasr">{t('qasr.badge')}</span>}</div>
                <div className="entry-meta"><Icon name="clock" /> {fmtDate(e.date)}</div>
              </div>
              <button className="btn btn-read btn-sm" onClick={() => readEntry(e.id)}><Icon name="check" /> {t('read')}</button>
            </div>
          )
        })}
        {bulk.map(p => (
          <div key={'bulk-' + p.id} className="entry-card" style={{ '--pc-accent': p.color }}>
            <div className="entry-ico"><Icon name={p.icon} /></div>
            <div className="entry-main">
              <div className="entry-title">{t('p.' + p.id)} <span className="qlist-count">× {state.counts[p.id]}</span></div>
              <div className="entry-meta"><Icon name="calculator" /> {t('list.undated')}</div>
            </div>
            <button className="btn btn-read btn-sm" onClick={() => readOneFromCount(p.id)}><Icon name="check" /> {t('read')}</button>
          </div>
        ))}
        {sorted.length === 0 && bulk.length === 0 && (
          <div className="empty"><Icon name="calendar" /><div className="empty-title">{t('list.empty')}</div></div>
        )}
      </div>
      <div className="spacer-lg" />

      {detail && <PrayerDetailModal prayer={detail} onClose={() => setDetail(null)} />}
      {addFor && <AddEntryModal prayer={addFor} onClose={() => setAddFor(null)} />}
    </div>
  )
}
