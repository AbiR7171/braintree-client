import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { PaymentForm } from './PaymentForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
          <PaymentForm/>
    </>
  )
}

export default App
