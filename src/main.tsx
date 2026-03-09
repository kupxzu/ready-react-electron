import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <Theme appearance="light" accentColor="iris" grayColor="slate" radius="medium" scaling="100%">
            <App />
        </Theme>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
)
