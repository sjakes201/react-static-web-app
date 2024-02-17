import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CompLeaderboardSlot from "./CompLeaderboardSlot";
import { GameContext } from "../../GameContainer";
import { useWebSocket } from "../../WebSocketContext";
import CONSTANTS from "../../CONSTANTS";

const EVENT_END = 1708810712785;

function CompLeaderboard({
  type,
  leadersWeekly,
  leadersAll,
}) {
  const { getUser, getUserAlltimeTotals } = useContext(GameContext)
  const { waitForServerResponse } = useWebSocket();

  const userAlltimeTotals = getUserAlltimeTotals()
  const location = useLocation();
  const navigate = useNavigate();
  const [showRewards, setShowRewards] = useState(false)

  // for event crops
  const [specialData, setSpecialData] = useState([])

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
    return <div style={{
      display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
      textWrap: 'nowrap', borderBottom: '1px solid var(--menu_lighter)'
    }}>
      {positionStr}:
      <img style={{ height: '2vh', margin: '0 0.1vw 0 0.2vw' }} src={`${process.env.PUBLIC_URL}/assets/images/premiumCurrency.png`} />
      {amount}
    </div>
  }

  const getSpecialLeaderboard = async () => {
    try {
      if (waitForServerResponse) {
        let res = await waitForServerResponse('getSpecialLeaderboard')
        if (res.body?.success) {
          setSpecialData(res.body.data)

        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  function convertMsToTime(milliseconds) {
    if (milliseconds < 0) return 'Event has ended!'
    let days, hours, minutes;

    minutes = Math.floor(milliseconds / (1000 * 60));

    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    days = Math.floor(hours / 24);
    hours = hours % 24;

    return `${days} days, ${hours} hours, ${minutes} minutes remaining`;
  }

  function ordinalSuffix(number) {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits > 10 && lastTwoDigits < 20) {
      return "th";
    }

    switch (lastDigit) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  useEffect(() => {
    if(window.enableSpecialEvent) {
      getSpecialLeaderboard()
    }
  }, [])

  console.log(specialData)

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
  } else if (type === "ALLTIME") {
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
  } else if (type === "EVENT") {
    if (specialData.length > 0) {
      return <div
        className='basic-center'
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          padding: '1vh 10%',
          position: 'relative',
        }}>
        <img style={{position: 'absolute', height: '9vh', left: '3%', bottom: '2%'}} src={`${process.env.PUBLIC_URL}/assets/images/special1Deco2.png`} />
        <img style={{position: 'absolute', height: '9vh', left: '2%', bottom: '40%'}} src={`${process.env.PUBLIC_URL}/assets/images/special1Deco2.png`} />
        <img style={{position: 'absolute', height: '9vh', left: '3%', bottom: '70%'}} src={`${process.env.PUBLIC_URL}/assets/images/special1Deco1.png`} />
        <img style={{position: 'absolute', height: '9vh', right: '3%', bottom: '2%'}} src={`${process.env.PUBLIC_URL}/assets/images/special1Deco1.png`} />
        <img style={{position: 'absolute', height: '9vh', right: '2%', bottom: '40%'}} src={`${process.env.PUBLIC_URL}/assets/images/special1Deco1.png`} />
        <img style={{position: 'absolute', height: '9vh', right: '3%', bottom: '70%'}} src={`${process.env.PUBLIC_URL}/assets/images/special1Deco2.png`} />
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          position: 'relative'
        }}>
          <img
            style={{
              height: '10vh',
            }}
            src={`${process.env.PUBLIC_URL}/assets/images/special1.png`}
          />
          <p
            style={{
              fontSize: '2.5vw',
            }}
          >
            {CONSTANTS.InventoryDescriptions.special1[0]} Event!
          </p>
          <p
            style={{
              fontSize: '0.9vw',
              marginBottom: '-1.5vh',
              marginLeft: '1vw',
              fontStyle: 'italic',
            }}
          >{convertMsToTime(EVENT_END - Date.now())}</p>
          
         <img style={{position: 'absolute', height: '9vh', right: '-2%', bottom: '-10%'}} src={`${process.env.PUBLIC_URL}/assets/images/special1Deco1.png`} />
         <img style={{position: 'absolute', height: '9vh', right: '2%', bottom: '-10%'}} src={`${process.env.PUBLIC_URL}/assets/images/special1Deco2.png`} />
         <img style={{position: 'absolute', height: '9vh', right: '7%', bottom: '-10%'}} src={`${process.env.PUBLIC_URL}/assets/images/special1Deco3.png`} />
         <img style={{position: 'absolute', height: '9vh', right: '12%', bottom: '-10%'}} src={`${process.env.PUBLIC_URL}/assets/images/special1Deco1.png`} />
        </div>
        <div
          style={{
            width: '100%',
            height: '100%',
            padding: '0 0 2vh 0',
            border: '2px solid black',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}>
          <p style={{
            fontSize: '1vw',
            padding: '1.5vw 1vw 1vw 1vw',
            width: '95%',
            borderBottom: '2px solid black'
          }}><i>
              This is an event category! This event will only last a certain amount of time, and will have special prizes for all who participate, such as rare profile pictures.
            </i>
          </p>

          {specialData.map((data, index) => {
            return <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                width: '80%',
                borderBottom: '1px solid var(--menu_dark)'
              }}>
              <span
                style={{
                  cursor: 'pointer',
                  margin: '1vh'
                }}
                onClick={() => {
                  navigate(`/profile/${data.Username}`, {
                    state: { from: "leaderboard", subPage: 'EVENT' },
                  });
                }}
              >
                {data.position}{ordinalSuffix(data.position)}: {data.Username}: {data.count.toLocaleString()}
                <img
                  style={{
                    height: '2.5vh',
                    marginBottom: '-0.5vh',
                    display: 'inline'
                  }}
                  src={`${process.env.PUBLIC_URL}/assets/images/special1.png`}
                />
              </span>
            </div>

          })
          }

        </div>

      </div>
    } else {
      return <div className='basic-center' style={{ width: '100%', height: '100%' }}>
        <p><i>No special event currently! Check back later for a chance to win rare prizes.</i></p>
      </div>
    }
  }

  return <div></div>;
}

export default CompLeaderboard;
