import { useWebSocket } from "../../WebSocketContext";
import React, { useEffect, useState } from 'react'
import './TownSearch.css'
import TOWNSINFO from "../../TOWNSINFO";
import TownInterface from "./TownInterface";
import { calcTownLevel, calcPerkLevels } from '../../townHelpers.js'


function TownSearch({ updateXP, updateBalance, playerInTown, reloadTownPerks, setScreen, setTown }) {
    const { waitForServerResponse } = useWebSocket();

    const [towns, setTowns] = useState([]);
    const [viewingTown, setViewingTown] = useState("")

    const [searchString, setSearchString] = useState("")
    const [noResults, setNoResults] = useState(false)

    const [createTown, setCreateTown] = useState(false)
    const [townName, setTownName] = useState("")

    const fetchTowns = async () => {
        if (waitForServerResponse) {
            let result = await waitForServerResponse('getRandomTowns', { townName: searchString === "" ? undefined : searchString })
            if (result.body.townArray.length !== 0) {
                setTowns(result.body.townArray)
            } else {
                setNoResults(true)
            }
            console.log(result)
        }
    }

    useEffect(() => {
        if (towns.length !== 0) { setNoResults(false) }
    }, [towns])

    useEffect(() => {
        fetchTowns();
    }, [])

    const submitCreateTown = async () => {
        if (waitForServerResponse) {
            let result = await waitForServerResponse('createTown', { townName: townName })
            if (result.body.message === 'SUCCESS') {
                setCreateTown(false)
                setTown(townName)
                setScreen("TownInterface")
                reloadTownPerks();
            }
        }
    }

    const townCard = (townName, memberCount, townLogoNum, townXP, status) => {
        let townLevel = calcTownLevel(townXP)[0]

        return (
            <div
                className='townCard'
                onClick={() => {
                    setViewingTown(townName)
                }}
                key={townName}
            >
                <div className='townCardLeft'>
                    <img className='searchTownLogo' src={`${process.env.PUBLIC_URL}/assets/images/townIcons/${TOWNSINFO.townIcons[townLogoNum]}.png`} />
                    <p className='searchTownName'>{townName}</p>
                    <p className='searchTownLevel'>town lvl {townLevel}</p>
                </div>
                <div className='townCardRight'>
                    <p className={status === 'OPEN' ? 'searchTownStatus' : ''}>{status}</p>
                    <p className='searchMemberCount'>{memberCount}/25</p></div>
            </div>
        )
    }

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setCreateTown(false);
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    const createTownGUI = () => {
        return (
            <div className='createTown'>
                <div className='createGUI'>
                    <input className='townNameBox' value={townName}
                        onChange={(e) => {
                            const isValid = /^[A-Za-z0-9._]{0,32}$/.test(e.target.value);
                            if (isValid) {
                                setTownName(e.target.value)
                            }
                        }} />
                    <div className={`townCreateButton ${/^[A-Za-z0-9._]{4,32}$/.test(townName) ? 'validButton' : ''}`}
                        onClick={() => {
                            submitCreateTown()
                        }}
                    >Create</div>
                    <p onClick={() => setCreateTown(false)}>X</p>
                </div>
            </div>
        )
    }

    return (
        <div className='townSearchContainer'>
            {viewingTown &&
                <div className='searchViewInterface'>
                    <TownInterface updateBalance={updateBalance} updateXP={updateXP} townName={viewingTown} reloadTownPerks={reloadTownPerks} setScreen={setScreen}
                        backArrow={(deleted) => { setViewingTown(""); if (deleted) { fetchTowns() } }
                        } />
                </div>
            }
            {createTown && createTownGUI()}
            <div className='searchTopBar'>
                <input className='townSearchBar' type='text' value={searchString}
                    onChange={(e) => {
                        const isValid = /^[A-Za-z0-9._]{0,32}$/.test(e.target.value);
                        if (isValid) {
                            setSearchString(e.target.value)
                        }
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter') fetchTowns(); }}
                />
                <img className='searchGo' src={`${process.env.PUBLIC_URL}/assets/images/refresh.png`} onClick={fetchTowns} />
                <div className={`${!playerInTown ? 'createTownButton' : 'disabledCreateButton'}`} onClick={() => { if (!playerInTown) setCreateTown(true) }}>Create town</div>
            </div>
            <div className='searchResults'>
                {
                    noResults ? (
                        <p>No towns found</p>
                    ) : (
                        towns.map((town) => townCard(town.townName, town.memberCount, town.townLogoNum, town.townXP, town.status))
                    )
                }
                {!noResults &&
                    <p id='townResultsInfo'>{towns.length} random result{towns.length === 1 ? '' : 's'} shown</p>
                }
            </div>
        </div>
    )
}

export default TownSearch;