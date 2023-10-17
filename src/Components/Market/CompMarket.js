import React, { useEffect, useState } from "react";
import CompMarketItem from "./CompMarketItem";
import "../CSS/CompMarket.css";

function CompMarket({ marketItems, setSelected }) {
  return (
    <div id="market-container">
      <div className="market-shelf">
        {marketItems.map((item, index) => {
          return (
            <div
              key={index}
              className="market-item"
              onClick={() =>
                setSelected({
                  name: item.name,
                  newPrice: item.newPrice,
                  oldPrice: item.oldPrice,
                  imgURL: item.imgURL,
                })
              }
            >
              <CompMarketItem
                key={index}
                imgURL={item.imgURL}
                newPrice={item.newPrice}
                oldPrice={item.oldPrice}
                name={item.name}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CompMarket;
