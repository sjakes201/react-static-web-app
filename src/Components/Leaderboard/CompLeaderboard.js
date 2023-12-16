import React, { useContext, useEffect } from "react";
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
              style={{ height: "20vh" }}
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
                minutes.
              </p>
              <hr
                style={{ width: "50%", marginTop: "2px", marginBottom: "2px" }}
              ></hr>
              <p>
                They contain the total crop and animal produce farmed over the
                past week and all time.
              </p>
              <p>
                Weekly leaderboard resets 11:59PM Sunday (UTC), and all time
                leaderboards never reset.
              </p>
              <hr
                style={{ width: "50%", marginTop: "2px", marginBottom: "2px" }}
              ></hr>
              <p>
                The all time leaderboard contains the current richest players'
                live balances, which decrease as money is spent. Everything else
                are all time totals: even if you sell your goods.
              </p>
            </div>
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/HIGHRESHOMIE.png`}
              style={{ height: "20vh" }}
            />
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
