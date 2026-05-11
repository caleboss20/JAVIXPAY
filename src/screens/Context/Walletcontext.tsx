import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
const WalletContext = createContext<WalletContextType | undefined>(undefined);
const STORAGE_KEY = "javix_wallets";
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  // Load wallets on app start
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setWallets(JSON.parse(saved));
      } catch (e) {
        console.log("Failed to load wallets", e);
      }
    };
    load();
  }, []);
  // Save wallets whenever they change
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
      } catch (e) {
        console.log("Failed to save wallets", e);
      }
    };
    save();
  }, [wallets]);
  const addWallet = (wallet: Omit<Wallet, "id" | "balance" | "createdAt">) => {
    const newWallet: Wallet = {
      id: Date.now().toString(),
      balance: 0.00,
      createdAt: new Date().toISOString(),
      ...wallet,
    };
    setWallets(prev => [...prev, newWallet]);
  };
  const removeWallet = (phone: string) => {
    setWallets(prev => prev.filter(w => w.phone !== phone));
  };
  const getWalletByPhone = (phone: string): Wallet | undefined => {
    return wallets.find(w => w.phone === phone);
  };
  return (
    <WalletContext.Provider value={{ wallets, addWallet, removeWallet, getWalletByPhone }}>
      {children}
    </WalletContext.Provider>
  );
}
export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used inside WalletProvider");
  return context;
}