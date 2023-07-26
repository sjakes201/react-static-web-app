import React, { useState, useEffect } from "react";
import './CSS/PlantScreen.css';
import CompPlot from "../Components/Crops/CompPlot";
import CompInventory from "../Components/GUI/CompInventory";
import CompOtherScreens from "../Components/GUI/CompOtherScreens";
import CompProfile from "../Components/GUI/CompProfile";
import Complogin from "../Components/GUI/CompLogin";
import { useNavigate } from 'react-router-dom';


function PlantScreen({ }) {

    const navigate = useNavigate();
    if (localStorage.getItem('token') === null) {
        // no auth token present
        navigate('/');
    }

    const [items, setItems] = useState({});

    // profile info
    const [Balance, setBalance] = useState(0);
    const [XP, setXP] = useState(0);
    const [Username, setUsername] = useState("");
    const [deluxePermit, setDeluxePermit] = useState(false);
    const [exoticPermit, setExoticPermit] = useState(false);
    const [animals, setAnimals] = useState({});
    const [prices, setPrices] = useState([{}, {}]);
    const [loginBox, setLoginBox] = useState(false);
    const [upgrades, setUpgrades] = useState({});


    useEffect(() => {
        const token = localStorage.getItem('token');
        sessionStorage.setItem('equipped', '')
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

    const getXP = () => {
        return XP;
    }

    const getBal = () => {
        return Balance;
    }

    const getUser = () => {
        if (Username) {
            if (Username.includes('#')) return "Guest"
            return Username;
        }
    }

    const getUpgrades = () => {
        if (upgrades) return upgrades;
        // for all of these.. else return proper formatted data with default values?
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


    return (
        <div className="app">
            <div className='left-column'>
                <div className='other-screensPl'><CompOtherScreens current={'plants'} /></div>
                <div className='plot'><CompPlot getUpgrades={getUpgrades} updateInventory={updateInventory} updateXP={updateXP} getXP={getXP} /></div>
            </div>
            <div className='right-column'>
                <div className="userProfile"><CompProfile setLoginBox={setLoginBox} type={'tall'} getBal={getBal} updateBalance={updateBalance} getUser={getUser} getXP={getXP} /></div>
                <div className="inventoryPl"><CompInventory items={items} updateInventory={updateInventory} /></div>
                <div className="settings">SETTINGS</div>
            </div>
            <div className="login-GUI">
                { loginBox && <Complogin close={() => setLoginBox(false)}/>}
            </div>
        </div>
    )
}


export default PlantScreen