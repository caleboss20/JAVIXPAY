
import React, { createContext, useState, useContext } from 'react'
interface Transaction {
  id: string
  amount: number
  currency: string
  recipient: string
  date: string
}
interface TransactionContextType{
  transactions:Transaction[]
  addTransaction:(transaction:Transaction)=>void
}

const TransactionContext = createContext<TransactionContextType|null>(null)
export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction])
  }
  return (
    <TransactionContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionContext.Provider>
  )
}
export const useTransactions = () => useContext(TransactionContext)