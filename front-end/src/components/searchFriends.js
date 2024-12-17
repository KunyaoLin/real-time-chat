import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlinePersonSearch } from "react-icons/md";
import { useGlobalContext } from "../context/globalContext";
import { PiSpinnerGapBold } from "react-icons/pi";
import axios from "axios";
import AddFriendIcon from "./AddFriendIcon";
import { IoMdSearch } from "react-icons/io";
const URL = process.env.REACT_APP_SERVER_URL;

function SearchFriend() {
  const [visiable, setVisiable] = useState(false);
  const [animateout, setAnimateout] = useState(false);
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState({});
  const [loading, SetLoading] = useState(false);
  const popUpRef = useRef(null);
  const { Me, friends } = useGlobalContext();
  console.log("searchResult", searchResult);
  console.log("friends", friends);
  console.log("Me", Me);
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
      // console.log("search account error");
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
        setInput("");
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
      // console.log("input", input);
    } else {
      setSearchResult({});
    }
  }, [debounceSearch, input]);
  // console.log("searchResult", searchResult);
  // console.log("ME", Me);
  // console.log("friends", friends);
  // console.log("searchResult.length :", searchResult.length);
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
          <div className="relative flex flex-col space-y-1">
            <div className="relative w-full">
              <IoMdSearch className="absolute top-1 left-1 text-4xl" />
              <input
                type="text"
                placeholder="Search by name..."
                value={input}
                onChange={handleInput}
                //   value={searchTerm}
                className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              ></input>
            </div>

            <div>
              {loading ? (
                <div>
                  <PiSpinnerGapBold />
                </div>
              ) : (
                <div className="pt-1">
                  {searchResult?.data?.message === "success" ? (
                    <div className="flex space-y-1 flex-col">
                      {searchResult.data.data.userFound.map((el) => {
                        const checkBlock = el.blockList.filter((e) => {
                          console.log("check", e.email === Me.email);

                          return e.email === Me.email;
                        });
                        if (
                          checkBlock.length > 0 &&
                          checkBlock[0].email === Me.email
                        ) {
                          return (
                            <div>
                              <p>You are block by this account</p>
                            </div>
                          );
                        }
                        const friendExist = friends.filter((t) => {
                          return t.friends[0].email === el.email;
                        });
                        if (friendExist.length !== 0 || el.email === Me.email) {
                          return (
                            <AddFriendIcon
                              key={el._id}
                              avatar={el.avatar}
                              name={el.username}
                              email={el.email}
                              addSuccess={true}
                            ></AddFriendIcon>
                          );
                        } else {
                          return (
                            <AddFriendIcon
                              key={el._id}
                              email={el.email}
                              URL={URL}
                              avatar={el.avatar}
                              name={el.username}
                            ></AddFriendIcon>
                          );
                        }
                      })}
                    </div>
                  ) : (
                    <div>No user Found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default SearchFriend;
