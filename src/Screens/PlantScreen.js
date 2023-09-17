import React, { useState, useEffect, useRef } from "react";
import CONSTANTS from "../CONSTANTS";
import './CSS/PlantScreen.css';
import CompPlot from "../Components/Crops/CompPlot";
import CompInventory from "../Components/GUI/CompInventory";
import CompOtherScreens from "../Components/GUI/CompOtherScreens";
import CompProfile from "../Components/GUI/CompProfile";
import OrderBoard from "../Components/Orders/OrderBoard";
import { useNavigate } from 'react-router-dom';

import AdinPlayAd from "../AdinPlayAd";

function PlantScreen({ townPerks, tiles, setTiles, itemsData, setItemsData, getUpgrades, getUser, getBal, updateBalance, getXP, updateXP, level, setLoginBox }) {


    const navigate = useNavigate();
    if (localStorage.getItem('token') === null) {
        // no auth token present
        navigate('/');
    }

    const [items, setItems] = useState({});
    const [fertilizers, setFertilizers] = useState({})
    const [tool, setTool] = useState("")

    const [orderBox, setOrderBox] = useState(false);
    const [orderNotice, setOrderNotice] = useState(false);

    // level is just for level (pass to components that want to know unlocks)
    // The rest is for the level up notification system, create notification box only when the change in level is not from init mount (hence the ref)

    const [equippedFert, setEquippedFert] = useState("");

    useEffect(() => {
        let data = { ...itemsData }
        setFertilizers({
            HarvestsFertilizer: data.HarvestsFertilizer,
            TimeFertilizer: data.TimeFertilizer,
            YieldsFertilizer: data.YieldsFertilizer,
        })
        delete data.HarvestsFertilizer; delete data.TimeFertilizer; delete data.YieldsFertilizer;
        setItems(data);

    }, [itemsData]);

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

    useEffect(() => {
        sessionStorage.setItem('equipped', '')
    }, [])

    return (
        <div style={appStyle}>
            <div className='left-column'>
                <div className='other-screensPl'><CompOtherScreens current={'plants'} /></div>
                <div className='plot'><CompPlot townPerks={townPerks} tiles={tiles} setTiles={setTiles} tool={tool} setFertilizers={setFertilizers} fertilizers={fertilizers} equippedFert={equippedFert} setEquippedFert={setEquippedFert} setOrderNotice={setOrderNotice} getUpgrades={getUpgrades} updateInventory={updateInventory} updateXP={updateXP} getXP={getXP} items={items} /></div>
            </div>
            <div className='right-column'>
                <div className="userProfile"><CompProfile orderNotice={orderNotice} setOrderBox={setOrderBox} setLoginBox={setLoginBox} type={'tall'} getBal={getBal} updateBalance={updateBalance} getUser={getUser} getXP={getXP} /></div>
                <div className="inventoryPl"><CompInventory level={level} tool={tool} setTool={setTool} fertilizers={fertilizers} equippedFert={equippedFert} items={items} updateInventory={updateInventory} showFertilizer={true} setEquippedFert={setEquippedFert} /></div>
                <div className="settings">
                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '60px', justifyContent: 'space-evenly', position: 'absolute', top: '0' }}>
                        <div style={{ position: 'relative', width: '120px', height: '60px', zIndex: '2000' }}>
                            {/* <div id="farmgame-live_120x60"></div> */}
                            <div>
                                <AdinPlayAd placementId="farmgame-live_120x60" />
                            </div>
                        </div>
                    </div>
                    {/* <a target='_blank' href="/updateNotes.html" style={{ fontSize: '.7vw', marginRight: '1%' }}>update notes </a> */}
                    <div style={{ width: '70%', height: '3vh', position: 'absolute', bottom: '1vh', left: '0', fontSize: '1vw' }}>
                        <a target='_black' href="https://discord.gg/jrxWrgNCHw" style={{ fontSize: '.6vw', textDecoration: 'underline', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={`${process.env.PUBLIC_URL}/assets/images/discord.png`} style={{ height: '50%', marginRight: '2%' }}></img>
                            Community Discord
                            <img src={`${process.env.PUBLIC_URL}/assets/images/discord.png`} style={{ height: '50%', marginLeft: '2%' }}></img>
                        </a>
                    </div>
                </div>
            </div>
            <div className="order-GUI">
                {orderBox && <OrderBoard townPerks={townPerks} close={() => setOrderBox(false)} setFertilizers={setFertilizers} updateBalance={updateBalance} updateXP={updateXP} />}
            </div>
        </div>
    )
}


export default PlantScreen