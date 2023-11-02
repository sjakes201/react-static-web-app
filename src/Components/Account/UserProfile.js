import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import './AccountComponents.css'
import { GameContext } from '../../GameContainer';
import CONSTANTS from '../../CONSTANTS';
import { useWebSocket } from "../../WebSocketContext";
import PfpSelection from './PfpSelection';
import LoadingWheel from '../Atoms/LoadingWheel'

const DISCORD_REDIRECT =
    "https://discord.com/api/oauth2/authorize?client_id=1143367795682320434&redirect_uri=https%3A%2F%2Ffarmgame.live%2FdiscordAuth&response_type=code&scope=identify"

function UserProfile({ username }) {
    const { getUser } = useContext(GameContext);
    const { waitForServerResponse } = useWebSocket();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (waitForServerResponse) {
                const response = await waitForServerResponse("getProfileData", {
                    targetUser: username,
                });
                setProfileData(response.body);
                if (response?.body?.profilePic) {
                    setPfpName(response.body.profilePic)
                }
                if (response?.body?.friendStatus) {
                    setFriendStatus(response.body.friendStatus)
                }
            }
        };
        fetchData();
    }, [username]);

    const [profileData, setProfileData] = useState({});
    const [activePoke, setActivePoke] = useState(false);
    const [pfpName, setPfpName] = useState("reg_maroon");

    const [pfpMenu, setPfpMenu] = useState(false)

    const [friendStatus, setFriendStatus] = useState("friends")
    const [friendToolTip, setFriendToolTip] = useState(false);
    const [tipTimerID, setTipTimerID] = useState(null);

    const handlePoke = async () => {
        if (profileData.lastPoke < Date.now() - 60 * 1000) {
            setActivePoke(true);
            setTimeout(() => {
                setActivePoke(false);
            }, 1200);
            if (waitForServerResponse) {
                let pokeRes = await waitForServerResponse("pokeUser", {
                    targetUsername: username,
                });
                setProfileData((old) => {
                    let newData = { ...old };
                    newData.receivedPokes += 1;
                    newData.lastPoke = Date.now();
                    return newData;
                });
            }
        }
    };

    const addFriendButton = () => {
        const addFriend = async () => {
            if (friendStatus === 'not_friends') {
                const res = await waitForServerResponse('sendFriendRequest', { targetUsername: username });
                if (res.body.success) {
                    setFriendStatus('pending_sent')
                }
            }
        }

        return (
            <div
                onClick={addFriend}
                className='friendButton'
                onMouseEnter={() => {
                    setTipTimerID(setTimeout(() => { setFriendToolTip(true) }, 700))
                }}
                onMouseLeave={() => {
                    clearTimeout(tipTimerID);
                    setFriendToolTip(false)
                }}
            >
                {friendToolTip &&
                    <p className='friendToolTip'>
                        {friendStatus === 'pending_sent' && 'Sent request pending'}
                        {friendStatus === 'friends' && 'Friends'}
                        {friendStatus === 'pending_received' && 'Friend request received'}
                        {friendStatus === 'not_friends' && 'Send friend request'}
                    </p>
                }
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/gui/addFriend.png`}
                    className={`${friendStatus === 'pending_sent' ? 'friendPending' : 'clickable'}`}
                />
            </div>
        )
    }

    if (Object.keys(profileData).length === 0) {
        return (<div className='wh100per basic-center'>
            <LoadingWheel />
        </div>)
    }

    if (!profileData.username) {
        return (
            <div className='wh100per basic-center'>
                <p>No profile for <i>'{username}'</i> found.</p>
            </div>
        )
    }

    return (
        <div className='wh100per'>
            {pfpMenu && <PfpSelection close={() => setPfpMenu(false)} setPfpName={setPfpName} />}

            <div className="acc-row" id="acc-profile">
            {(friendStatus !== 'friends' && username != getUser()) && addFriendButton()}
                <div
                    className={`profile-pic-container ${getUser() === username ? 'clickable' : ''}`}
                    onClick={() => setPfpMenu(getUser() === username)}
                >
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/profilePics/${pfpName}.png`}
                        alt="profile pic"
                        draggable={false}
                        id='pfp-img'
                    />
                    {getUser() === username &&
                        <img
                            id='pfp-switch-icon'
                            src={`${process.env.PUBLIC_URL}/assets/images/Gears.png`}
                        />
                    }

                </div>

                <div className="acc-user-info">
                    <h3 id="acc-username">{profileData?.username?.replace(/#/g, "-")}</h3>
                    <p>XP: {profileData?.XP?.toLocaleString()}</p>
                    <p>Balance: ${profileData?.Balance?.toLocaleString()}</p>
                </div>

                <img
                    draggable={false}
                    id='town-info-icon'
                    src={`${process.env.PUBLIC_URL}/assets/images/townButton2.png`}
                    onClick={() => {
                        if (profileData.townName) {
                            navigate(`/towns/${profileData.townName}`,
                                {
                                    state:
                                        { from: location.pathname.substring(1, location.pathname.length) }
                                })
                        }
                    }}
                />
                <div className='acc-user-town-info'>
                    <p>
                        Town: {profileData.townName ?
                            (<span
                                id='townLink'
                                onClick={() => navigate(`/towns/${profileData.townName}`,
                                    {
                                        state:
                                            { from: location.pathname.substring(1, location.pathname.length) }
                                    })}
                            >{profileData.townName}</span>)
                            :
                            (<span id='noTown'>None</span>)}
                    </p>
                    {profileData?.totalContributedTownXP !== undefined &&
                        <p>
                            All-Time XP: {profileData.totalContributedTownXP.toLocaleString()}
                        </p>
                    }
                </div>
                <div className="acc-poke-info">
                    <img
                        draggable={false}
                        src={
                            activePoke
                                ? `${process.env.PUBLIC_URL}/assets/images/duck_walking_right.gif`
                                : `${process.env.PUBLIC_URL}/assets/images/duck_standing_right.png`
                        }
                        className={`${profileData.lastPoke < Date.now() - 60 * 1000
                            ? "pokable"
                            : "poked"
                            }`}
                        onClick={() => handlePoke()}
                    />
                    <p>x </p>
                    <p>{profileData?.receivedPokes?.toLocaleString()}</p>
                </div>

                {profileData.isMe &&
                    (!localStorage.getItem("discordLinked") ? (
                        <a href={DISCORD_REDIRECT}>
                            <div
                                className={`discordAuthBox ${localStorage.getItem("discordLinked") ? "syncedDiscord" : ""
                                    }`}
                                onClick={() => {
                                    window.location.href = DISCORD_REDIRECT;
                                    if (window.gtag) {
                                        window.gtag('event', 'discord_link', {
                                            'event_category': 'Social',
                                            'event_label': 'Linked Discord'
                                        })
                                    }
                                }}
                            >
                                <img
                                    src={`${process.env.PUBLIC_URL}/assets/images/discord.png`}
                                    id="discordAccIcon"
                                />
                                Link Discord
                            </div>
                        </a>
                    ) : (
                        <div
                            className={`discordAuthBox ${localStorage.getItem("discordLinked") ? "syncedDiscord" : ""}`}
                        >
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/images/discord.png`}
                                id="discordAccIcon"
                            />
                            Discord Linked!
                        </div>
                    ))}
            </div>

            <div className="acc-row" id="acc-stats">
                <div className="acc-collect-totals">
                    <p>Total Harvests</p>
                    <div className="acc-collect-grids">
                        {Object.keys(profileData).map((crop) => {
                            if (
                                crop in CONSTANTS.Init_Market_Prices &&
                                !crop.includes("_")
                            ) {
                                return (
                                    <div className="acc-goods-slot" key={crop}>
                                        <img
                                            src={`${process.env.PUBLIC_URL}/assets/images/${crop}.png`}
                                            alt={crop}
                                        />
                                        {profileData[crop]?.toLocaleString()}
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
                <div className="acc-collect-totals">
                    Total Produce
                    <div className="acc-collect-grids">
                        {Object.keys(profileData).map((produce) => {
                            if (
                                produce in CONSTANTS.Init_Market_Prices &&
                                produce.includes("_")
                            ) {
                                return (
                                    <div className="acc-goods-slot" key={produce}>
                                        <img
                                            src={`${process.env.PUBLIC_URL}/assets/images/${produce}.png`}
                                            alt={produce}
                                        />
                                        {profileData[produce]?.toLocaleString()}
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}



export default UserProfile