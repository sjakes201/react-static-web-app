import React, { useContext } from 'react'
import { GameContext } from '../../GameContainer'
import DaySlot from './DaySlot'
import "./LoginStreak.css"

function LoginStreak({ }) {
    const { loginStreakInfo, userNotifications, setShowLoginRewards } = useContext(GameContext)

    const pendingRewards = userNotifications.filter(n => n.Type === "LOGIN_STREAK_REWARD").map(r => {
        let parsedReward = JSON.parse(r.Message)
        return {
            timestamp: r.Timestamp,
            streakCount: parsedReward.streakCount,
            reward: parsedReward.reward,
            notificationID: r.NotificationID
        }
    });

    return (
        <div className='fog-focus-light basic-center'
            onClick={(event) => {
                event.preventDefault();
                if (event.target === event.currentTarget) {
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
                        />)
                    })}
                </div>
            </div>

        </div>
    )
}

export default LoginStreak