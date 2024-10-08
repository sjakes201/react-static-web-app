import { useEffect, useState, useContext } from "react";
import Order from "./Order";
import { useNavigate } from "react-router-dom";
import CONSTANTS from "../../CONSTANTS";
import { useWebSocket } from "../../WebSocketContext";
import TOWNSINFO from "../../TOWNSINFO";
import { GameContext } from "../../GameContainer";

function OrderBoard() {
  const { updateXP, updateBalance, townPerks, itemsData, setItemsData, setOrderBoard } = useContext(GameContext)
  const { waitForServerResponse } = useWebSocket();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([{}, {}, {}, {}]);
  const [lastRefresh, setLastRefresh] = useState(0);

  const timePassedMS = Date.now() - lastRefresh;
  let timePassedMins = timePassedMS * (1 / 1000) * (1 / 60);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (waitForServerResponse) {
          const response = await waitForServerResponse("getAllOrders");
          let data = response.body;
          setOrders(data.orders);
          setLastRefresh(data.lastOrderRefresh.LastOrderRefresh);
        }
      } catch (error) {
        if (error.message.includes("401")) {
          console.log("AUTH EXPIRED");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.log(error);
        }
      }
    };
    fetchOrders();
  }, []);

  const claimOrder = async (orderNum, goldReward, xpReward, rewardInfo) => {
    let goalGood = orders[orderNum - 1].good;
    let numHave = itemsData[goalGood];
    let numNeeded = orders[orderNum - 1].numNeeded;
    if (numHave < numNeeded) {
      return;
    }

    if (waitForServerResponse) {
      const response = await waitForServerResponse("claimOrder", {
        orderNum: orderNum,
      });
      let data = response.body;
      if (data.message === "SUCCESS") {
        setOrders((old) => {
          let newOrders = [...old];
          newOrders[orderNum - 1] = {
            good: data.newGood,
            numNeeded: data.newNumNeeded,
            reward: data.newReward,
          };
          return newOrders;
        });
        updateBalance(goldReward);
        updateXP(xpReward);

        setItemsData((old) => {
          let newItems = { ...old };
          if (rewardInfo[0] !== "") {
            newItems[rewardInfo[0]] =
              newItems[rewardInfo[0]] + parseInt(rewardInfo[1]);
          }
          newItems[goalGood] -= numNeeded;
          return newItems;
        });
      } else {
        console.log(data);
      }
    }
  };

  const refreshOrder = async (orderNumToRefresh) => {
    let timePassedMS = Date.now() - lastRefresh;

    if (townPerks.orderRefreshLevel) {
      let boostPercent =
        TOWNSINFO.upgradeBoosts.orderRefreshPerkLevel[
        townPerks.orderRefreshLevel
        ];
      let boostChange = 1 + boostPercent;
      timePassedMS *= boostChange;
    }
    if (timePassedMS < CONSTANTS.VALUES.ORDER_REFRESH_COOLDOWN) {
      // NOT READY
    } else {
      // CAN REFRESH AGAIN
      try {
        if (waitForServerResponse) {
          const response = await waitForServerResponse("refreshOrder", {
            orderNum: orderNumToRefresh,
          });
          let data = response.body;
          setOrders((old) => {
            let newOrders = [...old];
            newOrders[orderNumToRefresh - 1] = {
              good: data.newGood,
              numNeeded: data.newNumNeeded,
              numHave: 0,
              reward: data.newReward,
            };
            return newOrders;
          });
          setLastRefresh(Date.now());
        }
      } catch (error) {
        if (error.message.includes("401")) {
          console.log("AUTH EXPIRED");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.log(error);
        }
      }
    }
  };

  let refreshTimeNeeded = CONSTANTS.VALUES.ORDER_REFRESH_COOLDOWN * (1 / 1000) * (1 / 60);

  if (townPerks.orderRefreshLevel) {
    let boostPercent = TOWNSINFO.perkBoosts.orderRefreshLevel[townPerks.orderRefreshLevel - 1];
    let boostChange = 1 + boostPercent;
    refreshTimeNeeded /= boostChange;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: '0',
        left: '0',
        width: "100vw",
        height: "100vh",
        zIndex: "30100",
        backgroundColor: "rgba(255,245,245,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={(event) => {
        event.preventDefault();
        if (event.target === event.currentTarget) {
          setOrderBoard(false)
        }
      }}
    >
      <div
        id="order-screen"
        style={{
          width: "60vw",
          height: "80vh",
          boxShadow:
            "0 0 0 3px var(--black), 0 0 0 6px var(--border_orange), 0 0 0 8px var(--border_shadow_orange), 0 0 0 11px var(--black)",
          backgroundColor: "var(--menu_dark)",
          position: "relative",
          animation: "grow-box 0.2s ease-in-out forwards"

        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2.2vh",
            right: "1.3vw",
            cursor: "pointer",
            textShadow: "-1px 1px var(--menu_light)",
          }}
          onClick={() => setOrderBoard(false)}
        >
          X
        </div>
        <div
          id="title"
          style={{
            width: "100%",
            height: "10%",
            textDecoration: "underline",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "3.5vh",
            paddingTop: "2%",
            color: "var(--menu_lighter)",
            textShadow: "1px 1px 1px var(--black)",
          }}
        >
          <p>ORDER BOARD</p>
          {timePassedMins < refreshTimeNeeded && (
            <span
              style={{
                position: "absolute",
                right: "6%",
                fontSize: "0.8vw",
                color: "lightgrey",
              }}
            >
              <span style={{ textDecoration: "underline" }}>
                Refresh cooldown:
              </span>
              <span> </span>
              {Math.ceil(refreshTimeNeeded - timePassedMins)}{" "}
              {Math.ceil(refreshTimeNeeded - timePassedMins) === 1
                ? "minute"
                : "minutes"}
            </span>
          )}
        </div>
        <div
          id="order-board"
          style={{
            width: "100%",
            height: "90%",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
          }}
        >
          {orders[1].good !== undefined && (
            <Order
              orderNum={1}
              good={orders[0].good}
              reward={orders[0].reward}
              itemsData={itemsData}
              numNeeded={orders[0].numNeeded}
              claimOrder={claimOrder}
              refreshOrder={refreshOrder}
              refreshable={timePassedMins > refreshTimeNeeded}
            />
          )}
          {orders[1].good !== undefined && (
            <Order
              orderNum={2}
              good={orders[1].good}
              reward={orders[1].reward}
              itemsData={itemsData}
              numNeeded={orders[1].numNeeded}
              claimOrder={claimOrder}
              refreshOrder={refreshOrder}
              refreshable={timePassedMins > refreshTimeNeeded}
            />
          )}
          {orders[1].good !== undefined && (
            <Order
              orderNum={3}
              good={orders[2].good}
              reward={orders[2].reward}
              itemsData={itemsData}
              numNeeded={orders[2].numNeeded}
              claimOrder={claimOrder}
              refreshOrder={refreshOrder}
              refreshable={timePassedMins > refreshTimeNeeded}
            />
          )}
          {orders[1].good !== undefined && (
            <Order
              orderNum={4}
              good={orders[3].good}
              reward={orders[3].reward}
              itemsData={itemsData}
              numNeeded={orders[3].numNeeded}
              claimOrder={claimOrder}
              refreshOrder={refreshOrder}
              refreshable={timePassedMins > refreshTimeNeeded}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default OrderBoard;
