import React, { useRef, useEffect } from 'react'

import '../CSS/CompShop.css'
import CompItem from './CompItem'
import CONSTANTS from '../../CONSTANTS'
import UPGRADES from '../../UPGRADES'

function CompShop({ addAnimal, updateAnimalsInfo, getAnimals, getXP, level, updateUpgrades, updateBalance, getBal, updateInventory, getUpgrades, items }) {

    const upgrades = getUpgrades();
    const animals = getAnimals();

    let unlocked = [];
    for (let unlockLevel in CONSTANTS.levelUnlocks) {
        if (level >= unlockLevel) {
            // if we have enough xp

            for (let i = 0; i < CONSTANTS.levelUnlocks[unlockLevel].length; ++i) {
                let item = CONSTANTS.levelUnlocks[unlockLevel][i];
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
        if (CONSTANTS.Permits.deluxeCrops.includes(itemName) && !upgrades.hasDeluxePermit) { permit = 'Deluxe'; }
        else if (CONSTANTS.Permits.exoticAnimals.includes(itemName) && !upgrades.hasExoticPermit) { permit = 'Exotic'; }
        return [unlocked.includes(itemName), permit]
    }

    const getSeedItems = () => {
        const firstItems = [];
        const lastItems = [];
        let allSeedsArray = CONSTANTS.ProduceNameFromID;
        allSeedsArray.sort((a,b) => CONSTANTS.shopOrder.indexOf(a) - CONSTANTS.shopOrder.indexOf(b))
        for (let i = 1; i < allSeedsArray.length; ++i) {
            let name = allSeedsArray[i];
            let unlockInfo = isUnlocked(name);
            if (unlockInfo[0]) {
                firstItems.push(<CompItem key={i} unlockInfo={unlockInfo} updateInventory={updateInventory} updateBalance={updateBalance} getBal={getBal} itemName={name} cost={CONSTANTS.Fixed_Prices[name]} unlocked={true} info={unlockInfo[1]} items={items} />)
            } else {
                lastItems.push(<CompItem key={i} unlockInfo={unlockInfo} updateInventory={updateInventory} updateBalance={updateBalance} getBal={getBal} itemName={name} cost={CONSTANTS.Fixed_Prices[name]} unlocked={false} info={unlockInfo[1]} items={items} />)
            }

        }
        return firstItems.concat(lastItems);
    }



    const getAnimalItems = () => {
        const firstItems = [];
        const lastItems = [];

        const allKeys = Object.keys(CONSTANTS.AnimalTypes)
        let allAnimals = [];
        for (let i = 0; i < allKeys.length; ++i) {
            allAnimals.push([allKeys[i], CONSTANTS.AnimalTypes[allKeys[i]]]);
        }

        // Consistent sorting order based on unlock (earlier unlocks first)
        allAnimals = allAnimals.sort((a,b) => CONSTANTS.shopOrder.indexOf(a[0]) - CONSTANTS.shopOrder.indexOf(b[0]))

        for (let i = 0; i < allAnimals.length; ++i) {
            let name = allAnimals[i][0];
            let unlockInfo = isUnlocked(name);
            //unlock info is array [xpUnlock (true / false), permitNeeded (either permit or blank)]
            let hasSpace = animals[`${(allAnimals[i][1][0])}Count`] < animals[`${(allAnimals[i][1][0])}Capacity`]
            if (unlockInfo[0]) {
                if (hasSpace) {
                    firstItems.push(<CompItem addAnimal={addAnimal} unlockInfo={unlockInfo} key={100 + i} updateAnimalsInfo={updateAnimalsInfo} updateInventory={updateInventory} updateBalance={updateBalance} getBal={getBal} itemName={name} cost={allAnimals[i][1][1]} unlocked={true} info={`${(allAnimals[i][1][0]).toUpperCase()} ${unlockInfo[1]}`} hasSpace={hasSpace} />)
                } else {
                    lastItems.push(<CompItem addAnimal={addAnimal} unlockInfo={unlockInfo} key={100 + i} updateAnimalsInfo={updateAnimalsInfo} updateInventory={updateInventory} updateBalance={updateBalance} getBal={getBal} itemName={name} cost={allAnimals[i][1][1]} unlocked={true} info={`${(allAnimals[i][1][0]).toUpperCase()} ${unlockInfo[1]}`} hasSpace={hasSpace} />)
                }
            } else {
                lastItems.push(<CompItem addAnimal={addAnimal} unlockInfo={unlockInfo} key={100 + i} updateAnimalsInfo={updateAnimalsInfo} updateInventory={updateInventory} updateBalance={updateBalance} getBal={getBal} itemName={name} cost={allAnimals[i][1][1]} unlocked={false} info={`${(allAnimals[i][1][0]).toUpperCase()} ${unlockInfo[1]}`} hasSpace={hasSpace} />)
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


    // handle horizontal scrolling
    const seedsRef = useRef(null);
    const animalsRef = useRef(null);
    const upgradesRef = useRef(null);

    useEffect(() => {
        const handleScroll = (event) => {
            const target = event.currentTarget;
            const scrollSpeed = 0.4;

            target.scrollLeft += event.deltaY * scrollSpeed;
            event.preventDefault();
        };

        if (seedsRef.current) {
            seedsRef.current.addEventListener('wheel', handleScroll);
        }
        if (animalsRef.current) {
            animalsRef.current.addEventListener('wheel', handleScroll);
        }
        if (upgradesRef.current) {
            upgradesRef.current.addEventListener('wheel', handleScroll);
        }

        return () => {
            if (seedsRef.current) {
                seedsRef.current.removeEventListener('wheel', handleScroll);
            }
            if (animalsRef.current) {
                animalsRef.current.removeEventListener('wheel', handleScroll);
            }
            if (upgradesRef.current) {
                upgradesRef.current.removeEventListener('wheel', handleScroll);
            }
        };
    }, []);

    return (
        <div className='shop'>
            <section id='Seeds' className='shopRow' >
                <div className='label'>
                    <h2>SEEDS</h2>
                </div>
                <div className='items' ref={seedsRef}>
                    {(getXP() !== -1) && getSeedItems()}
                </div>
            </section>
            <section id='Animals' className='shopRow' >
                <div className='label'>
                    <h2>ANIMALS</h2>
                </div>
                <div className='items' ref={animalsRef}>
                    {(Object.keys(animals).length !== 0) && getAnimalItems()}
                </div>
            </section>
            <section id='Upgrades' className='shopRow' >
                <div className='label'>
                    <h2>UPGRADES</h2>
                </div>
                <div className='items' ref={upgradesRef}>
                    {(Object.keys(upgrades).length !== 0) && getUpgradeItems()}
                </div>
            </section>
        </div>
    )
}

export default CompShop