import './ChatBox.css'
import TextDate from "../Atoms/TextDate";
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function MessageBubble({ text, myUser, userWhoSent, messageID, requestID, unixTimeStamp, type, townRoleID, resolveJoinRequest }) {
    const location = useLocation();
    const navigate = useNavigate();

    const [hover, setHover] = useState(false)

    const getText = () => {
        let allParts = text.split(" ");

        const toProfile = (user) => navigate(`/profile/${user}`, {
            state: {
                from: location.pathname
                    .substring(1, location.pathname.length)
            },
        })

        let result = allParts.map((part, index) => {
            if (part?.[0] === "@" && part.length > 1) {
                var invalidCharsPattern = /[^A-Za-z0-9_.]/g;
                const taggedTarget = part.replace(invalidCharsPattern, '');
                // This is to only highlight the name, considering it may be followed by punchation etc
                // suffixAndPrefix is two element array, ex "@Jake," turns into ["@", ","]
                let suffixAndPrefix = part.split(taggedTarget);
                if (taggedTarget?.toLowerCase() === myUser?.toLowerCase()) {
                    return <>
                        <span
                            key={index}
                            className='player-chat-tag tagging-me clickable'
                            onClick={() => toProfile(taggedTarget)}
                        >
                            {suffixAndPrefix?.[0]}
                            {taggedTarget}
                        </span>
                        {suffixAndPrefix?.[1]} </>
                } else if (part?.toLowerCase() === `@everyone`) {
                    return <>
                        <span
                            key={index}
                            className='player-chat-tag'
                        >
                            {suffixAndPrefix?.[0]}
                            {taggedTarget}
                        </span>
                        {suffixAndPrefix?.[1]} </>
                } else {
                    return <><span
                        key={index}
                        className='player-chat-tag clickable'
                        onClick={() => toProfile(taggedTarget)}
                    >
                        {suffixAndPrefix?.[0]}
                        {taggedTarget}
                    </span>
                        {suffixAndPrefix?.[1]} </>
                }
            }


            return part + " "
        })
        return result;
    }

    if (type === "SERVER_NOTIFICATION") {
        return (
            <div className='msgBubble'>
                <p className='server-notification'>{getText()}</p>
            </div>
        )
    }


    if (type === 'TOWN_BROADCAST') {
        return (
            <div className='msgBubble'>
                <p className='town-broadcast-user'>{userWhoSent}</p>
                <p className='broadcast-content'>{<i>{getText()}</i>}</p>
            </div>
        );
    }
    if (type === 'TOWN_JOIN_REQUEST') {
        let username = text.split(" ")[0]
        let restOfMsg = text.substring(username.length, text.length)

        return (<div className='msgBubble join-request'>
            <span
                onClick={() =>
                    navigate(`/profile/${username}`, {
                        state: {
                            from: location.pathname
                                .substring(1, location.pathname.length)
                        },
                    })
                }
                className='requester-username'
            >
                {username}
            </span>
            <span>{restOfMsg}</span>
            <div className={`request-responses`}>
                <button
                    className={townRoleID >= 3 ? 'clickable' : ''}
                    onClick={() => resolveJoinRequest(requestID, true)}
                >Accept</button>
                <button
                    className={townRoleID >= 3 ? 'clickable' : ''}
                    onClick={() => resolveJoinRequest(requestID, false)}
                >Deny</button>
            </div>
        </div>)
    }

    return (
        <div
            className='msgBubble'
            key={messageID}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <span
                onClick={() =>
                    navigate(`/profile/${userWhoSent?.replace(/#/g, "-")}`, {
                        state: {
                            from: location.pathname
                                .substring(1, location.pathname.length)
                                .includes("profile")
                                ? "plants"
                                : location.pathname.substring(1, location.pathname.length),
                        },
                    })
                }
                className="fromUser"
            >
                {userWhoSent}:
            </span>
            <span className='msgContent'>{getText()}</span>
            <span className='msgTimestamp'>
                {hover &&
                    <TextDate unixTimeStamp={Number(unixTimeStamp)} />
                }
            </span>
        </div>
    );
}

export default MessageBubble;