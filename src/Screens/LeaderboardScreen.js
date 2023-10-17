import React, { useEffect, useState } from 'react'
import CompLeaderboard from '../Components/Leaderboard/CompLeaderboard';
import './CSS/LeaderboardScreen.css'
import { useNavigate, useLocation } from 'react-router-dom';

function LeaderboardScreen({ refreshLeaderboard, leaderboardData, Username, userAlltimeTotals }) {

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        refreshLeaderboard()
    }, [])

    if (localStorage.getItem('token') === null) {
        // no auth token present
        navigate('/');
    }

    //ALLTIME, WEEKLY
    const [type, setType] = useState("WEEKLY")

    const backArrow = () => {
        const backFunc = () => {
            if (location?.state?.from === 'animals') {
                return () => navigate('/animals')
            } else {
                return () => navigate('/plants')
            }
        }

        return (
            <div className='back-arrow-leader'>
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_light.png`}
                    alt='profile/stats'
                    onClick={backFunc()}
                />
            </div>
        )
    }

    return (
        <div id="leaderboards" className="leaderboards" >
            {backArrow()}
            <div
                className='main-board'>
                <div className='buttons' style={{}}>
                    <div id="weekly-title" className={type === 'WEEKLY' ? 'type-button active' : 'type-button inactive'} onClick={() => setType("WEEKLY")}>
                        <h3>WEEKLY</h3>
                    </div>

                    <div id="alltime-title" className={type === 'ALLTIME' ? 'type-button active' : 'type-button inactive'} onClick={() => setType("ALLTIME")}>
                        <h3>ALL TIME</h3>
                    </div>
                </div>
                <div className='leaderboard-container'>
                    < CompLeaderboard
                        Username={Username}
                        userAlltimeTotals={userAlltimeTotals}
                        type={type}
                        leadersWeekly={leaderboardData.temp || {}}
                        leadersAll={leaderboardData.all || {}} /> </div>
            </div>




        </div>
    )
}



export default LeaderboardScreen;