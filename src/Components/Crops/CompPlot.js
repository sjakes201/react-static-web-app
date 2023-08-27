import React, { useEffect, useState } from "react";
import CompTile from "./CompTile";
import CONSTANTS from '../../CONSTANTS';
import UPGRADES from "../../UPGRADES";
import { useNavigate } from 'react-router-dom';

function CompPlot({ setFertilizers, fertilizers, equippedFert, setEquippedFert, getUpgrades, updateInventory, updateXP, getXP, setOrderNotice }) {

    const [tiles, setTiles] = useState([]);
    const [growthTable, setGrowthTable] = useState("")
    const [numHarvestTable, setNumHarvestTable] = useState("NumHarvests0")
    const [quantityYieldTable, setQuantityYieldTable] = useState("PlantQuantityYields0")
    const [hasDeluxe, setHasDeluxe] = useState(false);
    const [xp, setXP] = useState(0);

    // this is for triggering order button animation
    const [orderTimer, setOrderTimer] = useState(null)

    const navigate = useNavigate();

    // can you plant this plant?
    const isUnlocked = (name) => {
        let xpNeeded = Object.keys(CONSTANTS.levelUnlocks).filter((level) => CONSTANTS.levelUnlocks[level].includes(name) ? true : false)
        let permitNeeded = CONSTANTS.Permits.deluxeCrops.includes(name);
        if (permitNeeded && !hasDeluxe) {
            return false;
        }
        if (parseInt(xpNeeded[0]) > xp) {
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
            const token = localStorage.getItem('token');
            try {
                let fertilizeQuery = await fetch('https://farm-api.azurewebsites.net/api/fertilizeTile', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        tileID: tileID,
                        fertilizerType: desiredFertilizer
                    })
                })
                if (!fertilizeQuery.ok) {
                    throw new Error(`HTTP error! status: ${fertilizeQuery.status}`);
                } else {
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

    let pnid = [null, "carrot_seeds", "melon_seeds", "cauliflower_seeds", "pumpkin_seeds", "yam_seeds",
        "beet_seeds", "parsnip_seeds", "bamboo_seeds", "hops_seeds", "corn_seeds", "potato_seeds",
        "blueberry_seeds", "grape_seeds", "oats_seeds", "strawberry_seeds"];

    const updateTile = async (tileID, action, seedName, cropID) => {

        let targetTile = tiles.filter(tile => tile?.TileID === tileID);
        if (targetTile.length < 1) { console.log('INVALID updateTile target'); return { message: "INVALID updateTile target" } };
        targetTile = targetTile[0];
        let simRes = {
            ...targetTile,
            message: "",
            TileID: tileID,
            CropID: "",
            PlantTime: null,
            HarvestsRemaining: null,
        }
        if (action === 'plant' && targetTile?.CropID === -1 && seedName in CONSTANTS.SeedCropMap) {

            // do we have it unlocked? permit and xp
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


        } else {
            // there was a crop so we are permitting harvest attempt despite holding seeds
            action = 'harvest';
            //attempt harvest
            if (targetTile.CropID === -1) {
                simRes = { ...targetTile };
                simRes.message = `Nothing to harvest at tile ${tileID}`
            } else {
                let growthTimes = UPGRADES[growthTable][pnid[targetTile.CropID]];

                // ms since epoch
                let plantedTime = targetTile.PlantTime;
                let curTime = Date.now();

                let secsPassed = (curTime - plantedTime) / 1000;
                // buffer for less 400's
                let secsNeeded = growthTimes.reduce((sum, e) => sum + e, 0)
                if (simRes.hasTimeFertilizer) {
                    secsPassed *= 2;
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
                        // ms since epoch
                        let newPlantTime = Date.now();
                        newPlantTime = newPlantTime - timeSkip;

                        simRes = {
                            ...simRes,
                            CropID: cropID,
                            PlantTime: newPlantTime,
                            HarvestsRemaining: targetTile.HarvestsRemaining - 1,
                            TileID: tileID,
                            message: "SUCCESS"
                        }

                    }
                } else {
                    // not ready for harvest
                    simRes = { ...targetTile };
                    simRes.message = "Not ready for harvest"
                }
            }


        }

        if (simRes.message === 'SUCCESS') {
            if (action === 'plant') {
                updateInventory(seedName, -1);
            } else {
                let PNFI = [null, "carrot_seeds", "melon_seeds", "cauliflower_seeds", "pumpkin_seeds", "yam_seeds",
                    "beet_seeds", "parsnip_seeds", "bamboo_seeds", "hops_seeds", "corn_seeds", "potato_seeds",
                    "blueberry_seeds", "grape_seeds", "oats_seeds", "strawberry_seeds"];
                let SCM = {
                    carrot_seeds: ["carrot", 3, 2],
                    melon_seeds: ["melon", 1, 1],
                    cauliflower_seeds: ["cauliflower", 1, 1],
                    pumpkin_seeds: ["pumpkin", 1, 1],
                    yam_seeds: ["yam", 4, 3],
                    beet_seeds: ["beet", 4, 3],
                    parsnip_seeds: ["parsnip", 2, 1],
                    bamboo_seeds: ["bamboo", 5, 4],
                    hops_seeds: ["hops", 1, 3],
                    corn_seeds: ["corn", 1, 3],
                    potato_seeds: ["potato", 3, 3],
                    blueberry_seeds: ["blueberry", 6, 5],
                    grape_seeds: ["grape", 6, 5],
                    oats_seeds: ["oats", 4, 4],
                    strawberry_seeds: ["strawberry", 3, 4]
                };
                let seed_name = PNFI[cropID];
                let cropName = SCM[seed_name][0];


                let quantity = UPGRADES[quantityYieldTable][seed_name];
                if (simRes.YieldsFertilizer > 0) {
                    simRes.YieldsFertilizer -= 1;
                    let bonus = CONSTANTS.yieldFertilizerBonuses[seed_name];
                    quantity += bonus;
                }



                updateInventory(cropName, quantity);
                updateXP(CONSTANTS.XP[cropName]);
            }
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


        const token = localStorage.getItem('token');
        if (simRes.message === 'SUCCESS') {
            try {
                if (action === 'plant') {
                    let plantQuery = await fetch('https://farm-api.azurewebsites.net/api/plant', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            seedName: seedName,
                            tileID: tileID
                        })
                    })
                    if (!plantQuery.ok) {
                        console.log(await plantQuery.json())
                        throw new Error(`HTTP error! status: ${plantQuery.status}`);
                    }
                } else {
                    let harvestQuery = await fetch('https://farm-api.azurewebsites.net/api/harvest', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            tileID: tileID
                        })
                    })
                    if (!harvestQuery.ok) {
                        throw new Error(`HTTP error! status: ${harvestQuery.status}`);
                    } else {
                        let data = await harvestQuery.json()
                        setTiles(prevTiles => prevTiles.map((tile) => {
                            if (tile.TileID === data.TileID) {
                                console.log(data)
                                const newTile = {
                                    ...tile,
                                    hasTimeFertilizer: data.hasTimeFertilizer,
                                    stage: getStage(tile.PlantTime, tile.CropID, tile.hasTimeFertilizer)

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
                        return data.randomPart;
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


    const getStage = (PlantTime, CropID, hasTimeFertilizer) => {
        if (PlantTime !== null && CropID !== -1) {
            const date = PlantTime;
            const curTime = Date.now();

            let secsPassed = (curTime - date) / (1000);
            if (hasTimeFertilizer) {
                secsPassed = secsPassed * 2;
            }
            // Use secs passed to find out what stage you are in by summing growth in constants
            let growth = UPGRADES[growthTable][pnid[CropID]];
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
        console.log('updating')
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
    }, [tiles, growthTable]);

    const createTiles = async () => {
        try {
            const token = localStorage.getItem('token');
            let dbData = await fetch('https://farm-api.azurewebsites.net/api/tilesAll', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({})
            })
            if (!dbData.ok) {
                console.log(await dbData.json())
                throw new Error(`HTTP error! status: ${dbData.status}`);

            } else {
                let dbTiles = await dbData.json();
                let updatedTiles = dbTiles.map((tile) => {
                    let hasTimeFertilizer = tile.TimeFertilizer !== -1
                    let stage = getStage(tile.PlantTime, tile.CropID, hasTimeFertilizer);
                    return {
                        ...tile,
                        stage: stage,
                        hasTimeFertilizer: hasTimeFertilizer
                    };
                });
                setTiles(updatedTiles);
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

    // Manage async creation of tiles

    useEffect(() => {
        if (Object.keys(getUpgrades()).length > 0) {
            createTiles()
            updateAllStages();
        }
    }, [growthTable]);

    useEffect(() => {
        if (Object.keys(getUpgrades()).length > 0) {
            let upgrades = getUpgrades();
            setGrowthTable("GrowthTimes".concat(upgrades.plantGrowthTimeUpgrade))
            setNumHarvestTable("NumHarvests".concat(upgrades.plantNumHarvestsUpgrade));
            setQuantityYieldTable("PlantQuantityYields".concat(upgrades.plantHarvestQuantityUpgrade));
            setHasDeluxe(upgrades.deluxePermit);
            setXP(getXP());
        }
    })

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
                return <CompTile fertilizeTile={fertilizeTile} equippedFert={equippedFert} key={tile.TileID} tile={tile} stage={tile.stage} updateTile={updateTile} />
            })}
        </div>
    )
}

export default CompPlot;