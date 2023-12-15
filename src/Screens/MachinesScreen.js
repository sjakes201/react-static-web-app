import React, { useEffect, useState, useContext } from "react";
import "./CSS/MachinesScreen.css";
import MachineUnit from "../Components/Machines/MachineUnit";
import CompInventory from "../Components/GUI/CompInventory";
import { useNavigate, useLocation } from "react-router-dom";
import MACHINESINFO from "../MACHINESINFO";
import CompProfile from "../Components/GUI/CompProfile";
import { useWebSocket } from "../WebSocketContext";
import { GameContext } from "../GameContainer";

function MachinesScreen() {
  const { waitForServerResponse } = useWebSocket();
  const { itemsData, getBal, updateBalance, setParts, parts, artisanItems, setArtisanItems, machines, setMachines } = useContext(GameContext)

  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState({});

  const [helpGUI, setHelpGUI] = useState(false);

  const [selectedGood, setSelected] = useState("");
  const [sellQty, setSellQty] = useState("");

  const [priceHover, setPriceHover] = useState(null)

  useEffect(() => {
    let data = { ...itemsData };
    delete data.HarvestsFertilizer;
    delete data.TimeFertilizer;
    delete data.YieldsFertilizer;
    let keys = Object.keys(data);
    keys.forEach((key) => {
      if (key.includes("seeds") || !key.includes("_")) {
        delete data[key];
      }
    });
    let artisanKeys = Object.keys(artisanItems);
    artisanKeys.forEach((key) => {
      data[key] = artisanItems[key];
    });
    setItems(data);
  }, [itemsData, artisanItems]);

  const sellArtisan = async (good, quantity) => {
    if (!Object.keys(items).includes(good)) {
      console.log(`invalid artisan good`);
      return;
    }
    if (items[good] < quantity || !Number.isInteger(quantity) || quantity < 1) {
      console.log("invalid quantity");
      return;
    }

    let goodPrices = MACHINESINFO.artisanPrices;
    let totalRevenue = goodPrices[good] * quantity;

    updateBalance(totalRevenue);

    setArtisanItems((old) => {
      let newItems = { ...old };
      newItems[good] -= quantity;
      return newItems;
    });
    try {
      if (waitForServerResponse) {
        await waitForServerResponse("sellArtisanGood", {
          good: good,
          quantity: quantity,
        });
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

  // Buy / upgrade a machine, type: string 'cheese' 'cloth' 'mayonnaise', slot: int [1,6], tier: int [1,3]
  const buyMachine = async (type, slot, tier) => {
    // Check inputs
    if (![1, 2, 3, 4, 5, 6].includes(slot)) {
      console.log(`Invalid slot: ${slot}`);
      return false;
    }
    if (![1, 2, 3].includes(tier)) {
      console.log(`Invalid tier: ${tier}`);
      return false;
    }
    if (!["cheese", "cloth", "mayonnaise"].includes(type)) {
      console.log(`Invalid type: ${type}`);
      return false;
    }

    // check if they have the parts and the balance
    let costs = MACHINESINFO[`${type}MachineCost`][`tier${tier}`];
    if (costs.Money > getBal()) {
      console.log("Insufficient funds");
      return false;
    }
    if (
      costs.Gears > parts.Gears ||
      costs.MetalSheets > parts.MetalSheets ||
      costs.Bolts > parts.Bolts
    ) {
      console.log("Insufficient parts");
      return false;
    }
    updateBalance(-1 * costs.Money);
    setParts((old) => {
      let newParts = { ...old };
      newParts.Gears -= costs.Gears;
      newParts.MetalSheets -= costs.MetalSheets;
      newParts.Bolts -= costs.Bolts;
      return newParts;
    });

    // Change machine and TODO: initiate cloud building animation
    setMachines((old) => {
      let newMachines = { ...old };
      newMachines[`Slot${slot}Level`] += 1;
      newMachines[`Slot${slot}`] = MACHINESINFO.machineTypeIDS[type];
      return newMachines;
    });

    try {
      if (waitForServerResponse) {
        let res = await waitForServerResponse("buyMachine", {
          type: type,
          slot: slot,
          tier: tier,
        });
      }
    } catch (error) {
      if (error.message.includes("401")) {
        console.log("AUTH EXPIRED");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        console.log(error);
      }
      return false;
    }
    return true
  };

  const startMachine = async (slot, machineTypeID, ingredients) => {
    if (![1, 2, 3, 4, 5, 6].includes(slot)) {
      console.log(`invalid slot ${slot}`);
      return;
    }
    if (![0, 1, 2].includes(machineTypeID)) {
      console.log(`Invalid type: ${machineTypeID}`);
      return;
    }

    if (machines[`Slot${slot}StartTime`] !== -1) {
      return;
    }

    let totalProduce = 0;
    let ingredientsKeys = Object.keys(ingredients);
    ingredientsKeys.forEach((e) => {
      totalProduce += ingredients[e];
    });

    if (totalProduce === 0) return;

    setMachines((old) => {
      let newMachines = { ...old };
      newMachines[`Slot${slot}ProduceReceived`] = totalProduce;
      // 2000 ms buffer
      newMachines[`Slot${slot}StartTime`] = Date.now() + 2000;
      return newMachines;
    });

    let machineTypeName = MACHINESINFO.machineTypeFromIDS[machineTypeID];
    // ingredients should be object of animal produce, keys are produce values are count
    try {
      if (waitForServerResponse) {
        await waitForServerResponse("useMachine", {
          slot: slot,
          machineType: machineTypeName,
          ingredients: ingredients,
        });
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

  const collectMachine = async (slot) => {
    // check inputs
    if (![1, 2, 3, 4, 5, 6].includes(slot)) return;
    // Check for whether it's done is done in MachineUnit.js
    setMachines((old) => {
      let newMachines = { ...old };
      newMachines[`Slot${slot}ProduceReceived`] = 0;
      newMachines[`Slot${slot}StartTime`] = -1;
      return newMachines;
    });
    try {
      if (waitForServerResponse) {
        let response = await waitForServerResponse("collectMachine", {
          slot: slot,
        });
        let data = response.body;
        delete data.message;
        setArtisanItems((old) => {
          let newItems = { ...old };
          Object.keys(data).forEach((item) => {
            newItems[item] += data[item];
            if (data[item] !== 0) {
              // flash item in inventory
              const invItem = document.getElementById(item);
              invItem.classList.remove("flash");
              void invItem.offsetWidth; // This forces a reflow hack
              invItem.classList.add("flash");
            }
          });
          return newItems;
        });
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

  const sellMachine = async (slot) => {
    // check inputs
    if (![1, 2, 3, 4, 5, 6].includes(slot)) {
      console.log(`Invalid slot: ${slot}`);
      return;
    }

    // Change parts inventory for refund
    let tier = machines[`Slot${slot}Level`];
    let refunds = MACHINESINFO.sellRefunds[`tier${tier}`];
    setParts((old) => {
      let newParts = { ...old };
      newParts.Gears += refunds.Gears;
      newParts.MetalSheets += refunds.MetalSheets;
      newParts.Bolts += refunds.Bolts;
      return newParts;
    });

    // Change machines and TODO: initate animation
    setMachines((old) => {
      let newMachines = { ...old };
      newMachines[`Slot${slot}`] = -1;
      newMachines[`Slot${slot}Level`] = 0;
      newMachines[`Slot${slot}ProduceReceived`] = 0;
      newMachines[`Slot${slot}StartTime`] = -1;
      return newMachines;
    });
    try {
      if (waitForServerResponse) {
        await waitForServerResponse("sellMachine", {
          slot: slot,
        });
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

  const cancelMachine = async (slot) => {
    try {
      if (![1, 2, 3, 4, 5, 6].includes(slot)) return;

      setMachines((old) => {
        let newMachines = { ...old };
        newMachines[`Slot${slot}StartTime`] = -1;
        newMachines[`Slot${slot}ProduceReceived`] = 0;
        return newMachines;
      });

      if (waitForServerResponse) {
        await waitForServerResponse("cancelMachine", {
          slot: slot,
        });
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

  const buildHelpGUI = () => {
    return (
      <div className="artisanGUI">
        <div className="artisanGUIX" onClick={() => setHelpGUI(false)}>
          X
        </div>

        <div className="artisanLeftColumn">
          <div className="artisanInfoGrid">
            <div className="artisanInfoSpot">
              <h3>Build</h3>
              <p>
                Build up to 6 machines with money and parts. Machines convert
                animal produce into artisan goods. Each ingredient put into a
                machine will produce 1 of it's respective artisan good.
              </p>
            </div>
            <div className="artisanInfoSpot">
              <h3>Upgrade</h3>
              <p>
                Upgrade machines using parts and money to give them higher
                capacities, quicker processing times, and a higher chance of
                better artisan goods.
              </p>
            </div>
            <div className="artisanInfoSpot">
              <h3>Parts</h3>
              <p>
                Find machine parts in your field when harvesting crops. All
                crops have a small chance of giving you a random part (1-3%)
                when harvested. Quicker growth crops have lower drop chances.
              </p>
            </div>
            <div className="artisanInfoSpot">
              <h3>Artisan Goods</h3>
              <p>
                Artisan goods can be sold for a fixed price. Higher quality
                artisan goods sell for more. There are normal, bronze, silver,
                and gold quality artisan goods.
              </p>
            </div>
            <div className="infoGUIDecoBottom">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/cheeseQ0.png`}
                alt="deco icon"
              />
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/cheeseQ0.png`}
                alt="deco icon"
              />
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/cheeseQ0.png`}
                alt="deco icon"
              />
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/cheeseQ0.png`}
                alt="deco icon"
              />
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/cheeseQ0.png`}
                alt="deco icon"
              />
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/cheeseQ0.png`}
                alt="deco icon"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const backArrow = () => {
    const backFunc = () => {
      if (location?.state?.from) {
        return () => navigate(`/${location.state.from}`);
      } else {
        return () => navigate("/plants");
      }
    };
    return (
      <img
        src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_light.png`}
        alt="back-arrow"
        onClick={backFunc()}
        style={{
          width: "5%",
          marginLeft: "1%",
          marginBottom: "5%",
          cursor: "pointer",
          objectFit: "contain",
        }}
      />
    );
  };

  const MachineUnits = () => {
    const machineUnits = [1, 2, 3, 4, 5, 6]

    return (
      <>
        {machineUnits.map((machineNum) => (
          <div className="machineUnit" key={machineNum}>
            <MachineUnit
              items={items}
              machineNum={machineNum}
              machineInfo={{
                ID: machines[`Slot${machineNum}`],
                level: machines[`Slot${machineNum}Level`],
                produceReceived: machines[`Slot${machineNum}ProduceReceived`],
                startTime: machines[`Slot${machineNum}StartTime`],
              }}
              sellMachine={sellMachine}
              cancelMachine={cancelMachine}
              buyMachine={buyMachine}
              startMachine={startMachine}
              collectMachine={collectMachine}
            />
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="machineScreen">
      {helpGUI && buildHelpGUI()}
      <div className="machineGrid">
        <div id="placeholderMachine">
          {backArrow()}
          <div
            style={{
              position: "relative",
              width: "970px",
              height: "90px",
            }}
            id='machines_top_bar'
          >
          </div>

          <img
            src={`${process.env.PUBLIC_URL}/assets/images/questionmark.png`}
            alt="info"
            onClick={() => setHelpGUI((old) => !old)}
            id="questionMark"
          />
        </div>

        <div id="machineShop">
          <div className="machineTopRight">
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/machines/machineDesk.png`}
              alt="machines-desk"
              onClick={() => setHelpGUI((old) => !old)}
              id="machineDesk"
            />
            <div className="machinesProfile">
              <CompProfile
                type={"wide"}
                disableBorder={true}
                noPFP={true}
              />
            </div>
          </div>
          <div className="machinePartsInventory">
            <div className="machinePartCount">
              <img
                className="partCountImg"
                src={`${process.env.PUBLIC_URL}/assets/images/Gears.png`}
                alt="gears cost"
              />
              <span> X {parts.Gears}</span>
            </div>
            <div className="machinePartCount">
              <img
                className="partCountImg"
                src={`${process.env.PUBLIC_URL}/assets/images/Bolts.png`}
                alt="bolts cost"
              />
              <span> X {parts.Bolts}</span>
            </div>
            <div className="machinePartCount">
              <img
                className="partCountImg"
                src={`${process.env.PUBLIC_URL}/assets/images/MetalSheets.png`}
                alt="metal sheets cost"
              />
              <span> X {parts.MetalSheets}</span>
            </div>
          </div>
        </div>

        <div id="machineInventory">
          <CompInventory
            items={items}
            displayOnly={true}
            showBottomBar={true}
            setMarketSelected={setSelected}
          />
        </div>

        <div id="artisanSellGUI">
          <div id="artisanSellPic">
            <div className="artisanSelected">
              <img
                className="partCountImg"
                src={`${process.env.PUBLIC_URL}/assets/images/${Object.keys(MACHINESINFO.artisanPrices).includes(selectedGood)
                  ? selectedGood
                  : "EMPTY"
                  }.png`}
                alt="Selected artisan good"
              />
            </div>
          </div>
          <div id="artisanSellInfo">
            {Object.keys(MACHINESINFO.artisanPrices).includes(selectedGood) && (
              <div className="artisanPricesGrid">
                <div
                  className={`artisanPriceSlot ${selectedGood.includes("Q0") ? "bold" : "notSelected"
                    }`}
                  id="q0"
                >
                  <img
                    className="artisanPriceListImg"
                    src={`${process.env.PUBLIC_URL
                      }/assets/images/${selectedGood.substring(
                        0,
                        selectedGood.length - 2,
                      )}Q0.png`}
                    alt="Selected artisan good"
                  />
                  <span className="artisanTierPrice">
                    $
                    {
                      MACHINESINFO.artisanPrices[
                      `${selectedGood.substring(
                        0,
                        selectedGood.length - 2,
                      )}Q0`
                      ]
                    }
                  </span>
                </div>
                <div
                  className={`artisanPriceSlot ${selectedGood.includes("Q1") ? "bold" : "notSelected"
                    }`}
                  id="q1"
                >
                  <img
                    className="artisanPriceListImg"
                    src={`${process.env.PUBLIC_URL
                      }/assets/images/${selectedGood.substring(
                        0,
                        selectedGood.length - 2,
                      )}Q1.png`}
                    alt="Selected artisan good"
                  />
                  <span className="artisanTierPrice">
                    $
                    {
                      MACHINESINFO.artisanPrices[
                      `${selectedGood.substring(
                        0,
                        selectedGood.length - 2,
                      )}Q1`
                      ]
                    }
                  </span>
                </div>
                <div
                  className={`artisanPriceSlot ${selectedGood.includes("Q2") ? "bold" : "notSelected"
                    }`}
                  id="q2"
                >
                  <img
                    className="artisanPriceListImg"
                    src={`${process.env.PUBLIC_URL
                      }/assets/images/${selectedGood.substring(
                        0,
                        selectedGood.length - 2,
                      )}Q2.png`}
                    alt="Selected artisan good"
                  />
                  <span className="artisanTierPrice">
                    $
                    {
                      MACHINESINFO.artisanPrices[
                      `${selectedGood.substring(
                        0,
                        selectedGood.length - 2,
                      )}Q2`
                      ]
                    }
                  </span>
                </div>
                <div
                  className={`artisanPriceSlot ${selectedGood.includes("Q3") ? "bold" : "notSelected"
                    }`}
                  id="q3"
                >
                  <img
                    className="artisanPriceListImg"
                    src={`${process.env.PUBLIC_URL
                      }/assets/images/${selectedGood.substring(
                        0,
                        selectedGood.length - 2,
                      )}Q3.png`}
                    alt="Selected artisan good"
                  />
                  <span className="artisanTierPrice">
                    $
                    {
                      MACHINESINFO.artisanPrices[
                      `${selectedGood.substring(
                        0,
                        selectedGood.length - 2,
                      )}Q3`
                      ]
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
          <div id="artisanSellCount">
            <h4>
              <u>Sell Artisan Goods:</u>
            </h4>
            <div className="artSellInputs">
              <input
                placeholder="0"
                value={sellQty}
                className="sellQtyInput"
                onChange={(e) => setSellQty(e.target.value)}
              ></input>
              <button
                id="artSell"
                onClick={() => sellArtisan(selectedGood, parseInt(sellQty))}
                onMouseEnter={() => setPriceHover("SELL")}
                onMouseLeave={() => setPriceHover(null)}
              >
                SELL
              </button>
              <button
                id="artSellAll"
                onClick={() => {
                  sellArtisan(selectedGood, parseInt(items[selectedGood]));
                  setSellQty("");
                  // automatically equip next artisan good
                  let allKeys = Object.keys(items);
                  let foundNew = false;
                  for (let i = 0; i < allKeys.length; ++i) {
                    if (allKeys[i].includes("Q") && items[allKeys[i]] !== 0) {
                      setSelected(allKeys[i]);
                      setSellQty(items[allKeys[i]]);
                      foundNew = true;
                      break;
                    }
                  }
                  if (!foundNew) {
                    setSelected("");
                    setSellQty("");
                  }
                }}
                onMouseEnter={() => setPriceHover("SELL ALL")}
                onMouseLeave={() => setPriceHover(null)}
              >
                SELL ALL
              </button>
            </div>
            <div className='artisan-sell-total'>
              {(priceHover === "SELL" && sellQty) && <p>Total: ${(MACHINESINFO.artisanPrices[selectedGood] * parseInt(sellQty))?.toLocaleString()}</p>}
              {(priceHover === "SELL ALL" && selectedGood) && <p>Total: ${(MACHINESINFO.artisanPrices[selectedGood] * items[selectedGood])?.toLocaleString()}</p>}
            </div>

          </div>
        </div>

        {Object.keys(machines).length !== 0 && (
          <div id="machineArea">
            {MachineUnits()}
          </div>
        )}
      </div>
    </div>
  );
}

export default MachinesScreen;
