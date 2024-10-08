import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './FriendComponents.css'

const MS_FRIEND_FEED_COOLDOWN = 30 * 60 * 1000

function FriendRow({ profilePic, username, lastFeed, theirLastFeed, acceptedFlag, lastActive, removeFriend, acceptFriendRequest, feedFriendAnimal, status }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [confirmRemove, setConfirmRemove] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [recentFeedTip, setRecentFeedTip] = useState(false)

    const removeFriendButton = () => {
        return (<button
            className='friendOptions clickable basic-center'
            onClick={() => {
                if (confirmRemove) {
                    removeFriend(username)
                } else {
                    setConfirmRemove(true);
                    setTimeout(() => {
                        setConfirmRemove(false)
                    }, 4000)
                }
            }}
        >
            {confirmRemove ? 'x?' : 'x'}
        </button>)
    }

    const feedCart = () => {
        if (lastFeed + 1500 > Date.now()) {
            setTimeout(() => setRefresh((old) => !old), 1510);
            return (
                <img draggable={false} src={`${process.env.PUBLIC_URL}/assets/images/GUI/friendsCartFull.gif`} />
            )
        } else if (Date.now() > lastFeed + MS_FRIEND_FEED_COOLDOWN) {
            return (<img draggable={false} src={`${process.env.PUBLIC_URL}/assets/images/GUI/friendsCartFull.png`} />)
        } else {
            return (<img draggable={false} src={`${process.env.PUBLIC_URL}/assets/images/GUI/friendsCartEmpty.png`} />)
        }
    }

    const didTheyRecentlyFeed = () => {
        return (Date.now() - theirLastFeed) < (2 * 24 * 60 * 60 * 1000)
    }

    if (status === "OUTGOING") {
        return (
            <div className='friendRowContainer yellow-border-thin pendingRequest'>
                <div
                    onClick={() =>
                        navigate(`/profile/${username}`, {
                            state: {
                                from: location.pathname.substring(
                                    1,
                                    location.pathname.length,
                                ),
                                subPage: "friends"
                            },
                        })
                    }
                    className='leftAligned clickable'
                >
                    <img
                        className='friendPfP'
                        src={`${process.env.PUBLIC_URL}/assets/images/profilePics/${profilePic}.png`}
                    />
                    <p className='friendUsername'
                    >
                        {username}
                    </p>
                </div>

                <button
                    className='pendingRequestButton basic-center clickable'
                    onClick={() => removeFriend(username)}
                >
                    x
                </button>
                <i className='outgoing-status'>(sent)</i>

            </div>)
    }

    if (acceptedFlag === 1) {
        return (
            <div className='friendRowContainer yellow-border-thin acceptedRequest'>
                <div
                    onClick={() =>
                        navigate(`/profile/${username}`, {
                            state: {
                                from: location.pathname.substring(
                                    1,
                                    location.pathname.length,
                                ),
                                subPage: "friends"
                            },
                        })
                    }
                    className='leftAligned clickable'
                >
                    <img
                        className='friendPfP'
                        src={`${process.env.PUBLIC_URL}/assets/images/profilePics/${profilePic}.png`}
                    />
                    <p className='friendUsername'
                    >
                        {username}
                    </p>
                    <p className={`friendActiveStatus ${lastActive === 'Online' ? 'onlineStatus' : ''}`}>
                        {lastActive}
                    </p>
                </div>
                <div className='rightAligned'>
                    {recentFeedTip &&
                        <p className='recent-feed-tip'>
                            <div>They recently</div>
                            <div>fed your animals!</div>
                        </p>
                    }
                    {didTheyRecentlyFeed() &&
                        <img
                            className='recent-feed'
                            onMouseEnter={() => setRecentFeedTip(true)}
                            onMouseLeave={() => setRecentFeedTip(false)}
                            src={`${process.env.PUBLIC_URL}/assets/images/animal_reactions/fullheart.png`
                            } />
                    }
                    {Date.now() > lastFeed + MS_FRIEND_FEED_COOLDOWN ? (
                        <button
                            className='feedButton clickable basic-center feedable'
                            onClick={() => feedFriendAnimal(username)}
                        >
                            {feedCart()}
                        </button>
                    ) : (
                        <button
                            className='feedButton basic-center'
                        >
                            {feedCart()}
                        </button>

                    )}
                    {removeFriendButton()}
                </div>
            </div>
        )
    }
    return (
        <div className='friendRowContainer yellow-border-thin pendingRequest'>
            <div
                onClick={() =>
                    navigate(`/profile/${username}`, {
                        state: {
                            from: location.pathname.substring(
                                1,
                                location.pathname.length,
                            ),
                            subPage: "friends"
                        },
                    })
                }
                className='leftAligned clickable'
            >
                <img
                    className='friendPfP'
                    src={`${process.env.PUBLIC_URL}/assets/images/profilePics/${profilePic}.png`}
                />
                <p className='friendUsername'
                >
                    {username}
                </p>
            </div>

            <button
                className='pendingRequestButton basic-center clickable'
                onClick={() => acceptFriendRequest(username)}
            >
                &#10003;
            </button>

            <button
                className='pendingRequestButton basic-center clickable'
                onClick={() => removeFriend(username)}
            >
                x
            </button>

        </div>
    )

}

export default FriendRow