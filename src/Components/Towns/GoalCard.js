import './TownGoals.css'
import CONSTANTS from '../../CONSTANTS'
import TOWNSINFO from '../../TOWNSINFO'
import React, { useState, useEffect, useRef } from 'react'

// Good is string for good name, numNeeded and numHave are int for goal quantities, customGoal is boolean for whether this is one the four chosen by town leader
function GoalCard({ good, numNeeded, numHave, index, unclaimedData, role, changeGoal, claimUnclaimedGoal }) {

    let setByLeader = index < 4;
    let percentCompletion = numHave >= numNeeded ? 100 : Math.floor((numHave / numNeeded) * 100);
    // Unclaimed data is either an empty string or string for what was unclaimed: ex 'CORN 100' to know what to display
    const [goalSelect, setGoalSelect] = useState(false);
    const [newGoal, setNewGoal] = useState("")
    const [confirmGUI, setConfirmGUI] = useState(false)

    const goalSelectGuiRef = useRef(null);
    useEffect(() => {
        const handleScroll = (e) => {
            e.preventDefault();
            if (goalSelectGuiRef.current) {
                goalSelectGuiRef.current.scrollLeft += e.deltaY * 0.69;
            }
        };

        const goalSelectGuiElement = goalSelectGuiRef.current;
        if (goalSelectGuiElement) {
            goalSelectGuiElement.addEventListener('wheel', handleScroll);
        }

        // Cleanup
        return () => {
            if (goalSelectGuiElement) {
                goalSelectGuiElement.removeEventListener('wheel', handleScroll);
            }
        };
    }, [goalSelect])

    // If unclaimed reward, calculate reward same as backend. 5x the order reward per person
    const unclaimedButton = () => {
        const [unclaimedGood, unclaimedQty] = unclaimedData.split(" ");
        const goldReward = (Math.floor(CONSTANTS.Init_Market_Prices[unclaimedGood] * (2 / 3) * unclaimedQty)) * 5;
        const xpReward = (Math.floor(CONSTANTS.XP[unclaimedGood] * (2 / 3) * unclaimedQty)) * 5;

        return (
            <div
                className='unclaimedCover'
                onClick={() => claimUnclaimedGoal(index + 1)}
            >
                <div className='unclaimedInfoDiv'>
                    <p>{unclaimedQty}</p>
                    <p>x</p>
                    <img
                        className='unclaimedIcon'
                        src={`${process.env.PUBLIC_URL}/assets/images/${unclaimedGood}.png`}
                    />
                </div>
                <p>GOAL COMPLETED</p>
                <div className='unclaimedInfoDiv'>
                    <img
                        className='unclaimedIcon'
                        src={`${process.env.PUBLIC_URL}/assets/images/Balance.png`}
                    />
                    <p>{goldReward.toLocaleString()}</p>
                    <img
                        className='unclaimedIcon'
                        src={`${process.env.PUBLIC_URL}/assets/images/XP.png`}
                    />
                    <p>{xpReward.toLocaleString()}</p>
                </div>
            </div>
        )

    }

    return (
        <div className='goalCardContainer'>
            {unclaimedData !== null && unclaimedButton()}

            {
                goalSelect &&
                (<div className='goalSelectGUI' ref={goalSelectGuiRef}>
                    <img
                        className='selectGoalIcon cancelGoalIcon'
                        src={`${process.env.PUBLIC_URL}/assets/images/GUI/cancel.png`}
                        onClick={() => {
                            setNewGoal("");
                            setGoalSelect(false)
                        }}
                    />
                    {Object.keys(TOWNSINFO.goalQuantities).map((good, imgIndex) => {
                        return (<img
                            key={imgIndex}
                            className='selectGoalIcon'
                            src={`${process.env.PUBLIC_URL}/assets/images/${good}.png`}
                            onClick={() => {
                                setNewGoal(good);
                                setGoalSelect(false)
                                setConfirmGUI(true)
                            }}
                        />)
                    })}
                </div>)
            }
            {
                confirmGUI &&
                (<div className='goalConfirmGUI'>
                    <img
                        className='selectGoalIcon'
                        src={`${process.env.PUBLIC_URL}/assets/images/${newGoal}.png`}
                    />
                    <div
                        onClick={() => {
                            changeGoal(newGoal, index + 1)
                            setConfirmGUI(false)
                        }}
                        className='setGoalButton'>
                        SET
                    </div>
                </div>)
            }

            <img
                className={`goalCardIcon ${setByLeader ? 'customGoal' : ''} ${role === 'leader' ? 'clickable' : ''}`}
                src={`${process.env.PUBLIC_URL}/assets/images/${good}.png`}
                onClick={() => {
                    if ((setByLeader < 4) && role === 'leader') { setGoalSelect(true) }
                }}
            />

            <div className='goalCardInfo'>
                <div className='infoTopHalf'>
                    <p>{CONSTANTS.InventoryDescriptionsPlural[good][0]}</p>
                    <p>{numHave}/{numNeeded}</p>
                </div>
                <div className='cardProgressBarShell'>
                    <div
                        style={{
                            backgroundColor: 'lightblue',
                            position: 'absolute',
                            left: `-${100 - percentCompletion}%`,
                            width: '100%',
                            height: '100%',
                            borderRight: '1px solid black',
                        }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default GoalCard;