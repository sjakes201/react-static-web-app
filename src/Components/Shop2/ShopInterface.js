import React, { useState, useEffect, useRef, useContext } from 'react'
import { GameContext } from '../../GameContainer'
import './ShopInterface.css'
import ShopTab from './ShopTab'
import CONSTANTS from '../../CONSTANTS'
import { useWebSocket } from "../../WebSocketContext";

import ShopItem from './ShopItem'
import ShopUpgrade from './ShopUpgrade'
import ShopAnimal from './ShopAnimal'
import UPGRADES from '../../UPGRADES'



function ShopInterface() {
    const { getBal, updateBalance, itemsData, setItemsData, level, getUpgrades, animalsInfo, updateAnimalsInfo, addAnimal, updateUpgrades } = useContext(GameContext);
    const { waitForServerResponse } = useWebSocket();

    /* Shop pin management */
    const [pinnedItems, setPinnedItems] = useState([]);

    useEffect(() => {
        let jsonItems = localStorage.getItem("pinnedItems");
        if (jsonItems !== null) {
            setPinnedItems(JSON.parse(jsonItems));
        }
    }, [])

    useEffect(() => {
        let jsonItems = JSON.stringify(pinnedItems);
        localStorage.setItem("pinnedItems", jsonItems);
    }, [pinnedItems])

    const changePin = (itemName) => {
        if (!pinnedItems.includes(itemName)) {
            setPinnedItems([...pinnedItems, itemName]);
        } else {
            setPinnedItems(pinnedItems.filter((item) => item !== itemName));
        }
    }

    /* Translates up-down scroll into horizontal */
    const shopRef = useRef(null);

    useEffect(() => {
        const handleScroll = (event) => {
            const target = event.currentTarget;
            const scrollSpeed = 0.5;

            target.scrollLeft += event.deltaY * scrollSpeed;
            event.preventDefault();
        };

        if (shopRef.current) {
            shopRef.current.addEventListener("wheel", handleScroll);
        }

        return () => {
            if (shopRef.current) {
                shopRef.current.removeEventListener("wheel", handleScroll);
            }
        };
    }, []);

    /* Buying functions */

    const buySeeds = async (seed, qty) => {
        if (!(seed in CONSTANTS.Fixed_Prices)) return false;
        if (itemsData[seed] + qty > CONSTANTS.VALUES.SEED_LIMIT) qty = CONSTANTS.VALUES.SEED_LIMIT - itemsData[seed];
        if (qty === 0) return false;

        let cost = CONSTANTS.Fixed_Prices[seed] * qty;
        if (getBal() < cost) return false;

        if (waitForServerResponse) {
            const response = await waitForServerResponse("buy", {
                count: qty,
                item: seed,
            });

            if (response.body?.message === "SUCCESS") {
                setItemsData((prevItems) => {
                    return { ...prevItems, [seed]: prevItems[seed] + qty };
                })
                updateBalance(-cost);
                return true;
            }
        }
        return false;
    }

    const buyAnimal = async (animalType) => {
        if (!(animalType in CONSTANTS.AnimalTypes)) return false;
        let location = CONSTANTS.AnimalTypes[animalType][0];
        if (animalsInfo[`${location}Count`] + 1 > animalsInfo[`${location}Capacity`]) return false;
        let cost = CONSTANTS.AnimalTypes[animalType][1];
        if (getBal() < cost) return false;

        updateBalance(-1 * cost)
        updateAnimalsInfo(animalType)

        if (waitForServerResponse) {
            const response = await waitForServerResponse("buyAnimal", {
                type: animalType
            });
            if (response.body?.message === "SUCCESS") {
                delete response.body.message;
                addAnimal(response.body)
            }
        }
        return true;
    }

    const buyUpgrade = async (upgradeName, tier) => {
        if (!(upgradeName in UPGRADES.UpgradeCosts)) return false;
        let cost = UPGRADES.UpgradeCosts[upgradeName][tier];
        if (getBal() < cost) return false;
        if (upgradeName.includes("Permit")) {
            if (getUpgrades()[upgradeName]) return false;
        } else {
            if (tier !== getUpgrades()[upgradeName]) return false;
        }
        if (tier >= UPGRADES.UpgradeCosts[upgradeName].length) return false;
        updateBalance(-1 * cost);
        updateUpgrades(upgradeName);

        if (waitForServerResponse) {
            waitForServerResponse("buyUpgrade", {
                upgrade: upgradeName,
                tier: tier,
            });

        }
        return true
    }

    /* Component building functions */
    const [currentTab, setCurrentTab] = useState("Seeds");

    const getShopSlots = (tab) => {
        const firstItems = [];
        const lastItems = [];
        if (tab === 'Seeds') {
            let allSeeds = Object.keys(CONSTANTS.Fixed_Prices);
            allSeeds.sort(
                (a, b) => CONSTANTS.shopOrder.indexOf(a) - CONSTANTS.shopOrder.indexOf(b),
            );
            allSeeds.forEach((seedName) => {
                let availableInfoComponents = availableInfo(seedName);
                const seedSlot = <ShopItem
                    key={`shopSlot${seedName}`}
                    seedName={seedName}
                    buySeeds={buySeeds}
                    lockedInfoComponents={availableInfoComponents}
                    changePin={changePin}
                    isPinned={pinnedItems.includes(seedName)}
                />

                if (pinnedItems.includes(seedName)) {
                    firstItems.unshift(seedSlot);
                } else if (availableInfoComponents) {
                    lastItems.push(seedSlot);
                } else {
                    firstItems.push(seedSlot);
                }
            })
            return firstItems.concat(lastItems);
        } else if (tab === 'Animals') {
            let allAnimals = Object.keys(CONSTANTS.AnimalTypes);
            allAnimals.sort(
                (a, b) => CONSTANTS.shopOrder.indexOf(a) - CONSTANTS.shopOrder.indexOf(b),
            );
            allAnimals.forEach((animal) => {
                let availableInfoComponents = availableInfo(animal);
                const animalSlot = <ShopAnimal
                    key={`shopSlot${animal}`}
                    animalType={animal}
                    lockedInfoComponents={availableInfoComponents}
                    buyAnimal={buyAnimal}
                    maxCapacity={animalCapacityViolation(animal)}
                />

                if (availableInfoComponents) {
                    lastItems.push(animalSlot);
                } else {
                    firstItems.push(animalSlot);
                }
            })
            return firstItems.concat(lastItems);
        } else if (tab === 'Upgrades') {
            let allUpgrades = Object.keys(UPGRADES.UpgradeCosts);
            const currentTiers = getUpgrades();
            const firstItems = [];
            const lastItems = [];
            allUpgrades.forEach((upgradeName) => {
                let highestTier = UPGRADES.UpgradeCosts[upgradeName].length;
                let currentTier = currentTiers[upgradeName];
                if (typeof currentTier === "boolean") { currentTier = currentTier ? 1 : 0 }
                let upgradeComponent = <ShopUpgrade key={upgradeName} upgradeName={upgradeName} currentTier={currentTier} buyUpgrade={buyUpgrade} maxTier={highestTier} />
                if (currentTiers[upgradeName] < highestTier) {
                    firstItems.push(upgradeComponent)
                } else {
                    lastItems.push(upgradeComponent)
                }
            })
            return firstItems.concat(lastItems);
        } else if (tab === 'Parts') {
            return <div
                className='basic-center'
                style={{
                    gridRow: '1/3',
                    fontSize: '1.1vw',
                    color: '#222021'
                }}>
                <i>Coming soon</i>
                <img
                    style={{width: '4vw'}}
                    src={`${process.env.PUBLIC_URL}/assets/images/chicken_collectible_walking_right.gif`}
                />
            </div>
        }

    }

    const animalCapacityViolation = (name) => {
        let capacityViolation = false;
        let locationIfAnimal = CONSTANTS.AnimalTypes?.[name]?.[0];
        if (locationIfAnimal) {
            if (animalsInfo[`${locationIfAnimal}Count`] >= animalsInfo[`${locationIfAnimal}Capacity`]) {
                capacityViolation = true;
            }
        }
        return capacityViolation ? (<p>MAX CAPACITY</p>) : false
    }

    const availableInfo = (name) => {
        let levelViolation = CONSTANTS.levelToUnlock[name] > level;
        let deluxeViolation = CONSTANTS.Permits.deluxeCrops.includes(name) && !getUpgrades()?.deluxePermit;
        let exoticViolation = CONSTANTS.Permits.exoticAnimals.includes(name) && !getUpgrades()?.exoticPermit;

        if (levelViolation || deluxeViolation || exoticViolation) {
            return (<>
                {levelViolation && <p>LEVEL {CONSTANTS.levelToUnlock[name]}</p>}
                {deluxeViolation && <p>DELUXE</p>}
                {exoticViolation && <p>EXOTIC</p>}
            </>);
        }
        return false
    }

    return (
        <div className='shop-interface'>
            <div className='shop-tabs'>
                <ShopTab title='Seeds' setCurrentTab={setCurrentTab} currentTab={currentTab} position="leftmost" />
                <ShopTab title='Animals' setCurrentTab={setCurrentTab} currentTab={currentTab} />
                <ShopTab title='Upgrades' setCurrentTab={setCurrentTab} currentTab={currentTab} position="rightmost"/>
                {/* <ShopTab title='Parts' setCurrentTab={setCurrentTab} currentTab={currentTab}  /> */}
            </div>
            <div className='shop-contents orange-border'>
                <div className='shop-grid' ref={shopRef}>
                    {getShopSlots(currentTab)}
                </div>
            </div>
        </div>
    )
}

export default ShopInterface