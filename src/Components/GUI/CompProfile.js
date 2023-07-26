import React, { useEffect, useState } from "react";
import '../../CONSTANTS'
import CONSTANTS from "../../CONSTANTS";
import '../CSS/CompProfile.css'
import { Link } from 'react-router-dom';

function CompProfile({ getBal, getUser, getXP, type, setLoginBox }) {

    const [bal, setBal] = useState(0);
    const [user, setUser] = useState("");
    const [xp, setXP] = useState(0);

    useEffect(() => {
        setBal(getBal());
        setUser(getUser());
        setXP(getXP());
    }, [getBal, getUser, getXP]);

    if (type === 'tall') {
        return (
            <div style={{height: '100%'}}>
                <div className="containerTall">
                    <div className='pfpTall' ><img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} alt='homie' /></div>
                    <div>
                        <div className='userTall'>{user}</div>
                        <div className='profileXPTall'>XP: {xp}</div>
                        <div className='balanceTall'>${bal === 0 ? 0 : Math.round(bal * 100) / 100}</div>
                    </div>
                    <div>
                        <button onClick={ () => setLoginBox(true)}>
                            Login
                        </button>
                    </div>
                </div>
                <div className="profileButtons">
                    <Link className='profileLink' to={`/leaderboard`}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} alt='profile/stats' />
                    </Link>
                    <Link className='profileLink' to={`/leaderboard`}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} alt='town' />
                    </Link>
                    <Link className='profileLink' to={`/leaderboard`}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/leaderboard.png`} alt='leaderboard' />
                    </Link>
                    <Link className='profileLink' to={`/leaderboard`}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/questionmark.png`} alt='info/how to play' />
                    </Link>
                </div>
            </div>
        )
    }
    return (
        <div className="containerWide">
            <div className='pfpWide' ><img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} alt='homie' /></div>
            <div className='infoWide'>
                <div>{user}</div>
                <div>XP: {xp}</div>
                <div>${bal < 1 ? 0 : Math.round(bal * 100) / 100}</div>
            </div>
        </div>
    )

}

export default CompProfile;