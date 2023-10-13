import React, { useEffect, useState } from 'react'
import CONSTANTS from '../../CONSTANTS';
import TweetButton from '../External/TweetButton';

function CompLeaderboardSlot({ Username, item, data, userAlltimeTotals }) {

    if (item === "Balance") {
        data.first.Balance = formatMoney(data.first.Balance);
        data.second.Balance = formatMoney(data.second.Balance);
        data.third.Balance = formatMoney(data.third.Balance);
    }

    function formatMoney(amount) {
        if (amount.toString().includes("$")) return amount;
        const formatted = amount.toLocaleString('en-US');
        return "$" + formatted;
    }

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

    const twitterMessageGenerator = () => {
        let message = '';
        switch(item) {
            case 'Balance':
                message = `I am the ${data.you}${ordinalSuffix(data.you)} richest farmgame farmer in the world!\nI have $${userAlltimeTotals[item].toLocaleString()}.\nCheck me out on the leaderboards at https://farmgame.live/profile/${Username}`
                break;
            case 'XP':
                message = `I am the ${data.you}${ordinalSuffix(data.you)} best farmgame farmer in the world!\nI have ${userAlltimeTotals[item].toLocaleString()} XP.\nCheck me out on the leaderboards at https://farmgame.live/profile/${Username}`
                break;
            default:
                let itemName = item === 1 ? item : CONSTANTS.InventoryDescriptionsPlural[item][0];
                itemName = itemName.toLowerCase();
                message = `I am the ${data.you}${ordinalSuffix(data.you)} best ${item} farmer in the world!\nI have farmed ${userAlltimeTotals[item].toLocaleString()} ${itemName}.\nCheck me out on the leaderboards at https://farmgame.live/profile/${Username}`
                break;
        }
        return message;
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
                    border: "2px solid var(--black)",
                    height: "100%",
                    width: "100%"
                }}
            >
                <div id="icon"
                    style={{
                        width: '28%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/`.concat(item.concat(".png"))}
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            border: '2px solid black',
                            borderRadius: '50%',
                            alignSelf: 'center',
                            background: 'var(--menu_lighter)'
                        }} />

                </div>

                <div id="spans"
                    style={{
                        width: '72%',
                        padding: '2% 2%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        wordBreak: 'break-word',
                        fontSize: '2.3vh'

                    }}>
                    <p style={{ textAlign: 'center', textDecoration: 'underline', textTransform: 'uppercase', fontSize: "2.7vh" }}>{CONSTANTS.InventoryDescriptions[item][0]}</p>
                    <p><span style={{ color: '#fec32d', padding: '0 5px' }}>1<sup>st</sup></span> {data.first.Username === '' ? 'Guest' : data.first.Username}: {data?.first[item]?.toLocaleString()}</p>
                    <p><span style={{ color: 'silver', padding: '0 5px' }}>2<sup>nd</sup></span>{data.second.Username === '' ? 'Guest' : data.second.Username}: {data?.second[item]?.toLocaleString()}</p>
                    <p><span style={{ color: 'brown', padding: '0 5px' }}>3<sup>rd</sup></span> {data.third.Username === '' ? 'Guest' : data.third.Username}: {data?.third[item]?.toLocaleString()}</p>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', color: 'gray' }}>
                        <p>
                            You: {data.you === -1 ? "" : data.you}
                        </p>
                        <sup>{ordinalSuffix(data.you)}</sup>
                        <span style={{ marginLeft: '8px' }}>
                            <TweetButton
                                message={twitterMessageGenerator()} />
                        </span>

                    </div>

                </div>
            </div>
        </div>
    )

}


export default CompLeaderboardSlot;