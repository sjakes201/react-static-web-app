import React, { useEffect, useState } from 'react'
import CONSTANTS from '../../CONSTANTS';

function CompLeaderboardSlot({ item, data }) {
    if(!Array.isArray(data) || data.length < 3) {
        return null
    }
    return (
        <div id="leaderboard-slot"
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <div id="img_and_data"
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    border: "1px solid black",
                    height: "100%",
                    width: "100%"
                }}
            >
                <div id="icon"
                    style={{
                        border: '1px solid blue',
                        width: '28%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images`.concat(item.concat(".png"))}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            border: '2px solid black',
                            borderRadius: '50%',
                            alignSelf: 'center',
                        }} />

                </div>

                <div id="positions"
                    style={{
                        border: '1px solid red',
                        width: '72%',
                        padding: '2% 2%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        wordBreak: 'break-word',
                        fontSize: '2.3vh'

                    }}>
                    <p style={{ textAlign: 'center', textDecoration: 'underline', textTransform: 'uppercase', fontSize: "2.7vh" }}>{CONSTANTS.InventoryDescriptions[item][0]}</p>
                    <p>1. {data[0].Username}: {data[0][item]}</p>
                    <p>2. {data[1].Username}: {data[1][item]}</p>
                    <p>3. {data[2].Username}: {data[2][item]}</p>

                </div>
            </div>
        </div>
    )

}


export default CompLeaderboardSlot;