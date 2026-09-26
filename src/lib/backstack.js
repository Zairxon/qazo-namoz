// Стек «обработчиков назад». Каждая открытая модалка кладёт сюда свой onClose;
// аппаратная кнопка «назад» (Android) закрывает верхнюю модалку, а не выходит
// из приложения. См. App.jsx (обработчик Capacitor backButton).
const stack = []

export function pushBack(fn) {
  stack.push(fn)
  return () => {
    const i = stack.lastIndexOf(fn)
    if (i >= 0) stack.splice(i, 1)
  }
}

// Вызвать верхний обработчик (закрыть модалку). true — если что-то закрыли.
export function handleBack() {
  const fn = stack[stack.length - 1]
  if (fn) { fn(); return true }
  return false
}
