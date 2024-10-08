import React, { useState, useEffect, useContext } from "react";
import CONSTANTS from "../CONSTANTS";
import "./CSS/PlantScreen.css";
import CompPlot from "../Components/Crops/CompPlot";
import CompInventory from "../Components/GUI/CompInventory";
import CompOtherScreens from "../Components/GUI/CompOtherScreens";
import CompProfile from "../Components/GUI/CompProfile";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../GameContainer";

function PlantScreen({ passedTool }) {
  const navigate = useNavigate();
  if (localStorage.getItem("token") === null) {
    // no auth token present
    navigate("/");
  }

  const { itemsData, setItemsData, moreInfo } = useContext(GameContext)

  const [items, setItems] = useState({});
  const [fertilizers, setFertilizers] = useState({});
  const [tool, setTool] = useState("");

  useEffect(() => {
    setTool(passedTool)
  }, [passedTool])

  const [orderNotice, setOrderNotice] = useState(false);

  // level is just for level (pass to components that want to know unlocks)
  // The rest is for the level up notification system, create notification box only when the change in level is not from init mount (hence the ref)

  const [equippedFert, setEquippedFert] = useState("");
  const [aoeFertilizer, setAoeFertilizer] = useState(false)

  useEffect(() => {
    let data = { ...itemsData };
    setFertilizers({
      HarvestsFertilizer: data.HarvestsFertilizer,
      TimeFertilizer: data.TimeFertilizer,
      YieldsFertilizer: data.YieldsFertilizer,
    });
    delete data.HarvestsFertilizer;
    delete data.TimeFertilizer;
    delete data.YieldsFertilizer;
    setItems(data);
  }, [itemsData]);

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
    if (invItem !== null) {
      invItem.classList.remove("flash");
      void invItem.offsetWidth; // This forces a reflow hack
      invItem.classList.add("flash");
    }
  };

  let appStyle = {
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "auto minmax(300px, 20vw)",
    position: "relative",
    overflow: "hidden",
  };

  if (equippedFert !== "") {
    appStyle.cursor = `url(${process.env.PUBLIC_URL}/assets/images/mouse/${equippedFert}.png) 16 16, auto`;
  }
  if (moreInfo) {
    appStyle.cursor = `url(${process.env.PUBLIC_URL}/assets/images/mouse/moreInfo32.png) 16 16, auto`;
  }

  useEffect(() => {
    sessionStorage.setItem("equipped", "");
  }, []);

  return (
    <div style={appStyle}>
      <div className="left-column">
        <div className="other-screensPl">
          <CompOtherScreens />
        </div>
        <div className="plot">
          <div className="ad-box-style">
            <div className='inner-ad-test'>
            </div>
          </div>

          <div className="farmArea">
            <CompPlot
              tool={tool}
              setFertilizers={setFertilizers}
              fertilizers={fertilizers}
              equippedFert={equippedFert}
              setEquippedFert={setEquippedFert}
              setOrderNotice={setOrderNotice}
              updateInventory={updateInventory}
              items={items}
              aoeFertilizer={aoeFertilizer}
              setAoeFertilizer={setAoeFertilizer}
            />
            <div className='bottom-rail-space'>

            </div>
          </div>
        </div>
      </div>
      <div className="right-column">
        <div className="userProfile">
          <CompProfile
            orderNotice={orderNotice}
            type={"tall"}
          />
        </div>
        <div className="inventoryPl">
          <CompInventory
            tool={tool}
            setTool={setTool}
            fertilizers={fertilizers}
            equippedFert={equippedFert}
            items={items}
            updateInventory={updateInventory}
            showFertilizer={true}
            setEquippedFert={setEquippedFert}
            setAoeFertilizer={setAoeFertilizer}
            aoeFertilizer={aoeFertilizer}
          />
        </div>
        <div className="settings">



        </div>
      </div>
    </div>
  );
}

export default PlantScreen;
