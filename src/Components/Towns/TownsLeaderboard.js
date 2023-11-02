import { useWebSocket } from "../../WebSocketContext";
import "./TownsLeaderboard.css";
import React, { useState, useEffect } from "react";
import TownInterface from "./TownInterface";
import TOWNSINFO from "../../TOWNSINFO";
import { calcTownLevel, calcPerkLevels } from "../../townHelpers.js";

function TownsLeaderboard({ reloadTownPerks, updateBalance, updateXP }) {
  const { waitForServerResponse } = useWebSocket();

  const [topTowns, setTopTowns] = useState([]);

  const [viewing, setViewing] = useState("");

  const getTopTowns = async () => {
    if (waitForServerResponse) {
      let response = await waitForServerResponse("getTopTowns", {});
      setTopTowns(response.body.townArray);
    }
  };

  useEffect(() => {
    getTopTowns();
  }, []);

  const townLeaderboardSlot = (town, position) => {
    let topClass = "";
    switch (position) {
      case 1:
        topClass = "townFirst";
        break;
      case 2:
        topClass = "townSecond";
        break;
      case 3:
        topClass = "townThird";
        break;
    }
    let townLevel = calcTownLevel(town.townXP)[0];

    return (
      <div key={position} className="townLeaderboardSlot">
        <p className={`townPos ${topClass} basicCenter`}>{position}</p>
        <div
          className="townLeaderboardCard"
          onClick={() => setViewing(town.townName)}
        >
          <div className="lbCardLeft">
            <img
              className="lbTownLogo"
              src={`${process.env.PUBLIC_URL}/assets/images/townIcons/${
                TOWNSINFO.townIcons[town.townLogoNum]
              }.png`}
            />
            <p className="lbTownName">{town.townName}</p>
            <p className="lbTownLevel">town lvl {townLevel}</p>
          </div>
          <div className="lbCardRight">
            <p className={town.status === "OPEN" ? "lbTownStatus" : ""}>
              {town.status}
            </p>
            <p className="lbMemberCount">{town.memberCount}/25</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="townsLeaderboardContainer">
      {viewing && (
        <div className="searchViewInterface">
          <TownInterface
            reloadTownPerks={reloadTownPerks}
            updateBalance={updateBalance}
            updateXP={updateXP}
            townName={viewing}
            backArrow={() => {
              setViewing("");
            }}
          />
        </div>
      )}
      <div className="townSlotList">
        {topTowns.map((town, index) => townLeaderboardSlot(town, index + 1))}
      </div>
    </div>
  );
}
export default TownsLeaderboard;
