import React, { useEffect, useState, useContext } from "react";
import MACHINESINFO from "../../MACHINESINFO";
import "../CSS/CompOtherScreens.css";
import { Link } from "react-router-dom";
import { GameContext } from '../../GameContainer'

import { useNavigate, useLocation } from "react-router-dom";

// pass parameter for what screen you are at right now

function CompOtherScreens() {

  const location = useLocation();
  const { setTownChatBox, msgNotification, myTownName, setMoreInfo, machines } = useContext(GameContext)
  const [otherScreens, setOtherScreens] = useState([]);

  const [machineDone, setMachineDone] = useState(false);

  const current = location.pathname.substring(1, location.pathname.length);

  const navigate = useNavigate();
  if (localStorage.getItem("token") === null) {
    // no auth token present
    navigate("/");
  }

  const machineTimeRemaining = (machineTypeID, level, startTime) => {
    if (!level || level === 0 || startTime === -1) return Infinity;
    let totalInfo =
      MACHINESINFO[
      `${MACHINESINFO.machineTypeFromIDS[machineTypeID-1]}MachineInfo`
      ];
    let tierInfo = totalInfo?.[`tier${level}`];
    let timeRemainingSecs = Math.ceil(
      tierInfo?.timeInMs / 1000 - (Date.now() - startTime) / 1000,
    );
    return timeRemainingSecs
  }

  useEffect(() => {
    let closestTime = 0;
    for (let i = 1; i <= 6; ++i) {
      let timeRemaining = machineTimeRemaining(machines[`Slot${i}`], machines[`Slot${i}Level`], machines[`Slot${i}StartTime`]);
      if (timeRemaining <= 0) {
        setMachineDone(true);
        break;
      }
      if(i === 6) {
        setMachineDone(false)
      }
      if (!closestTime || timeRemaining < closestTime) {
        closestTime = timeRemaining;
      }
    }
    let machineDoneTimer = null;
    if (closestTime && closestTime > 0) {
      machineDoneTimer = setTimeout(() => {
        setMachineDone(true);
      }, [closestTime * 1000])
    }
    
    return () => {
      clearTimeout(machineDoneTimer);
    }
  }, [machines])

  const renderScreenButton = (imageSrc, altText, whereTo) => {
    return (
      <Link
        draggable={false}
        to={`/${whereTo}`}
        key={altText}
        className="nav-button"
        onClick={() => {
          if (whereTo !== "plants" && whereTo !== "animals") {
            setMoreInfo(false)
          }
        }}
      >
        <img
          style={{ height: "100%" }}
          key={altText}
          src={imageSrc}
          alt={altText}
          draggable={false}
        />
      </Link>
    );
  };

  const createButtons = () => {
    const allScreens = ["shop", "plants", "animals", "market"];
    const allImgs = [
      `${process.env.PUBLIC_URL}/assets/images/go_shop.png`,
      `${process.env.PUBLIC_URL}/assets/images/go_plants.png`,
      `${process.env.PUBLIC_URL}/assets/images/go_animals.png`,
      `${process.env.PUBLIC_URL}/assets/images/go_market.png`,
    ];
    const allImgsPressed = [
      `${process.env.PUBLIC_URL}/assets/images/go_shop_pressed.png`,
      `${process.env.PUBLIC_URL}/assets/images/go_plants_pressed.png`,
      `${process.env.PUBLIC_URL}/assets/images/go_animals_pressed.png`,
      `${process.env.PUBLIC_URL}/assets/images/go_market_pressed.png`,
    ];
    let otherScreenButtons = [];
    for (let i = 0; i < allScreens.length; ++i) {
      if (allScreens[i] === "plants" && (current === "plants" || current === "")) {
        otherScreenButtons.push(
          renderScreenButton(allImgsPressed[i], allScreens[i], allScreens[i]),
        );
      } else if (allScreens[i] === current) {
        otherScreenButtons.push(
          renderScreenButton(allImgsPressed[i], allScreens[i], allScreens[i]),
        );
      } else {
        otherScreenButtons.push(
          renderScreenButton(allImgs[i], allScreens[i], allScreens[i]),
        );
      }
    }
    setOtherScreens(otherScreenButtons);
  };

  useEffect(() => {
    createButtons();
  }, []);

  const getBubbleImg = () => {
    let type = 'textbubble'
    switch (msgNotification) {
      case 'GOAL':
        type += '_goal';
        break;
      case 'CHAT':
        type += '_chat';
        break;
    }
    return `${process.env.PUBLIC_URL}/assets/images/GUI/${type}.png`
  }

  return (
    <div className="buttons-container bottom-bar">
      {otherScreens}
      {current !== "shop" && (
        <div className="townsButtonContainer">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/townButton2.png`}
            className="townsButton"
            onClick={() =>
              navigate(`/towns/${myTownName}`, {
                state: {
                  from: location.pathname.substring(
                    1,
                    location.pathname.length,
                  ),
                },
              })
            }
          />
          {setTownChatBox && (
            <img
              src={getBubbleImg()}
              className="townChatButton"
              onClick={() => setTownChatBox((old) => !old)}
            />
          )}
        </div>
      )}
      {current !== "shop" && (
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/machines/deskClickable${machineDone ? '_notify' : ''}.png`}
          style={{ height: "100%", objectFit: "contain", cursor: "pointer" }}
          onClick={() => navigate("/machines")}
        />
      )}
    </div>
  );
}

export default CompOtherScreens;
