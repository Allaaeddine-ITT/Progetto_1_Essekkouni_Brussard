import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Geodecode  from "./geocoding.js"
import Button from '@mui/material/Button';

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <App />
  </StrictMode>,
  


)
Geodecode();
