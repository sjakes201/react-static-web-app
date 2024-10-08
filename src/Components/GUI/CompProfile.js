import React, { useEffect, useState, useRef, useContext } from "react";
import "../CSS/CompProfile.css";
import CONSTANTS from "../../CONSTANTS";
import { useNavigate, useLocation } from "react-router-dom";
import ScrollingText from "./ScrollingText";
import { GameContext } from "../../GameContainer";
import MoneyDisplay from "./MoneyDisplay";
import AccountDropdown from "./AccountDropdown";

function CompProfile({
  type,
  orderNotice,
  disableBorder,
  noPFP,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { getBal, getXP, getUser, setLoginBox, setOrderBoard, profilePic,
    getCurrentSeason, setSeasonsInfoBox, premiumCurrency, alertProfile, setAlertProfile } = useContext(GameContext)

  const [bal, setBal] = useState(0);
  const [user, setUser] = useState("");
  const [xp, setXP] = useState(0);

  const [loggedIn, setLoggedIn] = useState(false);
  const [dropDown, setDropDown] = useState(false)

  // Tooltips for buttons management
  const [tool1, setTool1] = useState(false);
  const [tool2, setTool2] = useState(false);
  const [tool3, setTool3] = useState(false);
  const [tool4, setTool4] = useState(false);
  const [tool5, setTool5] = useState(false);

  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();

  const handleMouseOver = (buttonNum) => {
    switch (buttonNum) {
      case 1:
        ref1.current = setTimeout(() => {
          setTool1(true);
        }, 500);
        break;
      case 2:
        ref2.current = setTimeout(() => {
          setTool2(true);
        }, 500);
        break;
      case 3:
        ref3.current = setTimeout(() => {
          setTool3(true);
        }, 500);
        break;
      case 4:
        ref4.current = setTimeout(() => {
          setTool4(true);
        }, 500);
        break;
      case 5:
        ref5.current = setTimeout(() => {
          setTool5(true);
        }, 500);
        break;
    }
  };

  const handleMouseOut = (buttonNum) => {
    // clear timeout when mouse leaves
    switch (buttonNum) {
      case 1:
        clearTimeout(ref1.current);
        setTool1(false);
        break;
      case 2:
        clearTimeout(ref2.current);
        setTool2(false);
        break;
      case 3:
        clearTimeout(ref3.current);
        setTool3(false);
        break;
      case 4:
        clearTimeout(ref4.current);
        setTool4(false);
        break;
      case 5:
        clearTimeout(ref5.current);
        setTool5(false);
        break;
    }
  };

  useEffect(() => {
    setBal(getBal());
    let user = getUser();
    if (user && !user.includes("Farmer-")) {
      // they are considered 'logged in' when they have a claimed account, guest accounts are 'logged out'
      setLoggedIn(true);
    }
    setUser(getUser());
    setXP(getXP());
  }, [getBal, getUser, getXP]);

  // Take integer XP, return object {level: int, overflow: xx, nextLvl: yy} for the current level and how close you are to next level

  const [showXP, setShowXP] = useState(false);

  // Used in calculating unlocks and creating XP bar
  function xpBarInfo(XP) {
    const lvlThresholds = CONSTANTS.xpToLevel;
    let level = 0;
    let remainingXP = XP;
    for (let i = 0; i < lvlThresholds.length; ++i) {
      if (XP >= lvlThresholds[i]) {
        level = i;
        remainingXP = XP - lvlThresholds[i];
      }
    }
    // If level is >= 15, and remainingXP is > 0, we calculate remaining levels (which are formulaic, each level is)
    while (remainingXP >= 600) {
      ++level;
      remainingXP -= 600;
    }
    // find next threshold
    let nextXPThreshold = 100;
    if (level < lvlThresholds.length - 1) {
      nextXPThreshold = lvlThresholds[level + 1] - lvlThresholds[level];
    } else {
      nextXPThreshold = 600;
    }
    return {
      level: level,
      overflow: remainingXP,
      nextLvlThresholdTotal: nextXPThreshold,
    };
  }

  function xpProgressBar(XP) {
    let barInfo = xpBarInfo(XP);

    return (
      <div
        className="levelInfoContainer"
        onMouseEnter={() => setShowXP(true)}
        onMouseLeave={() => setShowXP(false)}
      >
        <div className="levelTopBar">
          <p id="levelPrefix">LVL {barInfo.level}</p>
          {showXP && (
            <p className="hoverXPCount">
              {barInfo.overflow} / {barInfo.nextLvlThresholdTotal} XP
            </p>
          )}
        </div>
        <div className="xpBarContainer">
          <div
            style={{
              height: "100%",
              borderRight: "1px solid black",
              width: "100%",
              background: "lightblue",
              position: "absolute",
              right: `${100 - (barInfo.overflow / barInfo.nextLvlThresholdTotal) * 100
                }%`,
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`user-profile ${disableBorder ? "" : "orangeBorder"}`}>
      <div className="user-info">

        {!noPFP && (
          <div
            className="pfp"
            onClick={() =>
              navigate("/profile", {
                state: {
                  from: location.pathname.substring(
                    1,
                    location.pathname.length,
                  ),
                },
              })
            }
          >
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/profilePics/${profilePic}.png`}
              alt="profile pic"
            />
            {tool1 && <div className="toolTip">Profile info</div>}

          </div>
        )}

        <div
          className="profile-stats clickable"
          onClick={() =>
            navigate("/profile", {
              state: {
                from: location.pathname.substring(
                  1,
                  location.pathname.length,
                ),
              },
            })
          }
        >
          <div>{user && user.includes("Farmer-") ? "Farmer" : user}</div>
          {xpProgressBar(xp)}
          <div className='currencies-area'>
            <MoneyDisplay amount={bal} />
            <p className='premium-currency'>
              <img src={`${process.env.PUBLIC_URL}/assets/images/premiumCurrency.png`} />
              <MoneyDisplay amount={premiumCurrency} isPremiumCurrency={true} />
            </p>
          </div>

        </div>

        <div className="login-prompt">
          {!loggedIn && (
            <button
              className="login-button clickable"
              onClick={() => setLoginBox(true)}
            >
              Login
            </button>
          )}
          {loggedIn &&
            <p
              className={`dropdown-button light-border-small basic-center ${dropDown ? 'dropdown-is-open' : ''}`}
              onClick={() => {
                setDropDown(true);
                setAlertProfile(false);
              }}
            >
              {(alertProfile && !dropDown) &&
                <img className='in-profile-notice' src={`${process.env.PUBLIC_URL}/assets/animations/notice.gif`} />
              }
              ▿
            </p>}
          {dropDown && <AccountDropdown closeDropDown={() => setDropDown(false)} />}
          {type === "tall" &&
            <button className='seasons-button basic-center'>

            </button>
          }

          <button className='profile-dc-button clickable'>
            <a
              target="_blank"
              href="https://discord.gg/jrxWrgNCHw"
            >
              <img src={`${process.env.PUBLIC_URL}/assets/images/discord.png`} />
            </a>
          </button>

        </div>
      </div>

      {type === "tall" && (
        <div className="splashArea">
          <ScrollingText />
        </div>
      )}

      {type === "tall" && (
        <div className="profileButtons">

          <div
            className={orderNotice ? "profileLink orderNotice" : "profileLink"}
            id="orderboard-button"
            onMouseOver={() => handleMouseOver(2)}
            onMouseOut={() => handleMouseOut(2)}
            onClick={() => setOrderBoard(true)}
          >
            {tool2 && <div className="toolTip">Orders Board</div>}
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/order-icon.png`}
              alt="orders"
            />
          </div>

          <div
            className="profileLink"
            onMouseOver={() => handleMouseOver(3)}
            onMouseOut={() => handleMouseOut(3)}
            onClick={() =>
              navigate("/leaderboard", {
                state: {
                  from: location.pathname.substring(
                    1,
                    location.pathname.length,
                  ),
                },
              })
            }
          >
            {tool3 && <div className="toolTip">Leaderboard</div>}
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/leaderboard.png`}
              alt="leaderboard"
            />
          </div>

          <div
            className="profileLink"
            onMouseOver={() => handleMouseOver(5)}
            onMouseOut={() => handleMouseOut(5)}
            onClick={() => {
              setSeasonsInfoBox(true)
            }}
          >
            {tool5 && <div className="toolTip">Season Info</div>}
            <img
              alt='seasons info button'
              id='seasons-button-img'
              src={`${process.env.PUBLIC_URL}/assets/images/${getCurrentSeason()}Icon.png`}
            />
          </div>

          <div
            className="profileLink"
            onMouseOver={() => handleMouseOver(4)}
            onMouseOut={() => handleMouseOut(4)}
            onClick={() =>
              navigate("/howtoplay", {
                state: {
                  from: location.pathname.substring(
                    1,
                    location.pathname.length,
                  ),
                },
              })
            }
          >
            {tool4 && <div className="toolTip">How To Play</div>}
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/questionmark.png`}
              alt="info/how to play"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CompProfile;
