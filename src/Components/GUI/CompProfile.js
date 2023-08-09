import React, { useEffect, useState, useRef } from "react";
import '../CSS/CompProfile.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function CompProfile({ getBal, getUser, getXP, type, setLoginBox, setOrderBox, orderNotice }) {
    const navigate = useNavigate();

    const [bal, setBal] = useState(0);
    const [user, setUser] = useState("");
    const [xp, setXP] = useState(0);

    const [loggedIn, setLoggedIn] = useState(false);

    // Tooltips for buttons management
    const [tool1, setTool1] = useState(false);
    const [tool2, setTool2] = useState(false);
    const [tool3, setTool3] = useState(false);
    const [tool4, setTool4] = useState(false);

    const ref1 = useRef();
    const ref2 = useRef();
    const ref3 = useRef();
    const ref4 = useRef();

    const handleMouseOver = (buttonNum) => {
        switch (buttonNum) {
            case 1:
                ref1.current = setTimeout(() => {
                    setTool1(true);
                }, 500);
                break;
            case 2:
                ref2.current = setTimeout(() => {
                    setTool2(true);
                }, 500);
                break;
            case 3:
                ref3.current = setTimeout(() => {
                    setTool3(true);
                }, 500);
                break;
            case 4:
                ref4.current = setTimeout(() => {
                    setTool4(true);
                }, 500);
                break;
        }
    };

    const handleMouseOut = (buttonNum) => {
        // clear timeout when mouse leaves
        switch (buttonNum) {
            case 1:
                clearTimeout(ref1.current);
                setTool1(false);
                break;
            case 2:
                clearTimeout(ref2.current);
                setTool2(false);
                break;
            case 3:
                clearTimeout(ref3.current);
                setTool3(false);
                break;
            case 4:
                clearTimeout(ref4.current);
                setTool4(false);
                break;
        }
    };


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
                    <Link className='profileLink' to={`/account`}
                        onMouseOver={() => handleMouseOver(1)}
                        onMouseOut={() => handleMouseOut(1)}>
                        {
                            tool1 && <div className='toolTip'>
                                Profile info
                            </div>
                        }
                        <img src={`${process.env.PUBLIC_URL}/assets/images/accounticon.png`} alt='profile/stats'
                        />
                    </Link>
                    <div className={orderNotice ? 'profileLink orderNotice' : 'profileLink'} id='orderboard-button'
                        onMouseOver={() => handleMouseOver(2)}
                        onMouseOut={() => handleMouseOut(2)}>
                        {
                            tool2 && <div className='toolTip'>
                                Orders Board
                            </div>
                        }
                        <img src={`${process.env.PUBLIC_URL}/assets/images/order-icon.png`} alt='orders' onClick={() => setOrderBox(true)} />
                    </div>
                    <Link className='profileLink' to={`/leaderboard`}
                        onMouseOver={() => handleMouseOver(3)}
                        onMouseOut={() => handleMouseOut(3)}>
                        {
                            tool3 && <div className='toolTip'>
                                Leaderboard
                            </div>
                        }
                        <img src={`${process.env.PUBLIC_URL}/assets/images/leaderboard.png`} alt='leaderboard' />
                    </Link>
                    <Link className='profileLink' to={`/howtoplay`}
                        onMouseOver={() => handleMouseOver(4)}
                        onMouseOut={() => handleMouseOut(4)}>
                        {
                            tool4 && <div className='toolTip'>
                                How To Play
                            </div>
                        }
                        <img src={`${process.env.PUBLIC_URL}/assets/images/questionmark.png`} alt='info/how to play' />
                    </Link>
                </div>}
        </div>
    )
}

export default CompProfile;