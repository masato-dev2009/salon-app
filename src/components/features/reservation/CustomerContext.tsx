'use client'

import { createContext, useContext, useState } from 'react'

type Customer = {
  customerName: string
  phone: string
  email: string
}

const CustomerContext = createContext<{
  customer: Customer
  setCustomer: React.Dispatch<React.SetStateAction<Customer>>
} | null>(null)

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState({
    customerName: '',
    phone: '',
    email: '',
  })

  return (
    <CustomerContext.Provider value={{ customer, setCustomer }}>
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomer() {
  const context = useContext(CustomerContext)

  if (!context) {
    throw new Error('CustomerProviderで囲んでください')
  }

  return context
}
