import React, { useEffect, useState } from 'react';
import AnimalScreen from './Screens/AnimalScreen';
import PlantScreen from './Screens/PlantScreen';
import ShopScreen from './Screens/ShopScreen';
import MarketScreen from './Screens/MarketScreen';
import LeaderboardScreen from './Screens/LeaderboardScreen'
import CONSTANTS from './CONSTANTS';
import UPGRADES from './UPGRADES';

function GameContainer() {
    const [items, setItems] = useState({});
    const [activeScreen, setActiveScreen] = useState('PlantScreen')

    // profile info
    const [Balance, setBalance] = useState(0);
    const [XP, setXP] = useState(0);
    const [Username, setUsername] = useState("");
    const [deluxePermit, setDeluxePermit] = useState(false);
    const [exoticPermit, setExoticPermit] = useState(false);
    const [animals, setAnimals] = useState({})
    const [prices, setPrices] = useState([{}, {}])

    const [upgrades, setUpgrades] = useState({});


    useEffect(() => {
        const token = localStorage.getItem('token');
        async function fetchData() {
            const result = await fetch('https://farm-api.azurewebsites.net/api/inventoryAll', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${token}`
                }, 
                body: JSON.stringify({})
              });
            let data = await result.json();
            setItems(data);
        }
        fetchData();

        async function fetchProfile() {
            const result = await fetch('https://farm-api.azurewebsites.net/api/profileInfo', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${token}`
                }, 
                body: JSON.stringify({})
              });
            const data = await result.json();

            const prices = await fetch('https://farm-api.azurewebsites.net/api/prices', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${token}`
                }, 
                body: JSON.stringify({})
              });
            const pricesData = await prices.json()

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
            setPrices(pricesData);


            let upgrades = {};
            for (const column in data) {
                if (column.includes('Upgrade') || column.includes('Permit')) {
                    upgrades[column] = data[column];
                }
            }
            setUpgrades(upgrades);
        }
        fetchProfile();

    }, []);

    // pass each screen this. they will use it and assign it to their building/path buttons
    const switchScreen = (screenName) => {
        sessionStorage.setItem("equipped", "");
        setActiveScreen(screenName);
    }

    const getAnimals = () => {
        if (animals) return animals;
    }

    const getXP = () => {
        return XP;
    }

    const getPrices = () => {
        if (prices.newPrices) return prices;
    }

    const getBal = () => {
        return Balance;
    }

    const getUser = () => {
        if (Username) return Username
    }

    const getUpgrades = () => {
        if (upgrades) return upgrades;
        // for all of these.. else return proper formatted data with default values?
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

    const updateXP = (amount) => {
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

    const getScreen = () => {
        switch (activeScreen) {
            case 'PlantScreen':
                return <PlantScreen getUpgrades={getUpgrades} items={items} updateInventory={updateInventory} switchScreen={switchScreen} getBal={getBal} updateBalance={updateBalance} getUser={getUser} getXP={getXP} updateXP={updateXP} permits={{ 'deluxePermit': deluxePermit, 'exoticPermit': exoticPermit }} />
            case 'AnimalScreen':
                return <AnimalScreen getUpgrades={getUpgrades} items={items} updateInventory={updateInventory} switchScreen={switchScreen} getBal={getBal} updateBalance={updateBalance} getUser={getUser} getXP={getXP} updateXP={updateXP} permits={{ 'deluxePermit': deluxePermit, 'exoticPermit': exoticPermit }} />
            case 'ShopScreen':
                return <ShopScreen updateAnimals={updateAnimals} getAnimals={getAnimals} updateUpgrades={updateUpgrades} getUpgrades={getUpgrades} updateInventory={updateInventory} updateBalance={updateBalance} getBal={getBal} getXP={getXP} getUser={getUser} switchScreen={switchScreen} permits={{ 'deluxePermit': deluxePermit, 'exoticPermit': exoticPermit }} items={items} />
            case 'MarketScreen':
                return <MarketScreen items={items} getPrices={getPrices} switchScreen={switchScreen} getBal={getBal} getUser={getUser} getXP={getXP} updateInventory={updateInventory} updateBalance={updateBalance} />
            case 'LeaderboardScreen':
                return <LeaderboardScreen />    
        }
    }

    return (
        <div>
            {getScreen()}
        </div>
    )
}


export default GameContainer;