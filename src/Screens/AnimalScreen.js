import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import './CSS/AnimalScreen.css'
import CompPen from '../Components/Animals/CompPen';
import CompOtherScreens from '../Components/GUI/CompOtherScreens'
import CompInventory from '../Components/GUI/CompInventory'
import CompProfile from "../Components/GUI/CompProfile";
import Complogin from '../Components/GUI/CompLogin';
import AnimalsTopBar from '../Components/Animals/AnimalsTopBar';
import AnimalManagement from '../Components/Animals/AnimalManagement';
import OrderBoard from "../Components/Orders/OrderBoard";

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
        const result = await fetch('https://farm-api.azurewebsites.net/api/inventoryAll', {
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
        const barnData = await fetch('https://farm-api.azurewebsites.net/api/allBarn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({})
        })

        if (!barnData.ok) {
          throw new Error(`HTTP error! status: ${barnData.status}`);
        } else {
          let barnAnimals = await barnData.json();
          setBarn(barnAnimals);
        }


        const coopData = await fetch('https://farm-api.azurewebsites.net/api/allCoop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({})
        })
        if (!coopData.ok) {
          throw new Error(`HTTP error! status: ${barnData.status}`);
        } else {
          let coopAnimals = await coopData.json();
          setCoop(coopAnimals);
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
        <div className="settings"><a target='_blank' href="/updateNotes.html" style={{ fontSize: '.7vw', margin: '1%' }}>update notes </a></div>
      </div>
      <div className="login-GUI">
        {loginBox && <Complogin close={() => setLoginBox(false)} />}
      </div>
      <div className="order-GUI">
        {orderBox && <OrderBoard close={() => setOrderBox(false)} />}
      </div>
    </div>

  );
}

export default AnimalScreen;