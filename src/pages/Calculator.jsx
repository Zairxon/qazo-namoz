import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import DatePicker from '../components/DatePicker'
import { PRAYERS, addCounts } from '../lib/store'
import { daysBetween, fmtDate, fmtNum } from '../lib/format'
import { useT, rich } from '../lib/i18n'

const todayISO = () => new Date().toISOString().slice(0, 10)

function addYears(iso, years) {
  if (!iso || !years) return ''
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return ''
  d.setFullYear(d.getFullYear() + Number(years))
  return d.toISOString().slice(0, 10)
}

// Калькулятор qazo по датам: дни между балоғат и началом регулярного намаза;
// каждый пропущенный день = по одному каждого из 5 намозов + Vitr.
export default function Calculator() {
  const t = useT()
  const [birth, setBirth] = useState('')
  const [baligh, setBaligh] = useState(12)
  const [start, setStart] = useState('')
  const [added, setAdded] = useState(false)

  const obligation = useMemo(() => addYears(birth, baligh), [birth, baligh])
  const days = useMemo(() => daysBetween(obligation, start), [obligation, start])
  const perPrayer = days
  const total = perPrayer * PRAYERS.length

  const apply = () => {
    if (days <= 0) return
    addCounts(Object.fromEntries(PRAYERS.map(p => [p.id, perPrayer])))
    setAdded(true)
  }

  return (
    <div className="page">
      <div className="info-card">
        <Icon name="info" />
        <span>{rich(t('calc.info'))}</span>
      </div>

      <div className="fld">
        <label>{t('calc.birth')}</label>
        <DatePicker value={birth} max={todayISO()} onChange={v => { setBirth(v); setAdded(false) }} />
      </div>

      <div className="fld">
        <label>{t('calc.baligh')}</label>
        <input type="number" min="7" max="20" value={baligh} onChange={e => { setBaligh(e.target.value); setAdded(false) }} />
      </div>

      <div className="info-card" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <Icon name="calendar" />
        <span>{obligation ? rich(t('calc.obligation', { d: fmtDate(obligation) })) : <>{t('calc.obligation', { d: '' }).split('<b>')[0]}<b>{t('calc.obligationEmpty')}</b></>}</span>
      </div>

      <div className="fld">
        <label>{t('calc.start')}</label>
        <DatePicker value={start} max={todayISO()} onChange={v => { setStart(v); setAdded(false) }} />
      </div>

      {days > 0 && (
        <>
          <div className="info-card" style={{ marginTop: 4 }}>
            <Icon name="clock" />
            <span>{rich(t('calc.period', { n: fmtNum(days), y: (days / 365.25).toFixed(1) }))}</span>
          </div>

          <div className="calc-result">
            {PRAYERS.map(p => (
              <div key={p.id} className="calc-row" style={{ '--pc-accent': p.color }}>
                <div className="prayer-ico"><Icon name={p.icon} /></div>
                <div className="calc-row-name">{t('p.' + p.id)} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>· {t('pa.' + p.id)}</span></div>
                <div className="calc-row-val" style={{ color: p.color }}>{fmtNum(perPrayer)}</div>
              </div>
            ))}
            <div className="calc-total">
              <span>{t('calc.total')}</span>
              <span className="calc-total-val">{fmtNum(total)}</span>
            </div>
          </div>

          <div className="spacer-lg" />
          {added ? (
            <div className="btn btn-read btn-block" style={{ cursor: 'default' }}><Icon name="circle-check" /> {t('calc.added')}</div>
          ) : (
            <button className="btn btn-primary btn-block" onClick={apply}><Icon name="plus" /> {t('calc.apply')}</button>
          )}
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
            {t('calc.note')}
          </p>
        </>
      )}
      <div className="spacer-lg" />
    </div>
  )
}
