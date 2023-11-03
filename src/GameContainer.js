import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

import { useWebSocket } from "./WebSocketContext";

import CONSTANTS from "./CONSTANTS";
import CROPINFO from "./CROPINFO";
import UPGRADES from "./UPGRADES";

export const GameContext = React.createContext();

function GameContainer() {
  const { waitForServerResponse } = useWebSocket();
  const { addListener, removeListener } = useWebSocket();


  const { isConnected } = useWebSocket();

  const [notificationBox, setNotificationBox] = useState(false);
  const [unlockContents, setUnlockContents] = useState([]);
  const [loginBox, setLoginBox] = useState(false);
  const [townChatBox, setTownChatBox] = useState(false);

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

  const [tiles, setTiles] = useState([]);

  const [townPerks, setTownPerks] = useState({});
  const [myTownName, setMyTownName] = useState("")

  let newXP = useRef(false);

  const [prices, setPrices] = useState(null);

  const [itemsData, setItemsData] = useState({});

  const [townChatMsgs, setTownChatMsgs] = useState([]);

  const [msgNotification, setMsgNotification] = useState(false);
  const [orderBoard, setOrderBoard] = useState(false);

  const [leaderboardData, setLeaderboardData] = useState({});

  const getTownMessages = async () => {
    if (waitForServerResponse) {
      let chatHistory = await waitForServerResponse("getTownMessages");
      let pastMessages = chatHistory.body?.messageHistory;
      let lastSeenMsgID = chatHistory.body?.lastSeenMessage;
      if (Array.isArray(pastMessages)) {
        if (pastMessages.some((msgObj) => msgObj.messageID > lastSeenMsgID)) {
          setMsgNotification(true);
        }
        pastMessages.sort((a, b) => b.timestamp - a.timestamp);
        setTownChatMsgs(pastMessages);
      }
    }
  };

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

  const getTiles = async () => {
    if (waitForServerResponse) {
      const response = await waitForServerResponse("tilesAll");
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
      setTiles(updatedTiles);
    }
  }

  const refreshPrices = async () => {
    if (waitForServerResponse) {
      const response = await waitForServerResponse("prices");
      setPrices(response.body);
    }
  }

  useEffect(() => {
    let fetchData = async () => {

      if (waitForServerResponse) {
        const response = await waitForServerResponse("profileInfo", { oStamp: (new Date()).getTimezoneOffset() });
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
      }

      if (waitForServerResponse) {
        const response = await waitForServerResponse("inventoryAll");
        let data = response.body;
        setItemsData(data);
      }

      if (waitForServerResponse) {
        const response = await waitForServerResponse("allAnimals");
        let data = response.body;
        setBarn(data.barnResult);
        setCoop(data.coopResult);
      }


      if (waitForServerResponse) {
        const response = await waitForServerResponse("getAllMachines");
        let data = response.body;
        setMachines(data.machinesData);
        setParts(data.partsData);
        setArtisanItems(data.artisanData);
      }

      if (waitForServerResponse) {
        // For now, getTownPerks also returns the player's town info. Rename to 'player town info' or something
        const response = await waitForServerResponse("getTownPerks");
        let data = response.body;
        setTownPerks(data);
        setMyTownName(data.townName)
      }
    };
    refreshPrices();
    fetchData();
    getTownMessages();
    refreshLeaderboard();
    reloadTownPerks();
    getTiles();

    const handleNewMsg = (content, timestamp, Username, messageID) => {
      setTownChatMsgs((old) => {
        let newMsgs = [...old];
        newMsgs.push({
          content: content,
          timestamp: timestamp,
          Username: Username,
          messageID: messageID,
        });
        newMsgs.sort((a, b) => b.timestamp - a.timestamp);
        return newMsgs;
      });
      if (!townChatBox) {
        setMsgNotification(true);
      }
    };

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

    addListener(['town_message', handleNewMsg]);
    addListener(['animal_happiness', changeAnimalHappiness])
    return () => {
      removeListener(handleNewMsg);
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

  const reloadTownPerks = async () => {
    if (waitForServerResponse) {
      const response = await waitForServerResponse("getTownPerks");
      let data = response.body;
      setMyTownName(data.townName)
      setTownPerks(data);
    }
    getTownMessages();
  };

  const getStage = (PlantTime, CropID, hasTimeFertilizer) => {
    if (
      PlantTime !== null &&
      CropID !== -1 &&
      Object.keys(getUpgrades()).length !== 0
    ) {
      const date = PlantTime;
      const curTime = Date.now();

      let secsPassed = (curTime - date) / 1000;
      if (hasTimeFertilizer) {
        secsPassed = secsPassed * 2;
      }
      // Use secs passed to find out what stage you are in by summing growth in constants
      let growth =
        UPGRADES["GrowthTimes".concat(getUpgrades().plantGrowthTimeUpgrade)][
        CROPINFO.seedsFromID[CropID]
        ];
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

  useEffect(() => {
    // Initialize
    window.aiptag = window.aiptag || {};
    window.aiptag.cmd = window.aiptag.cmd || [];
    window.aiptag.cmd.display = window.aiptag.cmd.display || [];
    window.aiptag.cmd.player = window.aiptag.cmd.player || [];

    window.aiptag.cmp = {
      show: true,
      position: "centered", //centered or bottom
      button: true,
      buttonText: "Privacy settings",
      buttonPosition: "bottom-left", //bottom-left, bottom-right, top-left, top-right
    };

    // Load AdinPlay Ads script
    const script = document.createElement("script");
    script.async = true;
    script.src =
      "//api.adinplay.com/libs/aiptag/pub/FRM/farmgame.live/tag.min.js";
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

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
    refreshPrices
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
        {notificationBox && (
          <NotificationBox />
        )}
        {loginBox && <Complogin />}
        {townChatBox && (
          <ChatBox chatMessages={townChatMsgs} />
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
            element={<Navigate to={`/profile/${Username.replace(/#/g, "-")}`} />}
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
        </Routes>
      </div>
    </GameContext.Provider>
  );
}

export function CreateGameContainer() {
  return <GameContainer />;
}
