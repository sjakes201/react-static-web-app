import React, { useContext } from 'react'
import { GameContext } from '../../GameContainer';
import { useNavigate } from 'react-router-dom';
import "./AccountDropdown.css"

function AccountDropdown({ closeDropDown }) {
    const navigate = useNavigate();
    const { setShowLoginRewards, setShowSettinsGUI, setShowNotifBoard, alertNotifications } = useContext(GameContext);

    return (
        <div className='dropdown-container'>
            <div className='dropdown-item'
                id='close-dropdown'
                onClick={() => closeDropDown()}>X</div>
            <div className='dropdown-item'
                onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/");
                    window.location.reload(false);
                }}
            >Log out</div>
            <div className='dropdown-item'
                onClick={() => {
                    setShowLoginRewards(true);
                    closeDropDown();
                }}
            >
                Login rewards
            </div>
            <div className='dropdown-item'
                onClick={() => {
                    setShowNotifBoard(true);
                    closeDropDown();
                }}
            >
                {alertNotifications && <img className='in-dropdown-notice' src={`${process.env.PUBLIC_URL}/assets/animations/notice.gif`} />}
                My Notifications</div>
            <div className='dropdown-item'
                onClick={() => {
                    setShowSettinsGUI(true);
                    closeDropDown();
                }}
            >Settings</div>
            <div className='dropdown-item'>
                <a
                    target="_blank"
                    href="https://discord.gg/jrxWrgNCHw"
                    className='dropdown-discord'
                >
                    Discord
                </a>
            </div>
        </div>
    )
}

export default AccountDropdown