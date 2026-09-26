import { useSyncExternalStore } from 'react'

// ── Локальное офлайн-хранилище ──────────────────────────────────────────
// Всё состояние приложения (счётчики каза, отмеченные намозы, журнал, тема)
// живёт в localStorage. Никакого бэкенда/аккаунтов — данные не покидают
// устройство. Подписка на изменения — через useSyncExternalStore, чтобы любой
// компонент перерисовывался при commit(). Синхронизацию между устройствами
// можно добавить позже (см. заметку в README).

const KEY = 'qn_state_v1'

export const PRAYERS = [
  { id: 'fajr',    name: 'Bomdod',  arabic: 'Fajr',       icon: 'sunrise',    rakat: 2, color: 'var(--color-mustard)' },
  { id: 'zuhr',    name: 'Peshin',  arabic: 'Zuhr',       icon: 'sun',        rakat: 4, color: 'var(--accent)' },
  { id: 'asr',     name: 'Asr',     arabic: 'Asr',        icon: 'sun-low',    rakat: 4, color: 'var(--gold)' },
  { id: 'maghrib', name: 'Shom',    arabic: 'Mag‘rib',    icon: 'sunset',     rakat: 3, color: 'var(--color-terracotta)' },
  { id: 'isha',    name: 'Xufton',  arabic: 'Isho',       icon: 'moon-stars', rakat: 4, color: 'var(--color-slate-blue)' },
  { id: 'vitr',    name: 'Vitr',    arabic: 'Vitr vojib', icon: 'star',       rakat: 3, color: 'var(--color-olive)' },
]
export const PRAYER_MAP = Object.fromEntries(PRAYERS.map(p => [p.id, p]))

// Каср можно ставить только на 4-ракатные намозы (Пешин, Аср, Хуфтон) —
// в пути они читаются в 2 раката. Бомдод/Шом/Витр не сокращаются.
export const QASR_ELIGIBLE = new Set(['zuhr', 'asr', 'isha'])

const emptyCounts = () => ({ fajr: 0, zuhr: 0, asr: 0, maghrib: 0, isha: 0, vitr: 0 })

const DEFAULT_STATE = {
  counts: emptyCounts(),  // «массовые» каза (из калькулятора / ручного ввода)
  entries: [],            // конкретные отмеченные намозы { id, prayer, date, qasr, note, createdAt }
  journal: [],            // прочитанные каза { id, prayer, date, qasr, note, readAt, kind }
  settings: { theme: 'dark' },
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(DEFAULT_STATE)
    const parsed = JSON.parse(raw)
    // Мягкое слияние с дефолтами — на случай новых полей в будущих версиях.
    return {
      ...DEFAULT_STATE,
      ...parsed,
      counts: { ...emptyCounts(), ...(parsed.counts || {}) },
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
    }
  } catch {
    return structuredClone(DEFAULT_STATE)
  }
}

let state = load()
const listeners = new Set()

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* quota — игнор */ }
}

function emit() {
  persist()
  listeners.forEach(l => l())
}

function subscribe(l) { listeners.add(l); return () => listeners.delete(l) }
function getSnapshot() { return state }

// Хук состояния: selector(state) → значение, перерисовка при изменении.
export function useStore(selector = s => s) {
  return useSyncExternalStore(subscribe, () => selector(state))
}

export function getState() { return state }

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
const todayISO = () => new Date().toISOString().slice(0, 10)

// ── Мутации ─────────────────────────────────────────────────────────────

// Добавить конкретный отмеченный намоз (кнопка «Қўшиш»).
export function addEntry({ prayer, date, qasr = false, note = '' }) {
  const qasrOk = qasr && QASR_ELIGIBLE.has(prayer)
  state = {
    ...state,
    entries: [
      { id: uid(), prayer, date: date || todayISO(), qasr: qasrOk, note, createdAt: Date.now() },
      ...state.entries,
    ],
  }
  emit()
}

// Удалить отмеченный намоз без записи в журнал (ошибочно добавил).
export function deleteEntry(id) {
  state = { ...state, entries: state.entries.filter(e => e.id !== id) }
  emit()
}

// Прочитал конкретный отмеченный намоз → убрать из списка, записать в журнал.
export function readEntry(id) {
  const e = state.entries.find(x => x.id === id)
  if (!e) return
  state = {
    ...state,
    entries: state.entries.filter(x => x.id !== id),
    journal: [
      { id: uid(), prayer: e.prayer, date: e.date, qasr: e.qasr, note: e.note, readAt: Date.now(), kind: 'entry' },
      ...state.journal,
    ],
  }
  emit()
}

// Изменить массовый счётчик каза на delta (±). Не уходим ниже нуля.
export function adjustCount(prayer, delta) {
  const next = Math.max(0, (state.counts[prayer] || 0) + delta)
  state = { ...state, counts: { ...state.counts, [prayer]: next } }
  emit()
}

// Задать массовый счётчик напрямую.
export function setCount(prayer, value) {
  state = { ...state, counts: { ...state.counts, [prayer]: Math.max(0, Math.round(value) || 0) } }
  emit()
}

// Прибавить к массовым счётчикам сразу пачку (из калькулятора).
export function addCounts(map) {
  const counts = { ...state.counts }
  for (const [k, v] of Object.entries(map)) counts[k] = Math.max(0, (counts[k] || 0) + (Math.round(v) || 0))
  state = { ...state, counts }
  emit()
}

// Прочитал один каза из массового счётчика → −1 и запись в журнал.
export function readOneFromCount(prayer) {
  if ((state.counts[prayer] || 0) <= 0) return
  state = {
    ...state,
    counts: { ...state.counts, [prayer]: state.counts[prayer] - 1 },
    journal: [
      { id: uid(), prayer, date: null, qasr: false, note: '', readAt: Date.now(), kind: 'count' },
      ...state.journal,
    ],
  }
  emit()
}

// Отменить запись журнала → вернуть намоз обратно в «осталось».
export function undoJournal(id) {
  const j = state.journal.find(x => x.id === id)
  if (!j) return
  const journal = state.journal.filter(x => x.id !== id)
  if (j.kind === 'entry') {
    state = {
      ...state,
      journal,
      entries: [
        { id: uid(), prayer: j.prayer, date: j.date, qasr: j.qasr, note: j.note, createdAt: Date.now() },
        ...state.entries,
      ],
    }
  } else {
    state = { ...state, journal, counts: { ...state.counts, [j.prayer]: (state.counts[j.prayer] || 0) + 1 } }
  }
  emit()
}

// Удалить запись журнала насовсем (не возвращая намоз в «осталось»).
export function deleteJournal(id) {
  state = { ...state, journal: state.journal.filter(x => x.id !== id) }
  emit()
}

export function setTheme(theme) {
  state = { ...state, settings: { ...state.settings, theme } }
  emit()
}

// ── Производные значения (не хранятся, считаются из state) ───────────────

// Сколько каза осталось по конкретному намозу = массовый счётчик +
// отмеченные намозы этого типа.
export function remainingByPrayer(s, prayer) {
  return (s.counts[prayer] || 0) + s.entries.filter(e => e.prayer === prayer).length
}

export function totalRemaining(s) {
  return PRAYERS.reduce((a, p) => a + remainingByPrayer(s, p.id), 0)
}
