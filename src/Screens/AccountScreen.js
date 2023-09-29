import React, { useEffect, useState } from 'react'
import './CSS/AccountScreen.css'
import CONSTANTS from '../CONSTANTS';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from "../WebSocketContext";

const DISCORD_REDIRECT = 'https://discord.com/api/oauth2/authorize?client_id=1143367795682320434&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Faccount&response_type=code&scope=identify'


function AccountScreen() {
    const { waitForServerResponse } = useWebSocket();

    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({});
    const [cropCounts, setCropCounts] = useState({});
    const [produceCounts, setProduceCounts] = useState({});


    useEffect(() => {
        const fetchData = async () => {

            try {
                if (waitForServerResponse) {
                    const response = await waitForServerResponse('profileInfo');
                    let data = response.body;
                    setProfileData(data)
                    const allGoods = Object.keys(CONSTANTS.Init_Market_Prices);
                    let allCrops = {};
                    let allProduce = {};

                    for (const property in data) {
                        if (!allGoods.includes(property)) {
                        } else {
                            if (property.includes('_')) {
                                // is animal produce
                                allProduce[property] = data[property];
                            } else {
                                // is crop
                                allCrops[property] = data[property];

                            }
                        }
                    }
                    setCropCounts(allCrops);
                    setProduceCounts(allProduce);
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

            let url = new URL(window.location.href);
            let code = url.searchParams.get("code");

            if (code) {
                // Send the code to your backend or handle as necessary
                let attempts = 0;
                const sendCode = async () => {
                    if (waitForServerResponse) {
                        const response = await waitForServerResponse('linkDiscordAcc', {
                            code: code
                        })
                        code = null;
                    } else if (attempts < 20) {
                        attempts++;
                        setTimeout(() => {
                            sendCode();
                            console.log('failed attempt')
                        }, 200)
                    }
                }
                sendCode();
            } else {
                console.error("No code found in URL");
            }

        }

        fetchData();

    }, [])


    return (

        <div className='acc-screen'>
            <div className='back-arrow-acc'>
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_dark.png`}
                    alt='profile/stats'
                    onClick={() => window.history.back()}

                />
            </div>
            {(Object.keys(profileData).length !== 0) &&
                <div className='acc-container'>
                    <div className='acc-row' id='acc-profile'>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/HIGHRESHOMIE.png`} id='acc-pfp' alt='profile pic' />
                        <div className='acc-user-info'>
                            <h3 id="acc-username">{profileData.Username}</h3>
                            <p>XP: {(profileData.XP).toLocaleString()}</p>
                            <p>Balance: ${(profileData.Balance).toLocaleString()}</p>
                        </div>

                        <a href={DISCORD_REDIRECT}>
                            <div className='discordAuthBox' onClick={() => window.location.href = DISCORD_REDIRECT}>
                                <img src={`${process.env.PUBLIC_URL}/assets/images/discord.png`} id='discordAccIcon' />
                                Link account
                            </div>
                        </a>
                        

                    </div>

                    <div className='acc-row' id='acc-stats'>
                        <div className='acc-collect-totals'>
                            <p>Total Harvests</p>
                            <div className='acc-collect-grids'>
                                {Object.keys(cropCounts).map((crop) => {
                                    return (<div className='acc-goods-slot' key={crop}>
                                        <img src={`${process.env.PUBLIC_URL}/assets/images/${crop}.png`} alt={crop} />
                                        {cropCounts[crop]}
                                    </div>)
                                })}
                            </div>
                        </div>
                        <div className='acc-collect-totals'>
                            Total Produce
                            <div className='acc-collect-grids'>
                                {Object.keys(produceCounts).map((produce) => {
                                    return (<div className='acc-goods-slot' key={produce}>
                                        <img src={`${process.env.PUBLIC_URL}/assets/images/${produce}.png`} alt={produce} />
                                        {produceCounts[produce]}
                                    </div>)
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


                </div>
            }
        </div>
    )
}

export default AccountScreen