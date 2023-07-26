import React, { useEffect, useState, useRef } from 'react'
import '../CSS/CompOtherScreens.css'
import { Link } from 'react-router-dom';


// pass parameter for what screen you are at right now

function CompOtherScreens({ current }) {

  const [otherScreens, setOtherScreens] = useState([]);


  const renderScreenButton = (imageSrc, altText, whereTo) => {
    return (
      <Link to={`/${whereTo}`} key={altText}
      style={{
        width: '90%',
        height: '70%',
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <p style={{ height: '10%' }}>{whereTo}</p>
        <img key={altText} src={imageSrc} alt={altText} style={{ width: '100%', height: '90%', border: '1px solid black', objectFit: 'contain' }} />
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
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: 'rgb(120, 218, 81)',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      gap: '10px',
    }} >
      {otherScreens}
    </div>
  )
}

export default CompOtherScreens