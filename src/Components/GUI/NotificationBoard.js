import React, { useContext, useState, useEffect } from 'react'
import { GameContext } from '../../GameContainer'
import "./NotificationBoard.css"
import CONSTANTS from '../../CONSTANTS';
import { useWebSocket } from '../../WebSocketContext';

function NotificationBoard({ }) {
    const { waitForServerResponse } = useWebSocket();
    const { setShowNotifBoard, userNotifications, setUserNotifications, setPremiumCurrency } = useContext(GameContext);

    /* 
    Each one should be an object that represents a bundle of notifications, even if only one notif in bundle
    Bundle is so multiple related notifs can be in one header
        {
            notificationIDs: [array of all notif id numbers],
            type: Type from notification bundle,
            timestamp: timestamp of notifs,
            bundleID: int for this notif bundle,
            details: {
                case per case
            }
        }
    */
    const [notifications, setNotifications] = useState([])
    const [currentViewing, setCurrentViewing] = useState(null)

    const setViewingBundle = (bundleID) => {
        if (currentViewing === bundleID) {
            setCurrentViewing(null)
        } else {
            setCurrentViewing(bundleID)
        }
    }

    const claimNotif = async (notifID) => {
        if (waitForServerResponse) {
            let targetNotif = userNotifications.find((n) => n.NotificationID === notifID)
            let reward = JSON.parse(targetNotif.Message)?.reward
            setPremiumCurrency((prev) => prev + reward);
            setUserNotifications((old) => old.filter((n) => n.NotificationID !== notifID))
            let res = await waitForServerResponse('acceptNotification', {
                processAction: "CLAIM",
                notificationID: notifID
            })
            if (res.body?.success) {
            } else {
                // Something wrong, undo
                setPremiumCurrency((prev) => prev - reward);
            }
        }
    }

    useEffect(() => {
        let curBundleID = 1;
        // All notifications
        const allNotifs = [];

        // Create a notification for each leaderboard reward group
        const leaderboardRewards = userNotifications.filter((notif) => notif.Type === 'LEADERBOARD_PREMIUM_REWARD')
        let differentTimestamps = [];
        leaderboardRewards.forEach((n) => {
            if (!differentTimestamps.includes(n.Timestamp)) {
                differentTimestamps.push(n.Timestamp)
            }
        })
        let allLeaderboardMsgs = [];
        differentTimestamps.forEach((ts) => {
            let allNotifs = leaderboardRewards.filter((n) => Number(n.Timestamp) === Number(ts)).map((nt) => { return { ...nt, Message: JSON.parse(nt.Message) } })
            let notifObj = {
                notificationIDs: allNotifs.map((n) => n.NotificationID),
                timestamp: Number(ts),
                type: 'LEADERBOARD_PREMIUM_REWARD',
                bundleID: curBundleID++,
                details: {
                    positions: allNotifs.map((n) => { return { ...n.Message, notificationID: n.NotificationID } })
                }
            }
            allLeaderboardMsgs.push(notifObj)
        })
        allNotifs.push(...allLeaderboardMsgs)

        // Add other types of notifications as needed...

        // Set array
        allNotifs.sort((a, b) => a.timestamp - b.timestamp)
        setNotifications(allNotifs);
    }, [userNotifications])


    const getMsgRows = () => {

        const leaderboardRewardRow = () => {
            return (
                <div className='leaderboard-reward-row'>
                    <img className='leaderboard-icon-suffix' src={`${process.env.PUBLIC_URL}/assets/images/leaderboard.png`} />
                    <p className='lb-reward-header'>Your leaderboard rewards</p>
                </div>
            )
        }

        function formatDate(milliseconds) {
            const date = new Date(milliseconds);
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

            const month = monthNames[date.getMonth()];
            const day = date.getDate();

            return `${month} ${day}`;
        }

        if (notifications.length === 0) return (<div className='notif-board-msg-row no-notifications basic-center'>All caught up!</div>)

        return (<>
            {notifications.map((notif) =>
                <div className={`notif-board-msg-row ${currentViewing === notif.bundleID ? 'selected-notif-bundle' : 'not-selected-bundle'}`}
                    onClick={() => { setViewingBundle(notif.bundleID) }}
                >
                    {
                        notif.type === 'LEADERBOARD_PREMIUM_REWARD' ?
                            leaderboardRewardRow(notif)
                            :
                            <div></div>
                    }
                    <p className='notif-date'>{formatDate(notif.timestamp)}</p>
                </div>)}
        </>)
    }

    const getRowInfo = (bundleID) => {
        let row = notifications.find((n) => n.bundleID === bundleID)
        const leaderboardRewardInfo = (rowInfo) => {
            let positions = rowInfo.details?.positions;
            return (<div className='lb-reward-info-container'>
                <p className='lb-reward-header-1'>
                    Congratulations on your leaderboard positions!
                    <img className='lb-header-icon' src={`${process.env.PUBLIC_URL}/assets/images/leaderboard.png`} />

                </p>
                <p className='lb-reward-header-2'>You have earned premium currency for each top 50 leaderboard position.</p>
                <p className='lb-reward-header-3'>You have the following unclaimed rewards:</p>
                <div className='unclaimed-lb-rewards'>
                    {positions.map((pos) => {
                        return <div className='lb-reward-claim'>
                            <p>#{pos.position} {CONSTANTS.InventoryDescriptions[pos.category]?.[0]}</p>
                            <div className='lb-reward-pc-count'>
                                {pos.reward}
                                <img src={`${process.env.PUBLIC_URL}/assets/images/premiumCurrency.png`} />
                            </div>
                            <button onClick={() => claimNotif(pos.notificationID)}>CLAIM</button>
                        </div>
                    })}
                </div>
            </div>)
        }
        return (<div className='row-info-area'>
            {row?.type === 'LEADERBOARD_PREMIUM_REWARD' ? (
                leaderboardRewardInfo(row)
            ) : <div className='row-info-default basic-center'>Click a notification for more details</div>}
        </div>)
    }

    return (
        <div
            className='fog-focus-light basic-center grow-box'
            onClick={(event) => {
                event.preventDefault();
                if (event.target === event.currentTarget) {
                    setShowNotifBoard(false)
                }
            }}
        >
            <div className='notif-board-container yellow-border'>
                <div className='notif-board-header'>
                    Notifications
                    <p className='closing-x' onClick={() => setShowNotifBoard(false)}>X</p>
                </div>
                <div className='notif-board-body'>
                    <div className='notif-board-scroll'>
                        {getMsgRows()}
                    </div>
                    <div className='notif-board-info'>
                        {getRowInfo(currentViewing)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationBoard