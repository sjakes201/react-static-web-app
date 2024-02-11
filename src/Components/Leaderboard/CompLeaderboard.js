import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CompLeaderboardSlot from "./CompLeaderboardSlot";
import { GameContext } from "../../GameContainer";

function CompLeaderboard({
  type,
  leadersWeekly,
  leadersAll,
}) {
  const { getUser, getUserAlltimeTotals } = useContext(GameContext)
  const userAlltimeTotals = getUserAlltimeTotals()
  const location = useLocation();

  const [showRewards, setShowRewards] = useState(false)

  if(window.enableSpecialSeeds) {

  } else {
    delete leadersWeekly.special1
    delete leadersAll.special1
  }

  useEffect(() => {
    const subSection = location.state?.subSection;
    const subPage = location.state?.subPage;

    if (subPage && subSection) {
      const element = document.getElementById(`${subSection}-${subPage}-slot`);
      const scrollContainer = document.getElementById('leaderboard-scroll-box'); // ID of your scrolling container

      if (element && scrollContainer) {
        element.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    }
  }, [location.state]);

  const rewardTierText = (positionStr, amount) => {
    return <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
     textWrap: 'nowrap', borderBottom: '1px solid var(--menu_lighter)' }}>
      {positionStr}:
      <img style={{ height: '2vh', margin: '0 0.1vw 0 0.2vw' }} src={`${process.env.PUBLIC_URL}/assets/images/premiumCurrency.png`} />
      {amount}
    </div>
  }

  if (
    Object.keys(leadersAll).length === 0 ||
    Object.keys(leadersWeekly).length === 0
  ) {
    return <div></div>;
  }
  if (type === "WEEKLY") {
    if (Object.keys(leadersWeekly).length) {
      return (
        <div
          style={{
            padding: "1vh"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "1%",
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/HIGHRESHOMIE.png`}
              style={{ height: "15vh" }}
            />
            <div
              style={{
                width: "49%",
                height: "100%",
                border: "1px solid black",
                textAlign: "center",
                padding: "10px",
                fontSize: "1.8vh",
                overflowY: "auto",
              }}
              id='leaderboard-scroll-box'
            >
              <p>
                These are the farming leaderboards! Positions refresh every couple
                minutes. They contain the total crop and animal produce farmed over the
                past week and all time.
              </p>
              <hr
                style={{ width: "50%", marginTop: "2px", marginBottom: "2px" }}
              ></hr>
              <p>
              </p>
              <p>
                Weekly leaderboard resets 11:59PM Sunday (UTC), and all time
                leaderboards never reset.
              </p>
              <hr
                style={{ width: "50%", marginTop: "2px", marginBottom: "2px" }}
              ></hr>
              <p>
                You can earn 
                gold <img src={`${process.env.PUBLIC_URL}/assets/images/premiumCurrency.png`} style={{ width: '2vw', marginBottom: '-1vh' }} /> from
                 standings in both leaderboards at each weekly reset period!
                The top 50 positions in each category earn gold, with higher positions earnings more.
              </p>
            </div>
            {!showRewards && <img
              onMouseEnter={() => setShowRewards(true)}
              src={`${process.env.PUBLIC_URL}/assets/images/premiumCurrency.png`}
              style={{ width: "15vh", marginLeft: '1vw' }}
            />}
            {showRewards && <div style={{ width: '15vh', height: '15vh', position: 'relative', marginLeft: '1vw' }}>
              <div style={{
                display: 'grid',
                gridTemplateRows: '1fr 1fr 1fr 1fr',
                gridTemplateColumns: '1fr 1fr',
                padding: '1vw',
                gap: '1vh',
                height: '15vh',
                top: '-1.5vh',
                left: '0',
                position: 'absolute'
              }}
                onMouseLeave={() => setShowRewards(false)}
              >
                {rewardTierText("1st", 50)}
                {rewardTierText("2nd", 35)}
                {rewardTierText("3rd", 25)}
                {rewardTierText("4-5th", 15)}
                {rewardTierText("6th-7th", 10)}
                {rewardTierText("8-14th", 5)}
                {rewardTierText("15-24th", 4)}
                {rewardTierText("25-50th", 3)}
              </div>
            </div>}

          </div>
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              rowGap: '1vh',
              columnGap: '.5vw',

            }}
          >
            {Object.keys(leadersWeekly).map((key) => {
              if (key === "Balance" || key === "XP") return null;
              return (
                <div
                  key={key}
                  style={{
                    width: "100%",
                  }}
                >
                  <div style={{ width: "100%", height: "20vh" }}>
                    <CompLeaderboardSlot
                      Username={getUser()}
                      userAlltimeTotals={userAlltimeTotals}
                      key={key}
                      item={key}
                      data={leadersWeekly[key]}
                      type={type}
                    />{" "}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  } else {
    if (Object.keys(leadersAll).length) {
      return (
        <div
          style={{
            padding: "1vh"
          }}
        >
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              rowGap: '1vh',
              columnGap: '.5vw',
              overflowY: 'auto'
            }}
            id='leaderboard-scroll-box'
          >
            <div style={{ width: "100%", height: "20vh" }}>
              <CompLeaderboardSlot
                Username={getUser()}
                userAlltimeTotals={userAlltimeTotals}
                key={"Balance"}
                item={"Balance"}
                data={leadersAll.Balance}
                type={type}
              />
            </div>
            <div style={{ width: "100%", height: "20vh" }}>
              <CompLeaderboardSlot
                Username={getUser()}
                userAlltimeTotals={userAlltimeTotals}
                key={"XP"}
                item={"XP"}
                data={leadersAll.XP}
                type={type}
              />
            </div>
            {Object.keys(leadersAll).map((key) => {
              if (key === "Balance" || key === "XP") return;
              return (
                <div
                  key={key}
                  style={{
                    width: "100%",
                  }}
                >
                  <div style={{ width: "100%", height: "20vh" }}>
                    <CompLeaderboardSlot
                      Username={getUser()}
                      userAlltimeTotals={userAlltimeTotals}
                      key={key}
                      item={key}
                      data={leadersAll[key]}
                      type={type}
                    />{" "}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  }

  return <div></div>;
}

export default CompLeaderboard;
