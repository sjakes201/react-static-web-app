import React, { useEffect, useState, useRef, useContext } from 'react'
import '../CSS/CompOtherScreens.css'
import { Link } from 'react-router-dom';


// pass parameter for what screen you are at right now

function CompOtherScreens({ current }) {
  const [otherScreens, setOtherScreens] = useState([]);

  let classes = 'buttons-container ' + (current === 'animals' ? 'top-bar' : 'bottom-bar')

  const renderScreenButton = (imageSrc, altText, whereTo) => {
    return (
      <Link
        to={`/${whereTo}`}
        key={altText}
        className='nav-button'>
        {/* <p style={{ height: '50%' }}>{whereTo}</p> */}
        <img style={{height: '100%'}} key={altText} src={imageSrc} alt={altText}  />
      </Link>

    );
  }

  const createButtons = () => {
    const allScreens = ['shop', 'animals', 'plants', 'market']
    const allImgs = [`${process.env.PUBLIC_URL}/assets/images/go_shop.png`, `${process.env.PUBLIC_URL}/assets/images/go_animals.png`, `${process.env.PUBLIC_URL}/assets/images/go_plants.png`, `${process.env.PUBLIC_URL}/assets/images/go_market.png`]
    let index = allScreens.indexOf(current);
    if (index !== -1) {
      allScreens.splice(index, 1);
      allImgs.splice(index, 1);
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
    <div className={classes}>
      {otherScreens}
    </div>
  )
}

export default CompOtherScreens