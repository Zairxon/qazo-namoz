// Формат дат для UI (узбекская локаль). Даты в state хранятся как ISO
// 'YYYY-MM-DD' (без времени), журнал — как timestamp (мс).

const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
const WEEKDAYS = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba']

export function fmtDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function fmtLongDate(d = new Date()) {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export function fmtTs(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${hh}:${mm}`
}

// Число дней между двумя ISO-датами (включая обе границы, минимум 0).
export function daysBetween(fromISO, toISO) {
  if (!fromISO || !toISO) return 0
  const a = new Date(fromISO + 'T00:00:00').getTime()
  const b = new Date(toISO + 'T00:00:00').getTime()
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return 0
  return Math.floor((b - a) / 86400000)
}

// Красивое число с разделителями разрядов.
export function fmtNum(n) {
  return Math.round(n || 0).toLocaleString('ru-RU')
}
