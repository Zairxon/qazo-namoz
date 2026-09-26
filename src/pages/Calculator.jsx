import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { PRAYERS, addCounts } from '../lib/store'
import { daysBetween, fmtDate, fmtNum } from '../lib/format'

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
        <span>Namoz <b>balog‘at</b>dan farz bo‘ladi. Balog‘at bilan namozni doimiy boshlagan kun orasidagi har bir kun uchun — 5 vaqt namoz va <b>Vitr</b> qazo bo‘ladi.</span>
      </div>

      <div className="fld">
        <label>Tug‘ilgan sana</label>
        <input type="date" value={birth} max={todayISO()} onChange={e => { setBirth(e.target.value); setAdded(false) }} />
      </div>

      <div className="fld">
        <label>Balog‘at yoshi (odatda 12–15)</label>
        <input type="number" min="7" max="20" value={baligh} onChange={e => { setBaligh(e.target.value); setAdded(false) }} />
      </div>

      <div className="info-card" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <Icon name="calendar" />
        <span>Namoz farz bo‘lgan sana: <b>{obligation ? fmtDate(obligation) : '— tug‘ilgan sanani kiriting'}</b></span>
      </div>

      <div className="fld">
        <label>Namozni doimiy boshlagan sana</label>
        <input type="date" value={start} max={todayISO()} onChange={e => { setStart(e.target.value); setAdded(false) }} />
      </div>

      {days > 0 && (
        <>
          <div className="info-card" style={{ marginTop: 4 }}>
            <Icon name="clock" />
            <span>O‘tkazilgan davr: <b>{fmtNum(days)} kun</b> (≈ {(days / 365.25).toFixed(1)} yil)</span>
          </div>

          <div className="calc-result">
            {PRAYERS.map(p => (
              <div key={p.id} className="calc-row" style={{ '--pc-accent': p.color }}>
                <div className="prayer-ico"><Icon name={p.icon} /></div>
                <div className="calc-row-name">{p.name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>· {p.arabic}</span></div>
                <div className="calc-row-val" style={{ color: p.color }}>{fmtNum(perPrayer)}</div>
              </div>
            ))}
            <div className="calc-total">
              <span>Jami qazo namoz</span>
              <span className="calc-total-val">{fmtNum(total)}</span>
            </div>
          </div>

          <div className="spacer-lg" />
          {added ? (
            <div className="btn btn-read btn-block" style={{ cursor: 'default' }}><Icon name="circle-check" /> Hisobga qo‘shildi</div>
          ) : (
            <button className="btn btn-primary btn-block" onClick={apply}><Icon name="plus" /> Hisoblab «Namozlar»ga qo‘shish</button>
          )}
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
            Hayz/nifos kunlari (ayollar uchun) va tug‘ilish sanasi aniqligini o‘zingiz hisobga oling — bu taxminiy hisob-kitob.
          </p>
        </>
      )}
      <div className="spacer-lg" />
    </div>
  )
}
