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

    return (
        <div className="user-profile">
            <div className="user-info">
                <div className='pfp' ><img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} alt='homie' /></div>
                <div className='profile-stats'>
                    <div>{user}</div>
                    <div>XP: {xp}</div>
                    <div>${bal === 0 ? 0 : Math.round(bal * 100) / 100}</div>
                </div>
                <div className='login-prompt'>
                    <button onClick={() => setLoginBox(true)}>
                        Login
                    </button>
                </div>
            </div>

            {type === 'tall' &&
                <div className="profileButtons">
                    <Link className='profileLink' to={`/leaderboard`}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/accounticon.png`} alt='profile/stats' />
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
                </div>}
        </div>
    )
}

export default CompProfile;