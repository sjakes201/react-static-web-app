import React, { useEffect, useState } from "react";
import '../CSS/CompItem.css'
import CONSTANTS from "../../CONSTANTS";
import UPGRADES from "../../UPGRADES";

const SEED_LIMIT = 100;

function CompItem({ updateAnimals, itemName, cost, unlocked, info, updateBalance, getBal, updateInventory, tier, updateUpgrades, items, hasSpace }) {

    const [gif, setGif] = useState({ 1: null, 5: null, 25: null });
    const [gifKey, setGifKey] = useState(0);

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

            const token = localStorage.getItem('token');
            let res = await fetch('https://farm-api.azurewebsites.net/api/buy', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    count: num,
                    item: itemName
                })
            }).then((x) => x.json());
            if (res.message !== 'SUCCESS') {
                // out of sync
                // TODO: throw up 'server out of sync' splash
            }
        }
        if (itemName in CONSTANTS.AnimalTypes) {
            if (getBal() >= (cost)) {
                updateBalance(-1 * cost);
                updateAnimals(itemName);
                gifCopy[num] = 'success';
            } else {
                gifCopy[num] = 'fail';
            }
            setGif(gifCopy);
            setGifKey(prevKey => prevKey + 1);
            if (gifCopy[num] === 'fail') return;

            const token = localStorage.getItem('token');
            let res = await fetch('https://farm-api.azurewebsites.net/api/buyAnimal', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: itemName
                })
            }).then((x) => x.json());
            if (res.message !== 'SUCCESS') {
                // out of sync
                // TODO: throw up 'server out of sync' splash
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
            
            const token = localStorage.getItem('token');
            let res = await fetch('https://farm-api.azurewebsites.net/api/buyUpgrade', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    upgrade: itemName,
                    tier: tier
                })
            })
            if (res.message !== 'SUCCESS') {
                // out of sync
                // todo: throw up 'server out of sync' splash
            }
        }
    }

    useEffect(() => {
        let timeouts = [];
        Object.keys(gif).forEach((key) => {
            if (gif[key] !== null) {
                timeouts.push(setTimeout(() => {
                    setGif(prevGif => ({ ...prevGif, [key]: null }));
                }, 400));
            }
        });
        return () => timeouts.forEach(clearTimeout);  // Clean up on unmount
    }, [gif, gifKey]);


    const getXPNeeded = () => {
        for (let threshold in CONSTANTS.Levels) {
            if (CONSTANTS.Levels[threshold].includes(itemName)) return threshold
        }
        return -1;

    }

    if (itemName in CONSTANTS.Fixed_Prices) {
        return (
            <div id="itemBox" className={unlocked ? "" : "notAvailable"} >
                {!unlocked && (
                    <div className='content'>
                        <p>UNAVAILABLE</p>
                        <p>{(info === 'EXOTIC') ? 'EXOTIC' : (info === 'DELUXE') ? 'DELUXE' : `${getXPNeeded()}xp`}</p>
                    </div>
                )}
                <div className="itemImg">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/${itemName}.png`} />
                </div>
                <div id="name">
                    <p>{CONSTANTS.InventoryDescriptions[itemName][0]}</p>
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
            <div id="itemBox" className={(!unlocked || !hasSpace) ? "notAvailable" : ""} >
                {(!unlocked) && (
                    <div className='content'>
                        <p>UNAVAILABLE</p>
                        <p>{info.split(" ")[1] ? info.split(" ")[1] : `${getXPNeeded()} XP`}</p>
                    </div>
                )}
                {(unlocked && !hasSpace) && (
                    <div className='content'>
                        <p>MAX CAPACITY</p>
                    </div>
                )}
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
                        <button onClick={() => handleClick(1)}>ADOPT</button>
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
