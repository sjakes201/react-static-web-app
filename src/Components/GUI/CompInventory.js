import React, { useEffect, useState, useRef } from 'react';
import '../CSS/CompInventory.css'
import CONSTANTS from '../../CONSTANTS';
import ANIMALINFO from '../../ANIMALINFO';

const MULTIPLANTLEVEL = 25;
const MULTIHARVESTLEVEL = 25;

function CompInventory({ level, tool, setTool, fertilizers, items, displayOnly, setMarketSelected, isAnimalScreen, setEquippedFeed, showBottomBar, showFertilizer, setEquippedFert, equippedFert }) {

    //Tooltip code
    const [tip1, setTip1] = useState(false);
    const [tip2, setTip2] = useState(false);

    const ref1 = useRef();
    const ref2 = useRef();

    const handleMouseOver = (buttonNum) => {
        switch (buttonNum) {
            case 1:
                ref1.current = setTimeout(() => {
                    setTip1(true);
                }, 500);
                break;
            case 2:
                ref2.current = setTimeout(() => {
                    setTip2(true);
                }, 500);
                break;
        }
    };

    const handleMouseOut = (buttonNum) => {
        // clear timeout when mouse leaves
        switch (buttonNum) {
            case 1:
                clearTimeout(ref1.current);
                setTip1(false);
                break;
            case 2:
                clearTimeout(ref2.current);
                setTip2(false);
                break;
        }
    };


    const [selectedItem, setSelectedItem] = useState({
        name: '',
        quantity: 0,
        description: '',
        image: `${process.env.PUBLIC_URL}/assets/images/EMPTY.png`
    });

    // for equipped, from parent
    const [fertilizerMenu, setFerilizerMenu] = useState(false)
    // for which one to display info (not equal to parent, in case they re-open menu and have one equipped)
    const [fertInfo, setFertInfo] = useState("")

    useEffect(() => {
        if (items[selectedItem.name] === 0) {
            setSelectedItem({
                name: '',
                quantity: 0,
                description: '',
                image: `${process.env.PUBLIC_URL}/assets/images/EMPTY.png`
            })
            sessionStorage.setItem('equipped', '')
        }
    })

    const handleClick = (itemName) => {
        if (items[itemName]) {
            if (isAnimalScreen && (itemName in ANIMALINFO.FoodHappinessYields)) {
                sessionStorage.setItem("equipped", itemName);
                setEquippedFeed(itemName);
            } else if (isAnimalScreen) {
                setEquippedFeed('')
                sessionStorage.setItem('equipped', '')
            } else {
                sessionStorage.setItem("equipped", itemName);
            }

            if (setMarketSelected) setMarketSelected(itemName);
            setSelectedItem({
                name: itemName,
                quantity: items[itemName],
                description: CONSTANTS.InventoryDescriptions[itemName],
                image: `${process.env.PUBLIC_URL}/assets/images/${itemName}.png`
            });

            // If in animal screen, turn mouse into item for feeding


        } else {
            if (setMarketSelected) setMarketSelected("");
            sessionStorage.setItem("equipped", '');
            if (isAnimalScreen) setEquippedFeed('');
            setSelectedItem({
                name: '',
                quantity: 0,
                description: '',
                image: `${process.env.PUBLIC_URL}/assets/images/EMPTY.png`
            });
        }
        if (setEquippedFert) {
            setEquippedFert("");
            setFerilizerMenu(false)
        }
    }
    
    const toLoad = () => {
        let invItems = { ...items };
        if (displayOnly) {
            const keys = Object.keys(invItems);
            for (let i = 0; i < keys.length; ++i) {
                if (keys[i].includes("_seeds")) delete invItems[keys[i]];
            }
        }

        const customSort = (a, b) => {
            const aValue = invItems.hasOwnProperty(a) ? invItems[a] : -1;
            const bValue = invItems.hasOwnProperty(b) ? invItems[b] : -1;

            const hasQ = str => str.includes("Q");
            const hasSeeds = str => str.includes("_seeds");
            const hasUnderscore = str => str.includes("_");

            const getPriority = (str, val) => {
                if (val === 0) return 0;
                if (hasQ(str)) return 4;
                if (hasSeeds(str)) return 3;
                if (hasUnderscore(str)) return 2;
                return 1;
            };

            const aPriority = getPriority(a, aValue);
            const bPriority = getPriority(b, bValue);

            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            } else {
                return bValue - aValue;
            }
        };

        const sortedKeys = Object.keys(invItems).sort(customSort);
        const sortedObject = {};

        sortedKeys.forEach(key => {
            sortedObject[key] = invItems[key];
        });

        return Object.keys(sortedObject).flatMap((item, index) => {
            let totalSlots = [];
            let itemCount = sortedObject[item];
            while (itemCount > 1000) {
                totalSlots.push(
                    <div className={isAnimalScreen ? (item in ANIMALINFO.FoodHappinessYields && itemCount !== 0 ? 'item-slot is-feed' : 'item-slot') : "item-slot"} id={item.concat(itemCount)} key={`${item}+${itemCount}`} onClick={() => handleClick(item)}>
                        {itemCount ? (
                            <>
                                <img draggable={false} src={`${process.env.PUBLIC_URL}/assets/images/${item}.png`} alt={item} />
                                <ins className='count'>1000</ins>
                            </>
                        ) : (
                            <img src={`${process.env.PUBLIC_URL}/assets/images/EMPTY.png`} alt={"No item"} />
                        )}
                    </div>
                )
                itemCount -= 1000;
            }
            totalSlots.push(
                <div className={isAnimalScreen ? (item in ANIMALINFO.FoodHappinessYields && itemCount !== 0 ? 'item-slot is-feed' : 'item-slot') : "item-slot"} id={item} key={item} onClick={() => handleClick(item)}>
                    {itemCount ? (
                        <>
                            <img draggable={false} src={`${process.env.PUBLIC_URL}/assets/images/${item}.png`} alt={item} />
                            <ins className='count'>{itemCount}</ins>
                        </>
                    ) : (
                        <img src={`${process.env.PUBLIC_URL}/assets/images/EMPTY.png`} alt={"No item"} />
                    )}
                </div>
            )
            return totalSlots;
        });



    }
    if (displayOnly) {
        return (
            <div className='inventory-container'>
                <div className={`inventorySlots ${showBottomBar ? 'showBottomBar' : 'noBottomBar'}`}>
                    {
                        items && (<div id="display" className="items-grid">{toLoad()}</div>)
                    }
                </div>
            </div>
        )
    }

    const fertilizerGUI = () => {
        return (
            <div className='fertilizerMenu'>
                <span className='fertCloseX' onClick={() => { setFerilizerMenu(false); setFertInfo(""); }}>X</span>
                <div className='fertRow'>
                    <div className='fertilizerType' id='YieldsFertilizer'>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/YieldsFertilizer.png`}
                            onClick={() => { if (fertilizers.YieldsFertilizer > 0) { setEquippedFert('YieldsFertilizer'); setFerilizerMenu(false) } }}
                            onMouseEnter={() => setFertInfo('YieldsFertilizer')} onMouseLeave={() => setFertInfo("")} draggable={false} />
                        <p>x{fertilizers.YieldsFertilizer}</p>
                    </div>
                    <div className='fertilizerType' id='HarvestsFertilizer'>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/HarvestsFertilizer.png`}
                            onClick={() => { if (fertilizers.HarvestsFertilizer > 0) { setEquippedFert('HarvestsFertilizer'); setFerilizerMenu(false) } }}
                            onMouseEnter={() => setFertInfo('HarvestsFertilizer')} onMouseLeave={() => setFertInfo("")} draggable={false} />
                        <p>x{fertilizers.HarvestsFertilizer}</p>
                    </div>
                    <div className='fertilizerType' id='TimeFertilizer'>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/TimeFertilizer.png`}
                            onClick={() => { if (fertilizers.TimeFertilizer > 0) { setEquippedFert('TimeFertilizer'); setFerilizerMenu(false) } }}
                            onMouseEnter={() => setFertInfo('TimeFertilizer')} onMouseLeave={() => setFertInfo("")} draggable={false} />
                        <p>x{fertilizers.TimeFertilizer}</p>
                    </div>
                </div>
                {fertInfo !== '' && <p className='fertTextDescription'>
                    {CONSTANTS.fertilizerInfo[fertInfo]}
                </p>}
            </div>
        )
    }

    return (
        <div className={`inventory-container`}>
            <div className={`inventorySlots ${showBottomBar ? 'showBottomBar' : 'noBottomBar'}`}>
                <div className="selected-item-info">
                    <img src={selectedItem.image} alt={selectedItem.name} />
                    <summary>
                        <p>{selectedItem.description[0]}</p>
                        {/* <small>{selectedItem.description[1]}</small> */}
                    </summary>
                    {showFertilizer &&
                        <div className='toolSelect'>
                            {tool !== 'multiharvest' &&
                                <div className={`toolIcon${level < MULTIHARVESTLEVEL ? 'Disabled' : ''}`}>
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/multiharvest.png`}

                                        onClick={() => {
                                            if (level < MULTIHARVESTLEVEL) return;
                                            setTool("multiharvest")
                                        }}
                                        onMouseOver={() => handleMouseOver(1)}
                                        onMouseOut={() => handleMouseOut(1)} />
                                    {
                                        tip1 && <div className='toolTipInv'>
                                            Multiharvest {level < MULTIHARVESTLEVEL && '(Lvl 25)'}
                                        </div>
                                    }
                                </div>
                            }
                            {tool === 'multiharvest' &&
                                <img src={`${process.env.PUBLIC_URL}/assets/images/GUI/cancel.png`} className='toolIcon'
                                    onClick={() =>
                                        setTool("")
                                    } />
                            }
                            {tool !== 'multiplant' &&
                                <div className={`toolIcon${level < MULTIHARVESTLEVEL ? 'Disabled' : ''}`}>
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/multiplant.png`}

                                        onClick={() => {
                                            if (level < MULTIPLANTLEVEL) return;
                                            setTool("multiplant")
                                        }}
                                        onMouseOver={() => handleMouseOver(2)}
                                        onMouseOut={() => handleMouseOut(2)} />
                                    {
                                        tip2 && <div className='toolTipInv'>
                                            Multiplant {level < MULTIPLANTLEVEL && '(Lvl 25)'}
                                        </div>
                                    }
                                </div>
                            }
                            {tool === 'multiplant' &&
                                <img src={`${process.env.PUBLIC_URL}/assets/images/GUI/cancel.png`} className='toolIcon'
                                    onClick={() =>
                                        setTool("")
                                    } />
                            }
                        </div>}
                    {showFertilizer && equippedFert !== '' &&
                        <div className='dequipFertilizer'>
                            <img onClick={() => setEquippedFert('')} src={`${process.env.PUBLIC_URL}/assets/images/cancel.png`} />
                        </div>


                    }
                    {showFertilizer && equippedFert === '' &&
                        <div className='fertilizerButtonArea'>
                            <img className='fertilizerButton' src={`${process.env.PUBLIC_URL}/assets/images/fertilizerBlank.png`} onClick={() => setFerilizerMenu(true)} />
                        </div>
                    }

                    {fertilizerMenu &&
                        fertilizerGUI()
                    }

                </div>
                {
                    items && (<div className="items-grid">{toLoad()}</div>)
                }
            </div>
        </div >
    );
}

export default CompInventory;
