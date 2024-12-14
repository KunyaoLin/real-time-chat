import axios from "axios";
import React, { createContext, useContext, useEffect, useReducer } from "react";
const URL = process.env.REACT_APP_SERVER_URL;

const initialState = {
  numUnreadMegs: 0,
  friends: [],
  allFriendsReq: [],
  Me: {},
  allUserRec: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "getAllUnreadMegs":
      return { ...state, numUnreadMegs: state.numUnreadMegs + action.payload };
    case "getAllFriendsInfo":
      return { ...state, friends: action.payload };
    case "getAllFriendsReq":
      return { ...state, allFriendsReq: action.payload };
    case "getAllRec":
      return { ...state, allUserRec: action.payload };
    case "getMe":
      return { ...state, Me: action.payload };
    case "handleFriReq":
      return { ...state, editFriReq: action.paypload };
    default:
      throw new Error("unknow action");
  }
}

const GlobalContext = createContext();
const GlobalContextProvider = ({ children }) => {
  const [{ numUnreadMegs, friends, allFriendsReq, Me, allUserRec }, dispatch] =
    useReducer(reducer, initialState);

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
  function editAllUserRec(rec) {
    dispatch({
      type: "getAllRec",
      payload: rec,
    });
  }
  async function getFriendReq() {
    const result = await axios({
      url: `${URL}/friends/request`,
      method: "GET",
      withCredentials: true,
    });
    // console.log("result:", result);
    if (Object.keys(result.data.data).length !== 0) {
      dispatch({
        type: "getAllFriendsReq",
        payload: result.data.data.allReq,
      });
    } else {
      dispatch({
        type: "getAllFriendsReq",
        payload: [],
      });
    }
  }
  //get all unread megs num
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
        console.log("result", result);
        // console.log("numUnreadMegs", numUnreadMegs);
      }
    }
    getUnReadMegs();
  }, []);
  // get all friends
  useEffect(() => {
    async function getAllFriends() {
      try {
        const res = await axios({
          url: `${URL}/friends/getAllFriends`,
          method: "GET",
          withCredentials: true,
        });
        if (!res) throw new Error("get friends info error");
        // console.log("ressssss", res.data.data.FriendsContact);
        const friendsList = res.data.data.FriendsContact.filter((el) => {
          return el.friends.length !== 0;
        }).sort((a, b) => {
          return b.friends[0].onlineStatus === a.friends[0].onlineStatus
            ? 0
            : b.friends[0].onlineStatus
            ? 1
            : -1;
        });
        // console.log("friendsList:", friendsList);

        dispatch({
          type: "getAllFriendsInfo",
          payload: friendsList,
        });
      } catch (err) {}
    }
    getAllFriends();
  }, []);
  //get all friReq
  useEffect(() => {
    getFriendReq();
  }, []);
  //get all chatRec
  useEffect(() => {
    let isCancel = false;
    async function getAllChatRecord() {
      try {
        const res = await axios({
          method: "GET",
          url: `${URL}/chat/getChatRecord`,
          withCredentials: true,
        });
        if (!isCancel && res && res.data) {
          // console.log("res.data.loginUserInfo:", res.data.loginUserInfo);
          dispatch({
            type: "getAllRec",
            payload: res.data.results,
          });
          // setAllUserRec(res.data.results);
          // setCurrentUserInfo(res.data.loginUserInfo);
        }
        console.log(" res.data.results:", res.data.results);
      } catch (err) {
        dispatch({
          type: "getAllRec",
          payload: [],
        });
        // setAllUserRec([]);
      }
      // if (!isCancel) setTimeout(getAllChatRecord, 3000); //loop data for every 3s
    }

    getAllChatRecord();

    return () => {
      isCancel = true;
    };
  }, []);
  //get me
  useEffect(() => {
    async function getMe() {
      const result = await axios({
        url: `${URL}/getMe`,
        method: "GET",
        withCredentials: true,
      });
      if (result) {
        dispatch({
          type: "getMe",
          payload: result.data.data.currentUser[0],
        });
        // console.log("resultMEEEEEEEEE", result);
      }
    }
    getMe();
  }, []);
  // console.log("meeee", Me);
  // console.log("allUserRecallUserRec", allUserRec);
  return (
    <GlobalContext.Provider
      value={{
        friends,
        numUnreadMegs,
        editUnReadMegsNum,
        editUnReadMegsBySend,
        editAllUserRec,
        allFriendsReq,
        getFriendReq,
        Me,
        allUserRec,
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
