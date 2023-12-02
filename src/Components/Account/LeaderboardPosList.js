import React from 'react'
import CONSTANTS from '../../CONSTANTS'
import "./AccountComponents.css"

function LeaderboardPosList({ tempData, allTimeData }) {
    const listString = (crop, position, type, index) => {
        let numberClass =
            position <= 5 ? "goldPos" :
                position <= 6 ? "silverPos" :
                    "bronzePos"
        return (
            <p className='leaderboard-pos-row' key={index}>
                <span className={numberClass}>#{position}</span> {type} {CONSTANTS.InventoryDescriptionsPlural[crop]?.[0]}
            </p>
        )
    }

    let allTimeKeys = Object.keys(allTimeData).sort((a, b) => allTimeData[a] - allTimeData[b])
    let tempKeys = Object.keys(tempData).sort((a, b) => tempData[a] - tempData[b])

    return (
        <div className='profile-leaderboard-container'>
            <p id='leaderboard-pos-title'>Current Leaderboard Positions:</p>
            <div
                className='leaderboard-pos-list'
            >
                {tempKeys.length === 0 && allTimeKeys.length === 0 &&
                    <p className='no-leaderboard-positions'>No leaderboard positions yet!</p>
                }
                {allTimeKeys.map((item, index) => listString(item, allTimeData[item], "All Time", index))}
                {tempKeys.map((item, index) => listString(item, tempData[item], "Weekly", index))}
            </div>
        </div>
    )
}

export default LeaderboardPosList