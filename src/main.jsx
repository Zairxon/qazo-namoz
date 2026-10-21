import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Шрифты бандлятся локально: латиница и кириллица (для uz-кирилл и ru).
import '@fontsource/inter/cyrillic-400.css'
import '@fontsource/inter/cyrillic-500.css'
import '@fontsource/inter/cyrillic-600.css'
import '@fontsource/inter/cyrillic-700.css'
import '@fontsource/unbounded/cyrillic-400.css'
import '@fontsource/unbounded/cyrillic-700.css'
import '@fontsource/unbounded/cyrillic-800.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/unbounded/latin-400.css'
import '@fontsource/unbounded/latin-700.css'
import '@fontsource/unbounded/latin-800.css'

import './styles/variables.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
