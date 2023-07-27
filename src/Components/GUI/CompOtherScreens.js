import React, { useEffect, useState, useRef } from 'react'
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
        <p style={{ height: '10%' }}>{whereTo}</p>
        <img key={altText} src={imageSrc} alt={altText}  />
      </Link>

    );
  }

  const createButtons = () => {
    const allScreens = ['shop', 'animals', 'plants', 'market']
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
    <div className={classes}>
      {otherScreens}
    </div>
  )
}

export default CompOtherScreens