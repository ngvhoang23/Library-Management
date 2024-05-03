import React, { createContext, useReducer, useContext, useState } from "react";

// Create context
const UserInfoContext = createContext();

// Create provider
const UserInfoProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  const value = {
    user,
    setUser,
  };

  return <UserInfoContext.Provider value={value}>{children}</UserInfoContext.Provider>;
};

// Custom hook to use the context
const useUserInfoContext = () => useContext(UserInfoContext);

export { UserInfoProvider, useUserInfoContext };
