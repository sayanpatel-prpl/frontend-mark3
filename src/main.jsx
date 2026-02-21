import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App as AntApp } from 'antd'
import { ThemeProvider } from './contexts/ThemeContext'
import App from './App.jsx'
import './index.css'
import './styles/report-theme.css'
import './styles/report-components.css'
import './styles/print.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AntApp>
        <App />
      </AntApp>
    </ThemeProvider>
  </StrictMode>,
)
