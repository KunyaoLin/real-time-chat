import axios from "axios";
import React, { createContext, useContext, useEffect, useReducer } from "react";
const URL = process.env.REACT_APP_SERVER_URL;

const initialState = {
  isAuthenticated: false,
  numUnreadMegs: 0,
  friends: [],
  allFriendsReq: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "editAuthenticated":
      return { ...state, isAuthenticated: action.payload };
    case "getAllUnreadMegs":
      return { ...state, numUnreadMegs: state.numUnreadMegs + action.payload };
    case "getAllFriendsInfo":
      return { ...state, friends: action.payload };
    case "getAllFriendsReq":
      return { ...state, allFriendsReq: action.payload };
    default:
      throw new Error("unknow action");
  }
}

const GlobalContext = createContext();
const GlobalContextProvider = ({ children }) => {
  const [{ isAuthenticated, numUnreadMegs, friends, allFriendsReq }, dispatch] =
    useReducer(reducer, initialState);

  function editAuthenticated(type) {
    dispatch({
      type: "editAuthenticated",
      payload: type === "login" ? true : false,
    });
  }
  function editUnReadMegsNum(num) {
    dispatch({
      type: "getAllUnreadMegs",
      payload: -num,
    });
    console.log("num:", -num);
  }
  function editUnReadMegsBySend() {
    dispatch({
      type: "getAllUnreadMegs",
      payload: 1,
    });
  }

  useEffect(() => {
    async function getUnReadMegs() {
      const result = await axios({
        url: `${URL}/chat/getAllUnreadMegsNum`,
        method: "GET",
        withCredentials: true,
      });
      if (result) {
        dispatch({
          type: "getAllUnreadMegs",
          payload: result.data.data.unReadMegs,
        });
        // console.log("numUnreadMegs", numUnreadMegs);
      }

      // setUnReadMegs(result.data.data.unReadMegs);
      // console.log("result:", result);
    }
    getUnReadMegs();
  }, []);
  useEffect(() => {
    async function getAllFriends() {
      try {
        const res = await axios({
          url: `${URL}/friends/getAllFriends`,
          method: "GET",
          withCredentials: true,
        });
        if (!res) throw new Error("get friends info error");
        const friendsList = res.data.data.FriendsContact.map((el) => {
          return el.friends[0];
        }).sort((a, b) => {
          return b.onlineStatus === a.onlineStatus
            ? 0
            : b.onlineStatus
            ? 1
            : -1;
        });
        console.log("friendsList:", friendsList);

        dispatch({
          type: "getAllFriendsInfo",
          payload: friendsList,
        });
      } catch (err) {}
    }
    getAllFriends();
  }, []);
  useEffect(() => {
    async function getFriendReq() {
      const result = await axios({
        url: `${URL}/friends/request`,
        method: "GET",
        withCredentials: true,
      });
      console.log("result:", result);
      if (Object.keys(result.data.data).length !== 0) {
        dispatch({
          type: "getAllFriendsReq",
          payload: result.data.data.allReq,
        });
      }
    }
    getFriendReq();
  }, []);
  console.log("allFriendsReq:", allFriendsReq);

  return (
    <GlobalContext.Provider
      value={{
        isAuthenticated,
        friends,
        editAuthenticated,
        numUnreadMegs,
        editUnReadMegsNum,
        editUnReadMegsBySend,
        allFriendsReq,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("GlobalContext was used outside of its function area");
  return context;
}

export { useGlobalContext, GlobalContextProvider };
