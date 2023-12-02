import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './FriendComponents.css'
import { useWebSocket } from '../../WebSocketContext'
import FriendRow from './FriendRow';

function FriendsScreen() {
    const { waitForServerResponse } = useWebSocket();
    const navigate = useNavigate();
    const location = useLocation();

    const [friendsData, setFriendsData] = useState([]);
    const [helpInfo, setHelpInfo] = useState(false);
    const [userSearch, setUserSearch] = useState(false);

    const removeFriend = async (targetUsername) => {
        if (waitForServerResponse) {
            let res = await waitForServerResponse('removeFriend', { targetUsername: targetUsername })
            if (res.body.success) {
                setFriendsData((oldFriends) => oldFriends.filter((friend) => friend.friendUsername !== targetUsername))
            }
        }
    }

    const acceptFriendRequest = async (targetUsername) => {
        if (waitForServerResponse) {
            let res = await waitForServerResponse('acceptFriendRequest', { targetUsername: targetUsername })
            if (res.body.success) {
                getFriendsData()
            }
        }
    }

    const getFriendsData = async () => {
        if (waitForServerResponse) {
            let res = await waitForServerResponse('getFriendsData');
            if (res?.body?.friendsData) {
                res.body.friendsData.sort((a, b) => a.acceptedFlag === 1 ? -1 : 1)
                setFriendsData([...res.body.friendsData, ...res.body.outgoingRequests])
            }
        }
    }

    const feedFriendAnimal = async (targetUsername) => {
        if (waitForServerResponse) {
            let res = await waitForServerResponse('feedFriendAnimal', { targetUsername: targetUsername });
            if (res?.body?.success) {
                setFriendsData((old) => old.map((friend) => {
                    if (friend.friendUsername === targetUsername) {
                        let newFriend = { ...friend };
                        newFriend.yourLastFeed = Date.now();
                        return newFriend
                    }
                    return friend;
                }))
            }
        }
    }

    const helpScreen = () => {
        return (<div
            className='fog-focus-dark basic-center'
            onClick={(event) => {
                event.preventDefault();
                if (event.target === event.currentTarget) {
                    setHelpInfo(false)
                }
            }}>
            <div
                className='helpMenu yellow-border'
            >
                <button
                    className='closing-x'
                    onClick={() => setHelpInfo(false)}
                >X</button>
                <div className='friendsHelpSection'>
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/GUI/friendsIcon.png`}
                    />
                    <p>
                        You can add friends in game by going to their profile and pressing the <img id='inTextAddFriend' src={`${process.env.PUBLIC_URL}/assets/images/GUI/addFriend.png`} /> icon. You can view the profiles of your friends and when they were last online.
                    </p>
                </div>
                <div className='friendsHelpSection'>
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/GUI/friendsCartFull.gif`}
                    />
                    <p>
                        Clicking the cart will feed your friend's lowest happiness animal a double strength loved food. It has a 30 minute cooldown per friend and does not cost you any of your crops.
                    </p>
                </div>
            </div>
        </div>)
    }

    const [searchValue, setSearchValue] = useState("");

    const profileNavigate = (e) => {
        e.preventDefault()
        navigate(`/profile/${searchValue}`, {
            state: {
                from: location.pathname.substring(
                    1,
                    location.pathname.length,
                ),
            },
        })
    }

    const handleChange = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z0-9_.-]*$/;

        if (value.length <= 24 && regex.test(value)) {
            setSearchValue(value);
        }
    };

    const userSearchMenu = () => {
        return (<div
            className='fog-focus-dark basic-center'
            onClick={(event) => {
                event.preventDefault();
                if (event.target === event.currentTarget) {
                    setUserSearch(false)
                }
            }}>
            <div className='userSearch yellow-border'>
                <form onSubmit={profileNavigate}>
                    <input
                        type='text'
                        value={searchValue}
                        onChange={handleChange}
                        maxLength="24"
                        placeholder='Username'
                        autoFocus
                    />
                </form>

                <button
                    id='userSearchButton'
                    className='basic-center'
                    onClick={(e) => profileNavigate(e)}
                    type='button'
                >
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/GUI/searchBlue.png`}
                    />
                </button>

            </div>
        </div>)
    }

    useEffect(() => {
        getFriendsData();
    }, [])

    return (
        <div className='friendsScreen'>
            {helpInfo && helpScreen()}
            {userSearch && userSearchMenu()}
            <div className='friendsTopBar'>
                <p>Friends</p>
                <div className='friendsBarButtons'>
                    <button
                        id='friendsHelp'
                        className='clickable'
                        onClick={() => setHelpInfo(true)}
                    >
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/images/questionmark.png`}
                        />
                    </button>
                    <button
                        className='clickable'
                        onClick={() => setUserSearch(true)}
                    >
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/images/GUI/searchBlue.png`}
                        />
                    </button>
                </div>
            </div>
            <div className='friendsTable'>
                {friendsData.map((friend) => {
                    return (<FriendRow
                        key={friend.friendUsername}
                        profilePic={friend.friendProfilePic}
                        lastActive={friend.friendLastActive}
                        username={friend.friendUsername}
                        lastFeed={Number(friend.yourLastFeed)}
                        theirLastFeed={Number(friend.theirLastFeed)}
                        acceptedFlag={friend.acceptedFlag}
                        removeFriend={removeFriend}
                        acceptFriendRequest={acceptFriendRequest}
                        feedFriendAnimal={feedFriendAnimal}
                        status={friend?.status}
                    />)
                })}
            </div>
        </div>
    )
}


export default FriendsScreen;