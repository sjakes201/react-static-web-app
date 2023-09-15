import { useWebSocket } from "../../WebSocketContext";
import React, { useEffect, useState } from 'react'
import './TownSearch.css'
import TOWNSINFO from "../../TOWNSINFO";
import TownInterface from "./TownInterface";


function TownSearch() {
    const { waitForServerResponse } = useWebSocket();

    const [towns, setTowns] = useState([]);
    const [viewingTown, setViewingTown] = useState("")

    const [searchString, setSearchString] = useState("")
    const [noResults, setNoResults] = useState(false)

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

    const townCard = (townName, memberCount, townLogoNum, townXP, status) => {
        let level = 0;
        TOWNSINFO.townLevels.forEach((threshold, index) => { if (townXP > threshold) { level = index } })
        return (
            <div className='townCard'
                onClick={() => {
                    setViewingTown(townName)
                }}
            >
                <div className='townCardLeft'>
                    <img className='searchTownLogo' src={`${process.env.PUBLIC_URL}/assets/images/townIcons/${TOWNSINFO.townIcons[townLogoNum]}.png`} />
                    <p className='searchTownName'>{townName}</p>
                    <p className='searchTownLevel'>town lvl {level}</p>
                </div>
                <div className='townCardRight'>
                    <p className={status === 'OPEN' ? 'searchTownStatus' : ''}>{status}</p>
                    <p className='searchMemberCount'>{memberCount}/25</p></div>
            </div>
        )
    }

    return (
        <div className='townSearchContainer'>
            {viewingTown &&
                <div className='searchViewInterface'>
                    <TownInterface townName={viewingTown} backArrow={() => setViewingTown("")} />
                </div>
            }
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
            </div>
            <div className='searchResults'>
                {
                    noResults ? (
                        <p>No towns found</p>
                    ) : (
                        towns.map((town) => townCard(town.townName, town.memberCount, town.townLogoNum, town.townXP, town.status))
                    )
                }

            </div>
        </div>
    )
}

export default TownSearch;