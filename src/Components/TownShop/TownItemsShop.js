import CONSTANTS from "../../CONSTANTS";
import UPGRADES from "../../UPGRADES";
import BOOSTSINFO from "../../BOOSTSINFO";
import "./TownItemsShop.css"
import React, { useState, useEffect, useRef } from "react";
import TownBoostSlot from "./TownBoostSlot";
import { useWebSocket } from "../../WebSocketContext";

const purchasableBoosts = [
    "CARROT_1", "CARROT_TIME_1", "MELON_1", "MELON_TIME_1", "CAULIFLOWER_1", "CAULIFLOWER_TIME_1", "PUMPKIN_1", "PUMPKIN_TIME_1", "YAM_1", "YAM_TIME_1",
    "BEET_1", "BEET_TIME_1", "PARSNIP_1", "PARSNIP_TIME_1", "BAMBOO_1", "BAMBOO_TIME_1", "HOPS_1", "HOPS_TIME_1", "CORN_1", "CORN_TIME_1",
    "POTATO_1", "POTATO_TIME_1", "BLUEBERRY_1", "BLUEBERRY_TIME_1", "GRAPE_1", "GRAPE_TIME_1", "OATS_1", "OATS_TIME_1", "STRAWBERRY_1", "STRAWBERRY_TIME_1",
    "COW_1", "COW_TIME_1", "CHICKEN_1", "CHICKEN_TIME_1", "DUCK_1", "DUCK_TIME_1", "QUAIL_1", "QUAIL_TIME_1", "YAK_1", "YAK_TIME_1", "SHEEP_1",
    "SHEEP_TIME_1", "GOAT_1", "GOAT_TIME_1", "OSTRICH_1", "OSTRICH_TIME_1", "LLAMA_1", "LLAMA_TIME_1", "KIWI_1", "KIWI_TIME_1"
];


function TownItemsShop({ myRoleID, townShopInfo, townInfo, setRefreshData }) {
    const { waitForServerResponse } = useWebSocket();

    const [selectedBoost, setSelectedBoost] = useState(null)

    /* Translates up-down scroll into horizontal */
    const townShopRef = useRef(null);
    const activeBoostRef = useRef(null)
    useEffect(() => {
        const handleScroll = (event) => {
            const target = event.currentTarget;
            const scrollSpeed = 0.4;

            target.scrollLeft += event.deltaY * scrollSpeed;
            event.preventDefault();
        };

        if (activeBoostRef.current) {
            townShopRef.current.addEventListener("wheel", handleScroll);
        }
        if (activeBoostRef.current) {
            activeBoostRef.current.addEventListener("wheel", handleScroll);
        }

        return () => {
            if (townShopRef.current) {
                townShopRef.current.removeEventListener("wheel", handleScroll);
            }
            if (activeBoostRef.current) {
                activeBoostRef.current.removeEventListener("wheel", handleScroll);
            }
        };
    }, []);

    const setSelected = (boostName) => {
        if (selectedBoost === boostName) {
            setSelectedBoost(null)
        } else {
            setSelectedBoost(boostName)
        }
    }

    const getImageSrc = (boostName) => {
        let name = boostName.split("_")[0]?.toLowerCase();
        if (name in UPGRADES.AnimalProduceMap0) {
            //is animal
            return `${process.env.PUBLIC_URL}/assets/images/${name}_standing_right.png`
        } else {
            // is crop
            return `${process.env.PUBLIC_URL}/assets/images/${name}.png`
        }
    }

    const getAllBoosts = () => {
        const activeBoosts = townInfo.activeTownBoosts?.map(b => b.BoostName);
        let boostsArr = purchasableBoosts.map((boost, index) => {
            return <TownBoostSlot key={index} 
            boostName={boost} 
            active={activeBoosts?.includes(boost)} 
            setSelected={setSelected} 
            boostContext='town' 
            height="calc(100% - 6px)"
            width="8vw"
            fontSize='0.9vw'
            />
        })
        boostsArr.sort((a, b) => {
            if (a.props.active && !b.props.active) {
                return 1;
            } else if (!a.props.active && b.props.active) {
                return -1;
            } else {
                return purchasableBoosts.indexOf(a) - purchasableBoosts.indexOf(b);
            }
        })

        return (boostsArr)

    }
    const getSelectedBoostInfo = () => {
        const target = selectedBoost.split("_")[0]?.toLowerCase();
        const boostInfo = BOOSTSINFO.townBoostsInfo?.[selectedBoost];
        const type = boostInfo.type;
        const cost = boostInfo.cost;
        const duration = boostInfo.duration;
        const isAnimal = target in UPGRADES.AnimalProduceMap0;
        const product = isAnimal ? CONSTANTS[`InventoryDescriptions`][UPGRADES.AnimalProduceMap0[target][0]][0] : target;

        const alreadyActive = townInfo.activeTownBoosts.filter(b => b.BoostName === selectedBoost).length !== 0;

        return (
            <div className='selected-boost-details'>
                <div className='selected-boost-img'>
                    <img src={getImageSrc(selectedBoost)} />
                </div>
                <div className='selected-boost-numbers'>
                    <p
                        id='selected-boost-header'>
                        <u>{CONSTANTS.InventoryDescriptions[target][0]} Boost</u>
                    </p>
                    <p>Type: {type === "QTY" ? "QUANTITY" : type}</p>
                    <p>Cost: ${cost.toLocaleString()}</p>
                    <p>Length: {duration}</p>
                </div>
                <div className='selected-boost-explain'>
                    {type === "QTY" &&
                        <>
                            <p className='t-boost-description'>Gives higher yields to {CONSTANTS.InventoryDescriptionsPlural[target][0]}.</p>
                            <p className='green-boost'>
                                +{boostInfo.qty} {product} /{isAnimal ? "collect" : "harvest"}
                            </p>
                            {alreadyActive ? (
                                <p className='active-boost-status'>Active</p>
                            ) : (
                                <button
                                    disabled={myRoleID < 3}
                                    className={`${myRoleID >= 3 ? 'clickable' : ''}`}
                                    onClick={() => buyTownBoost(selectedBoost)}
                                >ACTIVATE</button>
                            )
                            }
                        </>
                    }
                    {type === "TIME" &&
                        <>
                            <p className='t-boost-description'>Gives faster {isAnimal ? 'produce' : 'growth'} times to {CONSTANTS.InventoryDescriptionsPlural[target][0]}.</p>
                            <p className='green-boost'>
                                +{boostInfo.boostPercent * 100}% faster {isAnimal ? 'produce' : 'growth'} time
                            </p>
                            {alreadyActive ? (
                                <p className='active-boost-status'>Active</p>
                            ) : (
                                <button
                                    disabled={myRoleID < 3}
                                    className={`${myRoleID >= 3 ? 'clickable' : ''}`}
                                    onClick={() => buyTownBoost(selectedBoost)}
                                >ACTIVATE</button>
                            )
                            }
                        </>
                    }
                </div>
            </div >
        )
    }

    const buyTownBoost = async (boostName) => {
        const boostInfo = BOOSTSINFO.townBoostsInfo?.[boostName];
        const cost = boostInfo.cost;

        if (cost > townShopInfo.townFunds) {
            console.log("ERROR: Insufficient funds")
            return;
        }
        if (townInfo.activeTownBoosts.filter(b => b.BoostName === boostName).length !== 0) {
            console.log("ERROR: Already have this boost active")
            return;
        }

        if (waitForServerResponse) {
            let res = await waitForServerResponse("buyTownBoost", { boostName: boostName })
            console.log(res)
            setRefreshData((old) => old + 1)
        }
    }

    const remainingTime = (startTime, duration) => {
        let remainingMS = (startTime + duration) - Date.now();
        let remainingMins = Math.ceil(remainingMS / 60000);
        if (remainingMins < 60) {
            return `${remainingMins}m`
        } else {
            let remainingHours = Math.floor(remainingMins / 60);
            return `${remainingHours}h ${remainingMins % 60 === 0 ? '' : `${remainingMins % 60}m`}
            `
        }
    }

    const activeSlot = (boost, key) => {
        return (
            <div
                className='slot-not-animated'
                key={key}
                onClick={() => setSelected(boost.BoostName)}
            >
                <img className='sna-timer' src={`${process.env.PUBLIC_URL}/assets/images/towns/timer.gif`} />
                <img className='sna-img' src={getImageSrc(boost.BoostName)} />
                <div>
                    <p className='bold'>{boost.Type}</p>
                    <p>{remainingTime(Number(boost.StartTime), Number(boost.Duration))}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="town-items-shop">
            <div className="items-shop-shelf brown-border-thin">
                <div className='town-shop-header'>
                    <p>BOOSTS</p>
                </div>
                <div className='town-items-grid' ref={townShopRef}>
                    {getAllBoosts()}
                </div>
            </div>
            <div className={`selected-boost-info brown-border-thin ${selectedBoost ? '' : 'soft-info'}`}>
                {!selectedBoost && <>
                    <p>
                        Town boosts can be bought by the leader or co-leaders and provide temporary boosts to all town members.
                        A town cannot have multiple of the same boost active at the same time.
                    </p>
                    <br />
                    <p>
                        Select a boost for more info.
                    </p>
                </>}
                {selectedBoost && getSelectedBoostInfo()}

            </div>
            <div className='active-town-boosts brown-border-thin' ref={activeBoostRef}>
                {townInfo.activeTownBoosts?.map((boost, index) => activeSlot(boost, index))}
                {townInfo.activeTownBoosts?.length === 0 && <p className='soft-info wh100per basic-center'>No active boosts</p>}
            </div>
        </div>
    )
}

export default TownItemsShop;