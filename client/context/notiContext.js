import React, { createContext, useReducer, useContext, useState } from "react";

// Create context
const NotiContext = createContext();

// Create provider
const NotiContextProvider = ({ children }) => {
  const [notiQuantity, setNotiQuantity] = useState(0);

  const value = {
    notiQuantity,
    setNotiQuantity,
  };

  return <NotiContext.Provider value={value}>{children}</NotiContext.Provider>;
};

// Custom hook to use the context
const useNotiContext = () => useContext(NotiContext);

export { NotiContextProvider, useNotiContext };
