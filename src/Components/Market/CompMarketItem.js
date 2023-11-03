import React, { useEffect, useState } from "react";
import CONSTANTS from "../../CONSTANTS";
import './MarketComponents.css'

// imgURL is img for icon, name is itemName, price is current price per unit,
// priceDirection is change from previous time interval: UP, DOWN, NEUTRAL
function CompMarketItem({ imgURL, name, newPrice, oldPrice, multiplier }) {
  let arrowURL = `${process.env.PUBLIC_URL}/assets/images/market_direction_error.png`;
  if (newPrice >= oldPrice * 1.019) {
    arrowURL = `${process.env.PUBLIC_URL}/assets/images/market-up${multiplier !== 1 ? '-gold' : ''}.png`;
  } else if (newPrice <= oldPrice * 0.981) {
    arrowURL = `${process.env.PUBLIC_URL}/assets/images/market-down${multiplier !== 1 ? '-gold' : ''}.png`;
  } else {
    arrowURL = `${process.env.PUBLIC_URL}/assets/images/market-neutral${multiplier !== 1 ? '-gold' : ''}.png`;
  }

  const borderType = () => {
    switch (multiplier) {
      case 2:
        return 'gold-border'
      case 3:
        return 'super-gold-border'
      default:
        return 'orange-border-medium'
    }
  }

  const multiplierGraphic = () => {
    return (
      multiplier === 2 ?
        <img className='pulse' src={`${process.env.PUBLIC_URL}/assets/images/market/multiplier2x.png`} /> :
        <img className='pulse' src={`${process.env.PUBLIC_URL}/assets/images/market/multiplier3x.png`} />
    )
  }

  return (
    <div
      id="market-item"
      className={`${borderType()} marketItem`}
    >
      <p
        id="market-item-name"
        className='marketItemName'
      >
        {CONSTANTS.InventoryDescriptions[name][0]}
      </p>
      <div
        id="market-img-container"
        className='marketImageContainer'
      >
        {multiplier !== 1 &&
          (<div className='multiplier-row'>
            {multiplierGraphic()}
            {multiplierGraphic()}
          </div>
          )
        }

        <img
          id="market-item-img"
          src={`${process.env.PUBLIC_URL}/assets/images/`.concat(imgURL)}
          alt={name}
          className='marketItemImage'
        />
      </div>
      <div
        id="market-price-info"
        className='marketPriceInfo'
      >
        <img className={`priceChangeArrow`} src={arrowURL} />
        <p className={`price-style`}>${Math.round((newPrice * multiplier) * 100) / 100}</p>
        <img className={`priceChangeArrow`} src={arrowURL} />
        <small style={{ fontSize: ".8vw" }}>/each</small>
      </div>
    </div>
  );
}

export default CompMarketItem;
