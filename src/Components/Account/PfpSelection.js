import React, { useEffect, useContext, useState } from 'react'
import { useWebSocket } from '../../WebSocketContext'
import { GameContext } from '../../GameContainer';
import './AccountComponents.css'
import LoadingWheel from '../Atoms/LoadingWheel';

function PfpSelection({ close, setPfpName }) {
    const { waitForServerResponse } = useWebSocket();
    const { setProfilePic } = useContext(GameContext)
    const [unlockedPfps, setUnlockedPfps] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            if (waitForServerResponse) {
                let result = await waitForServerResponse('getUnlockedPfp');
                console.log(result)
                if (result?.body?.pfpInfos) {
                    result.body.pfpInfos.sort((a, b) => {
                        if (a.Type === 'xp_unlock' && b.Type === 'xp_unlock' && a.Description && b.Description) {
                            return parseInt(a.Description.split(" ")[1]) - parseInt(b.Description.split(" ")[1])
                        }
                        if (a.Type === 'secret') return -1;
                        if (a.Type === 'default') return -1
                        return a.UnlockID - b.UnlockID
                    })
                    setUnlockedPfps(result.body.pfpInfos)
                }
            }
        }
        fetchData();
    }, [])

    const setNewPfp = async (unlockID, unlockName) => {
        if (waitForServerResponse) {
            await waitForServerResponse('setProfilePic', { unlockID: unlockID });
            setPfpName(unlockName);
            setProfilePic(unlockName)
            close();
        }
    }

    const pfpInfoIcon = (unlockName, description, unlockID) => {
        return (
            <div
                className={`pfp-item ${unlockName ? 'unlocked' : 'not-unlocked'}`}
                onClick={() => {
                    if (unlockName) setNewPfp(unlockID, unlockName)
                }}
            >
                {unlockName ?
                    (<img key={unlockID} src={`${process.env.PUBLIC_URL}/assets/images/profilePics/${unlockName}.png`} />)
                    :
                    (<img key={unlockID} src={`${process.env.PUBLIC_URL}/assets/images/profilePics/reg_maroon.png`} />)
                }

                <p>{description}</p>
            </div>
        )
    }

    return (
        <div
            className='fog-focus-dark basic-center'
            onClick={(event) => {
                event.preventDefault();
                if (event.target === event.currentTarget) {
                    close()
                }
            }}>
            <div className='yellow-border pfp-grid'>
                <span
                    className='closing-x'
                    onClick={close}
                >X</span>
                {unlockedPfps.length === 0 ?
                    (
                        <LoadingWheel />
                    ) : (
                        unlockedPfps.map((pfpData) => pfpInfoIcon(pfpData.UnlockName, pfpData.Description, pfpData.UnlockID))
                    )}
            </div>
        </div>
    )
}

export default PfpSelection;