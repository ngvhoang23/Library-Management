import React, { createContext, useReducer, useContext, useState } from "react";

// Create context
const AuthContext = createContext();

// Create provider
const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const value = {
    auth,
    setAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the context
const useAuthContext = () => useContext(AuthContext);

export { AuthContextProvider, useAuthContext };
