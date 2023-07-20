import React, { useEffect, useState, useRef } from 'react'
import '../CSS/CompOtherScreens.css'

// pass parameter for what screen you are at right now

function CompOtherScreens({ current, switchScreen }) {

  const [otherScreens, setOtherScreens] = useState([]);


  const renderScreenButton = (imageSrc, altText, whereTo) => {
    return (
      <button
        key={altText}
        style={{
          width: '90%',
          height: '70%',
          padding: 0,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
        }}
        onClick={() => switchScreen(whereTo)}
      >
        <small style={{height: '10%'}}>{whereTo}</small>
        <img key={altText} src={imageSrc} alt={altText} style={{ width: '100%', height: '100%', border: '1px solid black', objectFit: 'contain' }} />
      </button>
    );
  }

  const createButtons = () => {
    const allScreens = ['ShopScreen', 'AnimalScreen', 'PlantScreen', 'MarketScreen']
    const allImgs = [`${process.env.PUBLIC_URL}/assets/images/homie.png`, `${process.env.PUBLIC_URL}/assets/images/homie.png`, `${process.env.PUBLIC_URL}/assets/images/homie.png`, `${process.env.PUBLIC_URL}/assets/images/homie.png`]
    let index = allScreens.indexOf(current);
    if (index !== -1) {
      allScreens.splice(index, 1);
    }
    let otherScreenButtons = [];
    for (let i = 0; i < allScreens.length; ++i) {
      otherScreenButtons.push(
        renderScreenButton(allImgs[i], allScreens[i], allScreens[i])
      );
    }
    setOtherScreens(otherScreenButtons);
  }

  useEffect(() => {
    createButtons();
  }, [])

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: 'rgb(120, 218, 81)',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      gap: '10px',
    }} >
      {otherScreens}
    </div>
  )
}

export default CompOtherScreens