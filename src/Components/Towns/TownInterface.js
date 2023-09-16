import React, { useEffect, useState } from 'react'
import './TownInterface.css'
import PlayerCard from './PlayerCard';
import { useWebSocket } from "../../WebSocketContext";
import TOWNSINFO from '../../TOWNSINFO';
import TownGoals from './TownGoals';

// townName is string for town name, backArrow is optional function to be called when back arrow pressed
function TownInterface({ townName, backArrow }) {

    const { waitForServerResponse } = useWebSocket();

    // Which screen to show ("MAIN" or "GOALS")
    const [townScreen, setTownScreen] = useState("MAIN")

    /* The townInfo query will return data based on who requested it */
    const [townInfo, setTownInfo] = useState({})
    // GUI useStates
    const [perksPopup, setPerksPopup] = useState(false);

    // Settings GUI useStates and data for submit
    const [settingsGUI, setSettingsGUI] = useState(false);
    const [settingsData, setSettingsData] = useState({ description: "default text", logoNum: 0, status: "CLOSED" })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettingsData({
            ...settingsData,
            [name]: value,
        });
    };

    const setTownDetails = async (e) => {
        e.preventDefault();
        if (waitForServerResponse) {
            let response = await waitForServerResponse('setTownDetails', { newData: settingsData });
            setTownInfo((old) => {
                let newInfo = { ...old };
                newInfo.description = settingsData.description;
                newInfo.townLogoNum = settingsData.logoNum;
                newInfo.status = settingsData.status;
                return newInfo;
            })
            setSettingsGUI(false);
        }
    };

    // Use this to refresh town info call once the press join button
    const [refreshData, setRefreshData] = useState(1)

    useEffect(() => {
        const fetchData = async () => {
            if (waitForServerResponse) {
                let data = await waitForServerResponse('getTownInfo', { townName: townName });
                data.body.playersData.sort((a, b) => b.xp - a.xp)
                console.log(data)
                setTownInfo(data.body)
                setSettingsData({
                    description: data.body.description,
                    logoNum: data.body.townLogoNum,
                    status: data.body.status,
                })
            }
        }
        fetchData()
    }, [refreshData])

    // Interface action functions

    const managementAction = async (action, targetUser) => {
        if (townInfo.myControls === 'leader') {
            if (action === 'KICK') {
                console.log(`kicking ${targetUser}`)
                if (waitForServerResponse) {
                    setTownInfo((old) => {
                        let newTownInfo = { ...old };
                        newTownInfo.memberCount -= 1;
                        newTownInfo.playersData = newTownInfo.playersData.filter((player) => player.username !== targetUser);
                        return newTownInfo;
                    })
                    let response = await waitForServerResponse('kickTownMember', { kickedMember: targetUser });
                    console.log(response)
                }
            }
            if (action === 'PROMOTE') {
                console.log(`promoting ${targetUser}`)
                if (waitForServerResponse) {
                    let response = await waitForServerResponse('promoteTownMember', { newLeader: targetUser });
                    console.log(response)
                    setTownInfo((old) => {
                        let newTownInfo = { ...old };
                        newTownInfo.myControls = 'member';
                        newTownInfo.playersData = newTownInfo.playersData.map((player) => {
                            if (player.username === targetUser) {
                                let newPlayer = { ...player };
                                newPlayer.role = 'leader'
                                return newPlayer;
                            }
                            if (player.role === 'leader') {
                                let newPlayer = { ...player };
                                newPlayer.role = 'member'
                                return newPlayer;
                            }
                            return player;
                        });
                        return newTownInfo;
                    })
                }
            }
        }
    }

    const joinTown = async () => {
        if (waitForServerResponse) {
            let response = await waitForServerResponse('joinTown', { townName: townInfo.townName });
            console.log(response)
            if (response.body.message === 'SUCCESS') {
                setRefreshData((old) => old+1);
            }
        }
    }

    const leaveTown = async() => {
        if (waitForServerResponse) {
            let response = await waitForServerResponse('leaveTown', { });
            if (response.body.message === 'SUCCESS') {
                setRefreshData((old) => old+1);
            }
            console.log(response)
        }

    }

    // Info for when player clicks level button
    const levelPerks = () => {
        return (
            <div className='levelPerksContainer'>
                <span className='perksPopupX' onClick={() => setPerksPopup(false)}>X</span>
                <p id='perksLabel'>Town Perks</p>
                {townInfo.growthPerkLevel !== 0 && <li>
                    <span className='perkPercent'>{TOWNSINFO.perksInfo.growth[townInfo.growthPerkLevel]}%</span> faster crop growth
                </li>}
                {townInfo.animalPerkLevel !== 0 && <li>
                    <span className='perkPercent'>{TOWNSINFO.perksInfo.animals[townInfo.animalPerkLevel]}%</span> faster animal production
                </li>}
                {townInfo.partsPerkLevel !== 0 && <li>
                    <span className='perkPercent'>{TOWNSINFO.perksInfo.parts[townInfo.partsPerkLevel]}%</span> higher chance of parts
                </li>}
                {townInfo.orderRefreshPerkLevel !== 0 && <li>
                    <span className='perkPercent'>{TOWNSINFO.perksInfo.orderRefresh[townInfo.orderRefreshPerkLevel]}%</span> lower order refresh cooldown
                </li>}
            </div>
        )
    }

    const settings = () => {
        return (<div className='settingsGUIContainer basicCenter'>
            <div className='settingsGUI'>
                <span className='upperRightX'
                    onClick={() => {
                        setSettingsGUI(false);
                        setSettingsData({
                            description: townInfo.description,
                            logoNum: townInfo.townLogoNum,
                            status: townInfo.status,
                        });
                    }}>X</span>
                <form className='settingsForm' onSubmit={setTownDetails}>
                    <div className='setNewDescription'>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            type="text"
                            id="name"
                            name="description"
                            value={settingsData.description}
                            onChange={handleChange}
                            maxLength={128}
                        />
                    </div>
                    <div className='setTownIcon'>
                        <p id='iconsLabel'>Town Icon:</p>
                        <div className='townIconSelection'>
                            {TOWNSINFO.townIcons.map((icon, index) => {
                                return (
                                    <img key={index} className={`townIconOption ${settingsData.logoNum === index ? 'selectedIcon' : ''}`} src={`${process.env.PUBLIC_URL}/assets/images/townIcons/${icon}.png`}
                                        onClick={() => setSettingsData((old) => {
                                            let newData = { ...old };
                                            newData.logoNum = index;
                                            return newData;
                                        })}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <div className='setNewStatus'>
                        <label htmlFor="status">Status:</label>
                        <button type="button" className={settingsData.status === 'OPEN' ? 'selectedButton' : 'unselectedButton'}
                            onClick={() => setSettingsData((old) => { let newData = { ...old }; newData.status = 'OPEN'; return newData })}>
                            Open</button>
                        <button type="button" className={settingsData.status === 'CLOSED' ? 'selectedButton' : 'unselectedButton'}
                            onClick={() => setSettingsData((old) => { let newData = { ...old }; newData.status = 'CLOSED'; return newData })}>
                            Closed</button>
                    </div>
                    <button type="submit" id='descSubmitButton'>Save</button>
                </form>
            </div>
        </div>)
    }

    return (
        <div className='townInterfaceContainer'>
            {Object.keys(townInfo).length === 0 ? (<div className='townLoadingScreen basicCenter'>
                <div className='loadingIconAnimation'></div>
            </div>) : (
                <>
                    {
                        townScreen === "MAIN" &&
                        <>
                            {settingsGUI && settings()}
                            <div className='townInfoBar'>
                                <div className='townLeftBar'>
                                    {backArrow && <img id='townBackArrow' src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_dark.png`} onClick={() => backArrow(true)}/>}
                                    {townInfo.myControls === 'leader' && <img id='townSettingsButton' src={`${process.env.PUBLIC_URL}/assets/images/Gears.png`} onClick={() => setSettingsGUI(true)} />}
                                </div>
                                <div className='townLogo basicCenter'>
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/townIcons/${TOWNSINFO.townIcons[townInfo.townLogoNum]}.png`} />
                                </div>
                                <div className='townTextInfo'>
                                    <p id='townName'>
                                        {townInfo.townName}
                                    </p>
                                    <p id='townDescription'>
                                        {townInfo.description}
                                    </p>
                                </div>
                                <div className='townLevel'>
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/XP.png`} onClick={() => setPerksPopup(true)} />
                                    {perksPopup && levelPerks()}
                                    { townInfo.myControls !== 'visitor' &&
                                    <div className='showGoalsButton basicCenter'
                                        onClick={() => {
                                            setTownScreen("GOALS")
                                        }}
                                    >GOALS</div>}
                                </div>
                                <div className='townGap'></div>
                                <div className='townInfoSection'>
                                    <div className='townStatuses basicCenter'>
                                        <p>{townInfo.memberCount}/25 members</p>
                                        <p style={{ color: townInfo.status === 'OPEN' ? '#36e04d' : 'gray' }}>{townInfo.status}</p>
                                    </div>
                                    {townInfo.myControls !== 'visitor' && (townInfo.myControls === 'member' || townInfo.memberCount === 1 ?
                                        <div className='leaveContainer basicCenter townInfoLowerRight'>
                                            <div className='townLeaveButton basicCenter' onClick={() => {leaveTown(); backArrow()}}>
                                                Leave
                                            </div>
                                        </div>
                                        :
                                        <p className='promoteWarn basicCenter townInfoLowerRight'>
                                            Must promote new leader before leaving
                                        </p>
                                    )}
                                    {(townInfo.myControls === 'visitor' && townInfo.status === "OPEN" && townInfo.memberCount < 25 && !townInfo.imInTown) &&
                                        <div className='townJoinContainer basicCenter'>
                                            <div className='joinButton basicCenter' onClick={() => joinTown()}>Join</div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className='townPlayers'>
                                {townInfo.playersData.map((player, index) =>
                                    <div key={index * 100} className='playerInfo'>
                                        <PlayerCard key={index} username={player.username} xp={player.xp} role={player.role} contributions={player.contributions} myControls={townInfo.myControls} managementAction={managementAction} />
                                    </div>
                                )}
                            </div>
                        </>
                    }
                    {
                        townScreen === "GOALS" && (
                            <TownGoals setTownInfo={setTownInfo} setTownScreen={setTownScreen} townName={townInfo.townName} goals={townInfo.goalsData} role={townInfo.myControls} myUnclaimed={townInfo.myUnclaimed} remount={() => setRefreshData((old) => old+1)}/>
                        )
                    }
                </>)}
        </div>
    )
}

export default TownInterface;