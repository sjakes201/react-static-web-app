import React, { useEffect, useState, useRef } from 'react'
import CompAnimal from './CompAnimal';
import CONSTANTS from '../../CONSTANTS';
import UPGRADES from '../../UPGRADES';

// Should we stop CompPen from rerendering everything when individual animals update? I think that happens automatically 

function CompPen({ importedAnimals, passedUpgrades, penWidth, penHeight, className, isBarn, updateInventory, updateXP, getXP }) {
    let xSlots = 6;
    let ySlots = 9;
    let animalWidth = Math.round(penWidth / xSlots);
    let animalHeight = Math.round(penHeight / ySlots);

    // basic animal info (id, type, lastCollect from database fetch)
    const [animals, setAnimals] = useState([]);

    // whether it's collectible or not
    const [collectible, setCollectible] = useState([]);

    // coordinates, walking and direction
    const [walking, setWalking] = useState([]);

    const [hasExotic, setHasExotic] = useState(false);
    const [xp, setXP] = useState(0);

    useEffect(() => {
        if (Object.keys(passedUpgrades).length !== 0) {
            setXP(getXP())
            setHasExotic(passedUpgrades.exoticPermit)
        }
    })

    useEffect(() => {
        createAnimals();
    }, [importedAnimals])

    // can you collect on this animal?
    const isUnlocked = (name) => {
        let xpNeeded = Object.keys(CONSTANTS.Levels).filter((threshold) => CONSTANTS.Levels[threshold].includes(name) ? true : false)
        let permitNeeded = CONSTANTS.Permits.exoticAnimals.includes(name);
        if (parseInt(xpNeeded[0]) > xp) {
            return false;
        }
        if (permitNeeded && !hasExotic) {
            return false;
        }
        return true;

    }


    const handleCollect = async (Animal_ID, type) => {
        let animal = animals.filter((a) => a.Animal_ID === Animal_ID)[0];
        if (!isUnlocked(animal.Animal_type)) {
            console.log("NOT UNLOCKED");
            return false;
        }
        let newAnimal = { ...animal }
        if (isCollectible(animal.Last_produce, type)) {
            newAnimal.Last_produce = Date.now();
            setCollectible((prevCollectible) => {
                return prevCollectible.map((a) => {
                    if (a.Animal_ID === newAnimal.Animal_ID) {
                        return {
                            ...a,
                            Last_produce: newAnimal.Last_produce,
                            collectible: false
                        };
                    }
                    return a;
                })
            })
            setAnimals((prevAnimals) => {
                return prevAnimals.map((a) => {
                    if (a.Animal_ID === newAnimal.Animal_ID) {
                        return newAnimal;
                    }
                    return a;
                })
            })

            let quantTableName;
            switch (CONSTANTS.AnimalTypes[type][0]) {
                case 'barn':
                    quantTableName = "AnimalProduceMap".concat(passedUpgrades.barnCollectQuantityUpgrade);
                    break;
                case 'coop':
                    quantTableName = "AnimalProduceMap".concat(passedUpgrades.coopCollectQuantityUpgrade);
                    break;
            }
            console.log(`quantTableName: ${quantTableName}`);
            console.log(`type: ${type}`)
            updateInventory(UPGRADES[quantTableName][type][0], UPGRADES[quantTableName][type][1])
            updateXP(CONSTANTS.XP[UPGRADES[quantTableName][type][0]]);
            const token = localStorage.getItem('token');
            let res = await fetch('https://farm-api.azurewebsites.net/api/collect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    AnimalID: animal.Animal_ID
                })
            });

        } else {
        }
    }


    // fetch all animals and initialize
    const createAnimals = async () => {
        if (importedAnimals.length === 0) {
            console.log("Waiting to receive animals");
            return;
        } else {
            console.log("received!");
            console.log(importedAnimals)
        }
        let dbAnimals = importedAnimals;

        // init animals state array to objects with ID, type, last collect
        let animalsState = [];
        let walkingState = [];
        let collectibleState = [];
        for (let i = 0; i < dbAnimals.length; ++i) {
            let toPushAnimal = { ...dbAnimals[i] }
            delete toPushAnimal.UserID;
            animalsState.push(toPushAnimal);

            walkingState.push({
                Animal_ID: dbAnimals[i].Animal_ID,
                walking: false,
                direction: Math.random() < 0.5 ? 'left' : 'right',
                eating: false,
            })

            // ms since epoch
            let sqlDate = dbAnimals[i].Last_produce;

            collectibleState.push({
                Animal_ID: dbAnimals[i].Animal_ID,
                Animal_type: dbAnimals[i].Animal_type,
                Last_produce: sqlDate,
                collectible: isCollectible(sqlDate, dbAnimals[i].Animal_type)
            })

        }
        walkingState = randomStarting(walkingState);;

        setAnimals(animalsState);
        setWalking(walkingState);
        setCollectible(collectibleState);

        // init walking state array to objects random starting coords, random direction, walking false
    }

    const isCollectible = (Last_produce, Animal_type) => {
        // TODO: Need to update for upgrade collect times
        if (Last_produce === null || !(Animal_type in UPGRADES.AnimalCollectTimes0)) { console.log("INVALID isCollectible inputs"); return false; }

        let curTime = Date.now()
        let secsPassed = ((curTime - Last_produce) / 1000) - 0.2;

        let level = isBarn ? (passedUpgrades.barnCollectTimeUpgrade) : (passedUpgrades.coopCollectTimeUpgrade)
        let tableName = "AnimalCollectTimes".concat(level)
        if (tableName.includes('undefined')) tableName = 'AnimalCollectTimes0';
        let secsNeeded = UPGRADES[tableName][Animal_type];
        return secsPassed >= secsNeeded
    }

    const randomStarting = (walkingState) => {
        if (animals?.message === "No auth token present") return {};
        let newCoords = [...walkingState];
        newCoords.forEach((a) => {
            a.coordinates = [-1, -1]
        });
        newCoords.forEach((a) => {
            let invalid = true;
            let pos = [0, 0];
            while (invalid) {
                pos = [((Math.floor(Math.random() * xSlots)) * animalWidth), ((Math.floor(Math.random() * ySlots)) * animalHeight)];
                invalid = newCoords.some((c) => pos.toString() === c.coordinates.toString());
            }
            a.coordinates = pos;
        })
        return newCoords;
    }

    const updateCollectible = () => {
        setCollectible((oldState) => {
            return oldState.map((a) => {
                if (a.collectible) {
                    return a;
                }
                return {
                    ...a,
                    collectible: isCollectible(a.Last_produce, a.Animal_type)
                }
            })
        })
    }

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
        updateCollectible()
    }, [animals])

    useEffect(() => {
        let interval;
        if (walking) {
            interval = isBarn ? setInterval(updateMovement, 4000) : setInterval(updateMovement, 3000);

        }
        return () => {
            clearInterval(interval);
        };
    }, [walking]);

    const updateMovement = () => {
        if(importedAnimals.length === 0) {
            return
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
            })
            let timeoutID = setTimeout(() => {
                setWalking((prevWalking) => {
                    return prevWalking.map((a) => {
                        if (a.Animal_ID === updatedGraphicInfo.Animal_ID) {
                            return {
                                ...a,
                                walking: false,
                                eating: false,
                                direction: (a.direction === 'up' || a.direction === 'down') ? (Math.random() < 0.5 ? 'left' : 'right') : a.direction
                            }
                        }
                        return a;
                    })
                })
            }, 3000);

        }
    }


    const moveRandomAnimal = (curWalkingStates) => {
        if (curWalkingStates.length > 0) {
            let newWalkingStates = [...curWalkingStates];
            let index = Math.floor(Math.random() * curWalkingStates.length)
            // returns the new animals state and the graphic info (animal id, direction, and walking = true) for the moved one
            return randomAdjacentCoords(newWalkingStates, index);
        } else {
            return [curWalkingStates, null];
        }
    }

    // 50% random walking, 50% random eating
    const randomAdjacentCoords = (walkingStates, index) => {
        const newWalkingStates = [...walkingStates];
        let graphicInfo = {};
        let chosenAnimal = newWalkingStates[index];
        if (true) {
            // NO LONGER DOING EATING
            // do a random movement
            const takenCoords = [];
            newWalkingStates.forEach((a) => {
                if (a?.coordinates) {
                    takenCoords.push(a.coordinates);
                }
            })
            graphicInfo = {
                Animal_ID: chosenAnimal.Animal_ID,
                direction: 'left',
                walking: false,
                eating: false
            };
            if (chosenAnimal?.coordinates) {
                let [x, y] = chosenAnimal.coordinates;
                const newOptions = [];
                if (x >= animalWidth) { newOptions.push([x - animalWidth, y]); }
                if (x < animalWidth * (xSlots - 1)) { newOptions.push([x + animalWidth, y]); }
                if (y >= animalHeight) { newOptions.push([x, y - animalHeight]); }
                if (y < animalHeight * (ySlots - 1)) { newOptions.push([x, y + animalHeight]); }
                while (newOptions.length > 0) {
                    let index = Math.floor(Math.random() * (newOptions.length))
                    let pos = newOptions[index];
                    if (!(takenCoords.some((c) => c.toString() === pos.toString()))) {
                        if (pos[0] > x) graphicInfo.direction = 'right';
                        if (pos[0] < x) graphicInfo.direction = 'left';
                        if (pos[1] > y) graphicInfo.direction = 'down';
                        if (pos[1] < y) graphicInfo.direction = 'up';
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

                // walking state has updated coordinates, graphicInfo has the info about what was just changed (ID, new direction, walking = true)
                return [newWalkingStates, graphicInfo];
            }
        }
    }

    return (
        <div className={className} style={{
            position: 'absolute',
            display: 'grid',
            gridTemplateColumns: `repeat(${xSlots}, 1fr)`,
            gridTemplateRows: `repeat(${ySlots}, 1fr)`,
            border: '1px solid black',

            backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/grass1.png), url(${process.env.PUBLIC_URL}/assets/images/grass2.png`,
            backgroundRepeat: 'repeat, repeat',

            width: `40vw`,
            height: `80vh`,
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            userSelect: "none",
        }}>
            {animals.map((animal) => {
                return <CompAnimal
                    key={animal.Animal_ID}
                    Animal_ID={animal.Animal_ID}
                    type={animal.Animal_type}
                    walkingInfo={
                        (walking.filter((a) => a.Animal_ID === animal.Animal_ID)[0] || {})
                    }
                    collectible={
                        (collectible.filter((a) => a.Animal_ID === animal.Animal_ID)[0]?.collectible || false)
                    }
                    onCollect={handleCollect}
                    sizeWidth={`${animalWidth}px`}
                    sizeHeight={`${animalHeight}px`}
                />
            })}
        </div>
    )
}

export default CompPen;