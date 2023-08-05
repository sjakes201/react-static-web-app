import React, { useEffect, useState } from "react";
import '../CSS/CompProfile.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function CompProfile({ getBal, getUser, getXP, type, setLoginBox, setOrderBox, orderNotice }) {
    const navigate = useNavigate();

    const [bal, setBal] = useState(0);
    const [user, setUser] = useState("");
    const [xp, setXP] = useState(0);

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setBal(getBal());
        let user = getUser();
        if (user && !user.includes("#")) {
            // they are considered 'logged in' when they have a claimed account, guest accounts are 'logged out'
            setLoggedIn(true)
        }
        setUser(getUser());
        setXP(getXP());
    }, [getBal, getUser, getXP]);


    return (
        <div className="user-profile">
            <div className="user-info">
                <div className='pfp' ><img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} alt='homie' /></div>
                <div className='profile-stats'>
                    <div>{user && user.includes("#") ? "Guest" : user}</div>
                    <div>XP: {xp}</div>
                    <div>${bal === 0 ? 0 : Math.round(bal * 100) / 100}</div>
                </div>


                <div className='login-prompt'>
                    {!loggedIn &&
                        <div>
                            <button
                                className='login-button'
                                onClick={
                                    () => setLoginBox(true)
                                }
                            >
                                Login
                            </button>
                        </div>

                    }
                    {loggedIn &&
                        <div>
                            <button onClick={() => {
                                localStorage.removeItem("token");
                                navigate('/');
                            }}
                                className='login-button'
                            >
                                Log out
                            </button>
                        </div>

                    }

                </div>


            </div>

            {type === 'tall' &&
                <div className="profileButtons">
                    <Link className='profileLink' to={`/account`}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/accounticon.png`} alt='profile/stats' />
                    </Link>
                    <div className={orderNotice ? 'profileLink orderNotice' : 'profileLink'} id='orderboard-button'>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/order-icon.png`} alt='orders' onClick={() => setOrderBox(true)} />
                    </div>
                    <Link className='profileLink' to={`/leaderboard`}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/leaderboard.png`} alt='leaderboard' />
                    </Link>
                    <Link className='profileLink' to={`/howtoplay`}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/questionmark.png`} alt='info/how to play' />
                    </Link>
                </div>}
        </div>
    )
}

export default CompProfile;