import React, { useEffect, useState, useRef, useContext } from "react";
import CompAnimal from "./CompAnimal";
import CONSTANTS from "../../CONSTANTS";
import UPGRADES from "../../UPGRADES";
import { useNavigate } from "react-router-dom";
import ANIMALINFO from "../../ANIMALINFO";
import TOWNSINFO from "../../TOWNSINFO";
import { useWebSocket } from "../../WebSocketContext";
import { GameContext } from "../../GameContainer";

const getCurrentSeason = () => {
  const seasons = ['spring', 'summer', 'fall', 'winter'];
  const currentDate = new Date();
  const epochStart = new Date(1970, 0, 1);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  let totalDays = Math.floor((currentDate - epochStart) / millisecondsPerDay);

  const currentSeasonIndex = totalDays % seasons.length;

  return seasons[currentSeasonIndex];
}

function CompPen({
  animalsParent,
  setAnimalsParent,
  penWidth,
  penHeight,
  isBarn,
  updateInventory,
  setOrderNotice,
  setEquippedFeed,
}) {
  const { waitForServerResponse } = useWebSocket();
  const { townPerks, updateXP, getXP, getUpgrades, moreInfo } = useContext(GameContext)
  // 10 per border
  penWidth -= 20;
  penHeight -= 20;

  let xSlots = 6;
  let ySlots = 9;
  let animalWidth = Math.floor(penWidth / xSlots);
  let animalHeight = Math.floor(penHeight / ySlots);

  const navigate = useNavigate();

  // Profile info
  const [hasExotic, setHasExotic] = useState(false);
  const [xp, setXP] = useState(0);

  // The three animal state arrays: for their info, whether they are collectible, and whether they are walking
  // const [animals, setAnimals] = useState([]);
  const [collectible, setCollectible] = useState([]);
  const [walking, setWalking] = useState([]);

  // this is for triggering order button animation
  const [orderTimer, setOrderTimer] = useState(null);

  // Load in profile info
  useEffect(() => {
    if (Object.keys(getUpgrades()).length !== 0) {
      setXP(getXP());
      setHasExotic(getUpgrades().exoticPermit);
    }
  });

  /*
        On mount, generate random animal starting positions. If the animals change (deleted) only remove that animal, instead of recreating
        them all and generating new positions. Main effect is that animals do not generate new random positions when one is deleted from management screen
    */
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current && animalsParent.length > 0) {
      // First render and animals exist, generate random positionds
      createAnimals();
      firstRender.current = false;
    } else if (animalsParent.length > 0) {
      // Not the first render, if anything was removed, remove it from all states

      // Filter animals in current states for only ones present in animalsParent
      let currentIDs = [];
      for (let i = 0; i < animalsParent.length; ++i) {
        currentIDs.push(animalsParent[i].Animal_ID);
      }
      setWalking((old) => old.filter((a) => currentIDs.includes(a.Animal_ID)));
      setCollectible((old) =>
        old.filter((a) => currentIDs.includes(a.Animal_ID)),
      );
    }
  }, [animalsParent]);

  // Can you collect on this animal?
  const isUnlocked = (name) => {
    let xpNeeded = Object.keys(CONSTANTS.levelUnlocks).filter((lvl) =>
      CONSTANTS.levelUnlocks[lvl].includes(name) ? true : false,
    );
    let permitNeeded = CONSTANTS.Permits.exoticAnimals.includes(name);
    if (parseInt(xpNeeded[0]) > xp) {
      return false;
    }
    if (permitNeeded && !hasExotic) {
      return false;
    }
    return true;
  };

  // Feed animal function
  const handleFeed = async (Animal_ID, feed) => {
    let targetAnimal = animalsParent.filter(
      (a) => a.Animal_ID === Animal_ID,
    )[0];

    const lastFed = targetAnimal.Last_fed;
    let timePassedMS = Date.now() - lastFed;
    if (timePassedMS >= ANIMALINFO.VALUES.FEED_COOLDOWN) {
      let newCount = updateInventory(feed, -1);
      let happinessAdd = ANIMALINFO.FoodHappinessYields[feed];
      if (ANIMALINFO.foodPreferences[targetAnimal.Animal_type].like.includes(feed)) {
        happinessAdd *= 2;
      } else if (ANIMALINFO.foodPreferences[targetAnimal.Animal_type].dislike.includes(feed)) {
        happinessAdd *= -1;
      }
      if (happinessAdd > 0) {
        const happPerkLevel = townPerks.happinessMultiplierLevel;
        if (happPerkLevel > 0) {
          let perkBoost = 1 + TOWNSINFO.perkBoosts.happinessMultiplierLevel[happPerkLevel - 1]
          happinessAdd *= perkBoost;
        }
      }
      setAnimalsParent((old) => {
        return old.map((a) => {
          if (a.Animal_ID === targetAnimal.Animal_ID) {
            // set last fed and new happiness
            let newAnimal = { ...a };
            newAnimal.Last_fed = Date.now();
            newAnimal.Happiness = newAnimal.Happiness + happinessAdd;
            return newAnimal;
          } else {
            return a;
          }
        });
      });

      if (newCount === 0) {
        setEquippedFeed("");
        sessionStorage.setItem("equipped", "");
      }
      try {
        if (waitForServerResponse) {
          const response = await waitForServerResponse("feedAnimal", {
            animalID: targetAnimal.Animal_ID,
            foodType: feed,
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
      // cooldown
    }
  };

  // Collect produce function
  const handleCollect = async (Animal_ID, type) => {
    let animal = animalsParent.filter((a) => a.Animal_ID === Animal_ID)[0];
    if (!isUnlocked(animal.Animal_type)) {
      console.log("NOT UNLOCKED");
      return false;
    }
    let newAnimal = { ...animal };
    if (isCollectible(animal.Last_produce, type)) {
      newAnimal.Last_produce = Date.now();
      setCollectible((prevCollectible) => {
        return prevCollectible.map((a) => {
          if (a.Animal_ID === newAnimal.Animal_ID) {
            return {
              ...a,
              Last_produce: newAnimal.Last_produce,
              collectible: false,
            };
          }
          return a;
        });
      });
      setAnimalsParent((prevAnimals) => {
        return prevAnimals.map((a) => {
          if (a.Animal_ID === newAnimal.Animal_ID) {
            return newAnimal;
          }
          return a;
        });
      });

      let quantTableName;
      switch (CONSTANTS.AnimalTypes[type][0]) {
        case "barn":
          quantTableName = "AnimalProduceMap".concat(
            getUpgrades().barnCollectQuantityUpgrade,
          );
          break;
        case "coop":
          quantTableName = "AnimalProduceMap".concat(
            getUpgrades().coopCollectQuantityUpgrade,
          );
          break;
      }
      // FORCE REFRESH HERE
      if (getUpgrades().barnCollectQuantityUpgrade === undefined)
        quantTableName = "AnimalProduceMap0";

      let qty = UPGRADES[quantTableName][type][1];
      // Check random probability of extra
      let happiness = animal.Happiness,
        nextRandom = animal.Next_random;
      let probOfExtra = happiness > 1 ? 0.67 : happiness / 1.5;
      let inSeason = CONSTANTS.animalSeasons[getCurrentSeason()].includes(type);
      if (inSeason) {
        probOfExtra += 0.1
      }
      if (nextRandom < probOfExtra) {
        // extra produce bc of happiness
        qty += 1;
      }

      updateInventory(UPGRADES[quantTableName][type][0], qty);
      updateXP(CONSTANTS.XP[UPGRADES[quantTableName][type][0]]);

      try {
        if (waitForServerResponse) {
          const response = await waitForServerResponse("collect", {
            AnimalID: animal.Animal_ID,
          });
          let data = response.body;
          let finished = data.finishedOrder;
          if (finished) {
            setOrderNotice(true);
            if (orderTimer !== null) {
              clearTimeout(orderTimer);
            }
            let id = setTimeout(() => {
              setOrderNotice(false);
            }, 500);
            setOrderTimer(id);
          }
          setAnimalsParent((old) => {
            return old.map((a) => {
              if (a.Animal_ID === data.Animal_ID) {
                let updatedRandom = { ...a };
                updatedRandom.Next_random = data.Next_random;
                return updatedRandom;
              } else {
                return a;
              }
            });
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
    }
  };

  // Initialize all animals, with random positions
  const createAnimals = async () => {
    if (animalsParent.length === 0) {
      return;
    }
    let dbAnimals = animalsParent;

    // init animals state array to objects with ID, type, last collect
    let animalsState = [];
    let walkingState = [];
    let collectibleState = [];
    for (let i = 0; i < dbAnimals.length; ++i) {
      let toPushAnimal = { ...dbAnimals[i] };
      delete toPushAnimal.UserID;
      animalsState.push(toPushAnimal);

      walkingState.push({
        Animal_ID: dbAnimals[i].Animal_ID,
        walking: false,
        direction: Math.random() < 0.5 ? "left" : "right",
        eating: false,
      });

      // ms since epoch
      let sqlDate = dbAnimals[i].Last_produce;

      collectibleState.push({
        Animal_ID: dbAnimals[i].Animal_ID,
        Animal_type: dbAnimals[i].Animal_type,
        Last_produce: sqlDate,
        collectible: isCollectible(sqlDate, dbAnimals[i].Animal_type),
      });
    }

    // randomize the walking state
    walkingState = randomStarting(walkingState);

    setAnimalsParent(animalsState);
    setWalking(walkingState);
    setCollectible(collectibleState);

    // init walking state array to objects random starting coords, random direction, walking false
  };

  // Is this animal collectibel and ready to be collected?
  const isCollectible = (Last_produce, Animal_type) => {
    return timeUntilCollect(Last_produce, Animal_type) <= 0;
  };

  const timeUntilCollect = (Last_produce, Animal_type) => {
    if (
      Last_produce === null ||
      !(Animal_type in UPGRADES.AnimalCollectTimes0)
    ) {
      console.log("INVALID isCollectible inputs");
      return false;
    }

    let curTime = Date.now();
    let secsPassed = (curTime - Last_produce) / 1000 - 0.1;

    let inSeason = CONSTANTS.animalSeasons[getCurrentSeason()].includes(Animal_type);
    if (inSeason) {
      let boostPercent = CONSTANTS.VALUES.SEASON_ANIMAL_BUFF;
      let boostChange = 1 + boostPercent;
      secsPassed *= boostChange;
    }

    let level = isBarn
      ? getUpgrades().barnCollectTimeUpgrade
      : getUpgrades().coopCollectTimeUpgrade;
    let tableName = "AnimalCollectTimes".concat(level);
    if (tableName.includes("undefined")) tableName = "AnimalCollectTimes0";
    let secsNeeded = UPGRADES[tableName][Animal_type][0];

    if (townPerks.animalTimeLevel) {
      let boostPercent =
        TOWNSINFO.perkBoosts.animalTimeLevel[townPerks.animalTimeLevel - 1];
      let boostChange = 1 + boostPercent;
      secsPassed *= boostChange;
    }

    return secsNeeded - secsPassed;
  }

  // Generate random starting coords, takes array of animal objects
  const randomStarting = (walkingState) => {
    if (animalsParent?.message === "No auth token present") return {};
    let newCoords = [...walkingState];
    newCoords.forEach((a) => {
      a.coordinates = [-1, -1];
    });
    newCoords.forEach((a) => {
      let invalid = true;
      let pos = [0, 0];
      while (invalid) {
        pos = [
          Math.floor(Math.random() * xSlots) * animalWidth,
          Math.floor(Math.random() * ySlots) * animalHeight,
        ];
        invalid = newCoords.some(
          (c) => pos.toString() === c.coordinates.toString(),
        );
        // The following check is so that they are not on top of the management button
        if (isBarn) {
          if (pos[0] >= (xSlots - 1) * animalWidth && pos[1] === 0) {
            invalid = true;
          }
        } else {
          if (pos[0] === 0 && pos[1] === 0) {
            invalid = true;
          }
        }
      }
      a.coordinates = pos;

    });
    return newCoords;
  };

  const updateCollectible = () => {
    setCollectible((oldState) => {
      return oldState.map((a) => {
        if (a.collectible) {
          return a;
        }
        return {
          ...a,
          collectible: isCollectible(a.Last_produce, a.Animal_type),
        };
      });
    });
  };

  useEffect(() => {
    let interval;
    if (collectible) {
      interval = setInterval(updateCollectible, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [collectible]);

  useEffect(() => {
    updateCollectible();
  }, [animalsParent]);

  useEffect(() => {
    let interval;
    if (walking) {
      interval = isBarn
        ? setInterval(updateMovement, 4000)
        : setInterval(updateMovement, 3000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [walking]);

  const updateMovement = () => {
    if (animalsParent.length === 0) {
      return;
    }
    let random = Math.random();
    if (random < 0.75) {
      let updatedGraphicInfo;
      setWalking((prevWalking) => {
        let [newWalkingState, graphicInfo] = moveRandomAnimal(prevWalking);
        if (!newWalkingState || !graphicInfo) {
          return prevWalking;
        }
        updatedGraphicInfo = graphicInfo;
        return newWalkingState;
      });
      let timeoutID = setTimeout(() => {
        setWalking((prevWalking) => {
          return prevWalking.map((a) => {
            if (a.Animal_ID === updatedGraphicInfo.Animal_ID) {
              return {
                ...a,
                walking: false,
                eating: false,
                direction:
                  a.direction === "up" || a.direction === "down"
                    ? Math.random() < 0.5
                      ? "left"
                      : "right"
                    : a.direction,
              };
            }
            return a;
          });
        });
      }, 3000);
    }
  };

  const moveRandomAnimal = (curWalkingStates) => {
    if (curWalkingStates.length > 0) {
      let newWalkingStates = [...curWalkingStates];
      let index = Math.floor(Math.random() * curWalkingStates.length);
      // returns the new animals state and the graphic info (animal id, direction, and walking = true) for the moved one
      return randomAdjacentCoords(newWalkingStates, index);
    } else {
      return [curWalkingStates, null];
    }
  };

  const randomAdjacentCoords = (walkingStates, index) => {
    const newWalkingStates = [...walkingStates];
    let graphicInfo = {};
    let chosenAnimal = newWalkingStates[index];

    // do a random movement
    const takenCoords = [];
    newWalkingStates.forEach((a) => {
      if (a?.coordinates) {
        takenCoords.push(a.coordinates);
      }
    });
    graphicInfo = {
      Animal_ID: chosenAnimal.Animal_ID,
      direction: "left",
      walking: false,
      eating: false,
    };
    if (chosenAnimal?.coordinates) {
      let [x, y] = chosenAnimal.coordinates;
      const newOptions = [];
      if (x >= animalWidth) {
        newOptions.push([x - animalWidth, y]);
      }
      if (x < animalWidth * (xSlots - 1)) {
        newOptions.push([x + animalWidth, y]);
      }
      if (y >= animalHeight) {
        newOptions.push([x, y - animalHeight]);
      }
      if (y < animalHeight * (ySlots - 1)) {
        newOptions.push([x, y + animalHeight]);
      }
      while (newOptions.length > 0) {
        let index = Math.floor(Math.random() * newOptions.length);
        let pos = newOptions[index];
        let validCoords = !takenCoords.some((c) => c.toString() === pos.toString())
        if (isBarn) {
          if (pos[0] >= (xSlots - 1) * animalWidth && pos[1] === 0) {
            validCoords = false;
          }
        } else {
          if (pos[0] === 0 && pos[1] === 0) {
            validCoords = false;
          }
        }
        if (validCoords) {
          if (pos[0] > x) graphicInfo.direction = "right";
          if (pos[0] < x) graphicInfo.direction = "left";
          if (pos[1] > y) graphicInfo.direction = "down";
          if (pos[1] < y) graphicInfo.direction = "up";
          graphicInfo.walking = true;
          graphicInfo.eating = false;

          chosenAnimal.coordinates = pos;
          chosenAnimal.walking = true;
          chosenAnimal.direction = graphicInfo.direction;
          chosenAnimal.eating = false;
          break;
        }
        newOptions.splice(index, 1);
      }

      // walking state has updated coordinates, graphicInfo has the info about what specifically was just changed (ID, new direction, walking = true)
      return [newWalkingStates, graphicInfo];
    }
  };

  let [visible, setVisible] = useState("visible");

  document.addEventListener("visibilitychange", () => {
    setVisible(document.visibilityState);
  });

  return (
    <div
      style={{
        position: "absolute",
        display: "grid",
        gridTemplateColumns: `repeat(${xSlots}, 1fr)`,
        gridTemplateRows: `repeat(${ySlots}, 1fr)`,

        borderStyle: "solid",
        borderWidth: "10px",
        borderImage: `url(${process.env.PUBLIC_URL}/assets/images/fence.png) 45 repeat`,

        width: `calc(40% - 10px)`,
        height: `calc(90vh - 100px)`,
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
      }}
    >
      {animalsParent.map((animal) => {
        return (
          <CompAnimal
            key={animal.Animal_ID}
            Animal_ID={animal.Animal_ID}
            type={animal.Animal_type}
            name={animal.Name}
            lastFed={animal.Last_fed}
            walkingInfo={
              walking.filter((a) => a.Animal_ID === animal.Animal_ID)[0] || {}
            }
            collectible={
              collectible.filter((a) => a.Animal_ID === animal.Animal_ID)[0]
                ?.collectible || false
            }
            onCollect={handleCollect}
            onFeed={handleFeed}
            sizeWidth={`${animalWidth}px`}
            sizeHeight={`${animalHeight}px`}
            visible={visible}
            moreInfo={moreInfo}
            timeUntilCollect={timeUntilCollect(animal.Last_produce, animal.Animal_type)}
          />
        );
      })}
    </div>
  );
}

export default CompPen;
