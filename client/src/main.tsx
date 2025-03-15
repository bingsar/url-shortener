import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { store } from './store'
import { Provider } from 'react-redux'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
