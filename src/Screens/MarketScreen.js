import "./CSS/MarketScreen.css";
import CompProfile from "../Components/GUI/CompProfile";
import CompMarket from "../Components/Market/CompMarket";
import CompOtherScreen from "../Components/GUI/CompOtherScreens";
import CompInventory from "../Components/GUI/CompInventory";
import CompMarketSelection from "../Components/Market/CompMarketSelection";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../GameContainer";
import { useWebSocket } from "../WebSocketContext";

function MarketScreen() {
  const { waitForServerResponse } = useWebSocket();
  const { updateBalance, itemsData, setItemsData, prices, refreshPrices } = useContext(GameContext)

  const navigate = useNavigate();
  if (localStorage.getItem("token") === null) {
    // no auth token present
    navigate("/");
  }

  const [items, setItems] = useState({});
  const [marketItems, setMarketItems] = useState([]);
  const [selected, setSelected] = useState({
    name: "",
    newPrice: 0,
    oldPrice: 0,
    imgURL: "EMPTY.png",
    multiplier: 1
  });

  useEffect(() => {
    let items = { ...itemsData };
    delete items.HarvestsFertilizer;
    delete items.TimeFertilizer;
    delete items.YieldsFertilizer;
    setItems(items);
  }, [itemsData]);

  useEffect(() => {
    getMarketItems();
    refreshPrices()
  }, []);

  useEffect(() => {
    if (prices) getMarketItems();
  }, [prices]);

  const updateInventory = (itemName, quantity, preventAnimate) => {
    setItemsData((prevItems) => {
      let invItems = {
        ...prevItems,
        [itemName]: (prevItems[itemName] || 0) + quantity,
      };
      const sortedKeys = Object.keys(invItems).sort(
        (a, b) => invItems[b] - invItems[a],
      );
      const sortedObject = {};
      sortedKeys.forEach((key) => {
        sortedObject[key] = invItems[key];
      });

      return { ...sortedObject };
    });
    if (preventAnimate) return;
    const invItem = document.getElementById(itemName);
    invItem.classList.remove("flash");
    void invItem.offsetWidth; // This forces a reflow hack
    invItem.classList.add("flash");
  };

  // set market select item by name, used to permit selection in inventory
  const setMarketSelected = (name) => {
    if (marketItems) {
      let targetItem = marketItems.filter((item) => item.name === name);
      if (targetItem.length !== 1) {
        return;
      }
      setSelected(targetItem[0]);
    }
  };

  const getMarketItems = () => {
    if (!prices) return null;
    let keys = Object.keys(prices.newPrices).sort();
    let items = [];
    for (let i = 0; i < Object.keys(prices.newPrices).length; ++i) {
      items.push({
        name: keys[i],
        newPrice: prices.newPrices[keys[i]],
        oldPrice: prices.oldPrices[keys[i]],
        imgURL: `${keys[i]}.png`,
        multiplier: prices.bonuses[keys[i]]
      });
    }
    setMarketItems(items);
  };

  const onSell = async (itemName, quantity) => {
    if (itemName in items && itemName in prices.newPrices) {
      const targetItem = marketItems.filter((i) => i.name === itemName)[0]
      let priceMultiplier = targetItem.multiplier;

      if (items[itemName] >= quantity) {
        updateInventory(itemName, -1 * quantity, false);
        updateBalance(prices.newPrices[itemName] * quantity * priceMultiplier);
        if (waitForServerResponse) {
          await waitForServerResponse("marketSell", {
            item: itemName,
            count: parseInt(quantity),
          });
        }
      }
    } else {
      console.log("INVALID ITEM");
    }
  };

  return (
    <div className="market-container">
      <div className="market-left">
        <div id="market-other-screens">
          <CompOtherScreen />
        </div>
        <div className="mainMarketContainer">
          {/* <div className="ad-box-style">
            {window.innerHeight > 655 && (
              <div style={{ width: "160px", height: "600px" }}>
              </div>
            )}
          </div> */}

          <div id="CompMarket-container">
            <CompMarket
              marketItems={marketItems ? marketItems : []}
              setSelected={setSelected}
            />
          </div>
        </div>
      </div>

      <div className="market-right">
        <div className="market-profile">
          <CompProfile type="wide" />
        </div>
        <div className="market-select-info">
          <CompMarketSelection
            items={items}
            onSell={onSell}
            name={selected.name}
            newPrice={selected.newPrice}
            oldPrice={selected.oldPrice}
            imgURL={selected.imgURL}
            multiplier={selected.multiplier}
          />
        </div>
        <div className="market-inventory">
          <CompInventory
            items={items}
            displayOnly={true}
            setMarketSelected={setMarketSelected}
          />
        </div>
      </div>
    </div>
  );
}
export default MarketScreen;
