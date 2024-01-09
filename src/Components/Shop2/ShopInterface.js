import React, { useState, useEffect, useRef, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { GameContext } from '../../GameContainer'
import './ShopInterface.css'
import ShopTab from './ShopTab'
import CONSTANTS from '../../CONSTANTS'
import { useWebSocket } from "../../WebSocketContext";

import ShopItem from './ShopItem'
import ShopUpgrade from './ShopUpgrade'
import ShopAnimal from './ShopAnimal'
import TownBoostSlot from '../TownShop/TownBoostSlot'
import UPGRADES from '../../UPGRADES'
import BOOSTSINFO from '../../BOOSTSINFO'



function ShopInterface() {
    const { getBal, updateBalance, itemsData, setItemsData, level, getUpgrades,
        animalsInfo, updateAnimalsInfo, addAnimal, updateUpgrades, premiumCurrency, setPremiumCurrency, fetchBoostsInventory } = useContext(GameContext);
    const { waitForServerResponse } = useWebSocket();
    const pageLocation = useLocation();
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
                usi: {
                    p: pageLocation.pathname
                }
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
                type: animalType,
                usi: {
                    p: pageLocation.pathname
                }
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
                usi: {
                    p: pageLocation.pathname
                }
            });

        }
        return true
    }

    const [selectedPB, setSelectedPB] = useState(null)

    // Gifs for player boosts buy button
    const [gif, setGif] = useState(null);
    const [gifKey, setGifKey] = useState(0);

    useEffect(() => {
        let resetGiftTimer = null;
        if (gif !== null) {
            resetGiftTimer = setTimeout(() => {
                setGif(null);
            }, 447)
        }
        return () => clearTimeout(resetGiftTimer); // Clean up on unmount
    }, [gif, gifKey]);

    const buyPB = async (boostName) => {
        let cost = BOOSTSINFO[boostName]?.cost;
        if (premiumCurrency < cost) {
            setGif("fail");
            setGifKey((prevKey) => prevKey + 1);
            return false;
        };
        setPremiumCurrency((old) => old - cost);
        if (waitForServerResponse) {
            let res = await waitForServerResponse("buyPlayerBoost", {
                boostName: boostName,
                usi: {
                    p: pageLocation.pathname
                }
            })
            if (res.body?.success) {
                fetchBoostsInventory()
                setGif("success");
                setGifKey((prevKey) => prevKey + 1);
            } else {
                setGif("fail");
                setGifKey((prevKey) => prevKey + 1);
            }
        }
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
        } else if (tab === 'Boosts') {
            return <div
                className='basic-center player-boosts-interface'
            >
                <div className='player-boosts-shop'>
                    <div className='pb-shop-grid orange-border-marginless'>
                        {getBuyablePlayerBoosts()}
                    </div>
                    <div className='pb-select-parent basic-center'>
                        <div className='pb-shop-select-info orange-border-marginless'>
                            {!selectedPB && <p id='no-selected-pb' className='basic-center'>
                                Select a boost for more details
                            </p>}
                            {selectedPB && <>
                                <div className='pb-shop-select-boost basic-center'>
                                    <TownBoostSlot
                                        boostName={selectedPB} active={false} display={true}
                                        boostContext='player' width='60%' height='10vh' fontSize='1vw' />

                                </div>
                                <div className='pb-shop-select-details'>
                                    <p>
                                        <u>{BOOSTSINFO[selectedPB]?.name}</u>
                                    </p>
                                    <p>
                                        Type: {BOOSTSINFO[selectedPB]?.type}
                                    </p>
                                    <p className='pb-boost-cost'>
                                        Cost:
                                        <img src={`${process.env.PUBLIC_URL}/assets/images/premiumCurrency.png`} />
                                        {BOOSTSINFO[selectedPB]?.cost}
                                    </p>
                                    <button onClick={() => {
                                        buyPB(selectedPB)
                                    }}
                                        className={premiumCurrency >= BOOSTSINFO[selectedPB]?.cost ? 'clickable' : ''}
                                    >
                                        Buy
                                        {gif && (
                                            <img
                                                key={gifKey}
                                                src={`${process.env.PUBLIC_URL}/assets/images/${gif}.gif`}
                                                className="pb-buy-gif"
                                            />
                                        )}
                                    </button>
                                </div>
                                <div className='pb-shop-select-paragraph'>
                                    <p>{BOOSTSINFO[selectedPB]?.info}</p>
                                    <p>
                                        {BOOSTSINFO[selectedPB]?.type === 'QTY' &&
                                            <div className='pb-boost-qtys-list'>
                                                {boostQtyLists(selectedPB)}
                                            </div>}
                                        {BOOSTSINFO[selectedPB]?.type === 'TIME' &&
                                            <div className='pb-boost-green'>
                                                {BOOSTSINFO[selectedPB]?.boostPercent * 100}% faster {selectedPB.includes("ANIMAL") ? "produce" : "growth"} times
                                            </div>}
                                    </p>
                                </div>
                            </>}

                        </div>
                    </div>

                </div>
            </div>
        }
    }

    const boostQtyLists = (boostName) => {
        const getIcon = (boostName) => {
            let name = boostName.split("_")[0]?.toLowerCase();
            if (name in UPGRADES.AnimalProduceMap0) {
                //is animal
                return `${process.env.PUBLIC_URL}/assets/images/${name}_standing_right.png`
            } else {
                // is crop
                return `${process.env.PUBLIC_URL}/assets/images/${name}.png`
            }
        }

        const boosts = BOOSTSINFO[boostName].boostQtys;
        return <>
            {Object.keys(boosts).map((item, index) => {
                return <div className='pb-boost-qty-item' key={index}>
                    <img src={getIcon(item)} />
                    <p className='pb-boost-green'>+{boosts[item]}</p>
                </div>
            })}
        </>
    }

    const getBuyablePlayerBoosts = () => {
        const buyablePB = [
            "ALL_CROPS_QTY_1", "ALL_CROPS_QTY_2", "ALL_CROPS_QTY_3", "ALL_ANIMALS_QTY_1", "ALL_ANIMALS_QTY_2", "ALL_ANIMALS_QTY_3",
            "ALL_CROPS_TIME_1", "ALL_CROPS_TIME_2", "ALL_CROPS_TIME_3", "ALL_ANIMALS_TIME_1", "ALL_ANIMALS_TIME_2", "ALL_ANIMALS_TIME_3"
        ]

        return (<>
            {buyablePB.map((boostName, index) => {
                return <TownBoostSlot
                    boostName={boostName} active={false} setSelected={(boostName) => { setSelectedPB(boostName) }}
                    boostContext='player' width='90%' height='10vh' fontSize='1vw' />
            })}
        </>)
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
                <ShopTab title='Upgrades' setCurrentTab={setCurrentTab} currentTab={currentTab} />
                <ShopTab title='Boosts' setCurrentTab={setCurrentTab} currentTab={currentTab} position="rightmost" />
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