import "./TownItemsShop.css"
import CONSTANTS from "../../CONSTANTS";
import UPGRADES from "../../UPGRADES";
import TOWNSINFO from "../../TOWNSINFO";
import React, { useState, useRef } from "react";
import BOOSTSINFO from "../../BOOSTSINFO";

const getImageSrc = (boostName, boostContext) => {
    if (boostContext === "town") {
        let name = boostName.split("_")[0]?.toLowerCase();
        if (name in UPGRADES.AnimalProduceMap0) {
            //is animal
            return `${process.env.PUBLIC_URL}/assets/images/${name}_standing_right.png`
        } else {
            // is crop
            return `${process.env.PUBLIC_URL}/assets/images/${name}.png`
        }
    } else {
        if (boostName.includes("CROPS")) {
            return `${process.env.PUBLIC_URL}/assets/images/cropsPB.png`
        } else if (boostName.includes("ANIMALS")) {

            return `${process.env.PUBLIC_URL}/assets/images/animalsPB.png`
        }

    }
}
// boostContext is either "town" or "player", display is boolean for removing cost, width and height are CSS, menuIcon is to have no text and both icons
function TownBoostSlot({ boostName, active, setSelected, boostContext, width, height, fontSize, display, menuIcon }) {

    const [tip, setTip] = useState(false)
    const tipTimer = useRef(null)

    let name = boostName.split("_")[0]?.toLowerCase();
    let color = boostContext === "town" ? "gold" : BOOSTSINFO[boostName]?.color;

    let tier = null;
    if (boostContext === "player") {
        tier = boostName[boostName.length - 1]
    }

    return (
        <button
            onMouseDown={() => {
                clearTimeout(tipTimer.current);
                setTip(false);
                if (setSelected) setSelected(boostName);
            }}
            className={`town-shop-boost-slot boost-${color} ${active ? 'active-town-slot' : 'clickable'} ${menuIcon ? 'basic-center' : ''}`}
            style={{
                width: width,
                height: height,
                fontSize: fontSize
            }}
        >
            {menuIcon && <img id='pb-menu-icon' src={`${process.env.PUBLIC_URL}/assets/images/blankPB.png`}/>}
            {(tip && CONSTANTS.InventoryDescriptions[name]?.[0]) &&
                <div className='boost-tip-container basic-center'>
                    <p className='boost-tip'>{CONSTANTS.InventoryDescriptions[name]?.[0]}</p>
                </div>
            }
            {!menuIcon && <img
                onMouseEnter={() => {
                    tipTimer.current = setTimeout(() => {
                        setTip(true);
                    }, 600);
                }}
                onMouseLeave={() => {
                    clearTimeout(tipTimer.current);
                    setTip(false);
                }}
                className='slot-child town-boost-image'
                src={getImageSrc(boostName, boostContext)}
            />}
            
            <div className='slot-child town-boost-info'>
                {boostContext === "town" &&
                    <>
                        <p>{BOOSTSINFO.townBoostsInfo?.[boostName]?.type}</p>
                        <p>${BOOSTSINFO.townBoostsInfo?.[boostName]?.cost?.toLocaleString()}</p>
                        <p>{BOOSTSINFO.townBoostsInfo?.[boostName]?.duration}</p>
                    </>
                }
                {!menuIcon && boostContext === "player" &&
                    <>
                        <p>{BOOSTSINFO[boostName]?.type}</p>
                        {!display && <p className='premCurBoostCost' ><img src={`${process.env.PUBLIC_URL}/assets/images/premiumCurrency.png`} />{BOOSTSINFO[boostName]?.cost?.toLocaleString()}</p>}
                        <p>{BOOSTSINFO[boostName]?.duration}</p>
                        <p>T{tier}</p>
                    </>
                }

            </div>
        </button>
    )
}

export default TownBoostSlot