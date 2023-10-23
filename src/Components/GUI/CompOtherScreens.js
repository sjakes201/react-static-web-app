import React, { useEffect, useState, useContext } from "react";
import "../CSS/CompOtherScreens.css";
import { Link } from "react-router-dom";
import { GameContext } from '../../GameContainer'

import { useNavigate, useLocation } from "react-router-dom";

// pass parameter for what screen you are at right now

function CompOtherScreens() {

  const location = useLocation();
  const { setTownChatBox, msgNotification, myTownName } = useContext(GameContext)
  const [otherScreens, setOtherScreens] = useState([]);
  const current = location.pathname.substring(1, location.pathname.length);

  const navigate = useNavigate();
  if (localStorage.getItem("token") === null) {
    // no auth token present
    navigate("/");
  }

  const renderScreenButton = (imageSrc, altText, whereTo) => {
    return (
      <Link
        draggable={false}
        to={`/${whereTo}`}
        key={altText}
        className="nav-button"
      >
        {/* <p style={{ height: '50%' }}>{whereTo}</p> */}
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
      if (allScreens[i] === current) {
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
              src={`${process.env.PUBLIC_URL}/assets/images/GUI/textbubble${
                msgNotification ? "_notify" : ""
              }.png`}
              className="townChatButton"
              onClick={() => setTownChatBox((old) => !old)}
            />
          )}
        </div>
      )}
      {current !== "shop" && (
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/machines/deskClickable.png`}
          style={{ height: "100%", objectFit: "contain", cursor: "pointer" }}
          onClick={() => navigate("/machines")}
        />
      )}
    </div>
  );
}

export default CompOtherScreens;
