import React, { useState } from "react";
import './CSS/PlantScreen.css';
import CompPlot from "../Components/Crops/CompPlot";
import CompInventory from "../Components/GUI/CompInventory";
import CompOtherScreens from "../Components/GUI/CompOtherScreens";
import CompProfile from "../Components/GUI/CompProfile";

function PlantScreen({ getUpgrades, items, updateInventory, switchScreen, getBal, updateBalance, getUser, updateXP, getXP, lastItem }) {

    return (
        <div className="app">
            <div className='left-column'>
                <div className='other-screensPl'><CompOtherScreens switchScreen={switchScreen} current={'PlantScreen'} /></div>
                <div className='plot'><CompPlot getUpgrades={getUpgrades} updateInventory={updateInventory} updateXP={updateXP} getXP={getXP}/></div>
            </div>
            <div className='right-column'>
                <div className="userProfile"><CompProfile type={'tall'} getBal={getBal} updateBalance={updateBalance} getUser={getUser} getXP={getXP} /></div>
                <div className="inventoryPl"><CompInventory items={items} updateInventory={updateInventory} lastItem={lastItem} /></div>
                <div className="settings">SETTINGS</div>
            </div>
        </div>
    )
}


export default PlantScreen