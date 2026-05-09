import React, { createContext, useContext, useState } from "react";
const UserAuthContext = createContext({});
export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });
  const register = (data: any) => {
    setUser(data);
  };
  const logout = () => {
    setUser({ fullName: "", phone: "", email: "", password: "" });
  };
  return (
    <UserAuthContext.Provider value={{ user, register, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}
export function useUserAuth() {
  return useContext(UserAuthContext);
}