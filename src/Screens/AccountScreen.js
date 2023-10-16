import React, { useEffect, useState } from 'react'
import './CSS/AccountScreen.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebSocket } from "../WebSocketContext";
import { useParams } from 'react-router-dom';

import CONSTANTS from '../CONSTANTS';

const DISCORD_REDIRECT = 'https://discord.com/api/oauth2/authorize?client_id=1143367795682320434&redirect_uri=https%3A%2F%2Ffarmgame.live%2Faccount&response_type=code&scope=identify'


function AccountScreen() {
    let { username } = useParams();
    const location = useLocation();

    // # is for fragments in URL so we need to change # to - just for url username param. - and # are not allowed in chosen usernames
    username = username.replace(/-/g, '#')


    const { waitForServerResponse } = useWebSocket();
    const navigate = useNavigate();

    const [hasCode, setHasCode] = useState(false)
    const [profileData, setProfileData] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            if (waitForServerResponse) {
                const response = await waitForServerResponse('getProfileData', { targetUser: username });
                setProfileData(response.body)
            }
        }
        const checkDiscordAuthCode = async () => {
            let url = new URL(window.location.href);
            let code = url.searchParams.get("code");
            if (code) {
                setHasCode(true)
                // Send the code to your backend or handle as necessary
                let attempts = 0;
                const sendCode = async () => {
                    if (waitForServerResponse) {
                        const response = await waitForServerResponse('linkDiscordAcc', {
                            code: code
                        })
                        code = null;
                    } else if (attempts < 10) {
                        attempts++;
                        setTimeout(() => {
                            sendCode();
                        }, 500)
                    }
                }
                sendCode();
            } else {
                console.error("No code found in URL");
            }

        }
        fetchData();
        checkDiscordAuthCode();
    }, [username])

    const [activePoke, setActivePoke] = useState(false)

    const handlePoke = async () => {
        if (profileData.lastPoke < Date.now() - 60 * 1000) {
            setActivePoke(true);
            setTimeout(() => {
                setActivePoke(false)
            }, 1200)
            if (waitForServerResponse) {
                let pokeRes = await waitForServerResponse('pokeUser', { targetUsername: username })
                setProfileData((old) => {
                    let newData = { ...old }
                    newData.receivedPokes += 1;
                    newData.lastPoke = Date.now();
                    return newData;
                })
            }
        }
    }

    const backArrow = () => {
        const backFunc = () => {
            if(location?.state?.from) {
                return () => navigate(`/${location.state.from}`)
            } else {
                return () => navigate('/plants')
            }
        }

        return (
            <div className='back-arrow-acc'>
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_dark.png`}
                    alt='profile/stats'
                    onClick={backFunc()}

                />
            </div>
        )
    }

    if (Object.keys(profileData).length === 0) {
        return (
            <div className='acc-screen'>
                {backArrow()}
                <div className='acc-container'>
                    <div className='loadingIconAnimation centerSelf'></div>
                </div>
            </div>)
    }

    if (!profileData.username) {
        return (
            <div className='acc-screen'>
                {backArrow()}
                <div className='acc-container'>
                    <div className='centerSelf'><p>No profile for <i>'{username}'</i> found.</p></div>
                </div>
            </div>)
    }

    return (
        <div className='acc-screen'>
            {backArrow()}
            {
                <div className='acc-container'>
                    <div className='acc-row' id='acc-profile'>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/HIGHRESHOMIE.png`} id='acc-pfp' alt='profile pic' />
                        <div className='acc-user-info'>
                            <h3 id="acc-username">{profileData?.username}</h3>
                            <p>XP: {profileData?.XP?.toLocaleString()}</p>
                            <p>Balance: ${profileData?.Balance?.toLocaleString()}</p>
                        </div>

                        <div className='acc-poke-info'>
                            <img
                                src={activePoke ? `${process.env.PUBLIC_URL}/assets/images/duck_walking_right.gif` : `${process.env.PUBLIC_URL}/assets/images/duck_standing_right.png`}
                                className={`${profileData.lastPoke < Date.now() - 60 * 1000 ? 'pokable' : 'poked'}`}
                                onClick={() => handlePoke()}
                            />
                            <p>x </p>
                            <p>{profileData?.receivedPokes?.toLocaleString()}</p>

                        </div>

                        {profileData.isMe && (!hasCode ? (<a href={DISCORD_REDIRECT}>
                            <div className={`discordAuthBox ${hasCode ? 'syncedDiscord' : ''}`} onClick={() => window.location.href = DISCORD_REDIRECT}>
                                <img src={`${process.env.PUBLIC_URL}/assets/images/discord.png`} id='discordAccIcon' />
                                Link Discord
                            </div>
                        </a>) : (
                            <div className={`discordAuthBox ${hasCode ? 'syncedDiscord' : ''}`}>
                                <img src={`${process.env.PUBLIC_URL}/assets/images/discord.png`} id='discordAccIcon' />
                                Discord Linked!
                            </div>
                        ))}


                    </div>

                    <div className='acc-row' id='acc-stats'>
                        <div className='acc-collect-totals'>
                            <p>Total Harvests</p>
                            <div className='acc-collect-grids'>
                                {Object.keys(profileData).map((crop) => {
                                    if (crop in CONSTANTS.Init_Market_Prices && !crop.includes("_")) {
                                        return (<div className='acc-goods-slot' key={crop}>
                                            <img src={`${process.env.PUBLIC_URL}/assets/images/${crop}.png`} alt={crop} />
                                            {profileData[crop]?.toLocaleString()}
                                        </div>)
                                    }
                                })}
                            </div>
                        </div>
                        <div className='acc-collect-totals'>
                            Total Produce
                            <div className='acc-collect-grids'>
                                {Object.keys(profileData).map((produce) => {
                                    if (produce in CONSTANTS.Init_Market_Prices && produce.includes("_")) {
                                        return (<div className='acc-goods-slot' key={produce}>
                                            <img src={`${process.env.PUBLIC_URL}/assets/images/${produce}.png`} alt={produce} />
                                            {profileData[produce]?.toLocaleString()}
                                        </div>)
                                    }
                                })}
                            </div>
                        </div>
                    </div>

                    <div className='acc-row' id='acc-other'>
                        <div className='acc-line-decor'>
                            {Array.from({ length: 21 }, (_, i) =>
                                <img key={i} src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} alt={'corn'} />)
                            }
                        </div>
                    </div>


                </div >
            }
        </div >
    )
}

export default AccountScreen