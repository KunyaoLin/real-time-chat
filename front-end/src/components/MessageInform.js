import React, { useEffect, useState } from "react";
function MessageInform(props) {
  const [number, setNumber] = useState("");
  useEffect(() => {
    const num = () => {
      if (props.num > 99) {
        setNumber("99+");
      } else {
        setNumber(props.num);
      }
    };
    num();
  }, [props.num]);
  console.log("num", props.num);
  console.log("number", number);

  return (
    <span
      style={{
        position: "absolute",
        top: "-5px",
        right: "-5px",
        backgroundColor: "red",
        color: "white",
        borderRadius: "50%",
        width: "16px",
        height: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "10px",
        fontWeight: "bold",
      }}
    >
      {number}
    </span>
  );
}
export default MessageInform;
