import './PlayerCard.css'
import CONSTANTS from '../../CONSTANTS';
import React, { useState, useEffect, useRef } from 'react'

function PlayerCard({ username, xp, role, contributions, myControls, managementAction }) {

    const [kickConfirm, setKickConfirm] = useState(false);
    const kickTimer = useRef(null);

    const [promoteConfirm, setPromoteConfirm] = useState(false);
    const promoteTimer = useRef(null)

    const [hover, setHover] = useState(false)

    const [moreButton, setMoreButton] = useState(false)

    useEffect(() => {
        if (kickConfirm && kickTimer.current === null) {
            clearTimeout(kickTimer);
            kickTimer.current = null;
            kickTimer.current = setTimeout(() => {
                setKickConfirm(false)
                kickTimer.current = null;
            }, 5000)
        }
        if (promoteConfirm && promoteTimer.current === null) {
            clearTimeout(promoteTimer.current);
            promoteTimer.current = null;
            promoteTimer.current = setTimeout(() => {
                setPromoteConfirm(false)
                promoteTimer.current = null;
            }, 5000)
        }
    }, [kickConfirm, promoteConfirm])

    const calcLevel = (XP) => {
        const lvlThresholds = CONSTANTS.xpToLevel;
        let level = 0;
        let remainingXP = XP;
        for (let i = 0; i < lvlThresholds.length; ++i) {
            if (XP >= lvlThresholds[i]) {
                level = i;
                remainingXP = XP - lvlThresholds[i]
            }
        }
        // If level is >= 15, and remainingXP is > 0, we calculate remaining levels (which are formulaic, each level is)
        while (remainingXP >= 600) {
            ++level;
            remainingXP -= 600;
        }
        // find next threshold
        return level
    }

    const buttonControl = (button) => {
        if (button === 'KICK') {
            if (kickConfirm) {
                managementAction('KICK', username)
                setKickConfirm(false)
            } else {
                setKickConfirm(true)
            }
        }

        if (button === 'PROMOTE') {
            if (promoteConfirm) {
                managementAction('PROMOTE', username)
                setPromoteConfirm(false)
            } else {
                setPromoteConfirm(true)
            }
        }
    }

    return (
        <div className='playerCardContainer'>
            <div className='playerLevel basicCenter'>
                {/* <div id='burst-12' className='outer'> */}
                <div id='burst-12' className='inner'>
                    <p className='levelNum'>{calcLevel(xp)}</p>
                </div>
                {/* </div> */}
            </div>
            <div className='playerUser'>{username}</div>
            <div className='playerGap'></div>
            <div className='playerRole'>
                <p>{role === 'leader' ? role : 'member'}</p>
                {(myControls === 'leader' && role !== 'leader') &&
                    <div className='townAuthControls'>
                        <div className='authButton promoteButton basicCenter' onClick={() => buttonControl('PROMOTE')}>{promoteConfirm ? 'CONFIRM?' : 'LEADER'}</div>
                        <div className='authButton kickButton basicCenter' onClick={() => buttonControl('KICK')}>{kickConfirm ? 'CONFIRM?' : 'KICK'}</div>
                    </div>
                }
            </div>
            {myControls !== 'visitor' &&
                <div className='playerMoreButton' onClick={() => { if (!moreButton) setMoreButton((old) => !old) }}>
                    <div className='buttonBar'></div>
                    <div className='buttonBar'></div>
                    <div className='buttonBar'></div>
                    {moreButton &&
                        <div className={`playerMoreInfo ${hover ? 'onTop' : ''}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                            <span className='playerMoreX' onClick={() => setMoreButton(false)}>X</span>
                            {
                                Object.keys(contributions).map((good, index) => {
                                    return (
                                        <div className='contributionGoal' key={index}>
                                            <img src={`${process.env.PUBLIC_URL}/assets/images/${good}.png`} />
                                            <p>{contributions[good].toLocaleString()}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>}
        </div>
    )
}

export default PlayerCard;