import React, { useEffect, useState, useContext } from "react";
import CompTile from "./CompTile";
import CONSTANTS from "../../CONSTANTS";
import CROPINFO from "../../CROPINFO";
import BOOSTSINFO from "../../BOOSTSINFO";
import UPGRADES from "../../UPGRADES";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../WebSocketContext";
import TOWNSINFO from "../../TOWNSINFO";
import { GameContext } from "../../GameContainer";
import { calcCropYield } from "../../Helpers/farmHelpers";

function CompPlot({
  tool,
  setFertilizers,
  fertilizers,
  equippedFert,
  setEquippedFert,
  updateInventory,
  setOrderNotice,
  items,
  aoeFertilizer,
  setAoeFertilizer
}) {
  const { waitForServerResponse } = useWebSocket();
  const { townPerks, tiles, setTiles, updateXP, getXP, getUpgrades, setParts, getTiles, moreInfo, getStage, getCurrentSeason, activeBoosts } = useContext(GameContext)

  const [growthTable, setGrowthTable] = useState("");
  const [numHarvestTable, setNumHarvestTable] = useState("NumHarvests0");
  const [quantityYieldTable, setQuantityYieldTable] = useState(
    "PlantQuantityYields0",
  );

  // this is for triggering order button animation
  const [orderTimer, setOrderTimer] = useState(null);

  const [highlightedTiles, setHighlighted] = useState([]);
  // Controls machine part gifs
  const [partsGifs, setPartsGifs] = useState(
    Array.from({ length: 60 }, () => ""),
  );

  const navigate = useNavigate();

  // Logic for multi action hovering
  const setHovering = (tileID) => {
    if (tool === "" && !aoeFertilizer) {
      // single tile
      setHighlighted([tileID]);
      return;
    }
    // multitool
    if (tileID % 10 === 0) {
      setHighlighted([
        tileID - 11,
        tileID - 10,
        tileID - 1,
        tileID,
        tileID + 9,
        tileID + 10,
      ]);
      // left side
    } else if (tileID % 10 === 1) {
      // right side
      setHighlighted([
        tileID - 10,
        tileID - 9,
        tileID,
        tileID + 1,
        tileID + 10,
        tileID + 11,
      ]);
    } else {
      setHighlighted([
        tileID - 11,
        tileID - 10,
        tileID - 9,
        tileID - 1,
        tileID,
        tileID + 1,
        tileID + 9,
        tileID + 10,
        tileID + 11,
      ]);
    }
  };

  const isUnlocked = (name) => {
    let xpNeeded = Object.keys(CONSTANTS.levelUnlocks).filter((level) =>
      CONSTANTS.levelUnlocks[level].includes(name) ? true : false,
    );
    let permitNeeded = CONSTANTS.Permits.deluxeCrops.includes(name);
    if (permitNeeded && !getUpgrades().deluxePermit) {
      return false;
    }
    if (parseInt(xpNeeded[0]) > getXP()) {
      return false;
    }
    return true;
  };

  const fertilize = () => {
    highlightedTiles.forEach((tileID) => {
      fertilizeTile(tileID);
    })
  }

  const fertilizeTile = async (tileID) => {
    let desiredFertilizer = equippedFert;
    let targetTile = tiles.filter((tile) => tile.TileID === tileID)[0]
    if (!targetTile) return;

    if (targetTile[desiredFertilizer] > 0) {
      return;
    }

    if (fertilizers[desiredFertilizer] > 0) {
      setFertilizers((old) => {
        let newCounts = { ...old };
        newCounts[desiredFertilizer] -= 1;
        if (newCounts[desiredFertilizer] === 0) {
          setEquippedFert("");
        }
        return newCounts;
      });
      updateInventory(desiredFertilizer, -1, true);

      setTiles((old) => {
        let newTiles = old.map((tile) => {
          if (tile.TileID === tileID) {
            let newTile = { ...tile };
            switch (equippedFert) {
              case "TimeFertilizer":
                newTile.TimeFertilizer = Date.now();
                newTile.hasTimeFertilizer = true;
                break;
              case "YieldsFertilizer":
                newTile.YieldsFertilizer = 10;
                break;
              case "HarvestsFertilizer":
                newTile.HarvestsFertilizer = 5;
                break;
            }
            return newTile;
          } else {
            return tile;
          }
        });
        return newTiles;
      });
      try {
        if (waitForServerResponse) {
          await waitForServerResponse("fertilizeTile", {
            tileID: tileID,
            fertilizerType: desiredFertilizer,
          });
        }
      } catch (error) {
        if (error.message.includes("401")) {
          console.log("AUTH EXPIRED");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.log(error);
        }
      }
    } else {
      setAoeFertilizer(false)
    }
  };

  let seedIDS = CROPINFO.seedsFromID;
  let seedCropMap = CROPINFO.seedCropMap;

  const tileAction = async (tileID, action, seedName, cropID) => {
    let targetTile = tiles.filter((tile) => tile?.TileID === tileID);
    if (targetTile.length < 1) {
      console.log("INVALID updateTile target");
      return { message: "INVALID updateTile target" };
    }
    targetTile = targetTile[0];
    if (action === "plant") {
      multiPlant(seedName)
    } else {
      // Default to harvest to enable harvesting while still having seed equipped
      return await multiHarvest()
    }
  };

  const frontendPlant = (seedName, targetTile) => {
    let tileID = targetTile.TileID;

    if (targetTile.CropID !== -1) {
      return {
        ...targetTile,
        message: "ALREADY PLANTED",
      };
    }
    let simRes = {
      ...targetTile,
      message: "",
      TileID: tileID,
      CropID: "",
      PlantTime: null,
      HarvestsRemaining: null,
    };
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
      UserID: null,
    };
    if (simRes.HarvestsFertilizer > 0) {
      simRes.HarvestsFertilizer -= 1;
      simRes.HarvestsRemaining += 1;
    }

    if (simRes.message === "SUCCESS") {
      updateInventory(seedName, -1);
    }
    setTiles((prevTiles) =>
      prevTiles.map((tile) => {
        if (tile.TileID === tileID) {
          const newTile = {
            ...simRes,
            stage: getStage(
              simRes.PlantTime,
              simRes.CropID,
              tile.hasTimeFertilizer,
            ),
          };
          return newTile;
        } else {
          return {
            ...tile,
            stage: getStage(
              tile.PlantTime,
              tile.CropID,
              tile.hasTimeFertilizer,
            ),
          };
        }
      }),
    );
    return simRes;
  };

  // Tiles is array of objects {tileID: int, seedName: string}
  const multiPlant = async (seedName) => {
    if (!(CROPINFO.seedsFromID.includes(seedName))) { console.log("Invalid seed ", seedName); return; }
    // This needs a semaphore lock because update inventory is async for multiple multiplant calls
    let seedCount = items[seedName];
    let allSimRes = [];
    highlightedTiles.forEach((tileID) => {
      if (tileID >= 1 && tileID <= 60) {
        if (seedCount > 0) {
          let targetTile = tiles.filter((tile) => tile?.TileID === tileID);
          if (targetTile.length < 1) {
            console.log("INVALID updateTile target");
            return { message: "INVALID updateTile target" };
          }
          targetTile = targetTile[0];
          let simRes = frontendPlant(seedName, targetTile);
          if (simRes.message === "SUCCESS") {
            allSimRes.push(simRes);
            seedCount--;
          }
        }
      }
    });
    try {
      let queryTiles = allSimRes.map((sim) => {
        return { tileID: sim.TileID };
      });
      if (waitForServerResponse) {
        await waitForServerResponse("multiPlant", {
          tiles: queryTiles,
          seedName: seedName,
        });
      }
    } catch (error) {
      if (error.message.includes("401")) {
        console.log("AUTH EXPIRED");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        console.log(error);
      }
    }
  };

  const multiHarvest = async () => {
    // call multiharvest for all tiles that are valid
    let allSimRes = [];
    highlightedTiles.forEach((tileID) => {
      if (tileID >= 1 && tileID <= 60) {
        let targetTile = tiles.filter((tile) => tile?.TileID === tileID);
        if (targetTile.length < 1) {
          console.log("INVALID updateTile target");
          return { message: "INVALID updateTile target" };
        }
        targetTile = targetTile[0];
        let simRes = frontendHarvest(targetTile);
        if (simRes.message === "SUCCESS") {
          allSimRes.push(simRes);
        }
      }
    });

    if (allSimRes.length === 0) {
      // No tiles harvestable in multiharvest
      return false;
    }

    setTiles((prevTiles) =>
      prevTiles.map((tile) => {
        let thisTile = allSimRes.filter(
          (simTile) => simTile.TileID === tile.TileID,
        );
        if (thisTile.length !== 0) {
          thisTile = thisTile[0];
          const newTile = {
            ...thisTile,
            //hasTimeFertilizer is updated when the query responds
            stage: getStage(
              thisTile.PlantTime,
              thisTile.CropID,
              tile.hasTimeFertilizer,
            ),
          };
          return newTile;
        } else {
          return {
            ...tile,
            stage: getStage(
              tile.PlantTime,
              tile.CropID,
              tile.hasTimeFertilizer,
            ),
          };
        }
      }),
    );

    let idObjects = allSimRes.map((e) => {
      return { tileID: e.TileID };
    });

    try {
      if (waitForServerResponse) {
        // Ensure `waitForServerResponse` is defined
        const response = await waitForServerResponse("multiHarvest", {
          tiles: idObjects,
        });
        let tilesResult = response.body;

        if (!Array.isArray(tilesResult?.updatedTiles)) {
          console.log("ERROR: Did not receive array back");
          console.log(tilesResult)
          getTiles()
          return;
        }
        setTiles((prevTiles) =>
          prevTiles.map((tile) => {
            let thisTile = tilesResult.updatedTiles.filter(
              (udTile) => udTile.TileID === tile.TileID,
            );
            if (thisTile.length !== 0) {
              thisTile = thisTile[0];
              // let stage = getStage(thisTile.PlantTime, thisTile.CropID, thisTile.hasTimeFertilizer);
              const newTile = {
                ...tile,
                // stage: stage,
                hasTimeFertilizer: thisTile.hasTimeFertilizer,
                nextRandom: thisTile.nextRandom
              };
              return newTile;
            } else {
              return {
                ...tile,
                stage: getStage(
                  tile.PlantTime,
                  tile.CropID,
                  tile.hasTimeFertilizer,
                )
              };
            }
          }),
        );

        if (tilesResult.finishedOrder) {
          setOrderNotice(true);
          if (orderTimer !== null) {
            clearTimeout(orderTimer);
          }
          let id = setTimeout(() => {
            setOrderNotice(false);
          }, 500);
          setOrderTimer(id);
        }
        if (tilesResult.updatedTiles.some((tile) => tile.randomPart !== null)) {
          setPartsGifs((oldArr) => {
            let newpartsGifs = [...oldArr];
            tilesResult.updatedTiles.forEach((tile) => {
              if (tile.randomPart)
                newpartsGifs[tile.TileID - 1] = tile.randomPart;
            });
            return newpartsGifs;
          });
          tilesResult.updatedTiles.forEach((tile) => {
            if (tile.randomPart) {
              setParts((oldParts) => {
                let newParts = { ...oldParts };
                newParts[tile.randomPart] += 1;
                return newParts;
              });
            }
          });
        }
        return true;
      }
      // Compute the stage for each tile and include it in the tile object.
    } catch (error) {
      if (error.message.includes("401")) {
        console.log("AUTH EXPIRED");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        console.log(error);
      }
    }
  };

  const frontendHarvest = (targetTile) => {
    let tileID = targetTile.TileID;
    let simRes = {
      ...targetTile,
      message: "",
      TileID: tileID,
      CropID: "",
      PlantTime: null,
      HarvestsRemaining: null,
    };
    if (targetTile.CropID === -1) {
      simRes = { ...targetTile };
      simRes.message = `Nothing to harvest at tile ${tileID}`;
    } else {
      let growthTimes = UPGRADES[growthTable][seedIDS[targetTile.CropID]];

      // ms since epoch
      let plantedTime = targetTile.PlantTime;
      let curTime = Date.now();

      let secsPassed = (curTime - plantedTime) / 1000;
      let secsNeeded = growthTimes.reduce((sum, e) => sum + e, 0);
      if (simRes.hasTimeFertilizer) {
        secsPassed *= 2;
      }

      if (townPerks?.cropTimeLevel > 0) {
        let boostPercent =
          TOWNSINFO.perkBoosts.cropTimeLevel[townPerks.cropTimeLevel - 1];
        let boostChange = 1 + boostPercent;
        secsPassed *= boostChange;
      }

      if (CONSTANTS.cropSeasons[getCurrentSeason()]?.includes(seedIDS[targetTile.CropID])) {
        let boostChange = CONSTANTS.VALUES.SEASON_GROWTH_BUFF + 1;
        secsPassed *= boostChange;
      }

      activeBoosts?.forEach(boost => {
        if (boost.Type === "TIME" && boost.BoostTarget === "CROPS") {
          let boostPercent = BOOSTSINFO[boost.BoostName].boostPercent;
          secsPassed *= 1 + boostPercent;
        } else if (boost.Type === "TIME" && boost.BoostTarget === CONSTANTS.ProduceNameFromID[targetTile.CropID]) {
          let boostName = boost.BoostName;
          let level = boostName[boostName.length - 1];
          let boostPercent = BOOSTSINFO?.[`CROP_INDIV_TIME_${level}`]?.boostPercents[CONSTANTS.ProduceNameFromID[targetTile.CropID]];
          secsPassed *= 1 + boostPercent;
        }
      })

      if (secsPassed >= secsNeeded) {
        if (targetTile.HarvestsRemaining === 1) {
          // last harvest
          simRes = {
            ...simRes,
            CropID: -1,
            PlantTime: null,
            HarvestsRemaining: null,
            TileID: tileID,
            message: "SUCCESS",
          };
        } else {
          // multiple harvests
          let timeSkip = 0;
          for (let i = 0; i < growthTimes.length - 1; ++i) {
            timeSkip += growthTimes[i];
          }
          timeSkip *= 1000; // seconds to ms
          if (simRes.hasTimeFertilizer) {
            timeSkip /= 2;
          }

          if (townPerks?.cropTimeLevel > 0) {
            let boostPercent =
              TOWNSINFO.perkBoosts.cropTimeLevel[townPerks.cropTimeLevel - 1];
            let boostChange = 1 + boostPercent;
            timeSkip /= boostChange;
          }

          if (CONSTANTS?.cropSeasons?.[getCurrentSeason()]?.includes(seedIDS[targetTile.CropID])) {
            let boostPercent = CONSTANTS.VALUES.SEASON_GROWTH_BUFF;
            timeSkip /= (1 + boostPercent);
          }

          activeBoosts?.forEach(boost => {
            if (boost.Type === "TIME" && boost.BoostTarget === "CROPS") {
              let boostPercent = BOOSTSINFO[boost.BoostName].boostPercent;
              timeSkip /= 1 + boostPercent;
            } else if (boost.Type === "TIME" && boost.BoostTarget === CONSTANTS.ProduceNameFromID[targetTile.CropID]) {
              let boostName = boost.BoostName;
              let level = boostName[boostName.length - 1];
              let boostPercent = BOOSTSINFO?.[`CROP_INDIV_TIME_${level}`]?.boostPercents[CONSTANTS.ProduceNameFromID[targetTile.CropID]];
              timeSkip /= 1 + boostPercent;
            }
          })

          // ms since epoch
          let newPlantTime = Date.now();
          newPlantTime = newPlantTime - timeSkip;

          simRes = {
            ...simRes,
            CropID: targetTile.CropID,
            PlantTime: newPlantTime,
            HarvestsRemaining: targetTile.HarvestsRemaining - 1,
            TileID: tileID,
            message: "SUCCESS",
          };
        }
        let seedName = seedIDS[targetTile.CropID];
        let cropName = seedCropMap[seedName];
        let cropQty = calcCropYield(targetTile.nextRandom, seedName, parseInt(quantityYieldTable[quantityYieldTable.length - 1]), simRes.YieldsFertilizer > 0, activeBoosts)
        if (simRes.YieldsFertilizer > 0) {
          simRes.YieldsFertilizer -= 1;
        }

        updateInventory(cropName, cropQty);
        updateXP(CROPINFO.XP[cropName]);
      } else {
        // not ready for harvest
        simRes = { ...targetTile };
        simRes.message = "Not ready for harvest";
      }
    }
    return simRes;
  };

  const timeUntilHarvest = (PlantTime, CropID, hasTimeFertilizer) => {
    if (
      PlantTime !== null &&
      CropID !== -1 &&
      Object.keys(getUpgrades()).length !== 0
    ) {
      const date = PlantTime;
      const curTime = Date.now();

      let secsPassed = (curTime - date) / 1000;

      let growth =
        UPGRADES["GrowthTimes".concat(getUpgrades().plantGrowthTimeUpgrade)][
        CROPINFO.seedsFromID[CropID]
        ];

      let totalTimeNeeded = growth.reduce((sum, e) => sum + e, 0);

      let totalSpeedMultiple = 1;

      if (hasTimeFertilizer) {
        totalSpeedMultiple *= 2;
      }

      if (townPerks?.cropTimeLevel > 0) {
        let boostPercent =
          TOWNSINFO.perkBoosts.cropTimeLevel[townPerks.cropTimeLevel - 1];
        let boostChange = 1 + boostPercent;
        totalSpeedMultiple *= boostChange;
      }

      activeBoosts?.forEach(boost => {
        if (boost.Type === "TIME" && boost.BoostTarget === "CROPS") {
          let boostPercent = BOOSTSINFO[boost.BoostName].boostPercent;
          totalSpeedMultiple *= 1 + boostPercent;
        } else if (boost.Type === "TIME" && boost.BoostTarget === CONSTANTS.ProduceNameFromID[CropID]) {
          let boostName = boost.BoostName;
          let level = boostName[boostName.length - 1];
          let boostPercent = BOOSTSINFO?.[`CROP_INDIV_TIME_${level}`]?.boostPercents[CONSTANTS.ProduceNameFromID[CropID]];
          totalSpeedMultiple *= 1 + boostPercent;
        }
      })

      if (CONSTANTS.cropSeasons[getCurrentSeason()]?.includes(CROPINFO.seedsFromID[CropID])) {
        let boostChange = 1 + CONSTANTS.VALUES.SEASON_GROWTH_BUFF;
        totalSpeedMultiple *= boostChange;
      }

      /* Since we do not have secsPassed, calculate how many seconds would have been saved by the time you finish,
       subtract that from total and compare to unmodified secsPassed to get difference. We can't modify secsPassed because
       it is a real value the player sees, so it should be not accelerating or not 1 second per second
       */
      let adjustedSecondsNeeded = Math.ceil((totalTimeNeeded / totalSpeedMultiple))

      return adjustedSecondsNeeded - secsPassed > 0 ? adjustedSecondsNeeded - secsPassed : 0;
    } else {
      return -1;
    }
  };

  const updateAllStages = () => {
    setTiles((old) =>
      old.map((tile) => {
        let newTile = { ...tile };
        newTile.stage = getStage(
          newTile.PlantTime,
          newTile.CropID,
          newTile.hasTimeFertilizer,
        );
        return newTile;
      }),
    );
  };

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
      setGrowthTable("GrowthTimes".concat(upgrades.plantGrowthTimeUpgrade));
      setNumHarvestTable(
        "NumHarvests".concat(upgrades.plantNumHarvestsUpgrade),
      );
      setQuantityYieldTable(
        "PlantQuantityYields".concat(upgrades.plantHarvestQuantityUpgrade),
      );
    }
  });

  useEffect(() => {
    setHighlighted([]);
  }, [tool]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(10, 10%)",
        gridTemplateRows: "repeat(6, 16.666%)",
        justifyItems: "center",
        alignItems: "center",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
      }}
    >
      {tiles.map((tile, index) => {
        return (
          <CompTile
            tool={tool}
            partResult={partsGifs[tile.TileID - 1]}
            setHovering={setHovering}
            highlighted={highlightedTiles.includes(tile.TileID)}
            equippedFert={equippedFert}
            key={index}
            tile={tile}
            stage={tile.stage}
            tileAction={tileAction}
            moreInfo={moreInfo}
            timeUntilHarvest={timeUntilHarvest}
            aoeFertilizer={aoeFertilizer}
            fertilize={fertilize}
          />
        );
      })}
    </div>
  );
}

export default CompPlot;
