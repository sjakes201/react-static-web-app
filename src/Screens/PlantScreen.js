import React, { useState, useEffect } from "react";
import './CSS/PlantScreen.css';
import CompPlot from "../Components/Crops/CompPlot";
import CompInventory from "../Components/GUI/CompInventory";
import CompOtherScreens from "../Components/GUI/CompOtherScreens";
import CompProfile from "../Components/GUI/CompProfile";
import Complogin from "../Components/GUI/CompLogin";
import OrderBoard from "../Components/Orders/OrderBoard";
import { useNavigate } from 'react-router-dom';


function PlantScreen() {

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
    const [loginBox, setLoginBox] = useState(false);
    const [orderBox, setOrderBox] = useState(false);
    const [upgrades, setUpgrades] = useState({});
    const [orderNotice, setOrderNotice] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('token');
        sessionStorage.setItem('equipped', '')

        async function fetchData() {
            try {
                const result = await fetch('https://farm-api.azurewebsites.net/api/inventoryAll', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({})
                });
                if (!result.ok) {
                    throw new Error(`HTTP error! status: ${result.status}`);
                } else {
                    let data = await result.json();
                    setItems(data);
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
        fetchData();

        async function fetchProfile() {

            try {
                let data;
                const result = await fetch('https://farm-api.azurewebsites.net/api/profileInfo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({})
                });
                if (!result.ok) {
                    throw new Error(`HTTP error! status: ${result.status}`);
                } else {
                    data = await result.json();
                    setBalance(data.Balance);
                    setXP(data.XP);
                    setUsername(data.Username);
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
    }, []);

    const getXP = () => {
        return XP;
    }

    const getBal = () => {
        return Balance;
    }

    const getUser = () => {
        if (Username) {
            return Username
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
        if (invItem !== null) {
            invItem.classList.remove('flash');
            void invItem.offsetWidth; // This forces a reflow hack
            invItem.classList.add('flash');
        }
    }


    return (
        <div className="app">
            <div className='left-column'>
                <div className='other-screensPl'><CompOtherScreens current={'plants'} /></div>
                <div className='plot'><CompPlot setOrderNotice={setOrderNotice} getUpgrades={getUpgrades} updateInventory={updateInventory} updateXP={updateXP} getXP={getXP} /></div>
            </div>
            <div className='right-column'>
                <div className="userProfile"><CompProfile orderNotice={orderNotice} setOrderBox={setOrderBox} setLoginBox={setLoginBox} type={'tall'} getBal={getBal} updateBalance={updateBalance} getUser={getUser} getXP={getXP} /></div>
                <div className="inventoryPl"><CompInventory items={items} updateInventory={updateInventory} /></div>
                <div className="settings"><a target='_blank' href="/updateNotes.html" style={{fontSize: '.7vw', margin: '1%'}}>update notes </a></div>
            </div>
            <div className="login-GUI">
                {loginBox && <Complogin close={() => setLoginBox(false)} />}
            </div>
            <div className="order-GUI">
                {orderBox && <OrderBoard close={() => setOrderBox(false)} updateBalance={updateBalance} updateXP={updateXP} />}
            </div>
        </div>
    )
}


export default PlantScreen