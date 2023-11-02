import React, { useEffect, useState, useContext } from "react";
import "./CSS/AccountScreen.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import FriendsScreen from "../Components/Account/FriendsScreen";
import UserProfile from "../Components/Account/UserProfile";
import { GameContext } from "../GameContainer";


function AccountScreen() {
  let { username } = useParams();
  const { getUser } = useContext(GameContext);
  // # is for fragments in URL so we need to change # to - just for url username param. - and # are not allowed in chosen usernames
  username = username.replace(/-/g, "#");
  const location = useLocation();

  const navigate = useNavigate();

  const [accountTab, setAccountTab] = useState("profile")

  useEffect(() => {
    setAccountTab("profile")
  }, [username])

  const backArrow = () => {
    const backFunc = () => {
      if (location?.state?.from) {
        return () => navigate(`/${location.state.from}`);
      } else {
        return () => navigate("/plants");
      }
    };

    return (
      <div className="back-arrow-acc">
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_dark.png`}
          alt="profile/stats"
          onClick={backFunc()}
        />
      </div>
    );
  };

  return (
    <div className="acc-screen basic-center">
      {backArrow()}
      {
        <div className="acc-container">
          <div className='accNavButtons basicCenter'>
            {username === getUser() &&
              (<>
                <button
                  className={`clickable yellow-border-thin basic-center ${accountTab === 'profile' ? 'activeAccButton' : ''}`}
                  onClick={() => setAccountTab('profile')}
                >
                  <img src={`${process.env.PUBLIC_URL}/assets/images/homie.png`} />
                </button>
                <button className={`clickable yellow-border-thin basic-center ${accountTab === 'friends' ? 'activeAccButton' : ''}`}
                  onClick={() => setAccountTab('friends')}
                >
                  <img src={`${process.env.PUBLIC_URL}/assets/images/gui/friendsIcon.png`} />
                </button>
              </>)
            }
          </div>
          <div className='orange-border-marginless profile-info'>
            {
              accountTab === "profile" &&
              <UserProfile username={username} />
            }
            {
              accountTab === "friends" &&
              <FriendsScreen />
            }
          </div>

        </div>
      }
    </div >
  );
}

export default AccountScreen;
