import React, { useContext, useRef, useEffect } from 'react'
import { GameContext } from '../../GameContainer'
import DaySlot from './DaySlot'
import "./LoginStreak.css"
import { useWebSocket } from '../../WebSocketContext'

function LoginStreak({ }) {
    const { loginStreakInfo, userNotifications, setUserNotifications, setShowLoginRewards, setItemsData, setPremiumCurrency, setParts, fetchBoostsInventory } = useContext(GameContext)
    const { waitForServerResponse } = useWebSocket()

    const lastClaimedDay = loginStreakInfo.playerStreak?.[0]?.streakCount;
    const lastRewardTime = loginStreakInfo.playerStreak?.[0]?.LastRewardTime;

    const closeTimeout = useRef(false)
    useEffect(() => {
        let closeTimer = setTimeout(() => {closeTimeout.current = true;}, 500)
        return () => clearTimeout(closeTimer)
    }, [])

    const pendingRewards = userNotifications.filter(n => n.Type === "LOGIN_STREAK_REWARD").map(r => {
        let parsedReward = JSON.parse(r.Message)
        return {
            timestamp: r.Timestamp,
            streakCount: parsedReward.streakCount,
            reward: parsedReward.reward,
            notificationID: r.NotificationID
        }
    });

    const claimReward = async(notificationID) => {
        let claimRes = await waitForServerResponse('acceptNotification', {
            processAction: "CLAIM",
            notificationID: notificationID
        })
        if(claimRes.body?.success) {
            let reward = claimRes.body.reward;
            if(reward.hasOwnProperty("TimeFertilizer")) {
                setItemsData(old => {
                    let newData = {...old};
                    newData.TimeFertilizer += reward.TimeFertlizer || 0;
                    newData.YieldsFertilizer += reward.YieldsFertilizer || 0;
                    newData.HarvestsFertilizer += reward.HarvestsFertilizer || 0;
                    return newData;
                })
            }
            if(reward.hasOwnProperty("PremiumCurrency")) {
                setPremiumCurrency((old) => old + reward.PremiumCurrency)
            }
            if(reward.hasOwnProperty("Gears")) {
                setParts((old) => {
                    let newParts = {...old};
                    newParts.Gears += reward.Gears || 0;
                    newParts.Bolts += reward.Bolts || 0;
                    newParts.MetalSheets += reward.MetalSheets || 0;
                    return newParts;
                })
            }
            if(reward.hasOwnProperty("Boost")) {
                fetchBoostsInventory();
            }
            setUserNotifications((old) => old.filter(n => n.NotificationID !== notificationID))
        }
    }

    return (
        <div className='fog-focus-light basic-center'
            onClick={(event) => {
                event.preventDefault();
                if (event.target === event.currentTarget && closeTimeout.current) {
                    setShowLoginRewards(false)
                }
            }}
        >
            <div className='login-rewards-container yellow-border'>
                <p className='login-rewards-header'>
                    Login Rewards
                    <span
                        className='closing-x'
                        onClick={() => setShowLoginRewards(false)}
                    >X</span></p>
                <div className='login-calendar-container'>
                    {(loginStreakInfo.scheduledRewards || []).map((dayInfo, index) => {
                        return (<DaySlot
                            key={index}
                            dayNum={dayInfo.RewardID}
                            reward={dayInfo.Reward}
                            pendingReward={pendingRewards.filter((r => r.streakCount === dayInfo.RewardID))?.[0]}
                            playerLastClaimed={lastClaimedDay}
                            lastRewardTime={lastRewardTime}
                            claimReward={claimReward}
                        />)
                    })}
                </div>
            </div>

        </div>
    )
}

export default LoginStreak