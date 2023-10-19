import React, { useEffect, useState } from "react";
import CONSTANTS from "../../CONSTANTS";
import TweetButton from "../External/TweetButton";
import { useNavigate } from "react-router-dom";

function CompLeaderboardSlot({ Username, item, data, userAlltimeTotals }) {
  const navigate = useNavigate();

  function ordinalSuffix(number) {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits > 10 && lastTwoDigits < 20) {
      return "th";
    }

    switch (lastDigit) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  const twitterMessageGenerator = () => {
    let message = "";
    switch (item) {
      case "Balance":
        message = `I am the ${data.you}${ordinalSuffix(
          data.you,
        )} richest farmgame farmer in the world!\nI have $${userAlltimeTotals[
          item
        ]?.toLocaleString()}.\nCheck me out on the leaderboards at https://farmgame.live/profile/${Username}`;
        break;
      case "XP":
        message = `I am the ${data.you}${ordinalSuffix(
          data.you,
        )} best farmgame farmer in the world!\nI have ${userAlltimeTotals[
          item
        ]?.toLocaleString()} XP.\nCheck me out on the leaderboards at https://farmgame.live/profile/${Username}`;
        break;
      default:
        let itemName =
          item === 1 ? item : CONSTANTS.InventoryDescriptionsPlural[item][0];
        itemName = itemName.toLowerCase();
        message = `I am the ${data.you}${ordinalSuffix(
          data.you,
        )} best ${item} farmer in the world!\nI have farmed ${userAlltimeTotals[
          item
        ]?.toLocaleString()} ${itemName}.\nCheck me out on the leaderboards at https://farmgame.live/profile/${Username}`;
        break;
    }
    return message;
  };

  const userText = (place, username, count) => {
    const defaultPodiumStyles = {
      width: "2.4vw",
      display: "inline-block",
      padding: "0 5px",
    };
    const podiumStyles = [
      { color: "#fec32d" },
      { color: "silver" },
      { color: "brown" },
    ];
    const nameLink = { cursor: "pointer" };
    return (
      <p>
        <span style={{ ...podiumStyles[place - 1], ...defaultPodiumStyles }}>
          {place}
          <sup>{ordinalSuffix(place)} </sup>
        </span>
        <span
          style={username ? nameLink : {}}
          onClick={() => {
            if (username) {
              navigate(`/profile/${username}`, {
                state: { from: "leaderboard" },
              });
            }
          }}
        >
          {username === "" ? "Guest" : username}
        </span>
        : {(item === "Balance" ? "$" : "" )}{count?.toLocaleString()}
      </p>
    );
  };

  return data === undefined ? (
    <div></div>
  ) : (
    <div
      id="leaderboard-slot"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div
        id="img_and_data"
        style={{
          display: "flex",
          flexDirection: "row",
          border: "2px solid var(--black)",
          height: "100%",
          width: "100%",
        }}
      >
        <div
          id="icon"
          style={{
            width: "28%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/`.concat(
              item.concat(".png"),
            )}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              border: "2px solid black",
              borderRadius: "50%",
              alignSelf: "center",
              background: "var(--menu_lighter)",
            }}
          />
        </div>

        <div
          id="spans"
          style={{
            width: "72%",
            padding: "2% 2%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            wordBreak: "break-word",
            fontSize: "1vw",
          }}
        >
          <p
            style={{
              textAlign: "center",
              textDecoration: "underline",
              textTransform: "uppercase",
              fontSize: "1.3vw",
            }}
          >
            {CONSTANTS.InventoryDescriptions[item][0]}
          </p>
          <p>{userText(1, data.first.Username, data?.first?.[item])}</p>
          <p>{userText(2, data.second.Username, data?.second?.[item])}</p>
          <p>{userText(3, data.third.Username, data?.third?.[item])}</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              color: "gray",
            }}
          >
            <p>You: {data.you === -1 ? "" : data.you}</p>
            <sup>{ordinalSuffix(data.you)}</sup>
            <span style={{ marginLeft: "8px" }}>
              <TweetButton message={twitterMessageGenerator()} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompLeaderboardSlot;
