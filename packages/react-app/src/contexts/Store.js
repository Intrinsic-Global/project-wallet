import React, { useState, createContext } from "react";

export const ThemeContext = createContext();
export const ContractsContext = createContext();

const Store = ({ children }) => {
  const [theme, setTheme] = useState({ theme: "dark" });
  const [contracts, setContracts] = useState({});
  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      <ContractsContext.Provider value={[contracts, setContracts]}>{children}</ContractsContext.Provider>
    </ThemeContext.Provider>
  );
};

export default Store;
