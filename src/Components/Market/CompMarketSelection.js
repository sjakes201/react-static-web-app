import React, { useEffect, useState, useRef } from "react";
import CONSTANTS from "../../CONSTANTS";
import './MarketComponents.css'

// pass it all price info
function CompMarketSelection({
  name,
  newPrice,
  oldPrice,
  imgURL,
  onSell,
  items,
  multiplier
}) {
  const autoSubmit = useRef(false);

  let arrowURL = `${process.env.PUBLIC_URL}/assets/images/market_direction_error.png`;
  if (newPrice === 0 && oldPrice === 0) {
    arrowURL = `${process.env.PUBLIC_URL}/assets/images/market-neutral${multiplier !== 1 ? '-gold' : ''}.png`;
  } else if (newPrice >= oldPrice * 1.019) {
    arrowURL = `${process.env.PUBLIC_URL}/assets/images/market-up${multiplier !== 1 ? '-gold' : ''}.png`;
  } else if (newPrice <= oldPrice * 0.981) {
    arrowURL = `${process.env.PUBLIC_URL}/assets/images/market-down${multiplier !== 1 ? '-gold' : ''}.png`;
  } else {
    arrowURL = `${process.env.PUBLIC_URL}/assets/images/market-neutral${multiplier !== 1 ? '-gold' : ''}.png`;
  }
  const [quantity, setQuantity] = useState("");
  // showPrice is the quantity to override display in price calculation
  const [showPrice, setShowPrice] = useState(0);

  useEffect(() => {
    if (autoSubmit.current) {
      handleSubmit();
      autoSubmit.current = false;
    }
  }, [quantity]);

  useEffect(() => {
    setQuantity("");
  }, [name]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSell(name, quantity);
    setQuantity("");
  };

  const multiplierGraphic = () => {
    if (multiplier === 2) {
      return (
        <img className='nameMultiplierGraphic' src={`${process.env.PUBLIC_URL}/assets/images/market/multiplier2x.png`} />)
    }
    if (multiplier === 3) {
      return (
        <img className='nameMultiplierGraphic' src={`${process.env.PUBLIC_URL}/assets/images/market/multiplier3x.png`} />)
    }
  }

  return (
    <div
      style={{
        height: "100%",
        width: "calc(100% - 22px)",
        margin: "0 11px",
        height: "100%",
        boxSizing: "border-box",
        boxShadow:
          "0 0 0 3px rgb(0, 0, 0), 0 0 0 6px rgb(245, 166, 43), 0 0 0 8px rgb(199, 135, 35), 0 0 0 11px rgb(0, 0, 0)",
      }}
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <div
          style={{
            height: "100%",
            width: "57%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/`.concat(imgURL)}
            style={{ objectFit: "contain", width: "100%", maxHeight: "100%" }}
          />
        </div>
        <div
          style={{
            height: "100%",
            width: "40%",
            padding: "1.5vh 1vh",
            paddingTop: "4%",
          }}
        >
          <div
            className='selected-good-title'
          >
            {/* {multiplierGraphic()} */}
            <p>{name ? CONSTANTS?.InventoryDescriptions?.[name]?.[0] : ""}</p>
            {/* {multiplierGraphic()} */}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "5%",
              fontSize: "1.3vw",
            }}
          >
            ${Math.round((newPrice * multiplier) * 100) / 100} <small>/each</small>{" "}
            <img src={arrowURL} style={{ width: "12%" }} />
          </div>
          <div style={{ fontSize: "0.7vw" }}>${oldPrice} /each previously</div>
          <div style={{ marginTop: "10%", textAlign: "center" }}>
            <form onSubmit={handleSubmit} autoComplete="off">
              <input
                style={{
                  boxSizing: "border-box",
                  width: "85%",
                  padding: "10% 0",
                  textAlign: "center",
                  boxShadow:
                    "0 0 0 1px var(--black), 0 0 0 3px var(--border_yellow), 0 0 0 5px var(--border_shadow_yellow), 0 0 0 7px var(--black)",
                }}
                name="sellQuantity"
                placeholder="0"
                value={quantity}
                onChange={(e) => {
                  if (/^(\d+)?$/.test(e.target.value)) {
                    setQuantity(e.target.value);
                  }
                }}
              ></input>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: "15%",
                  width: "100%",
                  height: "100%",
                  fontSize: "1.7vh",
                }}
              >
                <input
                  type="submit"
                  value="SELL"
                  style={{
                    boxSizing: "border-box",
                    boxShadow:
                      "0 0 0 1px var(--black), 0 0 0 2px var(--border_orange), 0 0 0 3px var(--border_shadow_orange), 0 0 0 4px var(--black)",
                    width: "calc(45% - 8px)",
                    height: "calc(7vh - 8px)",
                    cursor: "pointer",
                    fontSize: "1vw",
                  }}
                ></input>
                <div
                  style={{
                    boxSizing: "border-box",
                    boxShadow:
                      "0 0 0 1px var(--black), 0 0 0 2px var(--border_orange), 0 0 0 3px var(--border_shadow_orange), 0 0 0 4px var(--black)",
                    width: "calc(45% - 8px)",
                    height: "calc(7vh - 8px)",
                    background: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: "1vw",
                  }}
                  onClick={() => {
                    autoSubmit.current = true;
                    setQuantity(items[name]);
                  }}
                  onMouseEnter={() => setShowPrice(items[name])}
                  onMouseLeave={() => setShowPrice(0)}
                >
                  SELL ALL
                </div>
              </div>
            </form>
          </div>
          {name !== "" && (quantity !== "" || showPrice !== 0) && (
            <div
              style={{
                textAlign: "center",
                marginTop: "8%",
                fontSize: "1vw",
                color: "#1a1a1a",
                lineHeight: "1.15vw",
              }}
            >
              <p>
                ${Math.round((newPrice * multiplier) * 100) / 100} x{" "}
                {showPrice
                  ? showPrice.toLocaleString()
                  : Number.parseInt(quantity).toLocaleString()}{" "}
                =
              </p>
              <p>
                $
                {(
                  Math.round(((newPrice * (showPrice ? showPrice : quantity)) * multiplier) * 100) / 100
                ).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompMarketSelection;
