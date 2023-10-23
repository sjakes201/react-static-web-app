import React, { useEffect, useState, useContext } from "react";
import "./CSS/AccountScreen.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useWebSocket } from "../WebSocketContext";
import { useParams } from "react-router-dom";
import { GameContext } from "../GameContainer";
import PfpSelection from "../Components/Account/PfpSelection";

import CONSTANTS from "../CONSTANTS";

const DISCORD_REDIRECT =
  "https://discord.com/api/oauth2/authorize?client_id=1143367795682320434&redirect_uri=https%3A%2F%2Ffarmgame.live%2FdiscordAuth&response_type=code&scope=identify"

function AccountScreen() {
  let { username } = useParams();
  // # is for fragments in URL so we need to change # to - just for url username param. - and # are not allowed in chosen usernames
  username = username.replace(/-/g, "#");

  const location = useLocation();
  const { getUser } = useContext(GameContext);


  const { waitForServerResponse } = useWebSocket();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({});
  const [pfpName, setPfpName] = useState("reg_maroon");

  const [pfpMenu, setPfpMenu] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (waitForServerResponse) {
        const response = await waitForServerResponse("getProfileData", {
          targetUser: username,
        });
        setProfileData(response.body);
        if (response?.body?.profilePic) {
          setPfpName(response.body.profilePic)
        }
      }
    };
    fetchData();
  }, [username]);

  const [activePoke, setActivePoke] = useState(false);

  const handlePoke = async () => {
    if (profileData.lastPoke < Date.now() - 60 * 1000) {
      setActivePoke(true);
      setTimeout(() => {
        setActivePoke(false);
      }, 1200);
      if (waitForServerResponse) {
        let pokeRes = await waitForServerResponse("pokeUser", {
          targetUsername: username,
        });
        setProfileData((old) => {
          let newData = { ...old };
          newData.receivedPokes += 1;
          newData.lastPoke = Date.now();
          return newData;
        });
      }
    }
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
      <div className="back-arrow-acc">
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_dark.png`}
          alt="profile/stats"
          onClick={backFunc()}
        />
      </div>
    );
  };

  if (Object.keys(profileData).length === 0) {
    return (
      <div className="acc-screen">
        {backArrow()}
        <div className="acc-container">
          <div className="loadingIconAnimation centerSelf"></div>
        </div>
      </div>
    );
  }

  if (!profileData.username) {
    return (
      <div className="acc-screen">
        {backArrow()}
        <div className="acc-container">
          <div className="centerSelf">
            <p>
              No profile for <i>'{username}'</i> found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="acc-screen">
      {backArrow()}
      {pfpMenu && <PfpSelection close={() => setPfpMenu(false)} setPfpName={setPfpName} />}
      {
        <div className="acc-container">
          <div className="acc-row" id="acc-profile">
            <div
              className={`profile-pic-container ${getUser() === username ? 'clickable' : ''}`}
              onClick={() => setPfpMenu(getUser() === username)}
            >
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/profilePics/${pfpName}.png`}
                alt="profile pic"
                draggable={false}
                id='pfp-img'
              />
              {getUser() === username &&
                <img
                  id='pfp-switch-icon'
                  src={`${process.env.PUBLIC_URL}/assets/images/Gears.png`}
                />
              }

            </div>

            <div className="acc-user-info">
              <h3 id="acc-username">{profileData?.username}</h3>
              <p>XP: {profileData?.XP?.toLocaleString()}</p>
              <p>Balance: ${profileData?.Balance?.toLocaleString()}</p>
            </div>

            <img
              draggable={false}
              id='town-info-icon'
              src={`${process.env.PUBLIC_URL}/assets/images/townButton2.png`}
              onClick={() => {
                if (profileData.townName) {
                  navigate(`/towns/${profileData.townName}`,
                    {
                      state:
                        { from: location.pathname.substring(1, location.pathname.length) }
                    })
                }
              }}
            />
            <div className='acc-user-town-info'>
              <p>
                Town: {profileData.townName ?
                  (<span
                    id='townLink'
                    onClick={() => navigate(`/towns/${profileData.townName}`,
                      {
                        state:
                          { from: location.pathname.substring(1, location.pathname.length) }
                      })}
                  >{profileData.townName}</span>)
                  :
                  (<span id='noTown'>None</span>)}
              </p>
              {profileData?.totalContributedTownXP !== undefined &&
                <p>
                  All-Time XP: {profileData.totalContributedTownXP.toLocaleString()}
                </p>
              }
            </div>
            <div className="acc-poke-info">
              <img
                draggable={false}
                src={
                  activePoke
                    ? `${process.env.PUBLIC_URL}/assets/images/duck_walking_right.gif`
                    : `${process.env.PUBLIC_URL}/assets/images/duck_standing_right.png`
                }
                className={`${profileData.lastPoke < Date.now() - 60 * 1000
                  ? "pokable"
                  : "poked"
                  }`}
                onClick={() => handlePoke()}
              />
              <p>x </p>
              <p>{profileData?.receivedPokes?.toLocaleString()}</p>
            </div>

            {profileData.isMe &&
              (!localStorage.getItem("discordLinked") ? (
                <a href={DISCORD_REDIRECT}>
                  <div
                    className={`discordAuthBox ${localStorage.getItem("discordLinked") ? "syncedDiscord" : ""
                      }`}
                    onClick={() => (window.location.href = DISCORD_REDIRECT)}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/discord.png`}
                      id="discordAccIcon"
                    />
                    Link Discord
                  </div>
                </a>
              ) : (
                <div
                  className={`discordAuthBox ${localStorage.getItem("discordLinked") ? "syncedDiscord" : ""}`}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/discord.png`}
                    id="discordAccIcon"
                  />
                  Discord Linked!
                </div>
              ))}
          </div>

          <div className="acc-row" id="acc-stats">
            <div className="acc-collect-totals">
              <p>Total Harvests</p>
              <div className="acc-collect-grids">
                {Object.keys(profileData).map((crop) => {
                  if (
                    crop in CONSTANTS.Init_Market_Prices &&
                    !crop.includes("_")
                  ) {
                    return (
                      <div className="acc-goods-slot" key={crop}>
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/${crop}.png`}
                          alt={crop}
                        />
                        {profileData[crop]?.toLocaleString()}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <div className="acc-collect-totals">
              Total Produce
              <div className="acc-collect-grids">
                {Object.keys(profileData).map((produce) => {
                  if (
                    produce in CONSTANTS.Init_Market_Prices &&
                    produce.includes("_")
                  ) {
                    return (
                      <div className="acc-goods-slot" key={produce}>
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/${produce}.png`}
                          alt={produce}
                        />
                        {profileData[produce]?.toLocaleString()}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>

          <div className="acc-row" id="acc-other">
            <div className="acc-line-decor">
              {Array.from({ length: 21 }, (_, i) => (
                <img
                  key={i}
                  src={`${process.env.PUBLIC_URL}/assets/images/corn.png`}
                  alt={"corn"}
                />
              ))}
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default AccountScreen;
