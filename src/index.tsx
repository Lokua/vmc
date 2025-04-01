// HMR does not work correctly in React 19 under StrictMode
// - https://github.com/facebook/react/issues/29915
// - https://github.com/vitejs/vite-plugin-react/issues/335
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <App />
  // <StrictMode>
  //   <App />
  // </StrictMode>
)

window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
