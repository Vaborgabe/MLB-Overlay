import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { SocketProvider } from './components/socketIOCtx/socketIOCtx.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  //<StrictMode>
  <SocketProvider namespace="overlay">
    <App />
  </SocketProvider>
  //</StrictMode>,
)
