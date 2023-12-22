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
        return `${process.env.PUBLIC_URL}/assets/images/homie.png`

    }
}
// boostContext is either "town" or "player"
function TownBoostSlot({ boostName, active, setSelected, boostContext, width, height, fontSize, display }) {

    const [tip, setTip] = useState(false)
    const tipTimer = useRef(null)

    let name = boostName.split("_")[0]?.toLowerCase();
    let color = boostContext === "town" ? "gold" : BOOSTSINFO[boostName]?.color;

    let tier = null;
    if(boostContext === "player") {
        tier = boostName[boostName.length - 1]
    }

    return (
        <button
            onMouseDown={() => {
                clearTimeout(tipTimer.current);
                setTip(false);
                if(setSelected) setSelected(boostName);
            }}
            className={`town-shop-boost-slot boost-${color} ${active ? 'active-town-slot' : 'clickable'}`}
            style={{
                width: width,
                height: height,
                fontSize: fontSize
            }}
        >
            {(tip && CONSTANTS.InventoryDescriptions[name]?.[0]) &&
                <div className='boost-tip-container basic-center'>
                    <p className='boost-tip'>{CONSTANTS.InventoryDescriptions[name]?.[0]}</p>
                </div>
            }
            <img
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
            />
            <div className='slot-child town-boost-info'>
                {boostContext === "town" &&
                    <>
                        <p>{BOOSTSINFO.townBoostsInfo?.[boostName]?.type}</p>
                        <p>${BOOSTSINFO.townBoostsInfo?.[boostName]?.cost?.toLocaleString()}</p>
                        <p>{BOOSTSINFO.townBoostsInfo?.[boostName]?.duration}</p>
                    </>
                }
                {boostContext === "player" &&
                    <>
                        <p>{BOOSTSINFO[boostName]?.type}</p>
                        {!display && <p>${BOOSTSINFO[boostName]?.cost?.toLocaleString()}</p>}
                        <p>{BOOSTSINFO[boostName]?.duration}</p>
                        <p>T{tier}</p>
                    </>
                }

            </div>
        </button>
    )
}

export default TownBoostSlot