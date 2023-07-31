import React, { useState, useEffect } from 'react'

import '../CSS/CompShop.css'
import CompItem from './CompItem'
import CONSTANTS from '../../CONSTANTS'
import UPGRADES from '../../UPGRADES'

function CompShop({ updateAnimals, getAnimals, getXP, updateUpgrades, updateBalance, getBal, updateInventory, getUpgrades, items }) {

    const upgrades = getUpgrades();
    const animals = getAnimals();

    let totalXP = getXP();
    let unlocked = [];
    for (let threshold in CONSTANTS.Levels) {
        if (totalXP >= threshold) {

            // if we have enough xp
            for (let i = 0; i < CONSTANTS.Levels[threshold].length; ++i) {
                let item = CONSTANTS.Levels[threshold][i];
                if (CONSTANTS.Permits.deluxeCrops.includes(item)) {
                    // you need a deluxeCrops permit
                    if (upgrades.deluxePermit) {
                        //you have the permit
                        unlocked.push(item);
                    }
                } else if (CONSTANTS.Permits.exoticAnimals.includes(item)) {
                    // you need an exoticAnimals permit
                    if (upgrades.exoticPermit) {
                        // you have the permit
                        unlocked.push(item);

                    }
                } else {
                    // no permit needed
                    unlocked.push(item);

                }
            }
        }
    }

    //[boolean, isexotic/isdeluxe]
    const isUnlocked = (itemName) => {
        let permit = "";
        if (CONSTANTS.Permits.deluxeCrops.includes(itemName)) { permit = 'DELUXE'; }
        else if (CONSTANTS.Permits.exoticAnimals.includes(itemName)) { permit = 'EXOTIC'; }
        return [unlocked.includes(itemName), permit]
    }

    const getSeedItems = () => {
        const firstItems = [];
        const lastItems = [];

        for (let i = 1; i < CONSTANTS.ProduceNameFromID.length; ++i) {
            let name = CONSTANTS.ProduceNameFromID[i];
            let unlockInfo = isUnlocked(name);
            if (unlockInfo[0]) {
                firstItems.push(<CompItem key={i} updateInventory={updateInventory} updateBalance={updateBalance} getBal={getBal} itemName={name} cost={CONSTANTS.Fixed_Prices[name]} unlocked={true} info={unlockInfo[1]} items={items} />)
            } else {
                lastItems.push(<CompItem key={i} updateInventory={updateInventory} updateBalance={updateBalance} getBal={getBal} itemName={name} cost={CONSTANTS.Fixed_Prices[name]} unlocked={false} info={unlockInfo[1]} items={items} />)
            }

        }
        return firstItems.concat(lastItems);
    }



    const getAnimalItems = () => {
        const firstItems = [];
        const lastItems = [];

        const allKeys = Object.keys(CONSTANTS.AnimalTypes)
        const allAnimals = [];
        for (let i = 0; i < allKeys.length; ++i) {
            allAnimals.push([allKeys[i], CONSTANTS.AnimalTypes[allKeys[i]]]);
        }
        // does this work? we are sorting it based on alphabetical because object.keys() is not consistent
        allAnimals.sort((a, b) => a[0].localeCompare(b[0]));

        for (let i = 0; i < allAnimals.length; ++i) {
            let name = allAnimals[i][0];
            let unlockInfo = isUnlocked(name);
            let hasSpace = animals[`${(allAnimals[i][1][0])}Count`] < animals[`${(allAnimals[i][1][0])}Capacity`]
            if (unlockInfo[0]) {
                console.log("appending to firstItems")
                if (hasSpace) {
                    firstItems.push(<CompItem key={100 + i} updateAnimals={updateAnimals} updateInventory={updateInventory} updateBalance={updateBalance} getBal={getBal} itemName={name} cost={allAnimals[i][1][1]} unlocked={true} info={`${(allAnimals[i][1][0]).toUpperCase()} ${unlockInfo[1]}`} hasSpace={hasSpace} />)
                } else {
                    lastItems.push(<CompItem key={100 + i} updateAnimals={updateAnimals} updateInventory={updateInventory} updateBalance={updateBalance} getBal={getBal} itemName={name} cost={allAnimals[i][1][1]} unlocked={true} info={`${(allAnimals[i][1][0]).toUpperCase()} ${unlockInfo[1]}`} hasSpace={hasSpace} />)
                }
            } else {
                console.log("appending to lastItems")
                lastItems.push(<CompItem key={100 + i} updateAnimals={updateAnimals} updateInventory={updateInventory} updateBalance={updateBalance} getBal={getBal} itemName={name} cost={allAnimals[i][1][1]} unlocked={false} info={`${(allAnimals[i][1][0]).toUpperCase()} ${unlockInfo[1]}`} hasSpace={hasSpace} />)
            }

        }
        return firstItems.concat(lastItems);
    }

    const getUpgradeItems = () => {
        const allKeys = Object.keys(UPGRADES.UpgradeCosts);
        const allUpgrades = [];
        for (let i = 0; i < allKeys.length; ++i) {
            let tier = upgrades[allKeys[i]];
            if (tier === false) tier = 0;
            if (tier === true) tier = 1;
            let unlocked;
            let cost = -1;
            if (tier >= UPGRADES.UpgradeCosts[allKeys[i]].length) {
                unlocked = false;
                cost = UPGRADES.UpgradeCosts[allKeys[i]][tier - 1]
            } else {
                unlocked = true;
                cost = UPGRADES.UpgradeCosts[allKeys[i]][tier]
            }
            allUpgrades.push({
                name: allKeys[i],
                cost: cost,
                unlocked: unlocked,
                tier: tier,
            })
        }
        allUpgrades.sort((a, b) => (a.name).localeCompare(b.name));
        const firstItems = [];
        const lastItems = [];
        for (let i = 0; i < allUpgrades.length; ++i) {
            let info = (allUpgrades[i].name).includes('Permit') ? 'PERMIT' : 'UPGRADE'
            if (allUpgrades[i].unlocked) {
                firstItems.push(<CompItem key={1000 + i} updateUpgrades={updateUpgrades}
                    updateInventory={updateInventory} updateBalance={updateBalance}
                    getBal={getBal} itemName={allUpgrades[i].name} cost={allUpgrades[i].cost} unlocked={true}
                    info={info} tier={allUpgrades[i].tier} />)
            } else {
                lastItems.push(<CompItem key={1000 + i} updateUpgrades={updateUpgrades}
                    updateInventory={updateInventory} updateBalance={updateBalance}
                    getBal={getBal} itemName={allUpgrades[i].name} cost={allUpgrades[i].cost} unlocked={false}
                    info={info} tier={allUpgrades[i].tier} />)
            }
        }
        return firstItems.concat(lastItems);
    }


    return (
        <div className='shop'>
            <section id='Seeds' className='shopRow'>
                <div className='label'>
                    <h2>SEEDS</h2>
                </div>
                <div className='items'>
                    {(totalXP !== -1) && getSeedItems()}
                </div>
            </section>
            <section id='Animals' className='shopRow'>
                <div className='label'>
                    <h2>ANIMALS</h2>
                </div>
                <div className='items'>
                    {(Object.keys(animals).length !== 0) && getAnimalItems()}
                </div>
            </section>
            <section id='Upgrades' className='shopRow'>
                <div className='label'>
                    <h2>UPGRADES</h2>
                </div>
                <div className='items'>
                    {(Object.keys(upgrades).length !== 0) && getUpgradeItems()}
                </div>
            </section>
        </div>
    )
}

export default CompShop