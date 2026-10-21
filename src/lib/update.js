import { useEffect, useState } from 'react'
import { Browser } from '@capacitor/browser'

// Версия приложения вшивается в сборку (vite define из package.json).
export const APP_VERSION = __APP_VERSION__

const REPO = 'Zairxon/qazo-namoz'

// '1.10.0' → [1, 10, 0]; нечисловые хвосты и ведущая «v» отбрасываются.
const parse = v => String(v).replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0)

export function isNewer(remote, local) {
  const a = parse(remote), b = parse(local)
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const d = (a[i] || 0) - (b[i] || 0)
    if (d) return d > 0
  }
  return false
}

// Сверка с последним релизом GitHub. Нет сети / ошибка — молча без уведомления.
export function useUpdate() {
  const [update, setUpdate] = useState(null)  // { version, url } | null
  useEffect(() => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : null))
      .then(rel => {
        if (!rel || !rel.tag_name || !isNewer(rel.tag_name, APP_VERSION)) return
        const apk = (rel.assets || []).find(a => a.name.endsWith('.apk'))
        setUpdate({ version: rel.tag_name.replace(/^v/i, ''), url: apk ? apk.browser_download_url : rel.html_url })
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer))
    return () => { ctrl.abort(); clearTimeout(timer) }
  }, [])
  return update
}

// Открыть ссылку во внешнем браузере (скачать APK); в обычном браузере — новая вкладка.
export function openUrl(url) {
  Browser.open({ url }).catch(() => window.open(url, '_blank'))
}
