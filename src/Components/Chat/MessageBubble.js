import './ChatBox.css'
import TextDate from "../Atoms/TextDate";
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function MessageBubble({ text, userWhoSent, messageID, requestID, unixTimeStamp, type, townRoleID, resolveJoinRequest }) {
    const location = useLocation();
    const navigate = useNavigate();

    const [hover, setHover] = useState(false)

    if (type === "SERVER_NOTIFICATION") {
        return (
            <div className='msgBubble'>
                <p className='server-notification'>{text}</p>
            </div>
        )
    }

    if (type === 'TOWN_BROADCAST') {
        return (
            <div className='msgBubble'>
                <p className='town-broadcast-user'>{userWhoSent}</p>
                <p className='broadcast-content'>{<i>{text}</i>}</p>
            </div>
        );
    }
    if (type === 'TOWN_JOIN_REQUEST') {
        let username = text.split(" ")[0]
        let restOfMsg = text.substring(username.length, text.length)

        return (<div className='msgBubble join-request'>
            <span
                onClick={() =>
                    navigate(`/profile/${username.replace(/#/g, "-")}`, {
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
            <span className='msgContent'>{text}</span>
            <span className='msgTimestamp'>
                {hover &&
                    <TextDate unixTimeStamp={Number(unixTimeStamp)} />
                }
            </span>
        </div>
    );
}

export default MessageBubble;