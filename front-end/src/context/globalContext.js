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
  openSetting: false,
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
      return { ...state, friends: [...action.payload] };
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
    case "handleSettingChat":
      return {
        ...state,
        openSetting: action.payload,
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
      openSetting,
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
  function handleSettingChat(open) {
    dispatch({
      type: "handleSettingChat",
      payload: open,
    });
  }
  async function getAllFriendReq() {
    const result = await axios({
      url: `${URL}/friends/request`,
      method: "GET",
      withCredentials: true,
    });
    // console.log("result:", result);
    if (Object.keys(result.data.data).length !== 0) {
      // console.log("have friends req now");

      dispatch({
        type: "getAllFriendsReq",
        payload: result.data.data.allReq,
      });
    } else {
      // console.log("NO friends req now");
      dispatch({
        type: "getAllFriendsReq",
        payload: [],
      });
    }
  }
  async function getAllChatRecord() {
    try {
      const res = await axios({
        method: "GET",
        url: `${URL}/chat/getChatRecord`,
        withCredentials: true,
      });
      if (res && res.data) {
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
  const getAllFriends = async () => {
    try {
      const res = await axios({
        url: `${URL}/friends/getAllFriends`,
        method: "GET",
        withCredentials: true,
      });
      if (!res) throw new Error("get friends info error");

      if (res.data.data.FriendsContact.length === 0) {
        dispatch({
          type: "getAllFriendsInfo",
          payload: [],
        });
      } else {
        const friendsList = res.data.data.FriendsContact.filter((el) => {
          return el.friends.length !== 0;
        }).sort((a, b) => {
          return b.friends[0].onlineStatus === a.friends[0].onlineStatus
            ? 0
            : b.friends[0].onlineStatus
            ? 1
            : -1;
        });

        dispatch({
          type: "getAllFriendsInfo",
          payload: friendsList,
        });
      }

      // return { friendsList };
    } catch (err) {
      // console.error("Error in getAllFriends:", err.message);
    }
  };
  async function getAllUnReadMegs() {
    const result = await axios({
      url: `${URL}/chat/getAllUnreadMegsNum`,
      method: "GET",
      withCredentials: true,
    });
    // console.log("result", result);
    if (result) {
      dispatch({
        type: "getAllUnreadMegs",
        payload: result.data.data.unReadMegs,
      });
    }
  }

  //get all friReq/UnReadMegs/AllFriends/AllChatRecord
  useEffect(() => {
    getAllFriendReq();
    getAllUnReadMegs();
    getAllFriends();
    getAllChatRecord();
    const intervalId = setInterval(() => {
      getAllFriendReq();
      getAllUnReadMegs();
      getAllFriends();
      getAllChatRecord();
    }, 20000);

    return () => {
      clearInterval(intervalId);
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
        getAllFriendReq,
        getAllChatRecord,
        getAllFriends,
        getAllUnReadMegs,
        currentFriInfo,
        handleChatWindow,
        handleCurUserAllmegs,
        handleSettingChat,
        Me,
        openSetting,
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
