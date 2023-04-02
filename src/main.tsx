import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "./static/css/stuff.min.css";
import "./static/css/custom.css";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
