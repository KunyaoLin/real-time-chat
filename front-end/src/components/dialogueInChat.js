import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
function DialogueInChat({
  dialogues,
  currentFriInfo,
  Me,
  myavatarUrl,
  friendAvatarUrl,
}) {
  const sender = dialogues.senderEmail;
  const friendEmail = currentFriInfo.email;

  return (
    <>
      {sender === friendEmail ? (
        <div className="flex flex-row p-2">
          <span>
            <Avatar
              // src={`${props.name}.png`}
              src={friendAvatarUrl}
              alt={friendAvatarUrl}
              sx={{
                fontSize: 10,
              }}
            ></Avatar>
          </span>
          <Box
            sx={{
              maxWidth: "500px",
              minWidth: "50px",
              minHeight: "40px",
              padding: "10px",
              backgroundColor: sender === friendEmail ? "#e0e0e0" : "#4caf50",
              color: sender === friendEmail ? "white" : "black",
              borderRadius: "15px",
              alignSelf: sender === friendEmail ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: sender === friendEmail ? "black" : "white",
              }}
            >
              {dialogues.message}
            </Typography>
          </Box>
        </div>
      ) : (
        <div className="flex flex-row justify-end p-2">
          <Box
            sx={{
              maxWidth: "500px",
              minWidth: "50px",
              minHeight: "40px",
              padding: "10px",
              backgroundColor: sender === friendEmail ? "#e0e0e0" : "#4caf50",
              color: sender === friendEmail ? "white" : "black",
              borderRadius: "15px",
              alignSelf: sender === friendEmail ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <Typography variant="body1">{dialogues.message}</Typography>
          </Box>
          <span>
            <Avatar
              //   src={`${props.name}.png`}
              src={myavatarUrl}
              alt={myavatarUrl}
              sx={{
                fontSize: 10,
              }}
            ></Avatar>
          </span>
        </div>
      )}
    </>
  );
}
export default DialogueInChat;
