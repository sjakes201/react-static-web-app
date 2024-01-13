import React, { useContext, useState, useEffect } from 'react'
import { GameContext } from '../../GameContainer'
import BOOSTSINFO from '../../BOOSTSINFO'
import CONSTANTS from '../../CONSTANTS'
import TownBoostSlot from '../TownShop/TownBoostSlot'
import { useWebSocket } from '../../WebSocketContext'

function PbMenu({ closeMenu }) {
    const { activeBoosts, setActiveBoosts, pBInventory, setPBInventory } = useContext(GameContext)
    const { waitForServerResponse } = useWebSocket();

    const [activePB, setActivePB] = useState([])
    const [activeTB, setActiveTB] = useState([])

    useEffect(() => {
        let pb = [], tb = []
        activeBoosts.forEach((boost) => {
            if (boost.Source === "Player") {
                pb.push(boost)
            } else if (boost.Source === "Town") {
                tb.push(boost)
            }
        })
        setActivePB(pb);
        setActiveTB(tb);
    }, [activeBoosts])

    const boostText = (boostName, boostContext, startTime, duration) => {
        const getTimeString = (msRemaining) => {
            const minutes = Math.ceil(msRemaining / 60000);
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;

            let timeString = '';

            if (hours > 0) {
                timeString += `${hours}h`;
            }

            if (remainingMinutes > 0) {
                // Add a space only if there are hours in the time string
                timeString += (hours > 0 ? ' ' : '') + `${remainingMinutes}m`;
            }

            return timeString || '0m'; // Return '0m' if input is 0
        };  

        let timeString = getTimeString((Number(duration) + Number(startTime)) - Date.now())


        if (boostContext === "town") {
            let boostInfo = BOOSTSINFO.townBoostsInfo[boostName]
            let boostSplit = boostName.split("_")
            let target = boostSplit[0]?.toLowerCase();
            let boostText = '';
            if (boostInfo.type === 'QTY') {
                boostText += `+(${boostInfo.qty} /harvest)`
            } else if (boostInfo.type === "TIME") {
                boostText += `(+${boostInfo.boostPercent * 100}% growth rate)`
            }
            return <p>{CONSTANTS.InventoryDescriptions[target][0]} <span style={{ color: 'green' }}>{boostText} <span style={{ color: 'gray' }}>({timeString})</span></span></p>
        } else {
            let boostInfo = BOOSTSINFO[boostName];
            let boostText = `${BOOSTSINFO[boostName].name}`
            let boostEffect = '';
            if (boostInfo.type === 'QTY') {
                boostEffect += ' (all qtys)'
            } else {
                boostEffect += ` (+${boostInfo.boostPercent * 100}%)`
            }
            return <p>{boostText} <span style={{ color: 'green' }}>{boostEffect} <span style={{ color: 'gray' }}>({timeString})</span></span></p>
        }
    }
    const [selectedBoost, setSelectedBoost] = useState(null)

    const getBoostInventory = () => {
        // Array of [boostName, count of this boost type owned]
        let invCounts = {};
        pBInventory.forEach((boost) => {
            if (invCounts[boost.BoostName]) {
                invCounts[boost.BoostName] += 1
            } else {
                invCounts[boost.BoostName] = 1
            }
        })

        const boostInvSlot = (boostName, count) => {
            return <div style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '8vh'
            }}>
                <TownBoostSlot
                    boostName={boostName} active={false} setSelected={(boostName) => { setSelectedBoost(boostName) }}
                    boostContext='player' width='100%' height='6vh' fontSize='2vh' display={true} />
            </div>
        }

        const activateBoost = async (boostName) => {
            let boostObj = pBInventory.find((boost) => boost.BoostName === boostName)
            if (!boostObj) return;
            let boostID = boostObj.BoostID
            if (waitForServerResponse) {
                let res = await waitForServerResponse('activatePlayerBoost', { boostID: boostID })
                console.log(res)
                setPBInventory((old) => old.filter((boost) => boost.BoostID !== boostID))
                let activeBoostObj = boostObj;
                activeBoostObj.StartTime = res.body.activeTime
                setActiveBoosts((old) => [...old, activeBoostObj])
            }
        }

        return <div style={{
            border: '1px solid gray', width: '100%', position: 'relative',
            display: 'flex', flexDirection: 'row'
        }}>
            <div style={{
                width: "50%", display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
                alignItems: 'flex-start', overflowY: 'auto', maxHeight: '20vh', gap: '0.6vh', borderRight: '1px solid black',
                padding: '0.5vw 0.5vw 1vw 0.5vw'
            }}>
                {Object.keys(invCounts).map((boostName) => boostInvSlot(boostName, invCounts[boostName]))}
            </div>
            <div style={{
                height: '100%', width: '50%', padding: '1vw'
            }}>
                {selectedBoost && <>
                    <p><u>{BOOSTSINFO[selectedBoost]?.name}</u></p>
                    <p>Count: {invCounts[selectedBoost]}</p>
                    <p style={{ fontSize: '0.8vw' }}>{BOOSTSINFO[selectedBoost]?.info}</p>
                    <button
                        onClick={() => activateBoost(selectedBoost)}
                        style={{
                            backgroundColor: 'var(--menu_lighter)', padding: '0.15vw', margin: '0.7vh 20% 0 20%', width: '60%', cursor: 'pointer'
                        }}>Activate</button>
                </>}
                {!selectedBoost &&
                    <p style={{ width: '100%', height: '100%', color: 'gray', fontStyle: 'italic' }}>Select a boost to view details</p>
                }
            </div>
        </div>
    }

    return <div style={{
        position: 'absolute',
        border: '1px solid black',
        backgroundColor: 'white',
        width: "25vw",
        zIndex: '50',
        right: '0.5vw',
        top: '0.5vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '1vw',
        fontSize: '0.9vw',
        gap: '2vh',
    }}>
        <span
            style={{
                position: 'absolute',
                right: '0.6vw',
                top: '0.5vw',
                cursor: 'pointer',
                fontSize: '0.9vw'
            }}
            onClick={(e) => closeMenu(e)}
        >
            X
        </span>
        <p>View and enable your farm-wide boosts:</p>
        <div style={{ width: '100%' }}>
            {(activePB.length === 0 && activeTB.length === 0) &&
                <i style={{ color: 'lightgray' }}>
                    No active boosts
                </i>}
            {activePB.length > 0 && <div >
                <p style={{ width: '100%', textAlign: 'left' }}><u>Player Boosts</u></p>
                <div style={{ color: 'rgb(60, 60, 60)', fontStyle: 'italic', maxHeight: '8vh', overflowY: 'auto' }}>
                    {activePB.map((boost) => {
                        return boostText(boost.BoostName, "player", boost.StartTime, boost.Duration)
                    })}
                </div>
            </div>}
            {activeTB.length > 0 && <div>
                <p style={{ width: '100%', textAlign: 'left' }}><u>Town Boosts</u></p>
                <div style={{ color: 'rgb(60, 60, 60)', fontStyle: 'italic', maxHeight: '8vh', overflowY: 'auto' }}>
                    {activeTB.map((boost) => {
                        return boostText(boost.BoostName, "town", boost.StartTime, boost.Duration)
                    })}
                </div>
            </div>}
        </div>
        <div style={{ width: '100%' }}>
            <p style={{ width: '100%', textAlign: 'left' }}><u>Boosts Inventory:</u></p>
            {pBInventory.length === 0 && <i style={{ color: 'lightgray' }}>
                No unused boosts</i>}
            {pBInventory.length > 0 && <div>
                {getBoostInventory()}
            </div>}
        </div>

    </div>
}

export default PbMenu