import React, { useState, useEffect, useContext } from "react";
import "./ChatBox.css";
import MessageBubble from "./MessageBubble";
import Draggable from "react-draggable";
import { useWebSocket } from "../../WebSocketContext";
import { useNavigate, useLocation } from "react-router-dom";
import { GameContext } from "../../GameContainer";

function ChatBox({ chatMessages, setTownChatMsgs }) {
  const { waitForServerResponse } = useWebSocket();
  const { setMsgNotification, myTownName, setTownChatBox, townRoleID, getUser } = useContext(GameContext)

  const [newMessage, setNewMessage] = useState("");

  // "PLAYER_CHAT" for main chat messages, "TOWN_BROADCAST" for broadcasts from leaders
  const [chatType, setChatType] = useState("PLAYER_CHAT");

  useEffect(() => {
    const messageBox = document.querySelector(".messageBox");
    if (messageBox.scrollTop > -75) {
      messageBox.scrollTop = 0;
    }
    if (chatMessages.length > 0) {
      const highestID = Math.max(...chatMessages.filter(msg => msg.messageID).map((item) => item.messageID));
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
      sendMessage(chatType);
    }
  };

  const handleMsgChange = (e) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = async (msgType) => {
    if (!newMessage.replace(/\s/g, '').length) { console.log('only whitespace'); return };
    if (waitForServerResponse) {
      let msgResult = await waitForServerResponse("createTownMessage", {
        messageContent: newMessage,
        msgType: msgType
      });
      if (msgResult.body.messageContent) {
        setNewMessage("");
      }
    }
  };


  const resolveJoinRequest = async (requestID, isAccepted) => {
    if (waitForServerResponse) {
      let msgResult = await waitForServerResponse("resolveJoinRequest", {
        requestID: requestID,
        isAccepted: isAccepted
      });
      if (msgResult.body.message?.includes("EXPIRED")) {
        setTownChatMsgs((old) => old.filter((msg => msg.requestID !== requestID)))
      }
    }
  }

  const chatTypeButton = (targetType, buttonID) => {
    const imgSrc = () => {
      switch (targetType) {
        case "PLAYER_CHAT":
          return "textbubble.png"
        case "TOWN_BROADCAST":
          return "townAnnouncement.png"
      }
    }
    return (
      <button
        className='chat-type-button yellow-border-thin clickable'
        id={buttonID}
        onClick={() => setChatType(targetType)}
      >
        <img src={`${process.env.PUBLIC_URL}/assets/images/GUI/${imgSrc()}`} />
      </button>
    )
  }

  const getMessages = () => {
    const myUser = getUser();
    switch (chatType) {
      case "PLAYER_CHAT":
        return chatMessages.filter(txt =>
          (txt.Type === "PLAYER_CHAT" || txt.Type === "SERVER_NOTIFICATION" || txt.Type === "TOWN_JOIN_REQUEST")).map((txt) =>
            <MessageBubble
              text={txt.content}
              userWhoSent={txt.Username}
              unixTimeStamp={txt.timestamp}
              requestID={txt.requestID}
              type={txt.Type}
              townRoleID={townRoleID}
              resolveJoinRequest={resolveJoinRequest}
              myUser={myUser}
            />)
      case "TOWN_BROADCAST":
        return chatMessages.filter(txt => txt.Type === "TOWN_BROADCAST").map((txt) =>
          <MessageBubble
            text={txt.content}
            userWhoSent={txt.Username}
            unixTimeStamp={txt.timestamp}
            type={txt.Type}
            myUser={myUser}
          />)
    }
  }

  return (
    <Draggable handle=".chatTabBar">
      <div className="chatContainer">
        {chatTypeButton("PLAYER_CHAT", "top-button")}
        {chatTypeButton("TOWN_BROADCAST", "middle-button")}
        <div className="chatTabBar">
          <p>{myTownName ? myTownName : 'Town'} {chatType === "PLAYER_CHAT" ? "chat" : "announcements"}</p>
          <p id="chatx" onClick={() => setTownChatBox(false)}>
            X
          </p>
        </div>
        <div className={`messageBox ${(chatType === "TOWN_BROADCAST" && townRoleID < 3) ? 'announcement-box' : ''}`}>
          {myTownName === "" ?
            <i>Not currently in a town</i>
            :
            getMessages()
          }
        </div>

        {(chatType === "PLAYER_CHAT" || (chatType === "TOWN_BROADCAST" && townRoleID >= 3)) &&
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
            <p id="chatSend" onClick={() => {
              sendMessage(chatType);
              if (window.gtag) {
                window.gtag('event', 'town_chat', {
                  'event_category': 'Social',
                  'event_label': 'Sent Town Chat'
                })
              }
            }}
              className='basic-center'>
              {chatType === "TOWN_BROADCAST" && (<img id='sendTownAnnouncement' src={`${process.env.PUBLIC_URL}/assets/images/GUI/sendTownAnnouncement.png`} />)}
              {chatType === "PLAYER_CHAT" && ">"}
            </p>
          </div>
        }
      </div>
    </Draggable>
  );
}

export default ChatBox;
