import React, { useEffect, useState } from 'react'
import CompLeaderboard from '../Components/Leaderboard/CompLeaderboard';
import './CSS/LeaderboardScreen.css'

/*
All time contains all time most harvested, and current max balance. So balance is current, can change, but crops are total harvested
ever.
Weekly only contains crops, and contains total harvested in past week

Explain this in text box inside each respective leaderboard

*/



function LeaderboardScreen({ }) {

    //ALLTIME, WEEKLY
    const [type, setType] = useState("WEEKLY")
    const [leadersAll, setLeadersAll] = useState({});
    const [leadersWeekly, setleadersWeekly] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        try {
            let data = fetch('https://farm-api.azurewebsites.net/api/leaderboard', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then((res) => res.json()).then((res) => {
                setLeadersAll(res.allTimeLeaderboard);
                setleadersWeekly(res.tempLeaderboard);
            });
        } catch (error) {
            console.error("ERROR LOADING LEADERBOARDs", error);
            // tell user to refresh or something
        }

    }, [])

    return (
        <div id="leaderboards" className="leaderboards" >
            <div
                style={{
                    width: '80%',
                    height: '100%',
                }}>
                <div className='buttons' style={{}}>
                    <div id="weekly-title" className={type === 'WEEKLY' ? 'type-button active' : 'type-button'} onClick={() => setType("WEEKLY")}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} />
                        <h3>WEEKLY</h3>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} />
                    </div>

                    <div id="alltime-title" className={type === 'ALLTIME' ? 'type-button active' : 'type-button'} onClick={() => setType("ALLTIME")}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} />
                        <h3>ALL TIME</h3>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} />
                    </div>
                </div>
                <div className='leaderboard-container' style={{

                }}> < CompLeaderboard type={type} leadersWeekly={leadersWeekly} leadersAll={leadersAll} /> </div>
            </div>




        </div>
    )
}



export default LeaderboardScreen;