import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import './index.css'
import './styles/print.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#646cff',
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
      <App />
    </ConfigProvider>
  </StrictMode>,
)
