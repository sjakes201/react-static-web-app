import React, { useEffect, useState, useRef, useContext } from "react";
import "../CSS/CompInventory.css";
import CONSTANTS from "../../CONSTANTS";
import ANIMALINFO from "../../ANIMALINFO";
import { GameContext } from "../../GameContainer";
import InventorySlot from "./InventorySlot";
import TownBoostSlot from "../TownShop/TownBoostSlot";
import PbMenu from "./PbMenu";

const MULTIPLANTLEVEL = 20;
const MULTIHARVESTLEVEL = 20;

function CompInventory({
  tool,
  setTool,
  fertilizers,
  items,
  displayOnly,
  setMarketSelected,
  isAnimalScreen,
  setEquippedFeed,
  showBottomBar,
  showFertilizer,
  setEquippedFert,
  equippedFert,
  setAoeFertilizer,
  aoeFertilizer
}) {
  //Tooltip code
  const { level, setMoreInfo, moreInfo, generalConfig } = useContext(GameContext)
  const [tip1, setTip1] = useState(false);
  const [tip2, setTip2] = useState(false);

  // slot id that is currently a tooltip
  const [activeTooltip, setActiveTooltip] = useState(null);
  const tooltipTimer = useRef(null);

  const tooltipHandleMouseEnter = (tooltipId) => {
    tooltipTimer.current = setTimeout(() => {
      setActiveTooltip(tooltipId);
    }, 1000);
  };

  const tooltipHandleMouseLeave = () => {
    clearTimeout(tooltipTimer.current);
    setActiveTooltip(null);
  };


  const ref1 = useRef();
  const ref2 = useRef();

  const handleMouseOver = (buttonNum) => {
    switch (buttonNum) {
      case 1:
        ref1.current = setTimeout(() => {
          setTip1(true);
        }, 500);
        break;
      case 2:
        ref2.current = setTimeout(() => {
          setTip2(true);
        }, 500);
        break;
    }
  };

  const handleMouseOut = (buttonNum) => {
    // clear timeout when mouse leaves
    switch (buttonNum) {
      case 1:
        clearTimeout(ref1.current);
        setTip1(false);
        break;
      case 2:
        clearTimeout(ref2.current);
        setTip2(false);
        break;
    }
  };

  const [selectedItem, setSelectedItem] = useState({
    name: "",
    quantity: 0,
    description: "",
    image: `${process.env.PUBLIC_URL}/assets/images/EMPTY.png`,
  });

  // for equipped, from parent
  const [fertilizerMenu, setFerilizerMenu] = useState(false);
  const [boostsMenu, setBoostsMenu] = useState(false)
  // for which one to display info (not equal to parent, in case they re-open menu and have one equipped)
  const [fertInfo, setFertInfo] = useState("");

  useEffect(() => {
    if (items[selectedItem.name] === 0) {
      setSelectedItem({
        name: "",
        quantity: 0,
        description: "",
        image: `${process.env.PUBLIC_URL}/assets/images/EMPTY.png`,
      });
      sessionStorage.setItem("equipped", "");
    }
  });

  const handleClick = (itemName) => {
    if (items[itemName] && selectedItem.name !== itemName) {
      if (isAnimalScreen && itemName in ANIMALINFO.FoodHappinessYields) {
        sessionStorage.setItem("equipped", itemName);
        setEquippedFeed(itemName);
      } else if (isAnimalScreen) {
        setEquippedFeed("");
        sessionStorage.setItem("equipped", "");
      } else {
        sessionStorage.setItem("equipped", itemName);
      }

      if (setMarketSelected) setMarketSelected(itemName);
      setSelectedItem({
        name: itemName,
        quantity: items[itemName],
        description: CONSTANTS.InventoryDescriptions[itemName],
        image: `${process.env.PUBLIC_URL}/assets/images/${itemName}.png`,
      });

      // If in animal screen, turn mouse into item for feeding
    } else {
      if (setMarketSelected) setMarketSelected("");
      sessionStorage.setItem("equipped", "");
      if (isAnimalScreen) setEquippedFeed("");
      setSelectedItem({
        name: "",
        quantity: 0,
        description: "",
        image: `${process.env.PUBLIC_URL}/assets/images/EMPTY.png`,
      });
    }
    if (setEquippedFert) {
      setEquippedFert("");
      setFerilizerMenu(false);
    }
  };

  const toLoad = () => {
    let invItems = { ...items };
    if (displayOnly) {
      const keys = Object.keys(invItems);
      for (let i = 0; i < keys.length; ++i) {
        if (keys[i].includes("_seeds")) delete invItems[keys[i]];
      }
    }

    const customSort = (a, b) => {
      const aValue = invItems.hasOwnProperty(a) ? invItems[a] : -1;
      const bValue = invItems.hasOwnProperty(b) ? invItems[b] : -1;

      const hasQ = (str) => str.includes("Q");
      const hasSeeds = (str) => str.includes("_seeds");
      const hasUnderscore = (str) => str.includes("_");

      const getPriority = (str, val) => {
        if (val === 0) return 0;
        if (hasQ(str)) return 4;
        if (hasSeeds(str)) return 3;
        if (hasUnderscore(str)) return 2;
        return 1;
      };

      const aPriority = getPriority(a, aValue);
      const bPriority = getPriority(b, bValue);

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      } else {
        return bValue - aValue;
      }
    };

    const sortedKeys = Object.keys(invItems).sort(customSort);
    const sortedObject = {};

    sortedKeys.forEach((key) => {
      sortedObject[key] = invItems[key];
    });

    delete sortedObject.special1;
    delete sortedObject.special1_seeds;

    return Object.keys(sortedObject).flatMap((item, index) => {
      let totalSlots = [];
      let itemCount = sortedObject[item];
      if (generalConfig.stackInventory) {
        while (itemCount > 1000) {
          totalSlots.push(
            <InventorySlot
              key={`${item}+${itemCount}`}
              handleClick={handleClick}
              itemCount={1000}
              item={item}
              isAnimalScreen={isAnimalScreen}
              passedID={item.concat(itemCount)}
              tooltipHandleMouseEnter={tooltipHandleMouseEnter}
              tooltipHandleMouseLeave={tooltipHandleMouseLeave}
              activeTooltip={activeTooltip}
            />
          );
          itemCount -= 1000;
        }
      }
      totalSlots.push(
        <InventorySlot
          key={`${item}+${itemCount}`}
          handleClick={handleClick}
          itemCount={itemCount}
          item={item}
          isAnimalScreen={isAnimalScreen}
          passedID={item}
          tooltipHandleMouseEnter={tooltipHandleMouseEnter}
          tooltipHandleMouseLeave={tooltipHandleMouseLeave}
          activeTooltip={activeTooltip}
        />
      );


      return totalSlots;
    });
  };

  if (displayOnly) {
    return (
      <div className="inventory-container">
        <div
          className={`inventorySlots ${showBottomBar ? "showBottomBar" : "noBottomBar"
            }`}
        >
          {items && (
            <div id="display" className="items-grid">
              {toLoad()}
            </div>
          )}
        </div>
      </div>
    );
  }

  const fertilizerGUI = () => {
    return (
      <div className="fertilizerMenu">
        <span
          className="fertCloseX"
          onClick={() => {
            setFerilizerMenu(false);
            setFertInfo("");
          }}
        >
          X
        </span>
        Apply fertilizers to tiles for boosts:
        <div className="fertRow">
          <div className="fertilizerType" id="YieldsFertilizer">
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/YieldsFertilizer.png`}
              onClick={() => {
                if (fertilizers.YieldsFertilizer > 0) {
                  setEquippedFert("YieldsFertilizer");
                }
              }}
              onMouseEnter={() => setFertInfo("YieldsFertilizer")}
              onMouseLeave={() => setFertInfo("")}
              draggable={false}
            />
            <p>x{fertilizers.YieldsFertilizer}</p>
          </div>
          <div className="fertilizerType" id="HarvestsFertilizer">
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/HarvestsFertilizer.png`}
              onClick={() => {
                if (fertilizers.HarvestsFertilizer > 0) {
                  setEquippedFert("HarvestsFertilizer");
                }
              }}
              onMouseEnter={() => setFertInfo("HarvestsFertilizer")}
              onMouseLeave={() => setFertInfo("")}
              draggable={false}
            />
            <p>x{fertilizers.HarvestsFertilizer}</p>
          </div>
          <div className="fertilizerType" id="TimeFertilizer">
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/TimeFertilizer.png`}
              onClick={() => {
                if (fertilizers.TimeFertilizer > 0) {
                  setEquippedFert("TimeFertilizer");
                }
              }}
              onMouseEnter={() => setFertInfo("TimeFertilizer")}
              onMouseLeave={() => setFertInfo("")}
              draggable={false}
            />
            <p>x{fertilizers.TimeFertilizer}</p>
          </div>
        </div>
        <div className='aoe-fert-checkbox'>
          <input
            type="checkbox"
            id="aoe-fert-checkbox"
            name="aoe-fert-checkbox"
            checked={aoeFertilizer}
            onChange={() => setAoeFertilizer((old) => !old)}
          />
          <label htmlFor="aoe-fert-checkbox"> Multi-Fertilize {"("}3x3{")"}</label>
        </div>
        {fertInfo !== "" && (
          <p className="fertTextDescription">
            {CONSTANTS.fertilizerInfo[fertInfo]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={`inventory-container`}>
      <div
        className={`inventorySlots ${showBottomBar ? "showBottomBar" : "noBottomBar"
          }`}
      >
        <div className="selected-item-info">
          <div className='info-left-column'>
            <img
              className='selected-item-img'
              src={selectedItem.image}
              alt={selectedItem.name}
              onClick={() => handleClick(selectedItem.name)}
            />
          </div>
          <summary>
            <p>{selectedItem.description[0]}</p>
            <button className={`more-info-button ${moreInfo ? 'throbbing' : ''}`} onClick={() => setMoreInfo((old) => !old)}>
              <img src={`${process.env.PUBLIC_URL}/assets/images/GUI/moreInfo.png`} />
            </button>
          </summary>
          <div className="toolSelect">
            {showFertilizer && tool !== "multiharvest" && (
              <div
                className={`toolIcon${level < MULTIHARVESTLEVEL ? "Disabled" : ""
                  }`}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/multiharvest.png`}
                  onClick={() => {
                    if (level < MULTIHARVESTLEVEL) return;
                    setTool("multiharvest");
                    handleMouseOut(1);
                  }}
                  onMouseOver={() => handleMouseOver(1)}
                  onMouseOut={() => handleMouseOut(1)}
                />
                {tip1 && (
                  <div className="toolTipInv">
                    Multiharvest{" "}
                    {level < MULTIHARVESTLEVEL &&
                      `(Lvl ${MULTIHARVESTLEVEL})`}
                  </div>
                )}
              </div>
            )}
            {showFertilizer && tool === "multiharvest" && (
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/GUI/cancel.png`}
                className="toolIcon"
                onClick={() => {
                  setTool("");

                }}
              />
            )}
            {showFertilizer && tool !== "multiplant" && (
              <div
                className={`toolIcon${level < MULTIHARVESTLEVEL ? "Disabled" : ""
                  }`}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/multiplant.png`}
                  onClick={() => {
                    if (level < MULTIPLANTLEVEL) return;
                    setTool("multiplant");
                    handleMouseOut(2);
                  }}
                  onMouseOver={() => handleMouseOver(2)}
                  onMouseOut={() => handleMouseOut(2)}
                />
                {tip2 && (
                  <div className="toolTipInv">
                    Multiplant{" "}
                    {level < MULTIPLANTLEVEL && `(Lvl ${MULTIPLANTLEVEL})`}
                  </div>
                )}
              </div>
            )}
            {showFertilizer && tool === "multiplant" && (
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/GUI/cancel.png`}
                className="toolIcon"
                onClick={() => setTool("")}
              />
            )}
          </div>
          {showFertilizer && equippedFert !== "" && (
            <div className="dequipFertilizer">
              <img
                onClick={() => {
                  setEquippedFert("");
                }}
                src={`${process.env.PUBLIC_URL}/assets/images/cancel.png`}
              />
            </div>
          )}
          <div className="fertilizerButtonArea">
            {showFertilizer && equippedFert === "" && (
              <img
                className="fertilizerButton"
                src={`${process.env.PUBLIC_URL}/assets/images/fertilizerBlank.png`}
                onClick={() => setFerilizerMenu(true)}
              />
            )}

            <div onClick={(e) => { setBoostsMenu(true); }} className='boosts-button'>
              <TownBoostSlot
                boostName={"ALL_CROPS_QTY_1"} active={false} display={true} menuIcon={true}
                boostContext='player' width='80%' height='4vh' fontSize='0vw' />

              {boostsMenu && <PbMenu closeMenu={(e) => { e.stopPropagation(); setBoostsMenu(false) }} />}
            </div>

          </div>
          {fertilizerMenu && fertilizerGUI()}
        </div>
        {items && <div className="items-grid">{toLoad()}</div>}
      </div>
    </div>
  );
}

export default CompInventory;
