import "./PlayerCard.css";
import CONSTANTS from "../../CONSTANTS";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PlayerCard({
  username,
  xp,
  roleID,
  contributions,
  myRoleID,
  managementAction,
  reportedTimePassed,
  contributedTownXP
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [demoteConfirm, setDemoteConfirm] = useState(false);
  const demoteTimer = useRef(null);

  const [promoteConfirm, setPromoteConfirm] = useState(false);
  const promoteTimer = useRef(null);

  const [moreButton, setMoreButton] = useState(false);

  useEffect(() => {
    if (demoteConfirm && demoteTimer.current === null) {
      clearTimeout(demoteTimer);
      demoteTimer.current = null;
      demoteTimer.current = setTimeout(() => {
        setDemoteConfirm(false);
        demoteTimer.current = null;
      }, 5000);
    }
    if (promoteConfirm && promoteTimer.current === null) {
      clearTimeout(promoteTimer.current);
      promoteTimer.current = null;
      promoteTimer.current = setTimeout(() => {
        setPromoteConfirm(false);
        promoteTimer.current = null;
      }, 5000);
    }
  }, [demoteConfirm, promoteConfirm]);

  const roles = ["member", "elder", "co-leader", "leader"];

  const calcLevel = (XP) => {
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
    return level;
  };

  const buttonControl = (button) => {
    if (button === "KICK" || button === "DEMOTE") {
      if (demoteConfirm) {
        managementAction(button, username, roleID, myRoleID);
        setDemoteConfirm(false);
        setMoreButton(false);
      } else {
        setDemoteConfirm(true);
      }
    }
    if (button === "PROMOTE") {
      if (promoteConfirm) {
        managementAction("PROMOTE", username, roleID, myRoleID);
        setPromoteConfirm(false);
        setMoreButton(false);
      } else {
        setPromoteConfirm(true);
      }
    }
  };

  const playerInfoCard = () => {
    return (
      <div
        className={`playerMoreInfo`}
        onMouseLeave={() => setMoreButton(false)}
      >
        <span className="playerMoreX">
          -
        </span>
        <div className="individualContributions">
          {Object.keys(contributions).map((good, index) => {
            return (
              <div className="contribution" key={index}>
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/${good}.png`}
                />
                <p>{contributions[good].toLocaleString()}</p>
              </div>
            );
          })}
        </div>
        {myRoleID > roleID && (
          <div className="townAuthControls">
            {(myRoleID > roleID + 1 || myRoleID === 4) && (
              <div
                className="authButton promoteButton basicCenter"
                onClick={() => buttonControl("PROMOTE")}
              >
                {promoteConfirm ? "confirm?" : `${roles[roleID]}`}
              </div>
            )}
            {myRoleID > roleID && (
              <div
                className="authButton kickButton basicCenter"
                onClick={() => {
                  if (roleID === 1) {
                    buttonControl("KICK");
                  } else {
                    buttonControl("DEMOTE");
                  }
                }}
              >
                {demoteConfirm
                  ? "confirm?"
                  : `${roleID === 1 ? "kick" : "demote"}`}
              </div>
            )}
          </div>
        )}
        {contributedTownXP !== undefined &&
          (<p className='contributedTownXP'>{contributedTownXP?.toLocaleString()} contributed town xp</p>)
        }
      </div>
    );
  };

  return (
    <div className="playerCardContainer">
      <div className="playerLevel basicCenter">
        <div id="burst-12" className="inner">
          <p className="levelNum">{calcLevel(xp)}</p>
        </div>
      </div>
      <div className="playerUser">
        {username.includes("#") ? (
          username
        ) : (
          <span
            onClick={() =>
              navigate(`/profile/${username}`, {
                state: {
                  from: location.pathname.substring(
                    1,
                    location.pathname.length,
                  ),
                },
              })
            }
          >
            {username}
          </span>
        )}
      </div>
      <div className="playerGap"></div>
      <div className="playerRole">
        <p>{roles[roleID - 1]}</p>
      </div>
      {myRoleID && (
        <div
          className="playerMoreButton"
          onMouseEnter={() => {
            setMoreButton(true);
          }}
        >
          <div className="buttonBar"></div>
          <div className="buttonBar"></div>
          <div className="buttonBar"></div>
          {moreButton && playerInfoCard()}
        </div>
      )}
    </div>
  );
}

export default PlayerCard;
