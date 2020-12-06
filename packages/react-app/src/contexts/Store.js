import React, { useState, useEffect, createContext } from "react";

import config from "../config";

export const ThemeContext = createContext();

const Store = ({ children }) => {
  const [theme, setTheme] = useState({ theme: "dark" });
  return <ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>;
};

export default Store;
