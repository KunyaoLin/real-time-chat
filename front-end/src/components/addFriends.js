import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlinePersonSearch } from "react-icons/md";
import { useGlobalContext } from "../context/globalContext";
import { PiSpinnerGapBold } from "react-icons/pi";
import axios from "axios";
const URL = process.env.REACT_APP_SERVER_URL;

function AddFriends() {
  const [visiable, setVisiable] = useState(false);
  const [animateout, setAnimateout] = useState(false);
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, SetLoading] = useState(false);
  const popUpRef = useRef(null);
  const { allFriendsReq } = useGlobalContext();

  const handleInput = (e) => {
    setInput(e.target.value);
  };
  const handleAnimate = () => {
    setAnimateout(true);
    setTimeout(() => {
      setAnimateout(false);
      setVisiable(false);
    }, 300);
  };
  const handlePopUp = () => {
    if (visiable) {
      handleAnimate();
    } else {
      setVisiable(true);
    }
  };
  const searchFriend = async (term) => {
    SetLoading(true);
    try {
      const result = await axios({
        url: `${URL}/friends/search?query=${term}`,
        method: "GET",
        withCredentials: true,
      });
      //   const data = await result;
      setSearchResult(result);
    } catch (err) {
      console.log("err", err);
      console.log("search account error");
    } finally {
      SetLoading(false);
    }
  };
  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  const debounceSearch = useCallback(
    debounce((term) => searchFriend(term), 500),
    []
  );
  //   console.log("searchValue", searchValue);
  useEffect(() => {
    const handleGlobalPopUp = (e) => {
      if (popUpRef.current && !popUpRef.current.contains(e.target)) {
        handleAnimate();
      }
    };

    document.addEventListener("mousedown", handleGlobalPopUp);
    return () => {
      document.removeEventListener("mousedown", handleGlobalPopUp);
    };
  }, []);
  useEffect(() => {
    if (input.trim() !== "") {
      debounceSearch(input);
    } else {
      setSearchResult([]);
    }
  }, [debounceSearch, input]);
  console.log("searchResult", searchResult);
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      {" "}
      <button onClick={handlePopUp}>
        <MdOutlinePersonSearch style={{ color: "white", fontSize: "30px" }} />
      </button>
      {visiable && (
        <div
          className={`addFriendpopUp ${
            animateout ? "hidden" : "active"
          } space-y-1`}
          ref={popUpRef}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Input email address..."
              value={input}
              onChange={handleInput}
              //   value={searchTerm}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default AddFriends;
