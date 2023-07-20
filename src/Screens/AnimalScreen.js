import React, { useRef, useLayoutEffect, useState } from 'react';
import './CSS/AnimalScreen.css'
import CompPen from '../Components/Animals/CompPen';
import CompOtherScreens from '../Components/GUI/CompOtherScreens'
import CompInventory from '../Components/GUI/CompInventory'
import CompProfile from "../Components/GUI/CompProfile";


function AnimalScreen({ items, updateInventory, switchScreen, getBal, updateBalance, getUpgrades, getUser, updateXP, getXP, lastItem }) {
  // Get size of component
  const componentRef = useRef(null);
  const [componentWidth, setComponentWidth] = useState(null);
  const [componentHeight, setComponentHeight] = useState(null);

  useLayoutEffect(() => {
    const componentNode = componentRef.current;
    const handleResize = () => {
      const newWidth = componentNode.offsetWidth;
      const newHeight = componentNode.offsetHeight;

      if (componentWidth !== newWidth || componentHeight !== newHeight) {
        setComponentWidth(newWidth);
        setComponentHeight(newHeight);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [componentWidth, componentHeight]);

  const renderPens = componentWidth !== null && componentHeight !== null;

  //


  return (
    <div className='app3'>
      <div className='left-column'>
        <div className="pens-wrapper" ref={componentRef}>
          {renderPens && (<><div className="barn-container"><CompPen getUpgrades={getUpgrades} className='barnPen' isBarn={true} key={1} penWidth={(1 / 2) * componentWidth} penHeight={(componentHeight)} updateInventory={updateInventory} updateXP={updateXP} getXP={getXP} /></div></>)}
          {renderPens && (<><div className="coop-container"><CompPen getUpgrades={getUpgrades} className='coopPen' isBarn={false} key={2} penWidth={(1 / 2) * componentWidth} penHeight={(componentHeight)} updateInventory={updateInventory} updateXP={updateXP} getXP={getXP} /></div></>)}
        </div>
        <div className='other-screensAn'><CompOtherScreens switchScreen={switchScreen} current={'AnimalScreen'}/></div>

      </div>
      <div className='right-column'>
        <div className="userProfile"><CompProfile type={'tall'} getBal={getBal} updateBalance={updateBalance} getUser={getUser} getXP={getXP} /></div>
        <div className="inventory"><CompInventory items={items} updateInventory={updateInventory} lastItem={lastItem}/></div>
        <div className="settings">SETTINGS</div>
      </div>
    </div>

  );
}

export default AnimalScreen;