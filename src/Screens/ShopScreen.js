import React, { useState, useEffect, useContext } from "react";

import CompShop from "../Components/Shop/CompShop";
import CompProfile from "../Components/GUI/CompProfile";
import CompOtherScreens from "../Components/GUI/CompOtherScreens";
import { useNavigate } from "react-router-dom";
import "./CSS/ShopScreen.css";
import { GameContext } from "../GameContainer";
import AdinPlayAd from "../AdinPlayAd";

function ShopScreen() {
  const navigate = useNavigate();
  if (localStorage.getItem("token") === null) {
    // no auth token present
    navigate("/");
  }
  const { itemsData, setItemsData } = useContext(GameContext)

  useEffect(() => {
    sessionStorage.setItem("equipped", "");
  }, []);

  // Functions

  const [items, setItems] = useState({});

  useEffect(() => {
    let data = { ...itemsData };
    delete data.HarvestsFertilizer;
    delete data.TimeFertilizer;
    delete data.YieldsFertilizer;
    setItems(data);
  }, [itemsData]);

  // pass each screen this. they will use it and assign it to their building/path buttons

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

  return (
    <div>
      <div
        style={{
          height: "12vh",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <div style={{ width: "70vw" }}>
          <CompOtherScreens />
        </div>
        <div style={{ width: "30vw" }}>
          <CompProfile
            type={"short"}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "88vh",
        }}
      >
        <CompShop
          updateInventory={updateInventory}
          items={items}
        />
        <div className="shop-ad-box">
          {window.innerHeight > 698 && (
            <AdinPlayAd placementId="farmgame-live_160x600" />
          )}
        </div>
      </div>
    </div>
  );
}

export default ShopScreen;
