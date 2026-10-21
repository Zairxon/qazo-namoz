import Icon from '../components/Icon'
import { useStore, PRAYER_MAP, undoJournal, deleteJournal } from '../lib/store'
import { fmtTs, fmtDate } from '../lib/format'
import { useT } from '../lib/i18n'

function groupByDay(journal) {
  const groups = new Map()
  for (const j of journal) {
    const key = new Date(j.readAt).toISOString().slice(0, 10)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(j)
  }
  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]))
}

export default function Journal() {
  const journal = useStore(s => s.journal)
  const t = useT()
  const groups = groupByDay(journal)

  return (
    <div className="page">
      {journal.length === 0 ? (
        <div className="empty">
          <Icon name="history" />
          <div className="empty-title">{t('journal.empty')}</div>
          <p>{t('journal.emptyText')}</p>
        </div>
      ) : (
        groups.map(([day, items]) => (
          <div key={day}>
            <div className="jrn-date-head">{fmtDate(day)}</div>
            <div className="entry-list">
              {items.map(j => {
                const p = PRAYER_MAP[j.prayer]
                return (
                  <div key={j.id} className="entry-card" style={{ '--pc-accent': p.color }}>
                    <div className="entry-ico"><Icon name={p.icon} /></div>
                    <div className="entry-main">
                      <div className="entry-title">{t('p.' + p.id)}{j.qasr && <span className="badge badge-qasr">{t('qasr.badge')}</span>}</div>
                      <div className="entry-meta">
                        <Icon name="circle-check" /> {fmtTs(j.readAt)}
                        {j.date && <span>· {fmtDate(j.date)}</span>}
                      </div>
                    </div>
                    <button className="icon-btn" title={t('undo')} onClick={() => undoJournal(j.id)}><Icon name="undo" /></button>
                    <button className="icon-btn danger" title={t('delete')} onClick={() => deleteJournal(j.id)}><Icon name="trash" /></button>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
      <div className="spacer-lg" />
    </div>
  )
}
