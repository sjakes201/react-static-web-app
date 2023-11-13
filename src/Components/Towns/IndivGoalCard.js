import React, { useState, useContext } from 'react';
import './IndivGoalCard.css';
import { calcIndivRewards } from '../../townHelpers'
import { GameContext } from '../../GameContainer';

function IndivGoalCard({ good, quantity, expiration, progress, username, goalID, chooseIndivGoal, profilePic, collectIndivReward }) {
    const rewards = calcIndivRewards(good, quantity);
    const { getUser } = useContext(GameContext)
    const [pfpTip, setPfpTip] = useState(false)

    let timeRemaining = expiration ? Math.round((expiration - Date.now()) / 1000 / 60) : 0
    if (timeRemaining < 0) timeRemaining = 0;

    const getBackgroundImage = () => {
        if (getUser() === username) {
            return `${process.env.PUBLIC_URL}/assets/images/towns/individualOrderYours.png`
        }
        return `${process.env.PUBLIC_URL}/assets/images/towns/individualOrder.png`
    }

    if (collectIndivReward) {
        return (<div
            className='indiv-goal-card clickable basic-center'
            onClick={() => collectIndivReward(goalID)}>
            <img src={`${process.env.PUBLIC_URL}/assets/images/towns/individualOrderDone.png`} className='main-card-img' />
            <div className='goal-contents'>
                <div className='goal-info basic-center'>
                    <img className='crop-icon' src={`${process.env.PUBLIC_URL}/assets/images/${good}.png`} />
                    <p className='goal-quantity'>
                        {quantity.toLocaleString()}
                    </p>
                </div>
                <div className='goal-info basic-center'>
                    <div className='indiv-reward-row'>
                        {profilePic ? (
                            <div
                                className='claimed-user'
                                onMouseEnter={() => setPfpTip(true)}
                                onMouseLeave={() => setPfpTip(false)}
                            >
                                <img src={`${process.env.PUBLIC_URL}/assets/images/profilePics/${profilePic}.png`} />
                            </div>

                        ) : (
                            <>
                                <img src={`${process.env.PUBLIC_URL}/assets/images/Balance.png`} />
                                <p>{rewards.gold?.toLocaleString()}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <p className='claim-goal'>CLAIM</p>
        </div>)
    }

    return (
        <button
            className={`indiv-goal-card ${profilePic ? '' : 'clickable'}`}
            onClick={() => chooseIndivGoal(goalID)}
        >
            <img src={getBackgroundImage()} className='main-card-img' />
            {profilePic && <img className='goal-timer' src={`${process.env.PUBLIC_URL}/assets/images/towns/timer.gif`} />}
            {pfpTip && <p className='toolTipText'>Claimed by {username} ({timeRemaining} mins)</p>}
            <div className='goal-contents'>
                <div className='goal-info basic-center'>
                    <img className='crop-icon' src={`${process.env.PUBLIC_URL}/assets/images/${good}.png`} />
                    <p className='goal-quantity'>
                        {username ? `${progress}/` : ''}
                        {quantity.toLocaleString()}
                    </p>
                </div>
                <div className='goal-info basic-center'>
                    <div className='indiv-reward-row'>
                        {profilePic ? (
                            <div
                                className='claimed-user'
                                onMouseEnter={() => setPfpTip(true)}
                                onMouseLeave={() => setPfpTip(false)}
                            >
                                <img src={`${process.env.PUBLIC_URL}/assets/images/profilePics/${profilePic}.png`} />
                            </div>

                        ) : (
                            <>
                                <img src={`${process.env.PUBLIC_URL}/assets/images/Balance.png`} />
                                <p>{rewards.gold?.toLocaleString()}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <p className='town-xp-reward'>{rewards.townXP} town funds</p>
        </button >
    );
}

export default IndivGoalCard;
