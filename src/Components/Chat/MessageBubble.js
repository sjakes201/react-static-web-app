import './ChatBox.css'
import TextDate from "../Atoms/TextDate";
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function MessageBubble({ text, userWhoSent, unixTimeStamp }) {
    const location = useLocation();
    const navigate = useNavigate();

    const [hover, setHover] = useState(false)

    if (userWhoSent === 'Server') {
        return (
            <div className='msgBubble'>
                <p className='broadcastContent'>{<i>{text}</i>}</p>
            </div>
        );
    }
    return (
        <div
            className='msgBubble'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <span
                onClick={() =>
                    navigate(`/profile/${userWhoSent}`, {
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