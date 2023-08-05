import React, { useEffect, useState } from 'react'
import CompLeaderboard from '../Components/Leaderboard/CompLeaderboard';
import './CSS/LeaderboardScreen.css'
import { useNavigate } from 'react-router-dom';

function LeaderboardScreen({ }) {

    const navigate = useNavigate();
    if (localStorage.getItem('token') === null) {
        // no auth token present
        navigate('/');
    }

    //ALLTIME, WEEKLY
    const [type, setType] = useState("WEEKLY")
    const [leadersAll, setLeadersAll] = useState({});
    const [leadersWeekly, setleadersWeekly] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        const getLeaderboards = async () => {
            try {

                let data = await fetch('https://farm-api.azurewebsites.net/api/leaderboard', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (!data.ok) {
                    throw new Error(`HTTP error! status: ${data.status}`);
                } else {
                    let res = await data.json();
                    setLeadersAll(res.allTimeLeaderboard);
                    setleadersWeekly(res.tempLeaderboard);
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
        getLeaderboards();
    }, [navigate])

    return (
        <div id="leaderboards" className="leaderboards" >
            <div className='back-arrow-leader'>
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/back_arrow.png`}
                    alt='profile/stats'
                    onClick={() => window.history.back()}
                />
            </div>
            <div
                className='main-board'>
                <div className='buttons' style={{}}>
                    <div id="weekly-title" className={type === 'WEEKLY' ? 'type-button active' : 'type-button inactive'} onClick={() => setType("WEEKLY")}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} />
                        <h3>WEEKLY</h3>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} />
                    </div>

                    <div id="alltime-title" className={type === 'ALLTIME' ? 'type-button active' : 'type-button inactive'} onClick={() => setType("ALLTIME")}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} />
                        <h3>ALL TIME</h3>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} />
                    </div>
                </div>
                <div className='leaderboard-container'> < CompLeaderboard type={type} leadersWeekly={leadersWeekly} leadersAll={leadersAll} /> </div>
            </div>




        </div>
    )
}



export default LeaderboardScreen;