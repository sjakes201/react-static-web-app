import "./TownItemsShop.css"
import CONSTANTS from "../../CONSTANTS";
import UPGRADES from "../../UPGRADES";
import TOWNSINFO from "../../TOWNSINFO";
import React, { useState, useRef } from "react";
import BOOSTSINFO from "../../BOOSTSINFO";

function TownBoostSlot({ boostName, active, setSelected, getImageSrc }) {

    const [tip, setTip] = useState(false)
    const tipTimer = useRef(null)

    let name = boostName.split("_")[0]?.toLowerCase();

    return (
        <button
            onMouseDown={() => {
                clearTimeout(tipTimer.current);
                setTip(false);
                setSelected(boostName);
            }}
            className={`town-shop-boost-slot ${active ? 'active-town-slot' : 'clickable'}`}
        >
            {tip &&
                <div className='boost-tip-container basic-center'>
                    <p className='boost-tip'>{CONSTANTS.InventoryDescriptions[name][0]}</p>
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
                src={getImageSrc(boostName)}
            />
            <div className='slot-child town-boost-info'>
                <p>{BOOSTSINFO.townBoostsInfo?.[boostName]?.type}</p>
                <p>${BOOSTSINFO.townBoostsInfo?.[boostName]?.cost?.toLocaleString()}</p>
                <p>{BOOSTSINFO.townBoostsInfo?.[boostName]?.duration}</p>
            </div>
        </button>
    )
}

export default TownBoostSlot