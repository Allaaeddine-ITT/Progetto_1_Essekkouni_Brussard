import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import WeatherPage from "./pages/weatherPage";
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
        <WeatherPage />
    </>
  )
}

export default App
