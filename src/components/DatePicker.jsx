import { useState } from 'react'
import Icon from './Icon'
import { fmtDate } from '../lib/format'
import { useT } from '../lib/i18n'


const pad = n => String(n).padStart(2, '0')
const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`

// Календарь в стиле приложения вместо системного <input type="date">.
// value/max — ISO 'YYYY-MM-DD'; раскрывается под полем. Тап по «Месяц год» — выбор года.
export default function DatePicker({ value, max, onChange }) {
  const t = useT()
  // Название месяца в именительном падеже с заглавной (ru — отдельный список).
  const MONTHS = t.list('monthsNom') || t.list('months').map(m => m[0].toUpperCase() + m.slice(1))
  const WD = t.list('wdShort')
  const init = value ? new Date(value + 'T00:00:00') : new Date()
  const [open, setOpen] = useState(false)
  const [yearMode, setYearMode] = useState(false)
  const [y, setY] = useState(init.getFullYear())
  const [m, setM] = useState(init.getMonth())

  const maxD = max ? new Date(max + 'T00:00:00') : null
  const maxY = maxD ? maxD.getFullYear() : new Date().getFullYear()

  const toggle = () => {
    if (!open) {
      const d = value ? new Date(value + 'T00:00:00') : new Date()
      setY(d.getFullYear()); setM(d.getMonth()); setYearMode(false)
    }
    setOpen(v => !v)
  }

  const shift = delta => {
    let nm = m + delta, ny = y
    if (nm < 0) { nm = 11; ny-- } else if (nm > 11) { nm = 0; ny++ }
    if (ny > maxY || (maxD && ny === maxY && nm > maxD.getMonth())) return
    setM(nm); setY(ny)
  }

  const first = (new Date(y, m, 1).getDay() + 6) % 7  // понедельник = 0
  const dim = new Date(y, m + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: dim }, (_, i) => i + 1)]
  const todayStr = new Date().toISOString().slice(0, 10)
  const years = Array.from({ length: maxY - 1920 + 1 }, (_, i) => maxY - i)

  const atMax = maxD && y === maxY && m === maxD.getMonth()

  return (
    <div className="dp">
      <button type="button" className={'dp-field' + (open ? ' open' : '')} onClick={toggle}>
        <span className={value ? '' : 'dp-ph'}>{value ? fmtDate(value) : t('dp.pick')}</span>
        <Icon name="calendar" />
      </button>

      {open && (
        <div className="dp-pop">
          <div className="dp-head">
            <button type="button" className="dp-nav" onClick={() => shift(-1)} disabled={yearMode}><Icon name="chevron-left" /></button>
            <button type="button" className="dp-title" onClick={() => setYearMode(v => !v)}>{MONTHS[m]} {y}</button>
            <button type="button" className="dp-nav" onClick={() => shift(1)} disabled={yearMode || atMax}><Icon name="chevron-right" /></button>
          </div>

          {yearMode ? (
            <div className="dp-years">
              {years.map(yr => (
                <button key={yr} type="button" className={'dp-year' + (yr === y ? ' sel' : '')}
                  ref={el => { if (el && yr === y) el.scrollIntoView({ block: 'center' }) }}
                  onClick={() => {
                    setY(yr)
                    if (yr === maxY && maxD && m > maxD.getMonth()) setM(maxD.getMonth())
                    setYearMode(false)
                  }}>{yr}</button>
              ))}
            </div>
          ) : (
            <>
              <div className="dp-grid dp-wd">{WD.map(w => <span key={w}>{w}</span>)}</div>
              <div className="dp-grid dp-days">
                {cells.map((d, i) => {
                  if (!d) return <span key={i} className="dp-empty" />
                  const s = iso(y, m, d)
                  const dis = max && s > max
                  return (
                    <button key={i} type="button" disabled={dis}
                      className={'dp-day' + (s === value ? ' sel' : '') + (s === todayStr ? ' today' : '')}
                      onClick={() => { onChange(s); setOpen(false) }}>{d}</button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
