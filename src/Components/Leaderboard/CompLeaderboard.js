import React, { useEffect, useState } from 'react'
import CompLeaderboardSlot from './CompLeaderboardSlot';

function CompLeaderboard({ type }) {
    const [leadersAll, setLeadersAll] = useState({});
    const [leadersWeekly, setleadersWeekly] = useState({});

    console.log(type)
    useEffect(() => {
        const token = localStorage.getItem('token');
        try {
            let data = fetch('https://farm-api.azurewebsites.net/api/leaderboardAll', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then((x) => x.json()).then((x) => setLeadersAll(x));
        } catch (error) {
            console.error("ERROR LOADING ALLTIME LEADERBOARD", error);
            // tell user to refresh or something
        }

        try {
            let data = fetch('https://farm-api.azurewebsites.net/api/leaderboardWeek', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then((x) => x.json()).then((x) => setleadersWeekly(x));
        } catch (error) {
            console.error("ERROR LOADING WEEKLY LEADERBOARD", error);
            // tell user to refresh or something
        }

    }, [])

    if (type === 'WEEKLY') {
        if (Object.keys(leadersWeekly).length) {
            return (
                <div style={{
                    paddingTop: '2%',
                    paddingBottom: '2%',
                    paddingLeft: '1%'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh', marginBottom: '1%' }}>

                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} style={{ height: '20vh' }} />
                        <div style={{ width: '49%', height: '100%' }}><CompLeaderboardSlot key={"Balance"} item={"Balance"} data={leadersWeekly.Balance} /></div>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} style={{ height: '20vh' }} />

                    </div>
                    <div style={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: '49% 49%',
                        rowGap: '.4%',
                        columnGap: '1%',
                        paddingBottom: '3%'
                    }}>
                        {Object.keys(leadersWeekly).map(key => {
                            if (key === "Balance") return null;
                            return (
                                <div key={key}
                                    style={{
                                        width: '100%',
                                    }}>
                                    <div style={{ width: '100%', height: '20vh' }}><CompLeaderboardSlot key={key} item={key} data={leadersWeekly[key]} /> </div>
                                </div>
                            )
                        })}
                    </div>
                </div >

            )
        }
    } else {
        if (Object.keys(leadersAll).length) {
            return (
                <div style={{
                    paddingTop: '2%',
                    paddingBottom: '2%',
                    paddingLeft: '1%'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh', marginBottom: '1%' }}>

                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} style={{ height: '20vh' }} />
                        <div style={{ width: '49%', height: '100%' }}><CompLeaderboardSlot key={"Balance"} item={"Balance"} data={leadersAll.Balance} /></div>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} style={{ height: '20vh' }} />

                    </div>
                    <div style={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: '49% 49%',
                        rowGap: '.4%',
                        columnGap: '1%',
                    }}>
                        {Object.keys(leadersAll).map(key => {
                            if (key === "Balance") return null;
                            return (
                                <div key={key}
                                    style={{
                                        width: '100%',
                                    }}>
                                    <div style={{ width: '100%', height: '20vh' }}><CompLeaderboardSlot key={key} item={key} data={leadersAll[key]} /> </div>
                                </div>
                            )
                        })}
                    </div>
                </div >

            )
        }
    }

    return (
        <div>

        </div>
    )

}

export default CompLeaderboard;