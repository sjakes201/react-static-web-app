import React, { useEffect, useState } from 'react'
import CompLeaderboard from '../Components/Leaderboard/CompLeaderboard';
import './CSS/LeaderboardScreen.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebSocket } from "../WebSocketContext";

function LeaderboardScreen({ Username, userAlltimeTotals }) {
    const { waitForServerResponse } = useWebSocket();

    const navigate = useNavigate();
    const location = useLocation();

    if (localStorage.getItem('token') === null) {
        // no auth token present
        navigate('/');
    }

    //ALLTIME, WEEKLY
    const [type, setType] = useState("WEEKLY")
    // const [leadersAll, setLeadersAll] = useState(JSON.parse(sessionStorage.getItem("storedAllLb")) || {});
    // const [leadersWeekly, setLeadersTemp] = useState(JSON.parse(sessionStorage.getItem("storedTempLb")) || {});
    const [leadersAll, setLeadersAll] = useState({});
    const [leadersWeekly, setLeadersTemp] = useState({});


    useEffect(() => {
        const getLeaderboards = async () => {
            try {
                if (waitForServerResponse) { // Ensure `waitForServerResponse` is defined
                    const response = await waitForServerResponse('leaderboard');
                    let data = response.body;
                    if (data.allTimeLeaderboard && data.tempLeaderboard) {
                        setLeadersAll(data.allTimeLeaderboard);
                        setLeadersTemp(data.tempLeaderboard);
                        console.log(data.tempLeaderboard)
                        // const stringifiedAll = JSON.stringify(data.allTimeLeaderboard);
                        // const stringifiedTemp = JSON.stringify(data.tempLeaderboard);
                        // sessionStorage.setItem("storedTempLb", stringifiedTemp)
                        // sessionStorage.setItem("storedAllLb", stringifiedAll)
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
    }, [])

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
                <div className='leaderboard-container'> < CompLeaderboard Username={Username} userAlltimeTotals={userAlltimeTotals} type={type} leadersWeekly={leadersWeekly} leadersAll={leadersAll} /> </div>
            </div>




        </div>
    )
}



export default LeaderboardScreen;