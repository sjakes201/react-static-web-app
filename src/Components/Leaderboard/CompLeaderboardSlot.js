import React, { useEffect, useState } from 'react'
import CONSTANTS from '../../CONSTANTS';

function CompLeaderboardSlot({ item, data }) {

    function ordinalSuffix(number) {
        const lastDigit = number % 10;
        const lastTwoDigits = number % 100;
    
        if (lastTwoDigits > 10 && lastTwoDigits < 20) {
            return "th";
        }
        
        switch (lastDigit) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    }    

    return data === undefined ? (<div></div>) : (
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
                        src={`${process.env.PUBLIC_URL}/assets/images/`.concat(item.concat(".png"))}
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
                    <p><position style={{color: '#fec32d', padding:'0 5px'}}>1<sup>st</sup></position> {data.first.Username}: {data.first[item]}</p>
                    <p><position style={{color: 'silver', padding:'0 5px'}}>2<sup>nd</sup></position>{data.second.Username}: {data.second[item]}</p>
                    <p><position style={{color: 'brown', padding:'0 5px'}}>3<sup>rd</sup></position> {data.third.Username}: {data.third[item]}</p>
                    <div style={{textAlign: 'center', color: 'gray'}}><p>You: {data.you === -1 ? "" : data.you}<sup>{ordinalSuffix(data.you)}</sup></p></div>

                </div>
            </div>
        </div>
    )

}


export default CompLeaderboardSlot;