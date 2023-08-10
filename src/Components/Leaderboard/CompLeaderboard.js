import React, { useEffect, useState } from 'react'
import CompLeaderboardSlot from './CompLeaderboardSlot';

function CompLeaderboard({ type, leadersWeekly, leadersAll }) {
    if (Object.keys(leadersAll).length === 0 || Object.keys(leadersWeekly).length === 0) {
        return (<div></div>)
    }
    if (type === 'WEEKLY') {
        if (Object.keys(leadersWeekly).length) {
            return (
                <div style={{
                    paddingTop: '2%',
                    paddingBottom: '2%',
                    paddingLeft: '1%',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1%' }}>

                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} style={{ height: '20vh' }} />
                        <div style={{ width: '49%', height: '100%', border: '1px solid black', textAlign: 'center', padding: '10px', fontSize:'1.8vh', overflowY: 'auto' }}>
                            <p>These are the farming leaderboards! Positions refresh every 4 hours.</p>
                            <hr style={{ width: '50%', marginTop: '2px', marginBottom: '2px' }}></hr>
                            <p>They contain the total crop and animal produce farmed over the past week and all time.</p>
                            <p>Weekly leaderboard resets 11:59 Sunday (UTC), and all time leaderboards never reset.</p>
                            <hr style={{ width: '50%', marginTop: '2px', marginBottom: '2px' }}></hr>
                            <p>The all time leaderboard contains the current richest players' balances, which decrease as money is spent. Everything else are all time totals: even if you sell your goods.</p>
                        </div>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} style={{ height: '20vh' }} />

                    </div>
                    <div style={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: '49% 49%',
                        rowGap: '.4%',
                        columnGap: '1%',
                        paddingBottom: '5%'
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