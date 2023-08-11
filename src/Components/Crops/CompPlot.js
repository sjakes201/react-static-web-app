import React, { useEffect, useState } from "react";
import CompTile from "./CompTile";
import CONSTANTS from '../../CONSTANTS';
import UPGRADES from "../../UPGRADES";
import { useNavigate } from 'react-router-dom';

function CompPlot({ getUpgrades, updateInventory, updateXP, getXP, setOrderNotice }) {

    const [tiles, setTiles] = useState([]);
    const [growthTable, setGrowthTable] = useState("GrowthTimes0")
    const [numHarvestTable, setNumHarvestTable] = useState("NumHarvests0")
    const [quantityYieldTable, setQuantityYieldTable] = useState("PlantQuantityYields0")
    const [hasDeluxe, setHasDeluxe] = useState(false);
    const [xp, setXP] = useState(0);

    // this is for triggering order button animation
    const [orderTimer, setOrderTimer] = useState(null)

    const navigate = useNavigate();

    // can you plant this plant?
    const isUnlocked = (name) => {
        let xpNeeded = Object.keys(CONSTANTS.Levels).filter((threshold) => CONSTANTS.Levels[threshold].includes(name) ? true : false)
        let permitNeeded = CONSTANTS.Permits.deluxeCrops.includes(name);
        if (permitNeeded && !hasDeluxe) {
            return false;
        }
        if (parseInt(xpNeeded[0]) > xp) {
            return false;
        }
        return true;
    }

    const updateTile = async (tileID, action, seedName, cropID) => {

        let targetTile = tiles.filter(tile => tile?.TileID === tileID);
        if (targetTile.length < 1) { console.log('INVALID updateTile target'); return { message: "INVALID updateTile target" } };
        targetTile = targetTile[0];
        let simRes = {
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
                TileID: tileID,
                CropID: CONSTANTS.ProduceIDs[seedName],
                PlantTime: Date.now(),
                HarvestsRemaining: UPGRADES[numHarvestTable][seedName],
                message: "SUCCESS",
                stage: 0,
                UserID: null
            }


        } else {
            // there was a crop so we are permitting harvest attempt despite holding seeds
            action = 'harvest';
            //attempt harvest
            if (targetTile.CropID === -1) {
                simRes = { ...targetTile };
                simRes.message = `Nothing to harvest at tile ${tileID}`
            } else {
                let growthTimes = UPGRADES[growthTable][CONSTANTS.ProduceNameFromID[targetTile.CropID]];

                // ms since epoch
                let plantedTime = targetTile.PlantTime;
                let curTime = Date.now();

                let secsPassed = (curTime - plantedTime) / 1000;
                // buffer for less 400's
                secsPassed -= 0.1;
                let secsNeeded = growthTimes.reduce((sum, e) => sum + e, 0)
                if (secsPassed >= secsNeeded) {
                    if (targetTile.HarvestsRemaining === 1) {
                        // last harvest
                        simRes = {
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

                        // ms since epoch
                        let newPlantTime = Date.now();
                        newPlantTime = newPlantTime - timeSkip * 1000;

                        simRes = {
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
                let seed_name = CONSTANTS.ProduceNameFromID[cropID];
                let cropName = CONSTANTS.SeedCropMap[seed_name][0];
                let quantity = UPGRADES[quantityYieldTable][seed_name];
                updateInventory(cropName, quantity);
                updateXP(CONSTANTS.XP[cropName]);
            }
        }
        setTiles(prevTiles => prevTiles.map((tile) => {
            if (tile.TileID === tileID) {
                const newTile = { ...simRes, stage: getStage(simRes.PlantTime, simRes.CropID) };
                return newTile;
            } else {
                return { ...tile, stage: getStage(tile.PlantTime, tile.CropID) };
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
                        let finished = data.finishedOrder;
                        if(finished) {
                            // setOrderNotice(false);
                            setOrderNotice(true);
                            if(orderTimer !== null) {
                                clearTimeout(orderTimer)
                            }
                            let id = setTimeout(() => {
                                setOrderNotice(false);
                            }, 500)
                            setOrderTimer(id)
                        }
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


    const getStage = (PlantTime, CropID) => {
        if (PlantTime !== null && CropID !== -1) {
            const date = PlantTime;
            const curTime = Date.now();

            let secsPassed = (curTime - date) / (1000);
            secsPassed -= 0.5;
            // buffer for less 400's
            // Use secs passed to find out what stage you are in by summing growth in constants
            let growth = UPGRADES[growthTable][CONSTANTS.ProduceNameFromID[CropID]];
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
        setTiles(tiles.map((tile) => {
            return { ...tile, stage: getStage(tile.PlantTime, tile.CropID) };
        }));
    }

    useEffect(() => {
        const interval = setInterval(updateAllStages, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [tiles]);

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
                throw new Error(`HTTP error! status: ${dbData.status}`);
            } else {
                let dbTiles = await dbData.json();
                let updatedTiles = dbTiles.map((tile) => {
                    let stage = getStage(tile.PlantTime, tile.CropID);
                    return { ...tile, stage: stage };
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
        createTiles()
        updateAllStages();
    }, []);

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
                return <CompTile key={tile.TileID} tile={tile} stage={tile.stage} updateTile={updateTile} />
            })}
        </div>
    )
}

export default CompPlot;