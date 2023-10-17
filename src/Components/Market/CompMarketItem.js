import React, { useEffect, useState } from "react";
import CONSTANTS from "../../CONSTANTS";

// imgURL is img for icon, name is itemName, price is current price per unit,
// priceDirection is change from previous time interval: UP, DOWN, NEUTRAL
function CompMarketItem({ imgURL, name, newPrice, oldPrice }) {
  let arrowURL = `${process.env.PUBLIC_URL}/assets/images/market_direction_error.png`;
  if (newPrice >= oldPrice * 1.019) {
    arrowURL = `${process.env.PUBLIC_URL}/assets/images/market-up.png`;
  } else if (newPrice <= oldPrice * 0.981) {
    arrowURL = `${process.env.PUBLIC_URL}/assets/images/market-down.png`;
  } else {
    arrowURL = `${process.env.PUBLIC_URL}/assets/images/market-neutral.png`;
  }
  return (
    <div
      id="market-item"
      style={{
        width: "calc(100% - 22px)",
        margin: "11px",
        boxSizing: "border-box",
        boxShadow:
          "0 0 0 1px rgb(0, 0, 0), 0 0 0 4px rgb(245, 166, 43), 0 0 0 6px rgb(199, 135, 35), 0 0 0 9px rgb(0, 0, 0)",
      }}
    >
      <p
        id="market-item-name"
        style={{
          textAlign: "center",
          height: "15%",
          width: "100%",
          fontSize: "1.05vw",
        }}
      >
        {CONSTANTS.InventoryDescriptions[name][0]}
      </p>
      <div
        id="market-img-container"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          id="market-item-img"
          src={`${process.env.PUBLIC_URL}/assets/images/`.concat(imgURL)}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
          }}
        />
      </div>
      <div
        id="market-price-info"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "20%",
          columnGap: "2%",
        }}
      >
        <img style={{ width: "10%" }} src={arrowURL} />
        <p style={{ fontSize: "1vw" }}>${newPrice}</p>
        <img style={{ width: "10%" }} src={arrowURL} />
        <small style={{ fontSize: ".8vw" }}>/each</small>
        {/* <img style={{ width: '10%'}} src={arrowURL} /> */}
      </div>
    </div>
  );
}

export default CompMarketItem;
