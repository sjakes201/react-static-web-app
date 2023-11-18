import React, { useEffect, useState, useContext } from "react";
import "./TownInterface.css";
import PlayerCard from "./PlayerCard";
import { useWebSocket } from "../../WebSocketContext";
import TOWNSINFO from "../../TOWNSINFO";
import TownGoals from "./TownGoals";
import TownShop from "../TownShop/TownShop";
import { calcTownLevel } from "../../townHelpers";
import { GameContext } from "../../GameContainer";
// townName is string for town name, backArrow is optional function to be called when back arrow pressed
function TownInterface({
  townName,
  backArrow,
  setTown,
  setScreen,
  setTownChatBox
}) {
  const { waitForServerResponse } = useWebSocket();
  const { updateBalance, updateXP, reloadTownPerks, msgNotification, myTownName, refreshNotifications } = useContext(GameContext)

  // Which screen to show ("MAIN" or "GOALS" or "SHOP" or "DNE")
  const [townScreen, setTownScreen] = useState("MAIN");

  /* The townInfo query will return data based on who requested it */
  const [townInfo, setTownInfo] = useState({});
  const [townShopInfo, setTownShopInfo] = useState({})
  // GUI useStates
  const [perksPopup, setPerksPopup] = useState(false);

  // Settings GUI useStates and data for submit
  const [settingsGUI, setSettingsGUI] = useState(false);
  const [settingsData, setSettingsData] = useState({
    description: "default text",
    logoNum: 0,
    status: "CLOSED",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettingsData({
      ...settingsData,
      [name]: value,
    });
  };

  const setTownDetails = async (e) => {
    // e.preventDefault();
    if (waitForServerResponse) {
      let response = await waitForServerResponse("setTownDetails", {
        newData: settingsData,
      });
      setTownInfo((old) => {
        let newInfo = { ...old };
        newInfo.description = settingsData.description;
        newInfo.townLogoNum = settingsData.logoNum;
        newInfo.status = settingsData.status;
        return newInfo;
      });
      setSettingsGUI(false);
    }
  };

  // Use this to refresh town info call once the press join button
  const [refreshData, setRefreshData] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      refreshNotifications();
      if (waitForServerResponse) {
        let data = await waitForServerResponse("getTownInfo", {
          townName: townName,
        });
        if (!data?.body?.playersData) {
          setTownScreen("DNE")
          return
        }
        data.body.playersData.sort((a, b) => b.xp - a.xp);
        setTownInfo(data.body);
        if (data.body.townShopInfo) {
          setTownShopInfo(data.body.townShopInfo)
        }
        setSettingsData({
          description: data.body.description,
          logoNum: data.body.townLogoNum,
          status: data.body.status,
        });
      }
    };
    fetchData();
  }, [refreshData]);

  // Interface action functions

  const managementAction = async (action, targetUser, roleID, myRoleID) => {
    if (action === "KICK" && myRoleID > roleID) {
      if (waitForServerResponse) {
        setTownInfo((old) => {
          let newTownInfo = { ...old };
          newTownInfo.memberCount -= 1;
          newTownInfo.playersData = newTownInfo.playersData.filter(
            (player) => player.username !== targetUser,
          );
          return newTownInfo;
        });
        let response = await waitForServerResponse("kickTownMember", {
          kickedMember: targetUser,
        });
      }
    }
    if (action === "DEMOTE" && myRoleID > roleID && roleID > 1) {
      if (waitForServerResponse) {
        let response = await waitForServerResponse("demoteTownMember", {
          targetUser: targetUser,
        });
        setTownInfo((old) => {
          let newTownInfo = { ...old };
          newTownInfo.playersData = newTownInfo.playersData.map((player) => {
            if (player.username === targetUser) {
              let newPlayer = { ...player };
              newPlayer.roleID -= 1;
              return newPlayer;
            }
            return player;
          });
          return newTownInfo;
        });
      }
    }
    if (action === "PROMOTE" && (myRoleID > roleID + 1 || myRoleID === 4)) {
      if (waitForServerResponse) {
        let response = await waitForServerResponse("promoteTownMemberRole", {
          targetUser: targetUser,
        });
        let targetPlayerInfo = townInfo.playersData.filter(
          (player) => player.username === targetUser,
        )[0];
        if (targetPlayerInfo.roleID === 3) {
          // Transferring leadership
          setTownInfo((old) => {
            let newTownInfo = { ...old };
            newTownInfo.playersData = newTownInfo.playersData.map((player) => {
              if (player.username === targetUser) {
                let newPlayer = { ...player };
                newPlayer.roleID = 4;
                return newPlayer;
              }
              if (player.roleID === 4) {
                let newPlayer = { ...player };
                newPlayer.roleID = 3;
                return newPlayer;
              }
              return player;
            });
            newTownInfo.myRoleID = 3;
            return newTownInfo;
          });
        } else {
          // regular promotion
          setTownInfo((old) => {
            let newTownInfo = { ...old };
            newTownInfo.playersData = newTownInfo.playersData.map((player) => {
              if (player.username === targetUser) {
                let newPlayer = { ...player };
                newPlayer.roleID += 1;
                return newPlayer;
              }
              return player;
            });
            return newTownInfo;
          });
        }
      }
    }
  };

  const joinTown = async () => {
    if (waitForServerResponse) {
      let response = await waitForServerResponse("joinTown", {
        townName: townInfo.townName,
      });
      if (response.body.message === "SUCCESS") {
        setRefreshData((old) => old + 1);
        if (reloadTownPerks) reloadTownPerks();
        if (setTown) setTown(townInfo.townName);
        if (setScreen) setScreen("TownInterface");
      }
    }
  };

  const leaveTown = async () => {
    if (waitForServerResponse) {
      let response = await waitForServerResponse("leaveTown", {});
      if (response.body.message === "SUCCESS") {
        setRefreshData((old) => old + 1);
        if (setTown) setTown("");
        if (setScreen) setScreen("TownSearch");
        if (reloadTownPerks) reloadTownPerks();
      }
    }
  };

  // Info for when player clicks level button
  const levelPerks = () => {
    const townLevelInfo = calcTownLevel(townInfo.townXP);
    let noPerks =
      !townInfo.growthPerkLevel &&
      !townInfo.partsPerkLevel &&
      !townInfo.animalPerkLevel &&
      !townInfo.orderRefreshPerkLevel;
    return (
      <div className="levelPerksContainer">
        <span className="perksPopupX" onClick={() => setPerksPopup(false)}>
          X
        </span>
        <p id="perksLabel">Town Perks</p>
        {townInfo.growthPerkLevel !== 0 && (
          <li>
            <span className="perkPercent">
              {TOWNSINFO.upgradeBoosts.growthPerkLevel[
                townInfo.growthPerkLevel
              ] * 100}
              %
            </span>{" "}
            faster crop growth
          </li>
        )}
        {townInfo.animalPerkLevel !== 0 && (
          <li>
            <span className="perkPercent">
              {TOWNSINFO.upgradeBoosts.animalPerkLevel[
                townInfo.animalPerkLevel
              ] * 100}
              %
            </span>{" "}
            faster animal production
          </li>
        )}
        {townInfo.partsPerkLevel !== 0 && (
          <li>
            <span className="perkPercent">
              {TOWNSINFO.upgradeBoosts.partsPerkLevel[townInfo.partsPerkLevel] *
                100}
              %
            </span>{" "}
            higher chance of parts
          </li>
        )}
        {townInfo.orderRefreshPerkLevel !== 0 && (
          <li>
            <span className="perkPercent">
              {TOWNSINFO.upgradeBoosts.orderRefreshPerkLevel[
                townInfo.orderRefreshPerkLevel
              ] * 100}
              %
            </span>{" "}
            lower order refresh cooldown
          </li>
        )}
        {noPerks && (
          <span
            style={{
              color: "gray",
              opacity: "0.65",
              marginTop: "5%",
              textAlign: "center",
              width: "100%",
            }}
          >
            First perk at town level 1
          </span>
        )}
        {townLevelInfo[2] !== -1 && (
          <p className="townXPIndicator">
            {townLevelInfo[1]} / {townLevelInfo[2]} town xp to next level
          </p>
        )}
      </div>
    );
  };

  const settings = () => {
    return (
      <div
        className="settingsGUIContainer basicCenter"
        onClick={(event) => {
          event.preventDefault();
          if (event.target === event.currentTarget) {
            setSettingsGUI(false);
            setSettingsData({
              description: townInfo.description,
              logoNum: townInfo.townLogoNum,
              status: townInfo.status,
            });
          }
        }}
      >
        <div className="settingsGUI">
          <span
            className="upperRightX"
            onClick={() => {
              setSettingsGUI(false);
              setSettingsData({
                description: townInfo.description,
                logoNum: townInfo.townLogoNum,
                status: townInfo.status,
              });
            }}
          >
            X
          </span>
          <form className="settingsForm" onSubmit={setTownDetails}>
            <div className="setNewDescription">
              <label htmlFor="description">Description:</label>
              <textarea
                type="text"
                id="name"
                name="description"
                value={settingsData.description}
                onChange={handleChange}
                maxLength={128}
              />
            </div>
            <div className="setTownIcon">
              <p id="iconsLabel">Town Icon:</p>
              <div className="townIconSelection">
                {TOWNSINFO.townIcons.map((icon, index) => {
                  return (
                    <img
                      key={index}
                      className={`townIconOption ${settingsData.logoNum === index ? "selectedIcon" : ""
                        }`}
                      src={`${process.env.PUBLIC_URL}/assets/images/townIcons/${icon}.png`}
                      onClick={() =>
                        setSettingsData((old) => {
                          let newData = { ...old };
                          newData.logoNum = index;
                          return newData;
                        })
                      }
                    />
                  );
                })}
              </div>
            </div>
            <div className="setNewStatus">
              <label htmlFor="status">Status:</label>
              <button
                type="button"
                className={
                  settingsData.status === "OPEN"
                    ? "selectedButton"
                    : "unselectedButton"
                }
                onClick={() =>
                  setSettingsData((old) => {
                    let newData = { ...old };
                    newData.status = "OPEN";
                    return newData;
                  })
                }
              >
                Open
              </button>
              <button
                type="button"
                className={
                  settingsData.status === "CLOSED"
                    ? "selectedButton"
                    : "unselectedButton"
                }
                onClick={() =>
                  setSettingsData((old) => {
                    let newData = { ...old };
                    newData.status = "CLOSED";
                    return newData;
                  })
                }
              >
                Closed
              </button>
            </div>
            <button
              type="submit"
              id="descSubmitButton"
              onClick={() => setTownDetails()}
            >
              Save
            </button>
          </form>
        </div>
      </div>
    );
  };

  const townPlayersList = () => {
    return (
      <div className="townPlayers">
        {townInfo.playersData.map((player, index) => (
          <div key={index * 100} className="playerInfo">
            <PlayerCard
              key={index}
              username={player.username}
              xp={player.xp}
              roleID={player.roleID}
              contributions={player.contributions}
              myRoleID={townInfo.myRoleID}
              managementAction={managementAction}
              contributedTownXP={player.contributedTownXP}
              pfpName={player.pfpName}
              seenString={player.seenString}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="townInterfaceContainer">
      {Object.keys(townInfo).length === 0 ? (
        <div className="townLoadingScreen basicCenter">
          {townScreen === "DNE" ? (
            <div><i>Town {townName} not found.</i></div>
          ) : (
            <div className="loadingIconAnimation"></div>
          )}

        </div>
      ) : (
        <>
          {townScreen === "MAIN" && (
            <>
              {settingsGUI && settings()}
              <div className="townInfoBar">
                <div className="townLeftBar">
                  {backArrow && (
                    <img
                      id="townBackArrow"
                      src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_dark.png`}
                      onClick={() => backArrow(true)}
                    />
                  )}
                  {(setTownChatBox && myTownName === townName) && (
                    <img
                      src={`${process.env.PUBLIC_URL
                        }/assets/images/GUI/textbubble${msgNotification ? "_notify" : ""
                        }.png`}
                      className="interfaceChatButton"
                      onClick={() => setTownChatBox((old) => !old)}
                    />
                  )}
                  {townInfo.myRoleID === 4 && (
                    <img
                      id="townSettingsButton"
                      src={`${process.env.PUBLIC_URL}/assets/images/Gears.png`}
                      onClick={() => setSettingsGUI(true)}
                    />
                  )}
                </div>
                <div className="townLogo basicCenter">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/townIcons/${TOWNSINFO.townIcons[townInfo.townLogoNum]
                      }.png`}
                  />
                </div>
                <div className="townTextInfo">
                  <p id="townName">{townInfo.townName} <small id='town-xp-level'>town level {calcTownLevel(townInfo.townXP)[0]}</small></p>
                  <p id="townDescription">{townInfo.description}</p>
                </div>
                <div className="townLevel">
                  {townInfo.myRoleID && (
                    <button
                      className='town-menu-button basic-center'
                      onClick={() => {
                        setTownScreen("SHOP");
                      }}
                    >
                      TOWN SHOP
                    </button>
                  )}
                  {townInfo.myRoleID && (
                    <button
                      className="town-menu-button basic-center"
                      onClick={() => {
                        setTownScreen("GOALS");
                      }}
                    >
                      GOALS
                    </button>
                  )}
                </div>
                <div className="townGap"></div>
                <div className="townInfoSection">
                  <div className="townStatuses basicCenter">
                    <p>{townInfo.memberCount}/25 members</p>
                    <p
                      style={{
                        color: townInfo.status === "OPEN" ? "#36e04d" : "gray",
                      }}
                    >
                      {townInfo.status}
                    </p>
                  </div>
                  {townInfo.myRoleID &&
                    (townInfo.myRoleID !== 4 || townInfo.memberCount === 1 ? (
                      <div className="leaveContainer basicCenter townInfoLowerRight">
                        <div
                          className="townLeaveButton basicCenter"
                          onClick={() => {
                            leaveTown();
                            if (backArrow) backArrow();
                          }}
                        >
                          Leave
                        </div>
                      </div>
                    ) : (
                      <p className="promoteWarn basicCenter townInfoLowerRight">
                        Must promote new leader before leaving
                      </p>
                    ))}
                  {!townInfo.myRoleID &&
                    townInfo.status === "OPEN" &&
                    townInfo.memberCount < 25 &&
                    !townInfo.imInTown && (
                      <div className="townJoinContainer basicCenter">
                        <div
                          className="joinButton basicCenter"
                          onClick={() => joinTown()}
                        >
                          Join
                        </div>
                      </div>
                    )}
                </div>
              </div>
              {townPlayersList()}
            </>
          )}
          {townScreen === "GOALS" && (
            <TownGoals
              updateBalance={updateBalance}
              updateXP={updateXP}
              indivGoals={townInfo.indivGoals}
              setTownInfo={setTownInfo}
              setTownScreen={setTownScreen}
              townName={townInfo.townName}
              goals={townInfo.goalsData}
              myRoleID={townInfo.myRoleID}
              myUnclaimed={townInfo.myUnclaimed}
              remount={() => setRefreshData((old) => old + 1)}
            />
          )}
          {townScreen === "SHOP" && (
            Object.keys(townShopInfo).length > 0 &&
            < TownShop
              townShopInfo={townShopInfo}
              setTownShopInfo={setTownShopInfo} 
              menuBack={() => setTownScreen("MAIN")}
              myRoleID={townInfo.myRoleID}
              />
          )}
        </>
      )
      }
    </div >
  );
}

export default TownInterface;
