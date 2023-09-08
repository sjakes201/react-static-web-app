import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import CONSTANTS from '../../CONSTANTS';
import '../CSS/ScrollingText.css'
import { useWebSocket } from "../../WebSocketContext";

function ScrollingText() {
    const { waitForServerResponse } = useWebSocket();
    const navigate = useNavigate();

    const [totals, setTotals] = useState({})
    const [lbPositions, setLbPositions] = useState({})

    const [splashes, setSplashes] = useState([""])

    const loadStats = async () => {
        try {
            if (waitForServerResponse) {
                const response = await waitForServerResponse('getStats');
                let data = response.body;
                setTotals(data.totals);
                setLbPositions(data.lbPositions)
            }
        } catch (error) {
            if (error.message.includes('401')) {
                console.log("AUTH EXPIRED")
                localStorage.removeItem('token');
                navigate('/');
            } else {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        loadStats()
    }, [])

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

    useEffect(() => {
        if (Object.keys(totals).length !== 0 && Object.keys(lbPositions).length !== 0) {

            let newSplashes = []
            newSplashes.push("Community Discord!: https://discord.gg/jrxWrgNCHw")
            // get top leaderboard position then all others
            let allSpots = Object.keys(lbPositions);
            for (let i = 0; i < allSpots.length; ++i) {
                let category = allSpots[i];
                let position = lbPositions[category]
                if (category === 'Balance') {
                    if (position === 1) {
                        newSplashes.push(`👑You are the richest player in the game. Finally on top. 👑`)
                    } else if (position === 2) {
                        newSplashes.push(`2nd richest player in the game. So close, yet so far.`)
                    } else if (position === 3) {
                        newSplashes.push(`3rd richest player in the game. Finally getting seen for your work.`)
                    } else if (position > 3 && position <= 50) {
                        newSplashes.push(`Congrats on being the ${position}${ordinalSuffix(position)} richest player in the game. If only this game had a stock market.`)
                    } else {
                        newSplashes.push(`${position}${ordinalSuffix(position)} richest player in the game.`);
                    }
                } else {
                    if (position === 1) {
                        newSplashes.push(`Number one ${CONSTANTS.InventoryDescriptions[category][0]} farmer in the world! Victory is yours, as it always should have been.`)
                    } else if (position === 2) {
                        newSplashes.push(`2nd best ${CONSTANTS.InventoryDescriptions[category][0]} farmer in the world! That must be frusturating.`)
                    } else if (position === 3) {
                        newSplashes.push(`3rd best ${CONSTANTS.InventoryDescriptions[category][0]} farmer in the world! Finally getting the recognition you deserve.`)
                    } else if (position >= 4 && position <= 10) {
                        newSplashes.push(`${position}${ordinalSuffix(position)} best ${CONSTANTS.InventoryDescriptions[category][0]} farmer! You're so close.`)
                    } else {
                        newSplashes.push(`${position}${ordinalSuffix(position)} best ${CONSTANTS.InventoryDescriptions[category][0]} farmer!`)
                    }
                }
            }
            // get top crop then all others
            let allTotals = Object.keys(totals);
            for (let i = 0; i < allTotals.length; ++i) {
                let category = allTotals[i];
                let num = totals[category]
                if (num === 0) {
                    newSplashes.push(`0 ${CONSTANTS.InventoryDescriptionsPlural[category][0]} produced! Someone clearly doesn't like ${CONSTANTS.InventoryDescriptionsPlural[category][0]}.`)
                } else if (num >= 1 && num <= 10) {
                    newSplashes.push(`Only ${num} ${CONSTANTS.InventoryDescriptions[category][0]} ever produced!`)
                } else {
                    newSplashes.push(`${num} ${CONSTANTS.InventoryDescriptionsPlural[category][0]} produced!`)
                }
            }
            setSplashes(newSplashes);
        }
    }, [totals, lbPositions])

    const [chosenText, setChosenText] = useState("")
    const [newText, setNewText] = useState(false)

    useEffect(() => {
        if (splashes.length > 1) {
            setChosenText(splashes[Math.floor(Math.random() * splashes.length)]);
            setNewText(true);
            setTimeout(() => { setNewText(false) }, 10000)
        }
    }, [splashes])

    useEffect(() => {
        if (newText === false && splashes.length > 1) {
            setNewText(true)
            setChosenText(splashes[Math.floor(Math.random() * splashes.length)]);
            setTimeout(() => { setNewText(false) }, 10000)
        }
    }, [newText])

    return (
        newText &&
        < div className="scrolling-box" >
            <p className="marquee"><span>{chosenText}</span></p>
        </div >
    );
}

export default ScrollingText;