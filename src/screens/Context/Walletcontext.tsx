import React, { createContext, useContext, useState } from "react";
// Types
type Wallet = {
  id: string;
  country: string;
  currency: string;
  countryCode: string;
  flag: string;
  phone: string;
  balance: number;
  createdAt: string;
};
type WalletContextType = {
  wallets: Wallet[];
  addWallet: (wallet: Omit<Wallet, "id" | "balance" | "createdAt">) => void;
  removeWallet: (phone: string) => void;
  getWalletByPhone: (phone: string) => Wallet | undefined;
};
// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined);
// Provider
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  // Add wallet
  const addWallet = (wallet: Omit<Wallet, "id" | "balance" | "createdAt">) => {
    const newWallet: Wallet = {
      id: Date.now().toString(),
      balance: 0.00,
      createdAt: new Date().toISOString(),
      ...wallet,
    };
    setWallets(prev => [...prev, newWallet]);
  };
  // Remove wallet
  const removeWallet = (phone: string) => {
    setWallets(prev => prev.filter(w => w.phone !== phone));
  };
  // Get wallet by phone
  const getWalletByPhone = (phone: string): Wallet | undefined => {
    return wallets.find(w => w.phone === phone);
  };
  return (
    <WalletContext.Provider value={{ wallets, addWallet, removeWallet, getWalletByPhone }}>
      {children}
    </WalletContext.Provider>
  );
}
// Custom hook
export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used inside WalletProvider");
  }
  return context;
}