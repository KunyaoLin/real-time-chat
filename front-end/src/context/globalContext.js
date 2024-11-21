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

const GlobalContext = createContext();
const GlobalContextProvider = ({ children }) => {
  const [{ isAuthenticated }, dispatch] = useReducer(reducer, initialState);

  function editAuthenticated(type) {
    dispatch({
      type: "editAuthenticated",
      payload: type === "login" ? true : false,
    });
  }

  return (
    <GlobalContext.Provider value={{ isAuthenticated, editAuthenticated }}>
      {children}
    </GlobalContext.Provider>
  );
};
function useAuth() {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("GlobalContext was used outside of its function area");
  return context;
}

export { useAuth, GlobalContextProvider };
