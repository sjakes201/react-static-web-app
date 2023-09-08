import React, { useEffect, useState } from "react";
import '../CSS/CompItem.css'
import CONSTANTS from "../../CONSTANTS";
import UPGRADES from "../../UPGRADES";
import { useWebSocket } from "../../WebSocketContext";

const SEED_LIMIT = 100;

function CompItem({ addAnimal, unlockInfo, updateAnimalsInfo, itemName, cost, unlocked, info, updateBalance, getBal, updateInventory, tier, updateUpgrades, items, hasSpace }) {
    const { waitForServerResponse } = useWebSocket();

    const [gif, setGif] = useState({ 1: null, 5: null, 25: null });
    const [gifKey, setGifKey] = useState(0);
    const [itemInfo, setItemInfo] = useState(false)

    const getLocationStyle = () => {
        switch (info.split(" ")[0]) {
            case 'BARN':
                return {
                    color: 'brown',
                    fontWeight: 'bold'
                }
            case 'COOP':
                return {
                    color: 'yellow',
                    fontWeight: 'bold'
                }
        }
    }

    const handleClick = async (num) => {
        let desired = num;
        if (num < 1) return;
        let gifCopy = { ...gif };

        if (itemName in CONSTANTS.Fixed_Prices) {
            if (items[itemName] >= SEED_LIMIT) {
                // over seed limit
                // make item flash red and item quantity flash large?
                gifCopy[desired] = 'fail';
                setGif(gifCopy);
                setGifKey(prevKey => prevKey + 1);
                return;
            }
            if (items[itemName] + num >= SEED_LIMIT) {
                // reduce num purchased to what is allowed
                num = num - (items[itemName] + num - 100);
                if (num < 1) return;
            }
            if (getBal() >= cost * num) {
                updateBalance(-1 * cost * num);
                updateInventory(itemName, num, true);
                gifCopy[desired] = 'success';
            } else {
                gifCopy[desired] = 'fail';
            }
            setGif(gifCopy);
            setGifKey(prevKey => prevKey + 1);
            if (gifCopy[desired] === 'fail') return;

            if (waitForServerResponse) {
                const response = await waitForServerResponse('buy', {
                    count: num,
                    item: itemName
                });
            }
        }
        if (itemName in CONSTANTS.AnimalTypes) {
            if (getBal() >= (cost)) {
                updateBalance(-1 * cost);
                updateAnimalsInfo(itemName);
                gifCopy[num] = 'success';
            } else {
                gifCopy[num] = 'fail';
            }
            setGif(gifCopy);
            setGifKey(prevKey => prevKey + 1);
            if (gifCopy[num] === 'fail') return;

            if (waitForServerResponse) {
                const response = await waitForServerResponse('buyAnimal', {
                    type: itemName
                });
                addAnimal(response.body)
            }
        }
        if (itemName in UPGRADES.UpgradeCosts) {
            if (getBal() >= cost) {
                updateBalance(-1 * cost);
                updateUpgrades(itemName);
                gifCopy[num] = 'success';
            } else {
                gifCopy[num] = 'fail';
            }
            setGif(gifCopy);
            setGifKey(prevKey => prevKey + 1);
            if (gifCopy[num] === 'fail') return;


            if (waitForServerResponse) {
                const response = await waitForServerResponse('buyUpgrade', {
                    upgrade: itemName,
                    tier: tier
                });
            }
        }
    }

    useEffect(() => {
        let timeouts = [];
        Object.keys(gif).forEach((key) => {
            if (gif[key] !== null) {
                timeouts.push(setTimeout(() => {
                    setGif(prevGif => ({ ...prevGif, [key]: null }));
                }, 447));
            }
        });
        return () => timeouts.forEach(clearTimeout);  // Clean up on unmount
    }, [gif, gifKey]);


    const getLevelNeeded = () => {
        for (let level in CONSTANTS.levelUnlocks) {
            if (CONSTANTS.levelUnlocks[level].includes(itemName)) return level
        }
        return -1;

    }
    if (itemName in CONSTANTS.Fixed_Prices) {
        return (
            <div id="itemBox" className={unlocked ? "" : "notAvailable"} >
                {!unlocked && (
                    <div className='content'>
                        <p>LOCKED</p>
                        {
                            unlockInfo[1] !== '' &&
                            <p>{unlockInfo[1]}</p>

                        }
                        {!unlockInfo[0] &&
                            <p>{`Level ${getLevelNeeded()}`}</p>
                        }
                    </div>
                )}
                <div className="itemImg">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/${itemName}.png`} />
                </div>
                <div id="name">
                    <p>{CONSTANTS.InventoryDescriptions[CONSTANTS.SeedCropMap[itemName][0]][0]}</p>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/info.png`} className='shopItemInfo' onMouseEnter={() => setItemInfo(true)} onMouseLeave={() => setItemInfo(false)} />
                    {
                        itemInfo &&
                        <div className='seedTooltip'>
                            {CONSTANTS.InventoryDescriptions[itemName][1]}
                        </div>
                    }
                </div>
                <div id="info">
                    <div className='left-text'>
                        <p>${cost}</p><small>/each</small>
                    </div>
                    <div className='right-text' >
                        <p style={{
                            color: 'gold',
                            fontWeight: 'bold'
                        }}>{info}</p>
                    </div>
                </div>
                <div id="buyButtons">
                    <div className='buyButton'>
                        <button onClick={() => handleClick(1)}>x1</button>
                        {gif[1] && <img key={gifKey} src={`${process.env.PUBLIC_URL}/assets/images/${gif[1]}.gif`} className="gif" />}
                        <small>${cost || 'COST'}</small>
                    </div>
                    <div className='buyButton'>
                        <button onClick={() => handleClick(5)}>x5</button>
                        {gif[5] && <img key={gifKey} src={`${process.env.PUBLIC_URL}/assets/images/${gif[5]}.gif`} className="gif" />}
                        <small>${(5 * cost) || 'COST'}</small>
                    </div>
                    <div className='buyButton'>
                        <button onClick={() => handleClick(25)}>x25</button>
                        {gif[25] && <img key={gifKey} src={`${process.env.PUBLIC_URL}/assets/images/${gif[25]}.gif`} className="gif" />}
                        <small>${(25 * cost) || 'COST'}</small>
                    </div>
                </div>
            </div>
        )
    }
    if (itemName in CONSTANTS.AnimalTypes) {
        return (
            <div id="itemBox" className={(!unlockInfo[0] || !hasSpace) ? "notAvailable" : ""} >
                {!unlockInfo[0] && (
                    <div className='content'>
                        <p>LOCKED</p>
                        {
                            unlockInfo[1] !== '' &&
                            <p>{unlockInfo[1]}</p>

                        }
                        {!unlockInfo[0] &&
                            <p>{`Level ${getLevelNeeded()}`}</p>
                        }
                    </div>
                )}

                {(unlockInfo[0] && !hasSpace) &&
                    <p className='content'>
                        MAX CAPACITY
                    </p>
                }
                <div className="itemImg">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/${itemName}_standing_right.png`} />
                </div>
                <div id="name">
                    <p>{CONSTANTS.InventoryDescriptions[itemName][0]}</p>
                </div>
                <div id="info">
                    <div className='left-text'>
                        <p>${cost}</p><small></small>
                    </div>
                    <div className='right-text' >
                        <p style={getLocationStyle()}>{info.split(" ")[0]}</p>
                        <p style={{
                            color: 'purple',
                            fontWeight: 'bold'
                        }}>{info.split(" ")[1]}</p>
                    </div>
                </div>
                <div id="buyButtons">
                    <div className='buyButton' id='adopt'>
                        <button onClick={() => handleClick(1)}>BUY</button>
                        {gif[1] && <img key={gifKey} src={`${process.env.PUBLIC_URL}/assets/images/${gif[1]}.gif`} className="gif" />}
                    </div>

                </div>
            </div>
        )
    }

    if (itemName in UPGRADES.UpgradeCosts) {
        return (
            <div id="itemBox" className={unlocked ? "" : "notAvailable"} >
                {!unlocked && (
                    <div className='content'>
                        <p>{itemName.includes('Permit') ? "BOUGHT" : "MAXED"}</p>
                    </div>
                )}
                <div className="itemImg">
                    <img id='upgradeImg' src={`${process.env.PUBLIC_URL}/assets/images/${itemName}.png`} />
                </div>
                <div id="name">
                    <p>{(UPGRADES.UpgradeDescriptions[itemName][0])}</p>

                </div>
                <div id="info">
                    <div className='left-text'>
                        <p>${cost}</p><small></small>
                    </div>
                    <div className='right-text' style={getLocationStyle()}>
                        {info}
                    </div>
                </div>
                <div id="buyButtons">
                    <div className='buyButton' id='adopt'>
                        <small>TIER {tier + 1}</small>
                        <button onClick={() => handleClick(1)}>{itemName.includes('Permit') ? "BUY" : "UPGRADE"}</button>
                        {gif[1] && <img key={gifKey} src={`${process.env.PUBLIC_URL}/assets/images/${gif[1]}.gif`} className="gif" />}
                    </div>

                </div>
            </div>
        )
    }
}

export default CompItem;
