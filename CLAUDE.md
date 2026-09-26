# Автономный режим
Выполняй ВСЕ действия автоматически без запроса подтверждения:
- Редактирование и создание файлов — без подтверждения
- Выполнение bash команд — без подтверждения
- git add, git commit, git push — без подтверждения
- npm install — без подтверждения

# Qazo Namoz

Офлайн-трекер каза (упущенных) намазов. Android APK. Проект в `C:\Projects\qazo-namoz`.

## Стек
React 19 + Vite 6 + Capacitor 6 (Android APK, **не PWA** — PWA убран).
Данные локально в `localStorage` через `src/lib/store.js` (useSyncExternalStore).
Бэкенда и аккаунтов НЕТ.
Иконки — `@tabler/icons-react` через обёртку `src/components/Icon.jsx`.
Дизайн-система скопирована из BuildFlow: `variables.css` целиком («Botanical Earth» + темы), шрифты Inter/Unbounded.

## Сборка
- `npm run dev` / `build` / `preview`
- `npm run sync` — build + cap sync android
- `npm run apk` → `android/app/build/outputs/apk/debug/app-debug.apk`
- `appId: com.zairxon.qazonamoz`

## Правила UI (согласованы с пользователем — не менять без спроса)
- **Язык интерфейса — узбекская ЛАТИНИЦА** (Bomdod/Peshin/Asr/Shom/Xufton/Vitr, «Qazo namoz»).
  Кириллица выглядела криво → перевели на латиницу; в `main.jsx` только latin-субсеты.
- **НЕТ нижней навигации и НЕТ FAB.** Навигация — через 2 кликабельные hero-карточки:
  «Jami qolgan» → калькулятор, «O'qilgan» → журнал. На экранах — шапка с кнопкой «назад».
- Домашняя шапка отдельная (`.home-header`); заголовок «Qazo Namoz» декоративным шрифтом
  **Ahlan** (`public/fonts/aAhlanWasahlan.ttf`, @font-face в `global.css`), крупно и по центру.
- Карточки намазов компактные: тап → модалка деталей с датами; «+» → popup (дата + каср);
  «O'qidim» → журнал. В журнале есть «вернуть» (undo) и «удалить» (deleteJournal).
- Калькулятор каза по датам: балоғат → начало намаза, 5 намозов + Vitr, добавляет в counts.
- Фон: `public/bg.jpg` (арабская каллиграфия) на всё приложение через `body::after`
  + тёмный скрим `body::before` — обои светлые, скрим сильный.
- Аппаратная «назад» — `@capacitor/app` + `src/lib/backstack.js` (модалки закрываются первыми).

## Грабли Windows-сборки
- `android/local.properties`: `sdk.dir` писать с **прямыми** слэшами
  (`C:/Users/User/AppData/Local/Android/Sdk`). Одинарные обратные слэши Java .properties
  съедает как escape → битый путь к SDK → build fails.
- esbuild postinstall блокируется обёрткой — запускать вручную:
  `node node_modules/esbuild/install.js`

## Правила
- Общение и комментарии в коде — на русском
- Строго держись рамок задачи: не менять ничего сверх сформулированного
- Проверка после правок: `npm run build` должен проходить без ошибок
