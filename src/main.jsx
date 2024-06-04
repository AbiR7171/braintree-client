import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PaymentProvider } from './PaymnetProvider.jsx'
import { PaymentForm } from './PaymentForm.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <PaymentProvider>
         <PaymentForm/>
   </PaymentProvider>
  </React.StrictMode>,
)
