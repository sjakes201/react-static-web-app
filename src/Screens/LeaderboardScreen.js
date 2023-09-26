import React, { useEffect, useState } from 'react'
import CompLeaderboard from '../Components/Leaderboard/CompLeaderboard';
import './CSS/LeaderboardScreen.css'
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from "../WebSocketContext";

function LeaderboardScreen({ }) {
    const { waitForServerResponse } = useWebSocket();

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
                if (waitForServerResponse) { // Ensure `waitForServerResponse` is defined
                    const response = await waitForServerResponse('leaderboard');
                    let data = response.body;
                    if(data.allTimeLeaderboard && data.tempLeaderboard) {
                        setLeadersAll(data.allTimeLeaderboard);
                        setleadersWeekly(data.tempLeaderboard);
                    }
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
                    src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_light.png`}
                    alt='profile/stats'
                    onClick={() => window.history.back()}
                />
            </div>
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
                <div className='leaderboard-container'> < CompLeaderboard type={type} leadersWeekly={leadersWeekly} leadersAll={leadersAll} /> </div>
            </div>




        </div>
    )
}



export default LeaderboardScreen;