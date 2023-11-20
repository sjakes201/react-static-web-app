import React, { useRef, useLayoutEffect, useEffect, useState, useContext } from "react";
import "./CSS/AnimalScreen.css";
import CompPen from "../Components/Animals/CompPen";
import CompOtherScreens from "../Components/GUI/CompOtherScreens";
import CompInventory from "../Components/GUI/CompInventory";
import CompProfile from "../Components/GUI/CompProfile";
import AnimalsTopBar from "../Components/Animals/AnimalsTopBar";
import AnimalManagement from "../Components/Animals/AnimalManagement";
import { GameContext } from "../GameContainer";

import { useNavigate } from "react-router-dom";

import AdinPlayAd from "../AdinPlayAd";

function AnimalScreen() {
  const navigate = useNavigate();
  if (localStorage.getItem("token") === null) {
    // no auth token present
    navigate("/");
  }
  const { itemsData, setItemsData, barn, coop, setBarn, setCoop, capacities, setAnimalsInfo, moreInfo } = useContext(GameContext)

  // Get size of component
  const componentRef = useRef(null);
  const [componentWidth, setComponentWidth] = useState(null);
  const [componentHeight, setComponentHeight] = useState(null);

  useLayoutEffect(() => {
    const componentNode = componentRef.current;
    const handleResize = () => {
      const newWidth = componentNode.offsetWidth;
      const newHeight = componentNode.offsetHeight;

      if (componentWidth !== newWidth || componentHeight !== newHeight) {
        setComponentWidth(newWidth);
        setComponentHeight(newHeight);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [componentWidth, componentHeight]);

  const renderPens = componentWidth !== null && componentHeight !== null;

  const [items, setItems] = useState({});

  const [manager, setManager] = useState(false);
  const [orderNotice, setOrderNotice] = useState(false);

  const [equippedFeed, setEquippedFeed] = useState("");

  useEffect(() => {
    let data = { ...itemsData };
    delete data.HarvestsFertilizer;
    delete data.TimeFertilizer;
    delete data.YieldsFertilizer;
    setItems(data);
  }, [itemsData]);

  useEffect(() => {
    sessionStorage.setItem("equipped", "");
  }, []);

  const updateInventory = (itemName, quantity, preventAnimate) => {
    let newCount = 0;
    setItemsData((prevItems) => {
      let invItems = {
        ...prevItems,
        [itemName]: (prevItems[itemName] || 0) + quantity,
      };
      newCount = (prevItems[itemName] || 0) + quantity;
      const sortedKeys = Object.keys(invItems).sort(
        (a, b) => invItems[b] - invItems[a],
      );
      const sortedObject = {};
      sortedKeys.forEach((key) => {
        sortedObject[key] = invItems[key];
      });

      return { ...sortedObject };
    });
    if (preventAnimate) return newCount;
    const invItem = document.getElementById(itemName);
    invItem.classList.remove("flash");
    void invItem.offsetWidth; // This forces a reflow hack
    invItem.classList.add("flash");
    return newCount;
  };

  const appStyle = {
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "80% 20%",
    position: "relative",
  };

  if(moreInfo) {
    appStyle.cursor = `url(${process.env.PUBLIC_URL}/assets/images/mouse/moreInfo32.png) 16 16, auto`;
  } else if (equippedFeed !== "") {
    appStyle.cursor = `url(${process.env.PUBLIC_URL}/assets/images/mouse/${equippedFeed}32.png) 16 16, auto`;
  }

  return (
    <div style={appStyle}>
      {manager && (
        <div className="manage-animals">
          {" "}
          <AnimalManagement
            setAnimalsInfo={setAnimalsInfo}
            capacities={capacities}
            coop={coop}
            setCoop={setCoop}
            barn={barn}
            setBarn={setBarn}
            setManager={setManager}
          />
        </div>
      )}
      <div className="left-column">
        <div className="other-screensAn">
          <CompOtherScreens />
        </div>
        <div className="pen-management">
          {" "}
          <AnimalsTopBar setManager={setManager} />{" "}
        </div>
        <div className="pens-wrapper">
          <div className="barn-container" ref={componentRef}>
            {" "}
            {renderPens && (
              <CompPen
                setEquippedFeed={setEquippedFeed}
                equippedFeed={equippedFeed}
                setOrderNotice={setOrderNotice}
                animalsParent={barn}
                setAnimalsParent={setBarn}
                isBarn={true}
                key={1}
                penWidth={componentWidth}
                penHeight={componentHeight}
                updateInventory={updateInventory}
              />
            )}
          </div>
          <div className="coop-container" ref={componentRef}>
            {renderPens && (
              <CompPen
                setEquippedFeed={setEquippedFeed}
                equippedFeed={equippedFeed}
                setOrderNotice={setOrderNotice}
                animalsParent={coop}
                setAnimalsParent={setCoop}
                isBarn={false}
                key={2}
                penWidth={componentWidth}
                penHeight={componentHeight}
                updateInventory={updateInventory}
              />
            )}
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
        <div className="inventory">
          <CompInventory
            items={items}
            updateInventory={updateInventory}
            isAnimalScreen={true}
            setEquippedFeed={setEquippedFeed}
          />
        </div>
        <div className="settings">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              height: "60px",
              justifyContent: "space-evenly",
              position: "absolute",
              top: "0",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "120px",
                height: "60px",
                zIndex: "2000",
              }}
            >
              <div>
                <AdinPlayAd placementId="farmgame-live_120x60_2" />
              </div>
            </div>
          </div>
          {/* <a target='_blank' href="/updateNotes.html" style={{ fontSize: '.7vw', marginRight: '1%' }}>update notes </a> */}
          <div
            style={{
              width: "70%",
              height: "3vh",
              position: "absolute",
              bottom: "1vh",
              left: "30%",
              fontSize: "1vw",
            }}
          >
            <a
              target="_black"
              href="https://discord.gg/jrxWrgNCHw"
              style={{
                fontSize: ".9vw",
                textDecoration: "underline",
                height: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/discord.png`}
                style={{ height: "65%", marginRight: "2%" }}
              ></img>
              Game Discord
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/discord.png`}
                style={{ height: "65%", marginLeft: "2%" }}
              ></img>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimalScreen;
