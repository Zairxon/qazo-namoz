import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Qazo Namoz — офлайн-трекер каза (упущенных) намазов. Собирается в APK через
// Capacitor: Vite билдит статику в dist/, Capacitor кладёт её внутрь Android-
// приложения и показывает в WebView. Данные — локально (localStorage,
// см. src/lib/store.js), бэкенда нет. Пути относительные (base:'./'), иначе
// ассеты не грузятся из file:///https схемы WebView.
export default defineConfig({
  base: './',
  plugins: [react()],
})
