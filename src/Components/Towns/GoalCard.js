import './TownGoals.css'
import CONSTANTS from '../../CONSTANTS'
import TOWNSINFO from '../../TOWNSINFO'
import React, { useState, useEffect, useRef } from 'react'
import { personalRewards } from '../../townHelpers'

// Good is string for good name, numNeeded and numHave are int for goal quantities, customGoal is boolean for whether this is one the four chosen by town leader
function GoalCard({ good, numNeeded, numHave, index, unclaimedData, myRoleID, changeGoal, claimUnclaimedGoal }) {

    let setByLeader = index < 4;
    let percentCompletion = numHave >= numNeeded ? 100 : Math.floor((numHave / numNeeded) * 100);
    if (numHave > 0 && percentCompletion === 0) percentCompletion = 1;
    // Unclaimed data is either an empty string or string for what was unclaimed: ex 'CORN 100' to know what to display
    const [goalSelect, setGoalSelect] = useState(false);
    const [newGoal, setNewGoal] = useState("")
    const [confirmGUI, setConfirmGUI] = useState(false)

    const toolTip = useRef(null)
    const [tool, setTool] = useState(false)

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

    const unclaimedButton = () => {
        let [unclaimedGood, unclaimedQty] = unclaimedData.split(" ");
        unclaimedQty = parseInt(unclaimedQty)
        // Gold reward is 
        let rewards = personalRewards(unclaimedGood, unclaimedQty)
        const goldReward = rewards.gold;
        const xpReward = rewards.xp;

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
                    <div className='unconfirmGoalGUI' onClick={() => setConfirmGUI(false)}>X</div>
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
                    <small>*Progress for this goal will be reset</small>
                </div>)
            }

            <img
                className={`goalCardIcon ${setByLeader ? 'customGoal' : ''} ${myRoleID > 2 && setByLeader ? 'clickable' : ''}`}
                src={`${process.env.PUBLIC_URL}/assets/images/${good}.png`}
                onClick={() => {
                    if ((setByLeader) && myRoleID > 2) { setGoalSelect(true) }
                }}
                onMouseEnter={() => {
                    toolTip.current = setTimeout(() => { setTool(true) }, myRoleID > 2 ? 800 : 500)
                }}
                onMouseLeave={() => {
                    clearTimeout(toolTip.current)
                    setTool(false);
                }}
            />
            {(tool && setByLeader) && <p className='goalToolTip'>Goal set by leader or co-leader</p>}

            <div className='goalCardInfo'>
                <div className='infoTopHalf'>
                    <p>{CONSTANTS.InventoryDescriptionsPlural[good][0]}<small className='townXPFromGoal'>{good.includes("_") ? 1200 : 1000} town xp</small></p>
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