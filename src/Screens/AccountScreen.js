import React, { useEffect, useState } from 'react'
import './CSS/AccountScreen.css'
import CONSTANTS from '../CONSTANTS';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from "../WebSocketContext";



function AccountScreen() {
    const { waitForServerResponse } = useWebSocket();

    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({});
    const [cropCounts, setCropCounts] = useState({});
    const [produceCounts, setProduceCounts] = useState({});


    useEffect(() => {
        const token = localStorage.getItem('token');

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
                            <p>XP: {profileData.XP}</p>
                            <p>Balance: {profileData.Balance}</p>
                        </div>
                        {/* <div id='acc-permit-holder'>
                            <p id='acc-permits-label'>Permits:</p>
                            <div id='acc-permits-status'>
                                <p>Deluxe Crops: </p>
                                <p>Exotic Animals: </p>
                            </div>
                        </div> */}
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
                        <div className='acc-bottom'>
                            <p id='acc-contact-info'>Contact: livefarmgame.service@gmail.com</p>
                            <div id='acc-bottom-ad'> PLACEHOLDER </div>
                            {/* <p id='acc-privacy-policy'>Privacy policy</p> */}
                        </div>
                    </div>


                </div>
            }
        </div>
    )
}

export default AccountScreen