import MACHINESINFO from '../../MACHINESINFO';
import '../CSS/MachineUnit.css'
import React, { useState, useEffect } from 'react';

function MachineUnit({ setItems, items, machineNum, machineInfo, buyMachine, startMachine, collectMachine, cancelMachine }) {


    // total info is constants machine type info
    let totalInfo = MACHINESINFO[`${MACHINESINFO.machineTypeFromIDS[machineInfo.ID]}MachineInfo`]
    let tierInfo = totalInfo?.[`tier${machineInfo.level}`]

    let timeRemainingSecs = Math.ceil((tierInfo?.timeInMs / 1000) - ((Date.now() - machineInfo?.startTime) / 1000));


    // Running means there's produce in it, done means the timer is done
    const [machineRunning, setRunning] = useState(machineInfo.startTime !== -1)
    const [machineDone, setDone] = useState(timeRemainingSecs <= 0)

    const [buildGUI, setBuildGUI] = useState(false)
    const [mainGUI, setMainGUI] = useState(false)
    const [selectedBuild, setSelectedBuild] = useState("")

    const [ingredients, setIngredients] = useState({})

    let widthA = '50%';
    let widthB = '65%';

    switch (machineInfo.level) {
        case 1:
            widthA = '35%';
            widthB = '50%';
            break;
        case 2:
            widthA = '45%';
            widthB = '60%';
            break;
        case 3:
            widthA = '55%';
            widthB = '70%';
            break;
    }

    useEffect(() => {
        setWidth(widthA)
        if (![0, 1, 2].includes(machineInfo.ID)) {
            return
        }
        let validInputsArray = totalInfo?.validInputs;
        let initIngredients = {}
        for (let i = 0; i < validInputsArray.length; ++i) {
            initIngredients[validInputsArray[i]] = 0;
        }
        setIngredients(initIngredients);

        let interval = setTimeout(() => {
            setDone(true);
        }, timeRemainingSecs * 1000)
        return () => {
            clearTimeout(interval);
        }
    }, [machineInfo])



    const [width, setWidth] = useState(widthA);

    useEffect(() => {
        setRunning(machineInfo.startTime !== -1)
    })

    // timer for when running but not done
    useEffect(() => {
        if (!machineDone) {
            let changeWidth = () => {
                setWidth((old) => {
                    if (old === widthA) {
                        return widthB
                    } else {
                        return widthA;
                    }
                })
            }
            changeWidth()
            let interval = setInterval(() => {
                changeWidth()
            }, 1000);
            return () => {
                clearInterval(interval);
                setWidth(widthA);
            }
        }
    }, [machineRunning, machineDone])

    const getImg = (typeID, level, isRunning) => {
        if ([0, 1, 2].includes(typeID)) {
            return (
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/machines/${MACHINESINFO.machineTypeFromIDS[typeID]}_t${level}_${isRunning ? 'running' : 'idle'}.png`}
                    alt='machine'
                    style={{
                        width: width,
                        cursor: 'pointer',
                        transition: 'width 1s linear, height 1s linear',
                    }}
                    onClick={() => setMainGUI(true)}
                    draggable={false}
                />
            )
        }
        return (
            <img
                src={`${process.env.PUBLIC_URL}/assets/images/machines/empty_slot.png`}
                alt='empty-machine-slot'
                className='machineBuildButton'
                onClick={() => setBuildGUI(true)}
                draggable={false}
            />
        )
    }

    const createMainGUI = () => {
        let validInputsArray = totalInfo?.validInputs;
        let nextTierCosts = MACHINESINFO[`${MACHINESINFO.machineTypeFromIDS[machineInfo.ID]}MachineCost`]?.[`tier${machineInfo.level + 1}`];
        return (
            validInputsArray !== undefined &&
            <div
                id='machineMainGUI'
                className='machineGUIDefault'
            >
                <div className='machineCloseX' onClick={() => setMainGUI(false)}>X</div>
                <div style={{
                    width: '50%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: '5%',
                }}>
                    <div style={{ textDecoration: 'underline', width: '90%', height: '10%' }}>Insert Produce</div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '90%', height: '80%' }}>
                        {validInputsArray.map((good) => {
                            // row per good with increment and decrement
                            return (
                                <div key={good} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '90%', height: `20%` }}>
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/${good}.png`} style={{ width: '40%', maxHeight: '100%', objectFit: 'contain' }} />
                                    <span style={{ marginRight: '5%' }}> x </span>
                                    <span style={{ margin: '0 3%' }}> {ingredients[good]}</span>
                                    <button className='machineQuantityButtonA'
                                        onClick={() => {
                                            setIngredients((old) => {
                                                let newIngredients = { ...old };
                                                let sum = 0;
                                                Object.keys(newIngredients).forEach((e) => sum += newIngredients[e]);
                                                if (items[good] > newIngredients[good] && sum < tierInfo.capacity) {
                                                    newIngredients[good] += 1;
                                                }
                                                return newIngredients
                                            })
                                        }}>
                                        +
                                    </button>
                                    <button className='machineQuantityButtonB'
                                        onClick={() => {
                                            setIngredients((old) => {
                                                let newIngredients = { ...old };
                                                if (newIngredients[good] > 0) {
                                                    newIngredients[good] -= 1;
                                                }
                                                return newIngredients
                                            })
                                        }}>
                                        -
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                    <button
                        className='machineButtonC'
                        onClick={() => {
                            let totalProduce = 0;
                            let ingredientsKeys = Object.keys(ingredients);
                            ingredientsKeys.forEach((e) => { totalProduce += ingredients[e] })
                            if (totalProduce > 0) {
                                setRunning(true)
                                setDone(false)
                                startMachine(machineNum, machineInfo.ID, ingredients);
                                setItems((old) => {
                                    let newItems = { ...old };
                                    ingredientsKeys.forEach((e) => { newItems[e] -= ingredients[e] })
                                    return newItems
                                })
                                setMainGUI(false)
                            }
                        }}
                    >Start</button>
                </div>
                <div className='machineRightColumn'>
                    <div className='machineStats'>
                        <div className='machineGUILabel'>Stats:</div>
                        <div>Capacity: {tierInfo.capacity}</div>
                        <div>Time: {Math.ceil(tierInfo.timeInMs * (1 / 1000) * (1 / 60))} {Math.ceil(tierInfo.timeInMs * (1 / 1000) * (1 / 60)) === 1 ? 'minute' : 'minutes'}</div>
                    </div>
                    {machineInfo.level === 3 &&
                        <div className='maxedMachineText'>
                            <p>Machine is</p>
                            <p>highest tier</p>
                        </div>
                    }
                    {machineInfo.level !== 3 &&
                        <div className='normalMachineText'>
                            <div className='machineGUILabel'>Upgrade:</div>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div className='costColumn'>
                                    <p className='costRow'>
                                        <span>$</span>
                                        : {nextTierCosts.Money}
                                    </p>
                                    <p className='costRow'>
                                        <img src={`${process.env.PUBLIC_URL}/assets/images/Gears.png`} className='costIconW' />
                                        : {nextTierCosts.Gears}
                                    </p>
                                </div>
                                <div className='costColumn'>
                                    <p className='costRow'>
                                        <img src={`${process.env.PUBLIC_URL}/assets/images/MetalSheets.png`} className='costIconW' />
                                        : {nextTierCosts.MetalSheets}
                                    </p>
                                    <p className='costRow'>
                                        <img src={`${process.env.PUBLIC_URL}/assets/images/Bolts.png`} className='costIconW' />
                                        : {nextTierCosts.Bolts}
                                    </p>
                                </div>
                            </div>
                            <div
                                style={{ width: '100%', textAlign: 'center' }}
                                onClick={() => {
                                    let typeName = MACHINESINFO.machineTypeFromIDS[machineInfo.ID];
                                    let nextTier = machineInfo.level + 1;
                                    buyMachine(typeName, machineNum, nextTier);
                                    setMainGUI(false)
                                }}
                            >
                                <button className='machineButtonD'>UPGRADE</button>
                            </div>
                        </div>
                    }

                </div>
            </div >
        )
    }

    const createBuildGUI = () => {
        return (<div id='buildGUI' className='machineGUIDefault'>
            <div
                className='machineCloseX'
                onClick={() => { setBuildGUI(false); setSelectedBuild("") }}>X</div>
            <div style={{
                width: '50%',
                fontSize: '1.1vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                <button className='machineButtonA' onClick={() => setSelectedBuild('cheese')}>CHEESE</button>
                <button className='machineButtonA' onClick={() => setSelectedBuild('mayonnaise')}>MAYONNAISE</button>
                <button className='machineButtonA' onClick={() => setSelectedBuild('cloth')}>CLOTH</button>
            </div>
            <div style={{
                width: '50%'
            }}>
                <div style={{ width: '100%', height: '50%', textAlign: 'center' }}>
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/${selectedBuild === '' ? 'EMPTY.png' : `machines/${selectedBuild}_t1_idle.png`}`}
                        alt='machine'
                        style={{
                            height: '100%',
                            maxWidth: '100%'
                        }}
                    />
                </div>

                <div style={{ width: '100%', height: '30%' }}>
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', }}>
                        <div className='costColumn'>
                            <p className='costRow'>
                                <span>$</span>
                                : {selectedBuild === '' ? '...' : MACHINESINFO[`${selectedBuild}MachineCost`][`tier1`].Money}
                            </p>
                            <p className='costRow'>
                                <img src={`${process.env.PUBLIC_URL}/assets/images/Gears.png`} className='costIconH' />
                                : {selectedBuild === '' ? '...' : MACHINESINFO[`${selectedBuild}MachineCost`][`tier1`].Gears}
                            </p>
                        </div>
                        <div className='costColumn'>
                            <p className='costRow'>
                                <img src={`${process.env.PUBLIC_URL}/assets/images/MetalSheets.png`} className='costIconH' />
                                : {selectedBuild === '' ? '...' : MACHINESINFO[`${selectedBuild}MachineCost`][`tier1`].MetalSheets}
                            </p>
                            <p className='costRow'>
                                <img src={`${process.env.PUBLIC_URL}/assets/images/Bolts.png`} className='costIconH' />
                                : {selectedBuild === '' ? '...' : MACHINESINFO[`${selectedBuild}MachineCost`][`tier1`].Bolts}
                            </p>
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%', height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button
                        className='machineButtonB'
                        onClick={() => {
                            buyMachine(selectedBuild, machineNum, 1);
                            setBuildGUI(false);
                        }}>BUILD</button>
                </div>
            </div>

        </div>)
    }

    const createRunningGUI = () => {
        let timePassedSeconds = (Date.now() - machineInfo.startTime) / 1000
        let timeNeededSeconds = tierInfo.timeInMs / 1000;
        let timeRemainingSeconds = timeNeededSeconds - timePassedSeconds;
        let timeRemainingMins = Math.ceil(timeRemainingSeconds / 60);
        let nextTierCosts = MACHINESINFO[`${MACHINESINFO.machineTypeFromIDS[machineInfo.ID]}MachineCost`]?.[`tier${machineInfo.level + 1}`];
        return (
            <div className='runningGUI machineGUIDefault'>
                <div
                    className='machineCloseX'
                    onClick={() => { setMainGUI(false); setSelectedBuild("") }}>X</div>
                <div className='machineGUIColumn'>
                    <div className='machineRunningInfo'>
                        <p className='underline'>Time remaining:</p>
                        <div> {timeRemainingMins <= 0 ? 'DONE' : `${timeRemainingMins} mins`}</div>
                        <p className='underline'>{timeRemainingMins > 0 ? 'Processing:' : 'Processed:'}</p>
                        <div className='processingRow'>
                            {machineInfo.produceReceived}
                            <img src={`${process.env.PUBLIC_URL}/assets/images/${MACHINESINFO.machineTypeFromIDS[machineInfo.ID]}Q0.png`} className='processedIcon' />
                        </div>
                        <br />
                        {timeRemainingMins > 0 &&
                            <div className='cancelMachine'>
                                <button
                                    onClick={() => {
                                        cancelMachine(machineNum);
                                        setMainGUI(false);
                                    }}
                                    className='machineButtonD'
                                >CANCEL</button>
                                <small className='machineCancelInfo'>*Produce will not be refunded</small>
                            </div>
                        }
                        {timeRemainingMins <= 0 &&
                            <div>
                                <button
                                    className='machineButtonD'
                                    onClick={() => {
                                        collectMachine(machineNum)
                                        setMainGUI(false)
                                    }}>
                                    COLLECT
                                </button>
                            </div>
                        }
                    </div>
                </div>
                <div className='machineGUIColumn'>
                    <div className='machineStats'>
                        <div className='machineGUILabel'>Stats:</div>
                        <div className='capacityRow'>Capacity: {tierInfo.capacity} </div>
                        <div>Time: {Math.ceil(tierInfo.timeInMs * (1 / 1000) * (1 / 60))} {Math.ceil(tierInfo.timeInMs * (1 / 1000) * (1 / 60)) === 1 ? 'minute' : 'minutes'}</div>
                    </div>
                    {machineInfo.level === 3 &&
                        <div className='maxedMachineText'>
                            <p>Machine is</p>
                            <p>highest tier</p>
                        </div>
                    }
                    {machineInfo.level !== 3 &&
                        <div className={`normalMachineText ${machineRunning ? 'isRunningUpgrade' : ''}`}>
                            <div className='machineGUILabel'>Upgrade:</div>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div className='costColumn'>
                                    <p className='costRow'>
                                        <span>$</span>
                                        : {nextTierCosts.Money}
                                    </p>
                                    <p className='costRow'>
                                        <img src={`${process.env.PUBLIC_URL}/assets/images/Gears.png`} className='costIconW' />
                                        : {nextTierCosts.Gears}
                                    </p>
                                </div>
                                <div className='costColumn'>
                                    <p className='costRow'>
                                        <img src={`${process.env.PUBLIC_URL}/assets/images/MetalSheets.png`} className='costIconW' />
                                        : {nextTierCosts.MetalSheets}
                                    </p>
                                    <p className='costRow'>
                                        <img src={`${process.env.PUBLIC_URL}/assets/images/Bolts.png`} className='costIconW' />
                                        : {nextTierCosts.Bolts}
                                    </p>
                                </div>
                            </div>
                            <div
                                style={{ width: '100%', textAlign: 'center' }}

                            ><button className={`machineButtonD ${machineRunning ? 'isRunningUpgrade' : ''}`}>UPGRADE</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {(mainGUI && machineInfo.startTime === -1) &&
                createMainGUI()
            }
            {(mainGUI && machineInfo.startTime !== -1) &&
                createRunningGUI()
            }
            {buildGUI &&
                createBuildGUI()
            }
            {getImg(machineInfo.ID, machineInfo.level, machineRunning)}
        </div>
    )
}

export default MachineUnit;