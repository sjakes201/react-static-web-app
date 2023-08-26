import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import CONSTANTS from '../CONSTANTS';
import './CSS/AnimalScreen.css'
import CompPen from '../Components/Animals/CompPen';
import CompOtherScreens from '../Components/GUI/CompOtherScreens'
import CompInventory from '../Components/GUI/CompInventory'
import CompProfile from "../Components/GUI/CompProfile";
import Complogin from '../Components/GUI/CompLogin';
import AnimalsTopBar from '../Components/Animals/AnimalsTopBar';
import AnimalManagement from '../Components/Animals/AnimalManagement';
import OrderBoard from "../Components/Orders/OrderBoard";
import NotificationBox from '../Components/GUI/NotificationBox';

import { useNavigate } from 'react-router-dom';


function AnimalScreen() {

  const navigate = useNavigate();
  if (localStorage.getItem('token') === null) {
    // no auth token present
    navigate('/');
  }


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

  // Functions

  const [items, setItems] = useState({});

  // profile info
  const [Balance, setBalance] = useState(0);
  const [XP, setXP] = useState(0);
  const [Username, setUsername] = useState("");
  const [loginBox, setLoginBox] = useState(false);
  const [orderBox, setOrderBox] = useState(false);
  const [coop, setCoop] = useState([]);
  const [barn, setBarn] = useState([]);
  const [manager, setManager] = useState(false);
  const [capacities, setCapacities] = useState({ barnCapacity: 0, coopCapacity: 0 });
  const [orderNotice, setOrderNotice] = useState(false);

  const [upgrades, setUpgrades] = useState({});

  const [equippedFeed, setEquippedFeed] = useState("")

  // level for unlocks and unlocks notifictaion stuff
  const [unlockContents, setUnlockContents] = useState([])
  const [notificationBox, setNotificationBox] = useState(false)
  const [level, setLevel] = useState(0)
  let newXP = useRef(false)

  useEffect(() => {
    if (Object.keys(upgrades).length === 0) {
      setUpgrades(getUpgrades)
    }
  })

  useEffect(() => {
    const token = localStorage.getItem('token');
    sessionStorage.setItem('equipped', '')
    async function fetchData() {
      try {
        const result = await fetch('http://localhost:7071/api/inventoryAll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({})
        });

        if (!result.ok) {
          throw new Error(`HTTP error! status: ${result.status}`);
        } else {
          let data = await result.json();
          delete data.HarvestsFertilizer; delete data.TimeFertilizer; delete data.YieldsFertilizer;
          setItems(data);
        }

      } catch (error) {
        if (error.message.includes('401')) {
          console.log("AUTH EXPIRED")
          localStorage.removeItem('token');
          navigate('/');
        } else {
          console.log(error)
        }
      }
    }
    fetchData();


    const getAnimals = async () => {
      try {
        const token = localStorage.getItem('token');
        const animalsData = await fetch('https://farm-api.azurewebsites.net/api/allAnimals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({})
        })

        if (!animalsData.ok) {
          throw new Error(`HTTP error! status: ${animalsData.status}`);
        } else {
          let animalsResult = await animalsData.json();
          setBarn(animalsResult.barnResult);
          setCoop(animalsResult.coopResult)
        }

      } catch (error) {
        if (error.message.includes('401')) {
          localStorage.removeItem('token');
          navigate('/');
        }
      }
    }

    async function fetchProfile() {
      try {
        const result = await fetch('https://farm-api.azurewebsites.net/api/profileInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({})
        });
        if (!result.ok) {
          throw new Error(`HTTP error! status: ${result.status}`);
        } else {
          const data = await result.json();
          setCapacities({ barnCapacity: data.BarnCapacity, coopCapacity: data.CoopCapacity })
          setBalance(data.Balance);
          setXP(data.XP);
          setUsername(data.Username);
          let upgrades = {};
          for (const column in data) {
            if (column.includes('Upgrade') || column.includes('Permit')) {
              upgrades[column] = data[column];
            }
          }
          setUpgrades(upgrades);
        }
      } catch (error) {
        if (error.message.includes('401')) {
          localStorage.removeItem('token');
          navigate('/');
        }
      }
    }
    fetchProfile();
    getAnimals();
  }, []);

  const calcLevel = (XP) => {
    const lvlThresholds = CONSTANTS.xpToLevel;
    let level = 0;
    let remainingXP = XP;
    for (let i = 0; i < lvlThresholds.length; ++i) {
      if (XP >= lvlThresholds[i]) {
        level = i;
        remainingXP = XP - lvlThresholds[i]
      }
    }
    // If level is >= 15, and remainingXP is > 0, we calculate remaining levels (which are formulaic, each level is)
    while (remainingXP >= 600) {
      ++level;
      remainingXP -= 600;
    }
    // find next threshold
    return level
  }

  useEffect(() => {
    console.log('xp updated')
    setLevel(calcLevel(XP))
  }, [XP])

  useEffect(() => {
    console.log('lvl updated')
    console.log(newXP.current)
    if (newXP.current && level in CONSTANTS.levelUnlocks) {
      console.log('lvl updated bc of new')
      setUnlockContents(CONSTANTS.levelUnlocks[level])
      setNotificationBox(true)

    }
  }, [level])

  const getXP = () => {
    return XP;
  }

  const getBal = () => {
    return Balance;
  }

  const getUser = () => {
    if (Username) {
      return Username;
    }
  }

  const getUpgrades = () => {
    if (upgrades) return upgrades;
  }

  const updateXP = (amount) => {
    newXP.current = true;
    setXP(prevXP => {
      const newXP = prevXP + amount;
      return newXP;
    });
  }

  const updateBalance = (amount) => {
    setBalance(oldBal => {
      const newBal = oldBal + amount;
      return newBal;
    })
  }

  const updateInventory = (itemName, quantity, preventAnimate) => {
    let newCount = 0;
    setItems((prevItems) => {
      let invItems = { ...prevItems, [itemName]: (prevItems[itemName] || 0) + quantity };
      newCount = (prevItems[itemName] || 0) + quantity;
      const sortedKeys = Object.keys(invItems).sort((a, b) => invItems[b] - invItems[a]);
      const sortedObject = {};
      sortedKeys.forEach(key => {
        sortedObject[key] = invItems[key];
      });

      return { ...sortedObject };
    })
    if (preventAnimate) return newCount;
    const invItem = document.getElementById(itemName);
    invItem.classList.remove('flash');
    void invItem.offsetWidth; // This forces a reflow hack
    invItem.classList.add('flash');
    return newCount;
  }

  const appStyle = {
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '80% 20%',
    position: 'relative'
  }

  if (equippedFeed !== "") {
    appStyle.cursor = `url(${process.env.PUBLIC_URL}/assets/images/mouse/${equippedFeed}32.png) 16 16, auto`
  }

  return (
    <div style={appStyle}>
      {notificationBox && <NotificationBox close={() => setNotificationBox(false)} contents={unlockContents} />}
      {manager && <div className='manage-animals'> <AnimalManagement capacities={capacities} coop={coop} setCoop={setCoop} barn={barn} setBarn={setBarn} setManager={setManager} /></div>}
      <div className='left-column'>
        <div className='other-screensAn'><CompOtherScreens current={'animals'} /></div>
        <div className='pen-management'> <AnimalsTopBar setManager={setManager} /> </div>
        <div className="pens-wrapper" ref={componentRef}>
          {renderPens && (<><div className="barn-container"><CompPen setEquippedFeed={setEquippedFeed} equippedFeed={equippedFeed} setOrderNotice={setOrderNotice} passedUpgrades={upgrades} getUpgrades={getUpgrades} className='barnPen' importedAnimals={barn} setAnimalsParent={setBarn} isBarn={true} key={1} penWidth={(1 / 2) * componentWidth} penHeight={(componentHeight)} updateInventory={updateInventory} updateXP={updateXP} getXP={getXP} /></div></>)}
          {renderPens && (<><div className="coop-container"><CompPen setEquippedFeed={setEquippedFeed} equippedFeed={equippedFeed} setOrderNotice={setOrderNotice} passedUpgrades={upgrades} getUpgrades={getUpgrades} className='coopPen' importedAnimals={coop} setAnimalsParent={setCoop} isBarn={false} key={2} penWidth={(1 / 2) * componentWidth} penHeight={(componentHeight)} updateInventory={updateInventory} updateXP={updateXP} getXP={getXP} /></div></>)}
        </div>

      </div>
      <div className='right-column'>
        <div className="userProfile"><CompProfile orderNotice={orderNotice} type={'tall'} setLoginBox={setLoginBox} setOrderBox={setOrderBox} getBal={getBal} updateBalance={updateBalance} getUser={getUser} getXP={getXP} /></div>
        <div className="inventory"><CompInventory items={items} updateInventory={updateInventory} isAnimalScreen={true} setEquippedFeed={setEquippedFeed} /></div>
        <div className="settings">
          {/* <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '60px', justifyContent: 'space-evenly', position: 'absolute', top: '0' }}>
            <div style={{ position: 'relative', background: 'orange', width: '120px', height: '60px', zIndex: '2000', border: '2px solid purple' }}>
              AD 120px x 60px
            </div>
            <div style={{ position: 'relative', background: 'orange', width: '120px', height: '60px', zIndex: '2000', border: '2px solid purple' }}>
              AD 120px x 60px
            </div>

          </div> */}
          <a target='_blank' href="/updateNotes.html" style={{ fontSize: '.7vw', marginRight: '1%' }}>update notes </a>
          <a target='_blank' href="/privacy.html" style={{ fontSize: '.7vw', marginRight: '1%' }}>Privacy Policy </a>
          <div style={{ width: '70%', height: '3vh', position: 'absolute', bottom: '4vh', left: '0', fontSize: '1vw' }}>
            <a target='_black' href="https://discord.gg/jrxWrgNCHw" style={{ fontSize: '.6vw', textDecoration: 'underline', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <img src={`${process.env.PUBLIC_URL}/assets/images/discord.png`} style={{ height: '50%', marginRight: '2%' }}></img>
              Community Discord
              <img src={`${process.env.PUBLIC_URL}/assets/images/discord.png`} style={{ height: '50%', marginLeft: '2%' }}></img>
            </a>
          </div>
          <div style={{ width: '70%', height: '3vh', position: 'absolute', bottom: '1vh', left: '0', fontSize: '1vw' }}>
            <a target='_black' href="https://www.buymeacoffee.com/farmgame" style={{ fontSize: '.6vw', textDecoration: 'underline', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <img src={`${process.env.PUBLIC_URL}/assets/images/goat_standing_right.png`} style={{ width: '20%' }}></img>
              Buy me a coffee
              <img src={`${process.env.PUBLIC_URL}/assets/images/goat_standing_right.png`} style={{ width: '20%' }}></img>
            </a>
          </div>
        </div>
      </div>
      <div className="login-GUI">
        {loginBox && <Complogin close={() => setLoginBox(false)} />}
      </div>
      <div className="order-GUI">
        {orderBox && <OrderBoard close={() => setOrderBox(false)} updateBalance={updateBalance} updateXP={updateXP} />}
      </div>
    </div>

  );
}

export default AnimalScreen;