import "./TownGoals.css";
import GoalCard from "./GoalCard";
import { useWebSocket } from "../../WebSocketContext";
import IndivGoalCard from "./IndivGoalCard";
import { GameContext } from "../../GameContainer";
import React, { useContext, useState, useEffect } from 'react'

// Goals is array of objects { good: string, numNeeded: int, numHave: int}
// townName is string
// remount recalls getTownInfo
// role is string ("leader", "member")
function TownGoals({
  setTownInfo,
  goals,
  townName,
  myUnclaimed,
  myRoleID,
  setTownScreen,
  remount,
  updateXP,
  updateBalance,
  indivGoals
}) {

  const { waitForServerResponse } = useWebSocket();
  const { getUser, profilePic, userNotifications, setUserNotifications } = useContext(GameContext)

  const [unclaimedIndiv, setUnclaimedIndiv] = useState([])
  const [individualGoals, setIndividualGoals] = useState([])

  useEffect(() => {
    const unclaimedIndivGoals = userNotifications.filter((goal) => goal.Type === "INDIV_TOWN_GOAL_REWARD").map((ucGoal) => JSON.parse(ucGoal.Message))
    setUnclaimedIndiv(unclaimedIndivGoals)
    setIndividualGoals(indivGoals)
  }, [])

  const changeGoal = async (newGoal, goalSlot) => {
    if (waitForServerResponse) {
      await waitForServerResponse("setTownGoal", {
        newGoal: newGoal,
        goalSlot: goalSlot,
      });
      remount();
    }
  };

  const claimUnclaimedGoal = async (slotNum) => {
    if (waitForServerResponse) {
      setTownInfo((old) => {
        let newInfo = { ...old };
        newInfo.myUnclaimed[`unclaimed_${slotNum}`] = null;
        return newInfo;
      });
      let result = await waitForServerResponse("claimTownGoal", {
        slotNum: slotNum,
      });
      updateXP(result.body.personalRewards.xp);
      updateBalance(result.body.personalRewards.gold);
    }
  };

  const chooseIndivGoal = async (goalID) => {
    if (waitForServerResponse) {
      let res = await waitForServerResponse("chooseIndivTownGoal", { targetGoalID: goalID })
      console.log(res.body)
      if (res.body?.success) {
        setTownInfo((old) => {
          let newInfo = { ...old };
          newInfo.indivGoals = newInfo.indivGoals.map((goal) => {
            if (goal.goalID === goalID) {
              let newGoal = { ...goal };
              newGoal.Expiration = res.body.expiration;
              newGoal.Username = getUser();
              newGoal.profilePic = profilePic;
              return newGoal;
            }
            return goal
          })
          return newInfo
        })
      }
    }
  }

  const collectIndivReward = (goalID) => {
    console.log(goalID)
    //* TODO: IMPLEMENT *//
  }

  return (
    <div className="townGoalsContainer">
      <div className="goalsTopBar">
        <img
          id="goalsBackArrow"
          src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_dark.png`}
          onClick={() => setTownScreen("MAIN")}
        />
        <p className="goalsTownName">{townName} town goals</p>
      </div>
      <div className='townGoalsRow'>
        <div className='townGoalsLabel basic-center'>
          <h2>TOWN</h2>
        </div>

        <div className="goalsListContainer">
          {goals.map((goal, index) => {
            return (
              <GoalCard
                key={index}
                good={goal.good}
                numNeeded={goal.numNeeded}
                numHave={goal.numHave}
                myRoleID={myRoleID}
                unclaimedData={myUnclaimed[`unclaimed_${index + 1}`]}
                claimUnclaimedGoal={claimUnclaimedGoal}
                index={index}
                changeGoal={changeGoal}
              />
            );
          })}
        </div>
      </div>
      <div className='townGoalsRow'>
        <div className='townGoalsLabel basic-center'>
          <h2>INDIVIDUAL</h2>
        </div>
        <div className='indivGoalsContainer'>
          {individualGoals.map((goalObj, index) => {
            let goalID = goalObj.goalID;
            if (unclaimedIndiv.length > 0) {
              let matchingGoal = unclaimedIndiv.filter(g => g.goalID === goalID)
              if (matchingGoal.length > 0) {
                return (<IndivGoalCard
                  key={index + 1000}
                  good={matchingGoal[0].good}
                  quantity={matchingGoal[0].qty}
                  collectIndivReward={collectIndivReward}
                  goalID={goalID}
                />)
              }
            }
            return (<IndivGoalCard
              key={index}
              good={goalObj.Good}
              quantity={goalObj.Quantity}
              expiration={goalObj.Expiration}
              progress={goalObj.progress}
              username={goalObj.Username}
              goalID={goalObj.goalID}
              chooseIndivGoal={chooseIndivGoal}
              profilePic={goalObj.profilePic}
            />)
          })}
        </div>

      </div>
    </div>
  );
}

export default TownGoals;
