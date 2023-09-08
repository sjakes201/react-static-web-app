import React, { useState, useEffect } from "react";

import CompShop from '../Components/Shop/CompShop'
import Complogin from "../Components/GUI/CompLogin";
import CompProfile from '../Components/GUI/CompProfile'
import CompOtherScreens from '../Components/GUI/CompOtherScreens'
import CONSTANTS from "../CONSTANTS";
import UPGRADES from "../UPGRADES";
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from "../WebSocketContext";




function ShopScreen() {
    const { waitForServerResponse } = useWebSocket();

    const navigate = useNavigate();
    if (localStorage.getItem('token') === null) {
        // no auth token present
        navigate('/');
    }

    sessionStorage.setItem("equipped", '');
    // Functions

    const [items, setItems] = useState({});

    // profile info
    const [Balance, setBalance] = useState(0);
    const [XP, setXP] = useState(-1);
    const [Username, setUsername] = useState("");
    const [deluxePermit, setDeluxePermit] = useState(false);
    const [exoticPermit, setExoticPermit] = useState(false);
    const [animals, setAnimals] = useState({})

    const [upgrades, setUpgrades] = useState({});
    const [loginBox, setLoginBox] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                if (waitForServerResponse) { // Ensure `waitForServerResponse` is defined
                    const response = await waitForServerResponse('inventoryAll');
                    let data = response.body;
                    delete data.HarvestsFertilizer; delete data.TimeFertilizer; delete data.YieldsFertilizer;
                    setItems(data);
                }
            } catch (error) {
                if (error.message.includes('401')) {
                    localStorage.removeItem('token');
                    navigate('/');
                }
            }
        }
        fetchData();

        async function fetchProfile() {

            try {
                if (waitForServerResponse) { // Ensure `waitForServerResponse` is defined
                    const response = await waitForServerResponse('profileInfo');
                    let data = response.body;
                    setBalance(data.Balance);
                    setXP(data.XP);
                    setUsername(data.Username);
                    setDeluxePermit(data.deluxePermit);
                    setExoticPermit(data.exoticPermit);
                    setAnimals({
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
            } catch (error) {
                if (error.message.includes('401')) {
                    console.log("AUTH EXPIRED")
                    localStorage.removeItem('token');
                    navigate('/');
                } else {
                    console.log(error)
                }
            }

        }
        fetchProfile();

    }, [navigate]);

    // pass each screen this. they will use it and assign it to their building/path buttons
    const switchScreen = () => {
        sessionStorage.setItem("equipped", "");
    }

    const getAnimals = () => {
        if (animals) return animals;
    }

    const getXP = () => {
        return XP;
    }

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

    const getLevel = () => {
        return calcLevel(XP)
    }

    const getBal = () => {
        return Balance;
    }

    const getUser = () => {
        if (Username) {
            return Username;
        }
    }

    const getUpgrades = () => {
        if (upgrades) return upgrades;
    }

    const updateAnimals = (animal) => {
        let location = CONSTANTS.AnimalTypes[animal][0];
        location = location.concat('Count')
        setAnimals(prevAnimals => {
            return {
                ...prevAnimals,
                [location]: prevAnimals[location] + 1
            }

        })
    }

    const updateUpgrades = (upgradeBought) => {
        let coopCapacityUpgrades = UPGRADES.CapacityIncreases.Coop;
        let barnCapacityUpgrades = UPGRADES.CapacityIncreases.Barn;

        setUpgrades(prevUpgrades => {
            let newUpgrades = {
                ...prevUpgrades,
                [upgradeBought]: prevUpgrades[upgradeBought] + 1
            }

            setAnimals((prevAnimals) => {
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

    const updateBalance = (amount) => {
        setBalance(oldBal => {
            const newBal = oldBal + amount;
            return newBal;
        })
    }

    const updateInventory = (itemName, quantity, preventAnimate) => {
        setItems((prevItems) => {
            let invItems = { ...prevItems, [itemName]: (prevItems[itemName] || 0) + quantity };
            const sortedKeys = Object.keys(invItems).sort((a, b) => invItems[b] - invItems[a]);
            const sortedObject = {};
            sortedKeys.forEach(key => {
                sortedObject[key] = invItems[key];
            });

            return { ...sortedObject };
        })
        if (preventAnimate) return;
        const invItem = document.getElementById(itemName);
        invItem.classList.remove('flash');
        void invItem.offsetWidth; // This forces a reflow hack
        invItem.classList.add('flash');
    }


    return (
        <div>
            <div style={{
                height: '14vh',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
            }}>
                <div style={{ width: '70vw' }}>
                    <CompOtherScreens switchScreen={switchScreen} current={'shop'} />
                </div>
                <div style={{ width: '30vw' }}>
                    <CompProfile setLoginBox={setLoginBox} type={'short'} getBal={getBal} getUser={getUser} getXP={getXP} />
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <CompShop getLevel={getLevel} getXP={getXP} getAnimals={getAnimals} updateUpgrades={updateUpgrades}
                    getUpgrades={getUpgrades} updateInventory={updateInventory} permits={{ 'deluxePermit': deluxePermit, 'exoticPermit': exoticPermit }}
                    updateBalance={updateBalance} getBal={getBal} updateAnimals={updateAnimals}
                    items={items} />
                {/* <div style={{ position: 'relative', background: 'orange', width: '160px', height: '600px', zIndex: '2000', border: '2px solid purple' }}>
                    AD 160 x 600
                </div> */}
            </div>
            <div className="login-GUI">
                {loginBox && <Complogin close={() => setLoginBox(false)} />}
            </div>
        </div>
    )

}

export default ShopScreen