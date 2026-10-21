import { createElement } from 'react'
import { useStore, getState } from './store'

// Четыре языка интерфейса: uz — узбекская латиница, uzc — узбекская кириллица,
// ru — русский, en — английский. Язык хранится в settings.lang (store).
export const LANGS = [
  { id: 'uz', label: 'O‘zbekcha (lotin)' },
  { id: 'uzc', label: 'Ўзбекча (кирилл)' },
  { id: 'ru', label: 'Русский' },
  { id: 'en', label: 'English' },
]

const DICT = {
  uz: {
    'screen.journal': 'Jurnal', 'screen.calc': 'Qazo hisoblagich', back: 'Orqaga', close: 'Yopish',
    'settings.title': 'Mavzu va til', 'theme.title': 'Mavzu', 'theme.light': 'Yorug‘', 'lang.title': 'Til',
    'kpi.total': 'Jami qolgan', 'kpi.calc': 'Hisoblagich →', 'kpi.read': 'O‘qilgan', 'kpi.journal': 'Jurnal →',
    'prayers.title': 'Namozlar', left: 'qoldi', none: 'qolmadi', read: 'O‘qidim', 'add.title': 'Qazo qo‘shish',
    'add.heading': '{name} — qazo qo‘shish', cancel: 'Bekor', 'add.btn': 'Qo‘shish', 'add.date': 'Qachon o‘tkazilgan (sana)',
    qasr: 'Qasr namoz', 'qasr.ok': 'Safarda 2 rakat o‘qiladigan namoz', 'qasr.no': 'Bu namoz qasrga qisqarmaydi', 'qasr.badge': 'Qasr',
    'detail.total': 'Jami qolgan: <b>{total}</b> qazo', 'detail.bulk': ' · shundan <b>{bulk}</b> ta kalkulyatordan (sanasiz)',
    'detail.calcTitle': 'Kalkulyator hisobi', 'detail.calcSub': 'Sanasiz umumiy qazo',
    'empty.title': 'Hozircha yo‘q', 'empty.text': '«Qazo qo‘shish» tugmasi bilan sana bo‘yicha o‘tkazilgan namozni belgilang.',
    'journal.empty': 'Jurnal bo‘sh', 'journal.emptyText': 'Qazo namozni «O‘qidim» deb belgilaganingizda, u shu yerga yozib boriladi.',
    undo: 'Bekor qilish (qaytarish)', delete: 'O‘chirish',
    'calc.info': 'Namoz <b>balog‘at</b>dan farz bo‘ladi. Balog‘at bilan namozni doimiy boshlagan kun orasidagi har bir kun uchun — 5 vaqt namoz va <b>Vitr</b> qazo bo‘ladi.',
    'calc.birth': 'Tug‘ilgan sana', 'calc.baligh': 'Balog‘at yoshi (odatda 12–15)',
    'calc.obligation': 'Namoz farz bo‘lgan sana: <b>{d}</b>', 'calc.obligationEmpty': '— tug‘ilgan sanani kiriting',
    'calc.start': 'Namozni doimiy boshlagan sana', 'calc.period': 'O‘tkazilgan davr: <b>{n} kun</b> (≈ {y} yil)',
    'calc.total': 'Jami qazo namoz', 'calc.added': 'Hisobga qo‘shildi', 'calc.apply': 'Hisoblab «Namozlar»ga qo‘shish',
    'calc.note': 'Hayz/nifos kunlari (ayollar uchun) va tug‘ilish sanasi aniqligini o‘zingiz hisobga oling — bu taxminiy hisob-kitob.',
    'dp.pick': 'Sanani tanlang',
    'p.fajr': 'Bomdod', 'p.zuhr': 'Peshin', 'p.asr': 'Asr', 'p.maghrib': 'Shom', 'p.isha': 'Xufton', 'p.vitr': 'Vitr',
    'pa.fajr': 'Fajr', 'pa.zuhr': 'Zuhr', 'pa.asr': 'Asr', 'pa.maghrib': 'Mag‘rib', 'pa.isha': 'Isho', 'pa.vitr': 'Vitr vojib',
    months: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
    weekdays: ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'],
    wdShort: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
  },
  uzc: {
    'screen.journal': 'Журнал', 'screen.calc': 'Қазо ҳисоблагич', back: 'Орқага', close: 'Ёпиш',
    'settings.title': 'Мавзу ва тил', 'theme.title': 'Мавзу', 'theme.light': 'Ёруғ', 'lang.title': 'Тил',
    'kpi.total': 'Жами қолган', 'kpi.calc': 'Ҳисоблагич →', 'kpi.read': 'Ўқилган', 'kpi.journal': 'Журнал →',
    'prayers.title': 'Намозлар', left: 'қолди', none: 'қолмади', read: 'Ўқидим', 'add.title': 'Қазо қўшиш',
    'add.heading': '{name} — қазо қўшиш', cancel: 'Бекор', 'add.btn': 'Қўшиш', 'add.date': 'Қачон ўтказилган (сана)',
    qasr: 'Қаср намоз', 'qasr.ok': 'Сафарда 2 ракат ўқиладиган намоз', 'qasr.no': 'Бу намоз қасрга қисқармайди', 'qasr.badge': 'Қаср',
    'detail.total': 'Жами қолган: <b>{total}</b> қазо', 'detail.bulk': ' · шундан <b>{bulk}</b> та калькулятордан (санасиз)',
    'detail.calcTitle': 'Калькулятор ҳисоби', 'detail.calcSub': 'Санасиз умумий қазо',
    'empty.title': 'Ҳозирча йўқ', 'empty.text': '«Қазо қўшиш» тугмаси билан сана бўйича ўтказилган намозни белгиланг.',
    'journal.empty': 'Журнал бўш', 'journal.emptyText': 'Қазо намозни «Ўқидим» деб белгилаганингизда, у шу ерга ёзиб борилади.',
    undo: 'Бекор қилиш (қайтариш)', delete: 'Ўчириш',
    'calc.info': 'Намоз <b>балоғат</b>дан фарз бўлади. Балоғат билан намозни доимий бошлаган кун орасидаги ҳар бир кун учун — 5 вақт намоз ва <b>Витр</b> қазо бўлади.',
    'calc.birth': 'Туғилган сана', 'calc.baligh': 'Балоғат ёши (одатда 12–15)',
    'calc.obligation': 'Намоз фарз бўлган сана: <b>{d}</b>', 'calc.obligationEmpty': '— туғилган санани киритинг',
    'calc.start': 'Намозни доимий бошлаган сана', 'calc.period': 'Ўтказилган давр: <b>{n} кун</b> (≈ {y} йил)',
    'calc.total': 'Жами қазо намоз', 'calc.added': 'Ҳисобга қўшилди', 'calc.apply': 'Ҳисоблаб «Намозлар»га қўшиш',
    'calc.note': 'Ҳайз/нифос кунлари (аёллар учун) ва туғилиш санаси аниқлигини ўзингиз ҳисобга олинг — бу тахминий ҳисоб-китоб.',
    'dp.pick': 'Санани танланг',
    'p.fajr': 'Бомдод', 'p.zuhr': 'Пешин', 'p.asr': 'Аср', 'p.maghrib': 'Шом', 'p.isha': 'Хуфтон', 'p.vitr': 'Витр',
    'pa.fajr': 'Фажр', 'pa.zuhr': 'Зуҳр', 'pa.asr': 'Аср', 'pa.maghrib': 'Мағриб', 'pa.isha': 'Ишо', 'pa.vitr': 'Витр вожиб',
    months: ['январ', 'феврал', 'март', 'апрел', 'май', 'июн', 'июл', 'август', 'сентябр', 'октябр', 'ноябр', 'декабр'],
    weekdays: ['якшанба', 'душанба', 'сешанба', 'чоршанба', 'пайшанба', 'жума', 'шанба'],
    wdShort: ['Ду', 'Се', 'Чо', 'Па', 'Жу', 'Ша', 'Як'],
  },
  ru: {
    'screen.journal': 'Журнал', 'screen.calc': 'Калькулятор каза', back: 'Назад', close: 'Закрыть',
    'settings.title': 'Тема и язык', 'theme.title': 'Тема', 'theme.light': 'Светлая', 'lang.title': 'Язык',
    'kpi.total': 'Осталось', 'kpi.calc': 'Калькулятор →', 'kpi.read': 'Прочитано', 'kpi.journal': 'Журнал →',
    'prayers.title': 'Намазы', left: 'осталось', none: 'не осталось', read: 'Прочитал', 'add.title': 'Добавить каза',
    'add.heading': '{name} — добавить каза', cancel: 'Отмена', 'add.btn': 'Добавить', 'add.date': 'Когда пропущен (дата)',
    qasr: 'Каср (сокращённый) намаз', 'qasr.ok': 'Намаз, сокращаемый до 2 ракатов в пути', 'qasr.no': 'Этот намаз не сокращается', 'qasr.badge': 'Каср',
    'detail.total': 'Всего осталось: <b>{total}</b> каза', 'detail.bulk': ' · из них <b>{bulk}</b> из калькулятора (без дат)',
    'detail.calcTitle': 'Счёт из калькулятора', 'detail.calcSub': 'Общий счёт без дат',
    'empty.title': 'Пока пусто', 'empty.text': 'Кнопкой «Добавить каза» отметьте пропущенный намаз по дате.',
    'journal.empty': 'Журнал пуст', 'journal.emptyText': 'Когда вы отметите каза-намаз как «Прочитал», он появится здесь.',
    undo: 'Отменить (вернуть)', delete: 'Удалить',
    'calc.info': 'Намаз становится обязательным с <b>совершеннолетия</b> (булуг). За каждый день между совершеннолетием и началом регулярного намаза пропущено 5 намазов и <b>витр</b>.',
    'calc.birth': 'Дата рождения', 'calc.baligh': 'Возраст совершеннолетия (обычно 12–15)',
    'calc.obligation': 'Намаз стал обязательным: <b>{d}</b>', 'calc.obligationEmpty': '— введите дату рождения',
    'calc.start': 'Дата начала регулярного намаза', 'calc.period': 'Пропущенный период: <b>{n} дн.</b> (≈ {y} г.)',
    'calc.total': 'Всего каза-намазов', 'calc.added': 'Добавлено в счёт', 'calc.apply': 'Посчитать и добавить в «Намазы»',
    'calc.note': 'Дни месячных/послеродовых (для женщин) и точность даты рождения учтите самостоятельно — это примерный расчёт.',
    'dp.pick': 'Выберите дату',
    'p.fajr': 'Фаджр', 'p.zuhr': 'Зухр', 'p.asr': 'Аср', 'p.maghrib': 'Магриб', 'p.isha': 'Иша', 'p.vitr': 'Витр',
    'pa.fajr': 'Утренний', 'pa.zuhr': 'Полуденный', 'pa.asr': 'Послеполуд.', 'pa.maghrib': 'Закатный', 'pa.isha': 'Ночной', 'pa.vitr': 'Ваджиб',
    months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    monthsNom: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    weekdays: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    wdShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  },
  en: {
    'screen.journal': 'Journal', 'screen.calc': 'Qaza calculator', back: 'Back', close: 'Close',
    'settings.title': 'Theme & language', 'theme.title': 'Theme', 'theme.light': 'Light', 'lang.title': 'Language',
    'kpi.total': 'Total left', 'kpi.calc': 'Calculator →', 'kpi.read': 'Prayed', 'kpi.journal': 'Journal →',
    'prayers.title': 'Prayers', left: 'left', none: 'none left', read: 'Prayed', 'add.title': 'Add qaza',
    'add.heading': '{name} — add qaza', cancel: 'Cancel', 'add.btn': 'Add', 'add.date': 'Date missed',
    qasr: 'Shortened (qasr) prayer', 'qasr.ok': 'Prayer shortened to 2 rak‘ahs when traveling', 'qasr.no': 'This prayer is not shortened', 'qasr.badge': 'Qasr',
    'detail.total': 'Total left: <b>{total}</b> qaza', 'detail.bulk': ' · incl. <b>{bulk}</b> from the calculator (undated)',
    'detail.calcTitle': 'Calculator count', 'detail.calcSub': 'Undated total count',
    'empty.title': 'Nothing yet', 'empty.text': 'Use “Add qaza” to mark a missed prayer by date.',
    'journal.empty': 'Journal is empty', 'journal.emptyText': 'When you mark a qaza prayer as “Prayed”, it will be logged here.',
    undo: 'Undo (restore)', delete: 'Delete',
    'calc.info': 'Prayer becomes obligatory at <b>puberty</b>. For each day between puberty and the day you started praying regularly, 5 daily prayers and <b>Witr</b> are owed.',
    'calc.birth': 'Date of birth', 'calc.baligh': 'Age of puberty (usually 12–15)',
    'calc.obligation': 'Prayer became obligatory on: <b>{d}</b>', 'calc.obligationEmpty': '— enter date of birth',
    'calc.start': 'Date you started praying regularly', 'calc.period': 'Missed period: <b>{n} days</b> (≈ {y} years)',
    'calc.total': 'Total qaza prayers', 'calc.added': 'Added to count', 'calc.apply': 'Calculate and add to “Prayers”',
    'calc.note': 'Account for menstruation/postnatal days (for women) and the accuracy of the birth date yourself — this is an estimate.',
    'dp.pick': 'Pick a date',
    'p.fajr': 'Fajr', 'p.zuhr': 'Dhuhr', 'p.asr': 'Asr', 'p.maghrib': 'Maghrib', 'p.isha': 'Isha', 'p.vitr': 'Witr',
    'pa.fajr': 'Dawn', 'pa.zuhr': 'Noon', 'pa.asr': 'Afternoon', 'pa.maghrib': 'Sunset', 'pa.isha': 'Night', 'pa.vitr': 'Wajib',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    wdShort: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  },
}

export const getLang = () => getState().settings.lang || 'uz'

function translate(lang, key, vars) {
  let s = (DICT[lang] && DICT[lang][key]) ?? DICT.uz[key] ?? key
  if (vars && typeof s === 'string') for (const k in vars) s = s.replaceAll(`{${k}}`, vars[k])
  return s
}

// Для вызова вне React (форматы дат).
export const listNow = key => (DICT[getLang()] || DICT.uz)[key] ?? DICT.uz[key]

// Хук: подписывает компонент на смену языка и отдаёт t(key, vars).
export function useT() {
  const lang = useStore(s => s.settings.lang || 'uz')
  const t = (key, vars) => translate(lang, key, vars)
  t.list = key => (DICT[lang] || DICT.uz)[key] ?? DICT.uz[key]
  t.lang = lang
  return t
}

// Строка с <b>…</b> → массив React-узлов (жирный текст внутри перевода).
export function rich(str) {
  return String(str).split(/(<b>.*?<\/b>)/g).filter(Boolean).map((part, i) =>
    part.startsWith('<b>') ? createElement('b', { key: i }, part.slice(3, -4)) : part)
}
