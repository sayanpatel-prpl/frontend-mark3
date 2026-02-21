import { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme as antTheme } from 'antd';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

const baseTokens = {
  colorError: '#ef4444',
  colorSuccess: '#22c55e',
  colorWarning: '#f59e0b',
  borderRadius: 6,
  fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
};

const lightTokens = {
  ...baseTokens,
  colorPrimary: '#8B7226',
};

const darkTokens = {
  ...baseTokens,
  colorPrimary: '#C9A84C',
  colorBgContainer: '#161D2F',
  colorBgElevated: '#1C2438',
  colorBgLayout: '#0F1219',
  colorText: '#E8ECF1',
  colorTextSecondary: 'rgba(232, 236, 241, 0.65)',
  colorTextTertiary: 'rgba(232, 236, 241, 0.45)',
  colorTextQuaternary: 'rgba(232, 236, 241, 0.25)',
  colorBorder: '#2A3349',
  colorBorderSecondary: '#232B3E',
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => setMode(m => m === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: mode === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
          cssVar: true,
          token: mode === 'dark' ? darkTokens : lightTokens,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
