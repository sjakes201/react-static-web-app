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
                <CompShop addAnimal={addAnimal} level={level} getXP={getXP} getAnimals={getAnimals} updateUpgrades={updateUpgrades}
                    getUpgrades={getUpgrades} updateInventory={updateInventory} permits={{ 'deluxePermit': deluxePermit, 'exoticPermit': exoticPermit }}
                    updateBalance={updateBalance} getBal={getBal} updateAnimalsInfo={updateAnimalsInfo}
                    items={items} />
                {/* <div style={{ position: 'relative', background: 'orange', width: '160px', height: '600px', zIndex: '2000', border: '2px solid purple' }}>
                    AD 160 x 600
                </div> */}
            </div>
        </div>
    )

}

export default ShopScreen