import "./TownGoals.css";
import GoalCard from "./GoalCard";
import { useWebSocket } from "../../WebSocketContext";
import { waitFor } from "@testing-library/react";

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
}) {
  const { waitForServerResponse } = useWebSocket();

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
      console.log(result);
      updateXP(result.body.personalRewards.xp);
      updateBalance(result.body.personalRewards.gold);
    }
  };

  // When this component is initialized, call something to get new unclaimed goals
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
  );
}

export default TownGoals;
