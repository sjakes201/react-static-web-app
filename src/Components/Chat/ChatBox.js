import React, { useState, useEffect, useContext } from "react";
import "./ChatBox.css";
import Draggable from "react-draggable";
import { useWebSocket } from "../../WebSocketContext";
import { useNavigate, useLocation } from "react-router-dom";
import { GameContext } from "../../GameContainer";

function ChatBox({ chatMessages }) {
  const { waitForServerResponse } = useWebSocket();
  const { setMsgNotification, myTownName, setTownChatBox } = useContext(GameContext)
  const navigate = useNavigate();
  const location = useLocation();

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messageBox = document.querySelector(".messageBox");
    if (messageBox.scrollTop > -75) {
      messageBox.scrollTop = 0;
    }
    if (chatMessages.length > 0) {
      const highestID = Math.max(...chatMessages.map((item) => item.messageID));
      if (waitForServerResponse) {
        waitForServerResponse("readTownMessage", {
          messageID: highestID,
        });
      }
    }
    setMsgNotification(false);
  }, [chatMessages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Check if 'Enter' was pressed and ensure 'Shift' wasn't held down
      e.preventDefault(); // Prevents the default behavior of creating a new line
      sendMessage();
    }
  };

  const handleMsgChange = (e) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = async () => {
    if (waitForServerResponse) {
      let msgResult = await waitForServerResponse("createTownMessage", {
        messageContent: newMessage,
      });
      if (msgResult.body.messageContent) {
        setNewMessage("");
      }
    }
  };

  const msgBubble = (text, userWhoSent) => {
    if (userWhoSent === 'Server') {
      return (
        <div className='msgBubble'>
          <p className='broadcastContent'>{<i>{text}</i>}</p>
        </div>
      );
    }
    return (
      <div className='msgBubble'>
        <span
          onClick={() =>
            navigate(`/profile/${userWhoSent}`, {
              state: {
                from: location.pathname
                  .substring(1, location.pathname.length)
                  .includes("profile")
                  ? "plants"
                  : location.pathname.substring(1, location.pathname.length),
              },
            })
          }
          className="fromUser"
        >
          {userWhoSent}:
        </span>
        <span className='msgContent'>{text}</span>
      </div>
    );
  };

  return (
    <Draggable handle=".chatTabBar">
      <div className="chatContainer">
        <div className="chatTabBar">
          <p>{myTownName ? myTownName : 'Town'} chat</p>
          <p id="chatx" onClick={() => setTownChatBox(false)}>
            X
          </p>
        </div>
        <div className="messageBox">
          {myTownName === "" ? <i>Not currently in a town</i> : chatMessages.map((txt) => msgBubble(txt.content, txt.Username))}
        </div>
        <div className="newMessageBox">
          <textarea
            type="text"
            className="chatInput"
            maxLength={512}
            autoFocus={true}
            value={newMessage}
            onChange={handleMsgChange}
            onKeyDown={handleKeyDown}
          ></textarea>
          <p id="chatSend" onClick={() => sendMessage()}>
            {">"}
          </p>
        </div>
      </div>
    </Draggable>
  );
}

export default ChatBox;
