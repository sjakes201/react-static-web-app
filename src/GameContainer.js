import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AnimalScreen from "./Screens/AnimalScreen";
import PlantScreen from "./Screens/PlantScreen";
import ShopScreen from "./Screens/ShopScreen";
import MarketScreen from "./Screens/MarketScreen";
import TownsScreen from "./Screens/TownsScreen";
import LeaderboardScreen from "./Screens/LeaderboardScreen";
import AccountScreen from "./Screens/AccountScreen";
import PasswordReset from "./Screens/PasswordReset";
import HowToPlay from "./Screens/HowToPlay";
import MachinesScreen from "./Screens/MachinesScreen";
import ChatBox from "./Components/Chat/ChatBox";
import NotificationBox from "./Components/GUI/NotificationBox";
import Complogin from "./Components/GUI/CompLogin";
import DiscordAuthReturn from "./Components/External/DiscordAuthReturn";
import GoogleAnalyticsReporter from "./GoogleAnalyticsReporter";
import OrderBoard from "./Components/Orders/OrderBoard";
import NotFound from "./Screens/NotFound";
import AnimationParent from "./Screens/ScreenEffects/AnimationParent";
import SeasonsInfo from "./Components/GUI/SeasonsInfo";

import { useWebSocket } from "./WebSocketContext";

import CONSTANTS from "./CONSTANTS";
import CROPINFO from "./CROPINFO";
import UPGRADES from "./UPGRADES";
import TOWNSINFO from "./TOWNSINFO";
import BOOSTSINFO from "./BOOSTSINFO";

export const GameContext = React.createContext();

/* Ad sets */
//  /farm, /market, 
const leftBottomRails = [
  {
    type: 'left_rail'
  },
  {
    type: 'bottom_rail'
  },
]

const bottomRightRails = [
  {
    type: 'right_rail'
  },
  {
    type: 'bottom_rail'
  }
]

const sideRails = [
  {
    type: 'left_rail'
  },
  {
    type: 'right_rail'
  }
]

const bottomOnly = [
  {
    type: 'bottom_rail'
  }
]

const allRailUnits = [
  {
    type: 'left_rail'
  },
  {
    type: 'right_rail'
  },
  {
    type: 'bottom_rail'
  }
]

const trendiUnit = [
  {
    type: 'trendi_video'
  }
]
const leaderboardTag = [
  {
    type: 'leaderboard_atf',
    selectorId: 'machines_top_bar'
  }
]

function GameContainer() {

  const { waitForServerResponse } = useWebSocket();
  const { addListener, removeListener } = useWebSocket();

  const location = useLocation();

  /* Playwire dynamic ad destroy and display based on pages */
  useEffect(() => {
    let page = location?.pathname?.split("/")?.[1];

    let adUnits = []
    switch (page) {
      case "plants":
        adUnits.push(...leftBottomRails, ...trendiUnit)
        break;
      case "animals":
        adUnits.push(...bottomOnly, ...trendiUnit)
        break;
      case "shop":
        adUnits.push(...bottomRightRails)
        break;
      case "market":
        adUnits.push(...leftBottomRails)
        break;
      case "leaderboard":
        adUnits.push(...sideRails)
        break;
      case "towns":
        adUnits.push(...allRailUnits)
        break;
      case "machines":
        adUnits.push(...leaderboardTag);
        break;
      case "profile":
        adUnits.push(...allRailUnits)
        break;
      case "":
        // Landing page
        adUnits.push(...leftBottomRails)
        break;
    }

    window?.ramp?.que.push(
      () => {
        // Only impacts the leaderboard tag ad in machines, check if they can display 970 width
        if (window?.innerWidth < 1515) {
          window?.ramp?.setPath('728x90-only')
        } else {
          window?.ramp?.setPath('')
        }

        // Regular ad destroy and recreate
        window?.ramp?.destroyUnits('all').then(() => {
          window?.ramp?.addUnits(adUnits).then(() => window?.ramp?.displayUnits())

          // Register pageview
          window._pwGA4PageviewId = ''.concat(Date.now());
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
          };
          window.gtag('js', new Date());
          window.gtag('config', 'G-3PPHZYFY40', { 'send_page_view': false });
          window.gtag(
            'event',
            'ramp_js',
            {
              'send_to': 'G-3PPHZYFY40',
              'pageview_id': window._pwGA4PageviewId
            }
          );

        })
      }
    )
  }, [location?.pathname])


  const { isConnected } = useWebSocket();

  const [notificationBox, setNotificationBox] = useState(false);
  const [unlockContents, setUnlockContents] = useState([]);
  const [loginBox, setLoginBox] = useState(false);
  const [townChatBox, setTownChatBox] = useState(false);

  const [moreInfo, setMoreInfo] = useState(false);

  const [XP, setXP] = useState(0);
  const [Balance, setBalance] = useState(0);
  const [Username, setUsername] = useState("");
  const [upgrades, setUpgrades] = useState({});
  const [level, setLevel] = useState(0);
  const [profilePic, setProfilePic] = useState("reg_maroon");

  const [capacities, setCapacities] = useState({
    barnCapacity: 0,
    coopCapacity: 0,
  });

  const [goodTotals, setGoodTotals] = useState({});

  const [machines, setMachines] = useState({});
  const [parts, setParts] = useState({});
  const [artisanItems, setArtisanItems] = useState({});

  const [coop, setCoop] = useState([]);

  const [barn, setBarn] = useState([]);
  const [deluxePermit, setDeluxePermit] = useState(false);
  const [exoticPermit, setExoticPermit] = useState(false);
  const [animalsInfo, setAnimalsInfo] = useState({});

  const [activeBoosts, setActiveBoosts] = useState([])

  const [tiles, setTiles] = useState([]);

  const [townPerks, setTownPerks] = useState({});
  const [townRoleID, setTownRoleID] = useState(-1);

  const [myTownName, setMyTownName] = useState("")

  let newXP = useRef(false);

  const [prices, setPrices] = useState(null);

  const [itemsData, setItemsData] = useState({});

  const [townChatMsgs, setTownChatMsgs] = useState([]);

  const [msgNotification, setMsgNotification] = useState(null);
  const [orderBoard, setOrderBoard] = useState(false);
  const [seasonsInfoBox, setSeasonsInfoBox] = useState(false);

  const [leaderboardData, setLeaderboardData] = useState({});

  const [userNotifications, setUserNotifications] = useState([])

  const [animationsEnabled, setAnimationsEnabled] = useState(localStorage.getItem("disableAnimations") !== "true")

  /* fetch data from server calls */
  const getTownMessages = async () => {
    if (waitForServerResponse) {
      let chatHistory = await waitForServerResponse("getTownMessages");
      let pastMessages = chatHistory.body?.messageHistory;
      let lastSeenMsgID = chatHistory.body?.lastSeenMessage;
      if (Array.isArray(pastMessages)) {
        let newMsgs = pastMessages.filter((msgObj) => msgObj.messageID > lastSeenMsgID);
        if (newMsgs.length > 0) {
          if (newMsgs.some((msg => msg.Type === "GOAL_COMPLETE"))) {
            setMsgNotification("GOAL")
          } else {
            setMsgNotification("CHAT");
          }
        }
        pastMessages.sort((a, b) => b.timestamp - a.timestamp);
        setTownChatMsgs(pastMessages);
      }
    }
  };

  const refreshNotifications = async () => {
    if (waitForServerResponse) {
      let res = await waitForServerResponse("getNotifications");
      if (res.body.success) {
        setUserNotifications(res.body.notificationsData)
      }
    }
  }

  const refreshLeaderboard = async () => {
    if (waitForServerResponse) {
      const response = await waitForServerResponse("leaderboard");
      let data = response.body;
      if (data.allTimeLeaderboard && data.tempLeaderboard) {
        setLeaderboardData({
          all: data.allTimeLeaderboard,
          temp: data.tempLeaderboard,
        });
      }
    }
  };

  const getTiles = async (numAttempts) => {
    try {
      if (waitForServerResponse) {
        const response = await waitForServerResponse("tilesAll", {}, 4000);
        let dbTiles = response.body;
        let updatedTiles = dbTiles.map((tile) => {
          let hasTimeFertilizer = tile.TimeFertilizer !== -1;
          let stage = getStage(tile.PlantTime, tile.CropID, hasTimeFertilizer);
          return {
            ...tile,
            stage: stage,
            hasTimeFertilizer: hasTimeFertilizer,
            highlighted: false,
          };
        });
        setTiles(updatedTiles)

      }
    } catch (error) {
      console.log(error)
      console.log(`called with numAttempts: ${numAttempts}, trying getTiles() again with numAtempts: ${numAttempts ? numAttempts + 1 : 1}`)
      if (!Number.isInteger(numAttempts) || numAttempts < 3) {
        getTiles(numAttempts ? numAttempts + 1 : 1)
      }
    }

  }

  const refreshPrices = async () => {
    if (waitForServerResponse) {
      const response = await waitForServerResponse("prices");
      setPrices(response.body);
    }
  }

  const getProfileInfo = async (numAttempts) => {
    try {
      if (waitForServerResponse) {
        const response = await waitForServerResponse("profileInfo", { oStamp: (new Date()).getTimezoneOffset() }, 4000);
        let data = response.body;
        if (response.body.profilePic) {
          setProfilePic(response.body.profilePic)
        }
        setBalance(data.Balance);
        setXP(data.XP);
        setUsername(data.Username);
        setCapacities({
          barnCapacity: data.BarnCapacity,
          coopCapacity: data.CoopCapacity,
        });
        setDeluxePermit(data.deluxePermit);
        setExoticPermit(data.exoticPermit);
        setAnimalsInfo({
          coopCount: data.CoopAnimals,
          coopCapacity: data.CoopCapacity,
          barnCount: data.BarnAnimals,
          barnCapacity: data.BarnCapacity,
        });
        let upgrades = {};
        let totals = {};
        for (const column in data) {
          if (column.includes("Upgrade") || column.includes("Permit")) {
            upgrades[column] = data[column];
          } else if (column in CONSTANTS.Init_Market_Prices) {
            totals[column] = data[column];
          }
        }
        setGoodTotals(totals);
        setUpgrades(upgrades);
        setActiveBoosts(data.activeBoosts)
      }
    } catch (error) {
      console.log(error)
      console.log(`called with numAttempts: ${numAttempts}, trying getProfileInfo() again with numAtempts: ${numAttempts ? numAttempts + 1 : 1}`)
      if (!Number.isInteger(numAttempts) || numAttempts < 3) {
        getProfileInfo(numAttempts ? numAttempts + 1 : 1)
      }
    }
  }

  const fetchMachines = async () => {
    if (waitForServerResponse) {
      const response = await waitForServerResponse("getAllMachines");
      let data = response.body;
      setMachines(data.machinesData);
      setParts(data.partsData);
      setArtisanItems(data.artisanData);
    }
  }

  const fetchInventory = async (numAttempts) => {
    try {
      if (waitForServerResponse) {
        const response = await waitForServerResponse("inventoryAll", {}, 4000);
        let data = response.body;
        setItemsData(data);
      }
    } catch (error) {
      console.log(error)
      console.log(`called with numAttempts: ${numAttempts}, trying fetchInventory() again with numAtempts: ${numAttempts ? numAttempts + 1 : 1}`)
      if (!Number.isInteger(numAttempts) || numAttempts < 3) {
        fetchInventory(numAttempts ? numAttempts + 1 : 1)
      }

    }
  }

  const fetchAnimals = async () => {
    if (waitForServerResponse) {
      const response = await waitForServerResponse("allAnimals");
      let data = response.body;
      setBarn(data.barnResult);
      setCoop(data.coopResult);
    }
  }

  const fetchBoosts = async (numAttempts) => {
    try {
      if (waitForServerResponse) {
        const response = await waitForServerResponse("getActiveBoosts");
        let boosts = response.body?.activeBoosts;
        console.log(boosts)
        if (boosts) {
          setActiveBoosts(boosts);
        }
      }
    } catch (error) {
      console.log(error)
      console.log(`called with numAttempts: ${numAttempts}, trying fetchBoosts() again with numAtempts: ${numAttempts ? numAttempts + 1 : 1}`)
      if (!Number.isInteger(numAttempts) || numAttempts < 3) {
        fetchBoosts(numAttempts ? numAttempts + 1 : 1)
      }

    }
  }

  /* Listeners */
  const handleNewMsg = (content, timestamp, Username, messageID, msgType, requestID) => {
    setTownChatMsgs((old) => {
      let newMsgs = [...old];
      newMsgs.push({
        content: content,
        timestamp: timestamp,
        Username: Username,
        messageID: messageID,
        requestID: requestID,
        Type: msgType
      });
      newMsgs.sort((a, b) => b.timestamp - a.timestamp);
      return newMsgs;
    });
    if (!townChatBox) {
      if (msgType === "GOAL_COMPLETE") {
        setMsgNotification("GOAL")
      } else {
        setMsgNotification("CHAT");
      }
    }
  };

  const handleTownJoinResolve = (requestID, isAccepted) => {
    setTownChatMsgs((old) => old.filter((msg) => msg.requestID !== requestID))
  }

  const changeAnimalHappiness = (Animal_ID, Happiness) => {
    setCoop((old) => old.map((animal) => {
      if (animal.Animal_ID === Animal_ID) {
        let newAnimal = { ...animal };
        newAnimal.Happiness += Happiness;
        return newAnimal
      }
      return animal;
    }))
    setBarn((old) => old.map((animal) => {
      if (animal.Animal_ID === Animal_ID) {
        let newAnimal = { ...animal };
        newAnimal.Happiness += Happiness;
        return newAnimal
      }
      return animal;
    }))
  }

  const townChange = () => {
    reloadTownPerks();
  }

  const newBoost = () => {
    fetchBoosts();
  }

  /* Init get data */
  useEffect(() => {

    fetchAnimals();
    fetchMachines()
    refreshPrices();
    getTownMessages();
    refreshLeaderboard();
    reloadTownPerks();
    getTiles();

    fetchInventory();
    refreshNotifications();
    getProfileInfo();

    addListener(['town_message', handleNewMsg]);
    addListener(['animal_happiness', changeAnimalHappiness])
    addListener(['TOWN_JOIN_RESOLVE', handleTownJoinResolve])
    addListener(['TOWN_CHANGE', townChange])
    addListener(['NEW_BOOST', newBoost])
    return () => {
      removeListener('town_message');
      removeListener('animal_happiness');
      removeListener('TOWN_JOIN_RESOLVE');
      removeListener('TOWN_CHANGE');
      removeListener('NEW_BOOST')
    };
  }, []);

  useEffect(() => {
    setLevel(calcLevel(XP));
  }, [XP]);

  useEffect(() => {
    if (newXP.current && level in CONSTANTS.levelUnlocks) {
      setUnlockContents(CONSTANTS.levelUnlocks[level]);
      setNotificationBox(true);
    }
  }, [level]);

  useEffect(() => {
    console.log(activeBoosts)
    const boostTimers = [];
    activeBoosts?.forEach((boost) => {
      let timeRemaining = (Number(boost.StartTime) + Number(boost.Duration)) - Date.now();
      let boostID = boost.BoostID;
      boostTimers.push(setTimeout(() => {
        setActiveBoosts((old) => old.filter((boost) => boost.BoostID !== boostID))
      }, [timeRemaining]))
    })

    return () => {
      boostTimers.forEach((timer) => {
        clearTimeout(timer)
      })
    }
  }, [activeBoosts])

  const reloadTownPerks = async () => {
    if (waitForServerResponse) {
      const response = await waitForServerResponse("getTownPerks");
      let data = response.body;
      setMyTownName(data.townName)
      const perks = { ...data };
      delete perks.townName;
      setTownPerks(perks);
      setTownRoleID(data.roleID)
    }
    getTownMessages();
    fetchBoosts();
  };

  const getStage = (PlantTime, CropID, hasTimeFertilizer) => {
    if (
      PlantTime !== null &&
      CropID !== -1 &&
      Object.keys(getUpgrades()).length !== 0
    ) {
      let seedName = CROPINFO.seedsFromID[CropID]
      let date = PlantTime;
      date -= 5; // 5 ms buffer to account for rounding as to not flash lower stage for a split second
      const curTime = Date.now();

      let secsPassed = (curTime - date) / 1000;
      if (hasTimeFertilizer) {
        secsPassed = secsPassed * 2;
      }
      if (townPerks?.cropTimeLevel > 0) {
        let boostPercent =
          TOWNSINFO.perkBoosts.cropTimeLevel[townPerks.cropTimeLevel - 1];
        let boostChange = 1 + boostPercent;
        secsPassed *= boostChange;
      }
      if (CONSTANTS.cropSeasons[getCurrentSeason()].includes(seedName)) {
        let boostPercent = CONSTANTS.VALUES.SEASON_GROWTH_BUFF;
        secsPassed *= 1 + boostPercent;
      }
      activeBoosts?.forEach(boost => {
        if (boost.Type === "TIME" && boost.BoostTarget === "CROPS") {
          let boostPercent = BOOSTSINFO[boost.BoostName].boostPercent;
          secsPassed *= 1 + boostPercent;
        }
      })

      // Use secs passed to find out what stage you are in by summing growth in constants
      let growth =
        UPGRADES["GrowthTimes".concat(getUpgrades().plantGrowthTimeUpgrade)][seedName];

      let stage = 0;
      while (secsPassed > 0 && stage < growth.length) {
        secsPassed -= growth[stage];
        if (secsPassed >= 0) {
          stage++;
        }
      }
      return stage;
    } else {
      return -1;
    }
  };

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

  const getCurrentSeason = () => {
    const seasons = ['spring', 'summer', 'fall', 'winter'];
    const nowMS = Date.now();
    let msPerDay = 24 * 60 * 60 * 1000;
    let daysPassed = Math.floor(nowMS / msPerDay)
    let seasonIndex = daysPassed % 4;
    return seasons[seasonIndex];
  };


  const getXP = () => {
    return XP;
  };

  const getBal = () => {
    return Balance;
  };

  const updateXP = (amount) => {
    newXP.current = true;
    setXP((prevXP) => {
      const newXP = prevXP + amount;
      return newXP;
    });
  };

  const updateBalance = (amount) => {
    if (isNaN(amount)) {
      return;
    }
    setBalance((oldBal) => {
      const newBal = oldBal + amount;
      return newBal;
    });
  };

  const getUser = () => {
    if (Username) {
      return Username;
    }
  };

  const getUpgrades = () => {
    return upgrades;
  };

  const updateUpgrades = (upgradeBought) => {
    let coopCapacityUpgrades = UPGRADES.CapacityIncreases.Coop;
    let barnCapacityUpgrades = UPGRADES.CapacityIncreases.Barn;

    setUpgrades((prevUpgrades) => {
      let newUpgrades = {
        ...prevUpgrades,
        [upgradeBought]: prevUpgrades[upgradeBought] + 1,
      };

      setAnimalsInfo((prevAnimals) => {
        let newAnimals = { ...prevAnimals };
        if (upgradeBought === "barnCapacityUpgrade") {
          newAnimals.barnCapacity =
            newAnimals.barnCapacity +
            barnCapacityUpgrades[newUpgrades.barnCapacityUpgrade - 1];
        }
        if (upgradeBought === "coopCapacityUpgrade") {
          newAnimals.coopCapacity =
            newAnimals.coopCapacity +
            coopCapacityUpgrades[newUpgrades.coopCapacityUpgrade - 1];
        }
        return newAnimals;
      });

      return newUpgrades;
    });
  };
  const updateAnimalsInfo = (animal) => {
    let location = CONSTANTS.AnimalTypes[animal][0];
    location = location.concat("Count");
    setAnimalsInfo((prevAnimals) => {
      return {
        ...prevAnimals,
        [location]: prevAnimals[location] + 1,
      };
    });
  };

  const addAnimal = (animal) => {
    let home = CONSTANTS.AnimalTypes[animal.Animal_type][0];
    if (home === "barn") {
      setBarn((old) => {
        let newAnimals = [...old];
        newAnimals.push(animal);
        return newAnimals;
      });
    }
    if (home === "coop") {
      setCoop((old) => {
        let newAnimals = [...old];
        newAnimals.push(animal);
        return newAnimals;
      });
    }
  };

  const getUserAlltimeTotals = () => {
    return { ...goodTotals, Balance: Balance, XP: XP }
  }

  const passedContextFuncs = {
    setTownChatBox,
    updateBalance,
    updateXP,
    reloadTownPerks,
    msgNotification,
    setMsgNotification,
    myTownName,
    itemsData,
    setItemsData,
    townPerks,
    tiles,
    setTiles,
    getXP,
    getUpgrades,
    parts,
    setParts,
    getBal,
    getUser,
    setLoginBox,
    level,
    setOrderBoard,
    barn,
    coop,
    setBarn,
    setCoop,
    capacities,
    setAnimalsInfo,
    prices,
    setNotificationBox,
    unlockContents,
    updateUpgrades,
    deluxePermit,
    exoticPermit,
    addAnimal,
    animalsInfo,
    updateAnimalsInfo,
    refreshLeaderboard,
    leaderboardData,
    getUserAlltimeTotals,
    setMachines,
    machines,
    artisanItems,
    setArtisanItems,
    profilePic,
    setProfilePic,
    getTiles,
    refreshPrices,
    setTownPerks,
    userNotifications,
    setUserNotifications,
    refreshNotifications,
    moreInfo,
    setMoreInfo,
    townRoleID,
    getCurrentSeason,
    getStage,
    setSeasonsInfoBox,
    activeBoosts
  }

  if (!isConnected) {
    return <div></div>;
  }
  // If connected, render the main game content
  return (
    <GameContext.Provider value={passedContextFuncs}>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          opacity: (location.pathname === "/plants" || location.pathname === "/animals" || location.pathname === "/") ? 1 : 0,
        }}>
          {animationsEnabled && <AnimationParent currentSeason={getCurrentSeason()} />}
        </div>
        {notificationBox && (
          <NotificationBox />
        )}
        {seasonsInfoBox && (
          <SeasonsInfo />
        )}
        {loginBox && <Complogin />}
        {townChatBox && (
          <ChatBox chatMessages={townChatMsgs} setTownChatMsgs={setTownChatMsgs} />
        )}
        {orderBoard && <OrderBoard />}
        <GoogleAnalyticsReporter />
        <Routes>
          <Route
            path="/"
            element={
              <PlantScreen />
            }
          />
          <Route
            path="/plants"
            element={
              <PlantScreen />
            }
          />
          <Route
            path="/animals"
            element={
              <AnimalScreen />
            }
          />
          <Route
            path="/shop"
            element={
              <ShopScreen />
            }
          />
          <Route
            path="/market"
            element={
              <MarketScreen />
            }
          />
          <Route
            path="/leaderboard"
            element={
              <LeaderboardScreen />
            }
          />
          <Route
            path="/profile"
            element={<Navigate to={`/profile/${Username?.replace(/#/g, "-")}`} />}
          />
          <Route path="/profile/:username" element={<AccountScreen />} />
          <Route path="/discordAuth" element={<DiscordAuthReturn />} />
          <Route path="/passwordReset" element={<PasswordReset />} />
          <Route path="/howtoplay" element={<HowToPlay />} />
          <Route
            path="/machines"
            element={
              <MachinesScreen />
            }
          />
          <Route
            path="/towns"
            element={
              <TownsScreen />}
          />
          <Route
            path="/towns/:townName"
            element={
              <TownsScreen />
            }
          />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </GameContext.Provider>
  );
}

export function CreateGameContainer() {
  return <GameContainer />;
}
