import axios from "axios";
import React, { createContext, useContext, useEffect, useReducer } from "react";
const URL = process.env.REACT_APP_SERVER_URL;

const initialState = {
  numUnreadMegs: 0,
  friends: [],
  allFriendsReq: [],
  Me: {},
  currentFriInfo: "",
  allUserRec: [],
  openChat: false,
  allCurUserMessageRec: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "getAllUnreadMegs":
      return { ...state, numUnreadMegs: action.payload };
    case "editUnreadMegs":
      return {
        ...state,
        numUnreadMegs: state.numUnreadMegs + action.payload,
      };
    case "getAllFriendsInfo":
      return { ...state, friends: action.payload };
    case "getAllFriendsReq":
      return { ...state, allFriendsReq: action.payload };
    case "getAllRec":
      return { ...state, allUserRec: action.payload };
    case "getMe":
      return { ...state, Me: action.payload };
    // case "handleFriReq":
    //   return { ...state, editFriReq: action.payload };
    case "setCurrentFriInfo":
      return {
        ...state,
        currentFriInfo: action.payload,
      };
    case "openChatWindow":
      return {
        ...state,
        openChat: action.payload,
      };
    case "handleCurChatMegs":
      return {
        ...state,
        allCurUserMessageRec: [...state.allCurUserMessageRec, action.payload],
      };
    case "handleCurChatMegsByClick":
      return {
        ...state,
        allCurUserMessageRec: action.payload,
      };
    default:
      throw new Error("unknow action");
  }
}

const GlobalContext = createContext();
const GlobalContextProvider = ({ children }) => {
  const [
    {
      numUnreadMegs,
      friends,
      allFriendsReq,
      Me,
      allUserRec,
      currentFriInfo,
      openChat,
      allCurUserMessageRec,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  function editUnReadMegsNumByClick(num) {
    dispatch({
      type: "editUnreadMegs",
      payload: -num,
    });
    // console.log("num:", -num);
  }
  function editUnReadMegsBySend() {
    dispatch({
      type: "editUnreadMegs",
      payload: 1,
    });
  }
  function editAllUserRec(rec) {
    dispatch({
      type: "getAllRec",
      payload: rec,
    });
  }
  function editCurrentFriInfo(info) {
    dispatch({
      type: "setCurrentFriInfo",
      payload: info,
    });
  }
  function handleChatWindow(open) {
    dispatch({
      type: "openChatWindow",
      payload: open,
    });
  }
  function handleCurUserAllmegs(megs) {
    dispatch({
      type: "handleCurChatMegs",
      payload: megs,
    });
  }
  function handleCurUserAllmegsByClick(megsArr) {
    dispatch({
      type: "handleCurChatMegsByClick",
      payload: megsArr,
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
  async function getAllChatRecord(e) {
    try {
      const res = await axios({
        method: "GET",
        url: `${URL}/chat/getChatRecord`,
        withCredentials: true,
      });
      if (e && res && res.data) {
        dispatch({
          type: "getAllRec",
          payload: res.data.results,
        });
      }
      // console.log(" res.data.results:", res.data.results);
    } catch (err) {
      dispatch({
        type: "getAllRec",
        payload: [],
      });
    }
    // if (!isCancel) setTimeout(getAllChatRecord, 3000); //loop data for every 3s
  }
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
      return { success: true };
    } catch (err) {}
  }
  async function getAllUnReadMegs() {
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
      // console.log("result", result);
      // console.log("numUnreadMegs", numUnreadMegs);
    }
  }
  //get all unread megs num
  useEffect(() => {
    getAllUnReadMegs();
  }, []);
  // get all friends
  useEffect(() => {
    getAllFriends();
  }, []);
  //get all friReq
  useEffect(() => {
    getFriendReq();
  }, []);
  //get all chatRec
  useEffect(() => {
    let isCreate = true;

    //点击创建聊天后，没有新增对话框左边，另外聊天里面没有创建的对话记录
    getAllChatRecord(isCreate);

    return () => {
      isCreate = false;
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

  return (
    <GlobalContext.Provider
      value={{
        friends,
        numUnreadMegs,
        editUnReadMegsNumByClick,
        editUnReadMegsBySend,
        editAllUserRec,
        editCurrentFriInfo,
        allFriendsReq,
        getFriendReq,
        getAllChatRecord,
        getAllFriends,
        getAllUnReadMegs,
        currentFriInfo,
        handleChatWindow,
        handleCurUserAllmegs,
        Me,
        allUserRec,
        openChat,
        allCurUserMessageRec,
        handleCurUserAllmegsByClick,
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
