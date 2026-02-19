import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme, App as AntApp } from 'antd'
import App from './App.jsx'
import './index.css'
import './styles/report-theme.css'
import './styles/report-components.css'
import './styles/print.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        cssVar: true,
        token: {
          colorPrimary: '#2B7AE8',
          colorBgContainer: '#1a1a1a',
          colorBgElevated: '#2a2a2a',
          colorBgLayout: '#141414',
          colorError: '#ef4444',
          colorSuccess: '#22c55e',
          colorWarning: '#f59e0b',
          borderRadius: 6,
          fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
        },
      }}
    >
      <AntApp>
        <App />
      </AntApp>
    </ConfigProvider>
  </StrictMode>,
)
