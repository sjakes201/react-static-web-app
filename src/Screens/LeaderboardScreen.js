import React, { useEffect, useState, useContext } from "react";
import CompLeaderboard from "../Components/Leaderboard/CompLeaderboard";
import "./CSS/LeaderboardScreen.css";
import { useNavigate, useLocation } from "react-router-dom";
import { GameContext } from "../GameContainer";

function LeaderboardScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshLeaderboard, leaderboardData } = useContext(GameContext)
  const { subPage = '', subSection = '' } = location.state || {};

  useEffect(() => {
    refreshLeaderboard();
  }, []);

  if (localStorage.getItem("token") === null) {
    // no auth token present
    navigate("/");
  }

  //ALLTIME, WEEKLY
  const [type, setType] = useState(subPage ? subPage : "WEEKLY");

  const backArrow = () => {
    const backFunc = () => {
      if (location?.state?.from === "animals") {
        return () => navigate("/animals");
      } else {
        return () => navigate("/plants");
      }
    };

    return (
      <div className="back-arrow-leader">
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_light.png`}
          alt="profile/stats"
          onClick={backFunc()}
        />
      </div>
    );
  };

  return (
    <div id="leaderboards" className="leaderboards">
      {backArrow()}
      <div className="main-board">
        <div className="buttons">
          <div
            id="weekly-title"
            className={
              type === "WEEKLY" ? "type-button active" : "type-button inactive"
            }
            onClick={() => setType("WEEKLY")}
          >
            <h3>WEEKLY</h3>
          </div>

          <div
            id="alltime-title"
            className={
              type === "ALLTIME" ? "type-button active center-button" : "type-button inactive center-button"
            }
            onClick={() => setType("ALLTIME")}
          >
            <h3>ALL TIME</h3>
          </div>

          <div
            id="event-title"
            className={
              type === "EVENT" ? "type-button active" : "type-button inactive"
            }
            onClick={() => setType("EVENT")}
          >
            <h3>EVENT</h3>
          </div>
        </div>
        <div className="leaderboard-container">
          <CompLeaderboard
            type={type}
            leadersWeekly={leaderboardData.temp || {}}
            leadersAll={leaderboardData.all || {}}
          />{" "}
        </div>
      </div>
    </div>
  );
}

export default LeaderboardScreen;
