import React, { useEffect, useState, useRef } from "react";
import CompTile from "./CompTile";
import CONSTANTS from '../../CONSTANTS';
import CROPINFO from "../../CROPINFO";
import UPGRADES from "../../UPGRADES";
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from "../../WebSocketContext";
import TOWNSINFO from "../../TOWNSINFO";

function CompPlot({ townPerks, tiles, setTiles, tool, setFertilizers, fertilizers, equippedFert, setEquippedFert, getUpgrades, updateInventory, updateXP, getXP, setOrderNotice, items }) {
    const { waitForServerResponse } = useWebSocket();

    const [growthTable, setGrowthTable] = useState("")
    const [numHarvestTable, setNumHarvestTable] = useState("NumHarvests0")
    const [quantityYieldTable, setQuantityYieldTable] = useState("PlantQuantityYields0")

    // this is for triggering order button animation
    const [orderTimer, setOrderTimer] = useState(null)

    const [highlightedTiles, setHighlighted] = useState([]);
    // Controls machine part gifs
    const [parts, setParts] = useState(Array.from({ length: 60 }, () => ''))

    const navigate = useNavigate();

    // Logic for multi action hovering
    const setHovering = (tileID) => {
        if (tool === "") {
            return;
        }
        if (tileID % 10 === 0) {
            setHighlighted([tileID - 11, tileID - 10, tileID - 1, tileID, tileID + 9, tileID + 10])
            // left side

        } else if (tileID % 10 === 1) {
            // right side
            setHighlighted([tileID - 10, tileID - 9, tileID, tileID + 1, tileID + 10, tileID + 11])
        } else {
            setHighlighted([tileID - 11, tileID - 10, tileID - 9, tileID - 1, tileID, tileID + 1, tileID + 9, tileID + 10, tileID + 11])

        }
    }

    // can you plant this plant?
    const isUnlocked = (name) => {
        let xpNeeded = Object.keys(CONSTANTS.levelUnlocks).filter((level) => CONSTANTS.levelUnlocks[level].includes(name) ? true : false)
        let permitNeeded = CONSTANTS.Permits.deluxeCrops.includes(name);
        if (permitNeeded && !getUpgrades().deluxePermit) {
            return false;
        }
        if (parseInt(xpNeeded[0]) > getXP()) {
            return false;
        }
        return true;
    }

    const fertilizeTile = async (tileID) => {
        let desiredFertilizer = equippedFert;
        if (fertilizers[desiredFertilizer] > 0) {
            setFertilizers((old) => {
                let newCounts = { ...old };
                newCounts[desiredFertilizer] -= 1;
                if (newCounts[desiredFertilizer] === 0) {
                    setEquippedFert("")
                }
                return newCounts
            })
            setTiles((old) => {
                let newTiles = old.map((tile) => {
                    if (tile.TileID === tileID) {
                        let newTile = { ...tile }
                        switch (equippedFert) {
                            case 'TimeFertilizer':
                                newTile.TimeFertilizer = Date.now();
                                newTile.hasTimeFertilizer = true;
                                break;
                            case 'YieldsFertilizer':
                                newTile.YieldsFertilizer = 10;
                                break;
                            case 'HarvestsFertilizer':
                                newTile.HarvestsFertilizer = 5;
                                break;
                        }
                        return newTile;
                    } else {
                        return tile;
                    }
                })
                return newTiles;
            })
            try {
                if (waitForServerResponse) {
                    await waitForServerResponse('fertilizeTile', {
                        tileID: tileID,
                        fertilizerType: desiredFertilizer
                    });
                }
            } catch (error) {
                if (error.message.includes('401')) {
                    console.log("AUTH EXPIRED")
                    localStorage.removeItem('token');
                    navigate('/');
                } else {
                    console.log(error)
                }

            }

        }
    }

    let seedIDS = CROPINFO.seedsFromID;
    let seedCropMap = CROPINFO.seedCropMap;

    const tileAction = async (tileID, action, seedName, cropID) => {
        let targetTile = tiles.filter(tile => tile?.TileID === tileID);
        if (targetTile.length < 1) { console.log('INVALID updateTile target'); return { message: "INVALID updateTile target" } };
        targetTile = targetTile[0];
        if (action === 'plant') {
            if (tool === "multiplant") {
                multiPlant(seedName);
            } else {
                plantTile(seedName, targetTile);
            }

        } else {
            // Default to harvest to enable harvesting while still having seed equipped
            if (tool === "multiharvest") {
                return await multiHarvest();
            } else {
                return await harvestTile(targetTile)
            }
        }


    }

    const frontendPlant = (seedName, targetTile) => {
        let tileID = targetTile.TileID;

        if (targetTile.CropID !== -1) {
            return {
                ...targetTile,
                message: "ALREADY PLANTED",
            }
        }
        let simRes = {
            ...targetTile,
            message: "",
            TileID: tileID,
            CropID: "",
            PlantTime: null,
            HarvestsRemaining: null,
        }
        // frontend simulate result to not have to wait for backend response
        if (!isUnlocked(seedName)) {
            console.log("NOT UNLOCKED");
            return { message: "NOT UNLOCKED" };
        }
        // can plant
        simRes = {
            ...targetTile,
            TileID: tileID,
            CropID: CONSTANTS.ProduceIDs[seedName],
            PlantTime: Date.now(),
            HarvestsRemaining: UPGRADES[numHarvestTable][seedName],
            message: "SUCCESS",
            stage: 0,
            UserID: null
        }
        if (simRes.HarvestsFertilizer > 0) {
            simRes.HarvestsFertilizer -= 1;
            simRes.HarvestsRemaining += 1;
        }

        if (simRes.message === 'SUCCESS') {
            updateInventory(seedName, -1);
        }
        setTiles(prevTiles => prevTiles.map((tile) => {
            if (tile.TileID === tileID) {
                const newTile = {
                    ...simRes,
                    stage: getStage(simRes.PlantTime, simRes.CropID, tile.hasTimeFertilizer),
                };
                return newTile;
            } else {
                return { ...tile, stage: getStage(tile.PlantTime, tile.CropID, tile.hasTimeFertilizer) };
            }
        }));
        return simRes;
    }

    // Tiles is array of objects {tileID: int, seedName: string}
    const multiPlant = async (seedName) => {

        // This needs a semaphore lock because update inventory is async for multiple multiplant calls
        let seedCount = items[seedName]
        let allSimRes = [];
        highlightedTiles.forEach((tileID) => {
            if (tileID >= 1 && tileID <= 60) {
                if (seedCount > 0) {
                    let targetTile = tiles.filter(tile => tile?.TileID === tileID);
                    if (targetTile.length < 1) { console.log('INVALID updateTile target'); return { message: "INVALID updateTile target" } };
                    targetTile = targetTile[0];
                    let simRes = frontendPlant(seedName, targetTile)
                    if (simRes.message === 'SUCCESS') {
                        allSimRes.push(simRes);
                        seedCount--;
                    }
                }
            }
        })
        try {
            let queryTiles = allSimRes.map((sim) => { return { tileID: sim.TileID } })
            if (waitForServerResponse) {
                const response = await waitForServerResponse('multiPlant', {
                    tiles: queryTiles,
                    seedName: seedName
                });
            }
        } catch (error) {
            if (error.message.includes('401')) {
                console.log("AUTH EXPIRED")
                localStorage.removeItem('token');
                navigate('/');
            } else {
                console.log(error)
            }
        }


    }

    const plantTile = async (seedName, targetTile) => {
        let tileID = targetTile.TileID;
        let simRes = frontendPlant(seedName, targetTile)

        if (simRes.message === 'SUCCESS') {
            // only put request through if frontend validates
            try {
                if (waitForServerResponse) { // Ensure `waitForServerResponse` is defined
                    const response = await waitForServerResponse('plant', {
                        seedName: seedName,
                        tileID: tileID
                    });
                }
            } catch (error) {
                if (error.message.includes('401')) {
                    console.log("AUTH EXPIRED")
                    localStorage.removeItem('token');
                    navigate('/');
                } else {
                    console.log(error)
                }
            }
        }
    }

    const harvestTile = async (targetTile) => {
        let tileID = targetTile.TileID;
        let simRes = frontendHarvest(targetTile)

        setTiles(prevTiles => prevTiles.map((tile) => {
            if (tile.TileID === tileID) {
                const newTile = {
                    ...simRes,
                    stage: getStage(simRes.PlantTime, simRes.CropID, tile.hasTimeFertilizer),
                };
                return newTile;
            } else {
                return { ...tile, stage: getStage(tile.PlantTime, tile.CropID, tile.hasTimeFertilizer) };
            }
        }));

        if (simRes.message === 'SUCCESS') {
            try {
                if (waitForServerResponse) {
                    const response = await waitForServerResponse('harvest', {
                        tileID: tileID
                    });
                    let data = response.body;
                    setTiles(prevTiles => prevTiles.map((tile) => {
                        if (tile.TileID === data.TileID) {
                            const newTile = {
                                ...tile,
                                hasTimeFertilizer: data.hasTimeFertilizer,
                                // stage: getStage(tile.PlantTime, tile.CropID, tile.hasTimeFertilizer)

                            };
                            return newTile;
                        } else {
                            return { ...tile, stage: getStage(tile.PlantTime, tile.CropID, tile.hasTimeFertilizer) };
                        }
                    }));
                    let finished = data.finishedOrder;
                    if (finished) {
                        // setOrderNotice(false);
                        setOrderNotice(true);
                        if (orderTimer !== null) {
                            clearTimeout(orderTimer)
                        }
                        let id = setTimeout(() => {
                            setOrderNotice(false);
                        }, 500)
                        setOrderTimer(id)
                    }
                    if (data.randomPart !== null) {
                        setParts((oldArr) => {
                            let newParts = [...oldArr];
                            newParts[data.TileID - 1] = data.randomPart;
                            return newParts;
                        })
                    }
                }
            } catch (error) {
                if (error.message.includes('401')) {
                    console.log("AUTH EXPIRED")
                    localStorage.removeItem('token');
                    navigate('/');
                } else {
                    console.log(error)
                }
            }
        }
    }

    const multiHarvest = async () => {
        // call multiharvest for all tiles that are valid
        let allSimRes = [];
        highlightedTiles.forEach((tileID) => {
            if (tileID >= 1 && tileID <= 60) {
                let targetTile = tiles.filter(tile => tile?.TileID === tileID);
                if (targetTile.length < 1) { console.log('INVALID updateTile target'); return { message: "INVALID updateTile target" } };
                targetTile = targetTile[0];
                let simRes = frontendHarvest(targetTile)
                if (simRes.message === 'SUCCESS') {
                    allSimRes.push(simRes);
                }
            }
        })

        if (allSimRes.length === 0) {
            console.log("No tiles harvestable in multiharvest")
            return;
        }

        setTiles(prevTiles => prevTiles.map((tile) => {
            let thisTile = allSimRes.filter((simTile) => simTile.TileID === tile.TileID)
            if (thisTile.length !== 0) {
                thisTile = thisTile[0]
                const newTile = {
                    ...thisTile,
                    //hasTimeFertilizer is updated when the query responds
                    stage: getStage(thisTile.PlantTime, thisTile.CropID, tile.hasTimeFertilizer),
                };
                return newTile;
            } else {
                return { ...tile, stage: getStage(tile.PlantTime, tile.CropID, tile.hasTimeFertilizer) };
            }
        }));

        let idObjects = allSimRes.map((e) => {
            return { tileID: e.TileID }
        })

        try {
            if (waitForServerResponse) { // Ensure `waitForServerResponse` is defined
                const response = await waitForServerResponse('multiHarvest', {
                    tiles: idObjects
                });
                let tilesResult = response.body;
                setTiles(prevTiles => prevTiles.map((tile) => {
                    let thisTile = tilesResult.updatedTiles.filter((udTile) => udTile.TileID === tile.TileID)
                    if (thisTile.length !== 0) {
                        thisTile = thisTile[0]
                        // let stage = getStage(thisTile.PlantTime, thisTile.CropID, thisTile.hasTimeFertilizer);
                        const newTile = {
                            ...tile,
                            // stage: stage,
                            hasTimeFertilizer: thisTile.hasTimeFertilizer,
                        };
                        return newTile;
                    } else {
                        return { ...tile, stage: getStage(tile.PlantTime, tile.CropID, tile.hasTimeFertilizer) };
                    }
                }));

                if (tilesResult.finishedOrder) {
                    setOrderNotice(true);
                    if (orderTimer !== null) {
                        clearTimeout(orderTimer)
                    }
                    let id = setTimeout(() => {
                        setOrderNotice(false);
                    }, 500)
                    setOrderTimer(id)
                }
                console.log(tilesResult.updatedTiles.some((tile) => tile.randomPart !== null))
                if (tilesResult.updatedTiles.some((tile) => tile.randomPart !== null)) {
                    setParts((oldArr) => {
                        let newParts = [...oldArr];
                        tilesResult.updatedTiles.forEach((tile) => {
                            if (tile.randomPart) newParts[tile.TileID - 1] = tile.randomPart;
                        })
                        return newParts;
                    })
                }
            }
            // Compute the stage for each tile and include it in the tile object.
        } catch (error) {
            if (error.message.includes('401')) {
                console.log("AUTH EXPIRED")
                localStorage.removeItem('token');
                navigate('/');
            } else {
                console.log(error)

            }
        }
    }


    const frontendHarvest = (targetTile) => {
        let tileID = targetTile.TileID;
        let simRes = {
            ...targetTile,
            message: "",
            TileID: tileID,
            CropID: "",
            PlantTime: null,
            HarvestsRemaining: null,
        }
        if (targetTile.CropID === -1) {
            simRes = { ...targetTile };
            simRes.message = `Nothing to harvest at tile ${tileID}`
        } else {
            let growthTimes = UPGRADES[growthTable][seedIDS[targetTile.CropID]];

            // ms since epoch
            let plantedTime = targetTile.PlantTime;
            let curTime = Date.now();

            let secsPassed = (curTime - plantedTime) / 1000;
            let secsNeeded = growthTimes.reduce((sum, e) => sum + e, 0)
            if (simRes.hasTimeFertilizer) {
                secsPassed *= 2;
            }
            if (townPerks?.growthPerkLevel) {
                let boostPercent = TOWNSINFO.upgradeBoosts.growthPerkLevel[townPerks.growthPerkLevel];
                let boostChange = 1 - boostPercent;
                secsNeeded *= boostChange;
            }

            if (secsPassed >= secsNeeded) {
                if (targetTile.HarvestsRemaining === 1) {
                    // last harvest
                    simRes = {
                        ...simRes,
                        CropID: -1,
                        PlantTime: null,
                        HarvestsRemaining: null,
                        TileID: tileID,
                        message: "SUCCESS"
                    }
                } else {
                    // multi harvest
                    let timeSkip = 0;
                    for (let i = 0; i < growthTimes.length - 1; ++i) {
                        timeSkip += growthTimes[i];
                    }
                    timeSkip *= 1000; // seconds to ms
                    if (simRes.hasTimeFertilizer) {
                        timeSkip /= 2;
                    }

                    if (townPerks?.growthPerkLevel) {
                        let boostPercent = TOWNSINFO.upgradeBoosts.growthPerkLevel[townPerks.growthPerkLevel];
                        let boostChange = 1 - boostPercent;
                        timeSkip *= boostChange;
                    }
                    // ms since epoch
                    let newPlantTime = Date.now();
                    newPlantTime = newPlantTime - timeSkip;

                    simRes = {
                        ...simRes,
                        CropID: targetTile.CropID,
                        PlantTime: newPlantTime,
                        HarvestsRemaining: targetTile.HarvestsRemaining - 1,
                        TileID: tileID,
                        message: "SUCCESS"
                    }

                }
                let seed_name = seedIDS[targetTile.CropID];
                let cropName = seedCropMap[seed_name];


                let quantity = UPGRADES[quantityYieldTable][seed_name];
                if (simRes.YieldsFertilizer > 0) {
                    simRes.YieldsFertilizer -= 1;
                    let bonus = CONSTANTS.yieldFertilizerBonuses[seed_name];
                    quantity += bonus;
                }
                updateInventory(cropName, quantity);
                updateXP(CROPINFO.XP[cropName]);
            } else {
                // not ready for harvest
                simRes = { ...targetTile };
                simRes.message = "Not ready for harvest"
            }
        }
        return simRes;
    }


    const getStage = (PlantTime, CropID, hasTimeFertilizer) => {
        if (PlantTime !== null && CropID !== -1 && Object.keys(getUpgrades()).length !== 0) {
            const date = PlantTime;
            const curTime = Date.now();

            let secsPassed = (curTime - date) / (1000);
            if (hasTimeFertilizer) {
                secsPassed = secsPassed * 2;
            }
            if (townPerks?.growthPerkLevel) {
                let boostPercent = TOWNSINFO.upgradeBoosts.growthPerkLevel[townPerks.growthPerkLevel];
                let boostChange = 1 - boostPercent;
                secsPassed /= boostChange;
            }
            // Use secs passed to find out what stage you are in by summing growth in constants
            let growth = UPGRADES["GrowthTimes".concat(getUpgrades().plantGrowthTimeUpgrade)][CROPINFO.seedsFromID[CropID]];
            let stage = 0;
            while (secsPassed > 0 && stage < growth.length) {
                secsPassed -= growth[stage];
                if (secsPassed >= 0) {
                    stage++;
                }
            }
            return stage;
        } else {
            return -1
        }
    }

    const updateAllStages = () => {
        setTiles((old) => old.map((tile) => {
            let newTile = { ...tile };
            newTile.stage = getStage(newTile.PlantTime, newTile.CropID, newTile.hasTimeFertilizer);
            return newTile;
        })
        );
    }

    useEffect(() => {
        const interval = setInterval(updateAllStages, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [tiles]);

    useEffect(() => {
        if (Object.keys(getUpgrades()).length > 0) {
            updateAllStages();
        }
    }, [growthTable]);

    useEffect(() => {
        if (Object.keys(getUpgrades()).length > 0) {
            let upgrades = getUpgrades();
            setGrowthTable("GrowthTimes".concat(upgrades.plantGrowthTimeUpgrade))
            setNumHarvestTable("NumHarvests".concat(upgrades.plantNumHarvestsUpgrade));
            setQuantityYieldTable("PlantQuantityYields".concat(upgrades.plantHarvestQuantityUpgrade));
        }
    })

    useEffect(() => {
        setHighlighted([])
    }, [tool])
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 10%)',
            gridTemplateRows: 'repeat(6, 16.6%)',
            justifyItems: 'center',
            alignItems: 'center',
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            userSelect: "none",
        }}>
            {tiles.map((tile, index) => {
                return <CompTile tool={tool} partResult={parts[tile.TileID - 1]} setHovering={setHovering} highlighted={highlightedTiles.includes(tile.TileID)} fertilizeTile={fertilizeTile} equippedFert={equippedFert} key={tile.TileID} tile={tile} stage={tile.stage} tileAction={tileAction} />
            })}
        </div>
    )
}

export default CompPlot;