import React, { useState, useEffect, useRef } from "react";
import CONSTANTS from "../CONSTANTS";
import './CSS/PlantScreen.css';
import CompPlot from "../Components/Crops/CompPlot";
import CompInventory from "../Components/GUI/CompInventory";
import CompOtherScreens from "../Components/GUI/CompOtherScreens";
import CompProfile from "../Components/GUI/CompProfile";
import Complogin from "../Components/GUI/CompLogin";
import OrderBoard from "../Components/Orders/OrderBoard";
import NotificationBox from "../Components/GUI/NotificationBox";
import { useNavigate } from 'react-router-dom';


function PlantScreen() {

    const navigate = useNavigate();
    if (localStorage.getItem('token') === null) {
        // no auth token present
        navigate('/');
    }

    const [items, setItems] = useState({});
    const [fertilizers, setFertilizers] = useState({})

    // profile info
    const [Balance, setBalance] = useState(0);
    const [XP, setXP] = useState(0);
    const [Username, setUsername] = useState("");
    const [loginBox, setLoginBox] = useState(false);
    const [orderBox, setOrderBox] = useState(false);
    const [upgrades, setUpgrades] = useState({});
    const [orderNotice, setOrderNotice] = useState(false);

    // level is just for level (pass to components that want to know unlocks)
    // The rest is for the level up notification system, create notification box only when the change in level is not from init mount (hence the ref)
    const [unlockContents, setUnlockContents] = useState([])
    const [notificationBox, setNotificationBox] = useState(false)
    const [level, setLevel] = useState(0);

    const [equippedFert, setEquippedFert] = useState("");

    let newXP = useRef(false)


    useEffect(() => {
        const token = localStorage.getItem('token');
        sessionStorage.setItem('equipped', '')

        async function fetchData() {
            try {
                const result = await fetch('http://localhost:7071/api/inventoryAll', {
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
                    setFertilizers({
                        HarvestsFertilizer: data.HarvestsFertilizer,
                        TimeFertilizer: data.TimeFertilizer,
                        YieldsFertilizer: data.YieldsFertilizer,
                    })
                    let dataCopy = { ...data }
                    delete dataCopy.HarvestsFertilizer; delete dataCopy.TimeFertilizer; delete dataCopy.YieldsFertilizer;
                    setItems(dataCopy);
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

    useEffect(() => {
        setLevel(calcLevel(XP))
    }, [XP])

    useEffect(() => {
        console.log('lvl updated')
        console.log(newXP.current)
        if (newXP.current && level in CONSTANTS.levelUnlocks) {
            console.log('lvl updated bc of new')
            setUnlockContents(CONSTANTS.levelUnlocks[level])
            setNotificationBox(true)

        }
    }, [level])

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

    let appStyle = {
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: '80% 20%',
        position: 'relative',
        overflow: 'hidden',
    }


    if (equippedFert !== "") {
        console.log(equippedFert)
        appStyle.cursor = `url(${process.env.PUBLIC_URL}/assets/images/mouse/${equippedFert}.png) 16 16, auto`
    }

    return (
        <div style={appStyle}>
            {notificationBox && <NotificationBox close={() => setNotificationBox(false)} contents={unlockContents} />}
            <div className='left-column'>
                <div className='other-screensPl'><CompOtherScreens current={'plants'} /></div>
                <div className='plot'><CompPlot setFertilizers={setFertilizers} fertilizers={fertilizers} equippedFert={equippedFert} setEquippedFert={setEquippedFert} setOrderNotice={setOrderNotice} getUpgrades={getUpgrades} updateInventory={updateInventory} updateXP={updateXP} getXP={getXP} /></div>
            </div>
            <div className='right-column'>
                <div className="userProfile"><CompProfile orderNotice={orderNotice} setOrderBox={setOrderBox} setLoginBox={setLoginBox} type={'tall'} getBal={getBal} updateBalance={updateBalance} getUser={getUser} getXP={getXP} /></div>
                <div className="inventoryPl"><CompInventory fertilizers={fertilizers} equippedFert={equippedFert} items={items} updateInventory={updateInventory} showFertilizer={true} setEquippedFert={setEquippedFert} /></div>
                <div className="settings">
                    {/* <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '60px', justifyContent: 'space-evenly', position: 'absolute', top: '0' }}>
                        <div style={{ position: 'relative', background: 'orange', width: '120px', height: '60px', zIndex: '2000', border: '2px solid purple' }}>
                            AD 120px x 60px
                        </div>
                        <div style={{ position: 'relative', background: 'orange', width: '120px', height: '60px', zIndex: '2000', border: '2px solid purple' }}>
                            AD 120px x 60px
                        </div>

                    </div> */}
                    <a target='_blank' href="/updateNotes.html" style={{ fontSize: '.7vw', marginRight: '1%' }}>update notes </a>
                    <a target='_blank' href="/privacy.html" style={{ fontSize: '.7vw', marginRight: '1%' }}>Privacy Policy </a>

                    <div style={{ width: '70%', height: '3vh', position: 'absolute', bottom: '4vh', left: '0', fontSize: '1vw' }}>
                        <a target='_black' href="https://discord.gg/jrxWrgNCHw" style={{ fontSize: '.6vw', textDecoration: 'underline', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={`${process.env.PUBLIC_URL}/assets/images/discord.png`} style={{ height: '50%', marginRight: '2%' }}></img>
                            Community Discord
                            <img src={`${process.env.PUBLIC_URL}/assets/images/discord.png`} style={{ height: '50%', marginLeft: '2%' }}></img>
                        </a>
                    </div>
                    <div style={{ width: '70%', height: '3vh', position: 'absolute', bottom: '1vh', left: '0', fontSize: '1vw' }}>
                        <a target='_black' href="https://www.buymeacoffee.com/farmgame" style={{ fontSize: '.6vw', textDecoration: 'underline', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={`${process.env.PUBLIC_URL}/assets/images/goat_standing_right.png`} style={{ width: '20%' }}></img>
                            Buy me a coffee
                            <img src={`${process.env.PUBLIC_URL}/assets/images/goat_standing_right.png`} style={{ width: '20%' }}></img>
                        </a>
                    </div>
                </div>
            </div>
            <div className="login-GUI">
                {loginBox && <Complogin close={() => setLoginBox(false)} />}
            </div>
            <div className="order-GUI">
                {orderBox && <OrderBoard close={() => setOrderBox(false)} setFertilizers={setFertilizers} updateBalance={updateBalance} updateXP={updateXP} />}
            </div>
        </div>
    )
}


export default PlantScreen