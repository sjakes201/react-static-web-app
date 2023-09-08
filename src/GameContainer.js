import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import InitLoading from './Screens/InitLoading';
import AnimalScreen from './Screens/AnimalScreen';
import PlantScreen from './Screens/PlantScreen';
import ShopScreen from './Screens/ShopScreen';
import MarketScreen from './Screens/MarketScreen';
import LeaderboardScreen from './Screens/LeaderboardScreen';
import AccountScreen from './Screens/AccountScreen';
import PasswordReset from './Screens/PasswordReset';
import HowToPlay from './Screens/HowToPlay';
import MachinesScreen from './Screens/MachinesScreen';
import NotificationBox from "./Components/GUI/NotificationBox";
import Complogin from "./Components/GUI/CompLogin";
import GoogleAnalyticsReporter from './GoogleAnalyticsReporter';

import { useWebSocket } from './WebSocketContext'; // Replace with your actual import path

import CONSTANTS from "./CONSTANTS";
import UPGRADES from './UPGRADES';


function GameContainer() {
    const { waitForServerResponse } = useWebSocket();

    const { isConnected } = useWebSocket();


    const [XP, setXP] = useState(0);
    const [Balance, setBalance] = useState(0);
    const [Username, setUsername] = useState("");
    const [upgrades, setUpgrades] = useState({});
    const [level, setLevel] = useState(0);
    const [notificationBox, setNotificationBox] = useState(false)
    const [unlockContents, setUnlockContents] = useState([])
    const [loginBox, setLoginBox] = useState(false);
    const [capacities, setCapacities] = useState({ barnCapacity: 0, coopCapacity: 0 });

    const [machines, setMachines] = useState({})
    const [parts, setParts] = useState({})
    const [artisanItems, setArtisanItems] = useState({})

    const [coop, setCoop] = useState([]);

    const [barn, setBarn] = useState([]);
    const [deluxePermit, setDeluxePermit] = useState(false);
    const [exoticPermit, setExoticPermit] = useState(false);
    const [animalsInfo, setAnimalsInfo] = useState({})

    let newXP = useRef(false)

    const [prices, setPrices] = useState(null);

    const [itemsData, setItemsData] = useState({})

    useEffect(() => {
        let fetchData = async () => {
            if (waitForServerResponse) {
                const response = await waitForServerResponse('profileInfo');
                let data = response.body;
                setBalance(data.Balance);
                setXP(data.XP);
                setUsername(data.Username);
                setCapacities({ barnCapacity: data.BarnCapacity, coopCapacity: data.CoopCapacity })
                setDeluxePermit(data.deluxePermit);
                setExoticPermit(data.exoticPermit);
                setAnimalsInfo({
                    coopCount: data.CoopAnimals,
                    coopCapacity: data.CoopCapacity,
                    barnCount: data.BarnAnimals,
                    barnCapacity: data.BarnCapacity
                });
                let upgrades = {};
                for (const column in data) {
                    if (column.includes('Upgrade') || column.includes('Permit')) {
                        upgrades[column] = data[column];
                    }
                }
                setUpgrades(upgrades);
            }

            if (waitForServerResponse) {
                const response = await waitForServerResponse('inventoryAll');
                let data = response.body;
                setItemsData(data);
            }

            if (waitForServerResponse) {
                const response = await waitForServerResponse('allAnimals');
                let data = response.body;
                setBarn(data.barnResult);
                setCoop(data.coopResult)
            }


            if (waitForServerResponse) {
                const response = await waitForServerResponse('prices');
                setPrices(response.body);
            }

            if (waitForServerResponse) {
                const response = await waitForServerResponse('getAllMachines');
                let data = response.body;
                setMachines(data.machinesData)
                setParts(data.partsData)
                setArtisanItems(data.artisanData);
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        setLevel(calcLevel(XP))
    }, [XP])

    useEffect(() => {
        if (newXP.current && level in CONSTANTS.levelUnlocks) {
            setUnlockContents(CONSTANTS.levelUnlocks[level])
            setNotificationBox(true)

        }
    }, [level])

    const calcLevel = (XP) => {
        const lvlThresholds = CONSTANTS.xpToLevel;
        let level = 0;
        let remainingXP = XP;
        for (let i = 0; i < lvlThresholds.length; ++i) {
            if (XP >= lvlThresholds[i]) {
                level = i;
                remainingXP = XP - lvlThresholds[i]
            }
        }
        // If level is >= 15, and remainingXP is > 0, we calculate remaining levels (which are formulaic, each level is)
        while (remainingXP >= 600) {
            ++level;
            remainingXP -= 600;
        }
        // find next threshold
        return level
    }

    const getXP = () => {
        return XP;
    }

    const getBal = () => {
        return Balance;
    }

    const updateXP = (amount) => {
        newXP.current = true;
        setXP(prevXP => {
            const newXP = prevXP + amount;
            return newXP;
        });
    }

    const updateBalance = (amount) => {
        setBalance(oldBal => {
            const newBal = oldBal + amount;
            return newBal;
        })
    }

    const getUser = () => {
        if (Username) {
            return Username
        }
    }

    const getUpgrades = () => {
        return upgrades;
    }

    const updateUpgrades = (upgradeBought) => {
        let coopCapacityUpgrades = UPGRADES.CapacityIncreases.Coop;
        let barnCapacityUpgrades = UPGRADES.CapacityIncreases.Barn;

        setUpgrades(prevUpgrades => {
            let newUpgrades = {
                ...prevUpgrades,
                [upgradeBought]: prevUpgrades[upgradeBought] + 1
            }

            setAnimalsInfo((prevAnimals) => {
                let newAnimals = { ...prevAnimals }
                if (upgradeBought === 'barnCapacityUpgrade') {
                    newAnimals.barnCapacity = newAnimals.barnCapacity + barnCapacityUpgrades[newUpgrades.barnCapacityUpgrade - 1]
                }
                if (upgradeBought === 'coopCapacityUpgrade') {
                    newAnimals.coopCapacity = newAnimals.coopCapacity + coopCapacityUpgrades[newUpgrades.coopCapacityUpgrade - 1]

                }
                return newAnimals;
            })

            return newUpgrades;
        })


    }
    const updateAnimalsInfo = (animal) => {
        let location = CONSTANTS.AnimalTypes[animal][0];
        location = location.concat('Count')
        setAnimalsInfo(prevAnimals => {
            return {
                ...prevAnimals,
                [location]: prevAnimals[location] + 1
            }

        })
    }

    const addAnimal = (animal) => {
        let home = CONSTANTS.AnimalTypes[animal.Animal_type][0];
        if (home === 'barn') {
            setBarn((old) => {
                let newAnimals = [...old];
                newAnimals.push(animal);
                return newAnimals
            })
        }
        if (home === 'coop') {
            setCoop((old) => {
                let newAnimals = [...old];
                newAnimals.push(animal);
                return newAnimals
            })

        }
    }

    if (!isConnected) {
        // If not connected yet, return a loading or connecting message
        return (
            <div>
            </div>
        );
    }

    // If connected, render the main game content
    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            {notificationBox && <NotificationBox close={() => setNotificationBox(false)} contents={unlockContents} />}
            {loginBox && <Complogin close={() => setLoginBox(false)} />}
            <GoogleAnalyticsReporter />
            <Routes>
                <Route path="/" element={<InitLoading />} />
                <Route path="/plants" element={<PlantScreen itemsData={itemsData} setItemsData={setItemsData} setLoginBox={setLoginBox} level={level} getUpgrades={getUpgrades} getUser={getUser} getBal={getBal} updateBalance={updateBalance} getXP={getXP} updateXP={updateXP} newXP={newXP} XP={XP} />} />
                <Route path="/animals" element={<AnimalScreen setAnimalsInfo={setAnimalsInfo} barn={barn} coop={coop} setBarn={setBarn} setCoop={setCoop} itemsData={itemsData} setItemsData={setItemsData} capacities={capacities} upgrades={upgrades} setLoginBox={setLoginBox} level={level} getUpgrades={getUpgrades} getUser={getUser} getBal={getBal} updateBalance={updateBalance} getXP={getXP} updateXP={updateXP} newXP={newXP} XP={XP} />} />
                <Route path="/shop" element={<ShopScreen addAnimal={addAnimal} itemsData={itemsData} setItemsData={setItemsData} animalsInfo={animalsInfo} updateAnimalsInfo={updateAnimalsInfo} deluxePermit={deluxePermit} exoticPermit={exoticPermit} updateUpgrades={updateUpgrades} setLoginBox={setLoginBox} level={level} getUpgrades={getUpgrades} getUser={getUser} getBal={getBal} updateBalance={updateBalance} getXP={getXP} newXP={newXP} XP={XP} />} />
                <Route path="/market" element={<MarketScreen itemsData={itemsData} setItemsData={setItemsData} prices={prices} setLoginBox={setLoginBox} getUser={getUser} getBal={getBal} updateBalance={updateBalance} getXP={getXP} newXP={newXP} XP={XP} />} />
                <Route path="/leaderboard" element={<LeaderboardScreen />} />
                <Route path="/account" element={<AccountScreen />} />
                <Route path="/passwordReset" element={<PasswordReset />} />
                <Route path="/howtoplay" element={<HowToPlay />} />
                <Route path="/machines" element={<MachinesScreen artisanItems={artisanItems} setArtisanItems={setArtisanItems} getUser={getUser} getXP={getXP} updateBalance={updateBalance} getBal={getBal} itemsData={itemsData} setItemsData={setItemsData} parts={parts} machines={machines} setParts={setParts} setMachines={setMachines} />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <GameContainer />
    );
}

export default App;
