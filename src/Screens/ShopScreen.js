import React, { useState, useEffect } from "react";

import CompShop from '../Components/Shop/CompShop'
import Complogin from "../Components/GUI/CompLogin";
import CompProfile from '../Components/GUI/CompProfile'
import CompOtherScreens from '../Components/GUI/CompOtherScreens'
import CONSTANTS from "../CONSTANTS";
import UPGRADES from "../UPGRADES";
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from "../WebSocketContext";




function ShopScreen({ addAnimal, itemsData, setItemsData, animalsInfo, updateAnimalsInfo, deluxePermit, exoticPermit, getUpgrades, getUser, getBal, updateBalance, getXP, level, setLoginBox, updateUpgrades }) {
    const { waitForServerResponse } = useWebSocket();

    const navigate = useNavigate();
    if (localStorage.getItem('token') === null) {
        // no auth token present
        navigate('/');
    }

    useEffect(() => {
        sessionStorage.setItem('equipped', '')
    }, [])

    // Functions

    const [items, setItems] = useState({});

    useEffect(() => {
        let data = { ...itemsData };
        delete data.HarvestsFertilizer; delete data.TimeFertilizer; delete data.YieldsFertilizer;
        setItems(data);
    }, [itemsData]);


    // pass each screen this. they will use it and assign it to their building/path buttons
    const switchScreen = () => {
        sessionStorage.setItem("equipped", "");
    }

    const getAnimals = () => {
        if (animalsInfo) return animalsInfo;
    }


    const updateInventory = (itemName, quantity, preventAnimate) => {
        setItemsData((prevItems) => {
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

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//api.adinplay.com/libs/aiptag/pub/FRM/farmgame.live/tag.min.js";
        script.async = true;

        script.onload = () => {
            if (window.aiptag && window.aiptag.cmd && window.aiptag.cmd.display) {
                window.aiptag.cmd.display.push(function () {
                    if (typeof window.aipDisplayTag.display === 'function') {
                        window.aipDisplayTag.display('farmgame-live_160x600');
                    }
                });
            }
        };

        document.body.appendChild(script);

        if (window.aiptag && window.aiptag.cmd && window.aiptag.cmd.display) {
            window.aiptag.cmd.display.push(function () {
                if (typeof window.aipDisplayTag.display.display === 'function') {
                    window.aipDisplayTag.display('farmgame-live_160x600');
                }
            });
        }

        return () => {
            document.body.removeChild(script);
        };
    }, []);


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
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
                <CompShop addAnimal={addAnimal} level={level} getXP={getXP} getAnimals={getAnimals} updateUpgrades={updateUpgrades}
                    getUpgrades={getUpgrades} updateInventory={updateInventory} permits={{ 'deluxePermit': deluxePermit, 'exoticPermit': exoticPermit }}
                    updateBalance={updateBalance} getBal={getBal} updateAnimalsInfo={updateAnimalsInfo}
                    items={items} />
                <div style={{ position: 'relative', background: 'var(--menu_light)', borderLeft: '1px solid black', width: '164px', minHeight: '100%', zIndex: '2000', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div id="farmgame-live_160x600"></div>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/goat_standing_right.png`} style={{ width: '50%', margin: '0 25% 0 25%', position: 'absolute', bottom: '0%' }} />
                </div>
            </div>
        </div>
    )

}

export default ShopScreen