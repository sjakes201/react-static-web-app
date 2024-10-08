import TownInterface from "../Components/Towns/TownInterface";
import TownSearch from "../Components/Towns/TownSearch";
import TownsLeaderboard from "../Components/Towns/TownsLeaderboard";

import "./CSS/TownsScreen.css";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { GameContext } from "../GameContainer";

function TownsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateBalance, updateXP, reloadTownPerks, msgNotification, setTownChatBox, myTownName } = useContext(GameContext)


  const { townName } = useParams();

  const [town, setTown] = useState("");
  const [screen, setScreen] = useState("TownSearch");

  const tipTimer1 = useRef(null);
  const tipTimer2 = useRef(null);
  const tipTimer3 = useRef(null);
  const [tip1, setTip1] = useState(false);
  const [tip2, setTip2] = useState(false);
  const [tip3, setTip3] = useState(false);

  const handleMouseEnter = (tip) => {
    switch (tip) {
      case 1:
        tipTimer1.current = setTimeout(() => setTip1(true), 800);
        break;
      case 2:
        tipTimer2.current = setTimeout(() => setTip2(true), 800);
        break;
      case 3:
        tipTimer3.current = setTimeout(() => setTip3(true), 800);
        break;
    }
  };

  const handleMouseLeave = (tip) => {
    switch (tip) {
      case 1:
        clearTimeout(tipTimer1.current);
        setTip1(false);
        break;
      case 2:
        clearTimeout(tipTimer2.current);
        setTip2(false);
        break;
      case 3:
        clearTimeout(tipTimer3.current);
        setTip3(false);
        break;
    }
  };

  const toolTip = (text) => {
    return <div className="townNavTip">{text}</div>;
  };

  const backArrow = () => {
    const backFunc = () => {
      if (location?.state?.from) {
        return () => navigate(`/${location.state.from}`);
      } else {
        return () => navigate("/plants");
      }
    };

    return (
      <img
        src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_light.png`}
        alt="back-arrow"
        onClick={backFunc()}
        className="townsScreenBackArrow"
        draggable={false}
      />
    );
  };

  useEffect(() => {
    if (townName) {
      setScreen("TownInterface");
      setTown(townName);
    } else if (myTownName) {
      setScreen("TownInterface");
      setTown(myTownName);
    }
  }, [myTownName, townName]);

  return (
    <div className="townsScreenContainer">
      {backArrow()}
      <div
        className='aipAd basicCenter'
      >
        <div className='innerSkyscraper'>
        </div>

      </div>

      <div className="townsScreenCenter basicCenter">
        <div className="townsNavButtons">
          <div
            className={`townsNavButton ${town === "" ? "lockedButton" : ""} ${screen === "TownInterface" ? "activeButton" : ""
              }`}
          >
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/singleHouse.png`}
              onClick={() => {
                if (town !== "") setScreen("TownInterface");
              }}
              onMouseEnter={() => handleMouseEnter(1)}
              onMouseLeave={() => handleMouseLeave(1)}
            />
            {tip1 && toolTip("Your Town")}
          </div>
          <div
            className={`townsNavButton ${screen === "TownSearch" ? "activeButton" : ""
              }`}
          >
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/searchRed.png`}
              onClick={() => setScreen("TownSearch")}
              onMouseEnter={() => handleMouseEnter(2)}
              onMouseLeave={() => handleMouseLeave(2)}
            />
            {tip2 && toolTip("Town Search")}
          </div>

          <div
            className={`townsNavButton ${screen === "TownLeaderboard" ? "activeButton" : ""
              }`}
          >
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/leaderboard.png`}
              onClick={() => setScreen("TownLeaderboard")}
              onMouseEnter={() => handleMouseEnter(3)}
              onMouseLeave={() => handleMouseLeave(3)}
            />
            {tip3 && toolTip("Town Leaderboards")}
          </div>
        </div>
        {screen === "TownInterface" && town !== "" && (
          <TownInterface
            msgNotification={msgNotification}
            setTownChatBox={setTownChatBox}
            updateBalance={updateBalance}
            updateXP={updateXP}
            reloadTownPerks={reloadTownPerks}
            townName={town}
            setScreen={setScreen}
            setTown={setTown}
          />
        )}
        {screen === "TownSearch" && (
          <TownSearch
            updateBalance={updateBalance}
            updateXP={updateXP}
            reloadTownPerks={reloadTownPerks}
            playerInTown={town}
            setScreen={setScreen}
            setTown={setTown}
          />
        )}
        {screen === "TownLeaderboard" && (
          <TownsLeaderboard
            updateBalance={updateBalance}
            updateXP={updateXP}
            reloadTownPerks={reloadTownPerks}
          />
        )}
        <div className='town-bottom-rail'>
          
        </div>
      </div>

      <div
        className='aipAd basicCenter'
      >
        <div className='innerSkyscraper'>
        </div>

      </div>
    </div>
  );
}

export default TownsScreen;
