import React, { createContext, useContext, useReducer } from "react";
// const URL = process.env.REACT_APP_SERVER_URL;
const initialState = {
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "editAuthenticated":
      return { ...state, isAuthenticated: action.payload };
    default:
      throw new Error("unknow action");
  }
}

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [{ isAuthenticated }, dispatch] = useReducer(reducer, initialState);

  function editAuthenticated(type) {
    dispatch({
      type: "editAuthenticated",
      payload: type === "login" ? true : false,
    });
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, editAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("AuthContext was used outside of its function area");
  return context;
}

export { useAuth, AuthProvider };
