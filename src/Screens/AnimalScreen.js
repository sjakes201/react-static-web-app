import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import './CSS/AnimalScreen.css'
import CompPen from '../Components/Animals/CompPen';
import CompOtherScreens from '../Components/GUI/CompOtherScreens'
import CompInventory from '../Components/GUI/CompInventory'
import CompProfile from "../Components/GUI/CompProfile";
import Complogin from '../Components/GUI/CompLogin';
import AnimalsTopBar from '../Components/Animals/AnimalsTopBar';
import AnimalManagement from '../Components/Animals/AnimalManagement';
import { useNavigate } from 'react-router-dom';


function AnimalScreen({ }) {

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
  const [coop, setCoop] = useState([]);
  const [barn, setBarn] = useState([]);
  const [manager, setManager] = useState(false);
  const [capacities, setCapacities] = useState({ barnCapacity: 0, coopCapacity: 0 });

  const [upgrades, setUpgrades] = useState({});

  useEffect(() => {
    if (Object.keys(upgrades).length === 0) {
      setUpgrades(getUpgrades)
      console.log("PINGING FOR UPGRADES")
    } else {
      console.log("RECEIVED UPGRADES")
    }
  })

  useEffect(() => {
    const token = localStorage.getItem('token');
    sessionStorage.setItem('equipped', '')
    async function fetchData() {
      const result = await fetch('https://farm-api.azurewebsites.net/api/inventoryAll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      let data = await result.json();
      setItems(data);
    }
    fetchData();

    const getAnimals = async () => {
      let coopAnimals;
      let barnAnimals;
      try {
        const token = localStorage.getItem('token');
        barnAnimals = await fetch('https://farm-api.azurewebsites.net/api/allBarn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({})
        }).then((x) => x.json())
        coopAnimals = await fetch('https://farm-api.azurewebsites.net/api/allCoop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({})
        }).then((x) => x.json())
      } catch (error) {
        console.log(error);
      }
      setCoop(coopAnimals);
      setBarn(barnAnimals);
    }

    async function fetchProfile() {
      const result = await fetch('https://farm-api.azurewebsites.net/api/profileInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
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
    fetchProfile();
    getAnimals();

  }, []);

  // pass each screen this. they will use it and assign it to their building/path buttons

  const getXP = () => {
    return XP;
  }

  const getBal = () => {
    return Balance;
  }

  const getUser = () => {
    if (Username) {
      if (Username.includes('#')) return "Guest"
      return Username;
    }
  }

  const getUpgrades = () => {
    if (upgrades) return upgrades;
    // for all of these.. else return proper formatted data with default values?
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
    setItems((prevItems) => {
      let invItems = { ...prevItems, [itemName]: (prevItems[itemName] || 0) + quantity };
      const sortedKeys = Object.keys(invItems).sort((a, b) => invItems[b] - invItems[a]);
      const sortedObject = {};
      sortedKeys.forEach(key => {
        sortedObject[key] = invItems[key];
      });

      return { ...sortedObject };
    })
    if (preventAnimate) return;
    const invItem = document.getElementById(itemName);
    invItem.classList.remove('flash');
    void invItem.offsetWidth; // This forces a reflow hack
    invItem.classList.add('flash');
  }


  return (
    <div className='app3'>
      {manager && <div className='manage-animals'> <AnimalManagement capacities={capacities} coop={coop} setCoop={setCoop} barn={barn} setBarn={setBarn} setManager={setManager} /></div>}
      <div className='left-column'>
        <div className='pen-management'> <AnimalsTopBar setManager={setManager} /> </div>
        <div className="pens-wrapper" ref={componentRef}>
          {renderPens && (<><div className="barn-container"><CompPen passedUpgrades={upgrades} getUpgrades={getUpgrades} className='barnPen' importedAnimals={barn} setBarn={setBarn} isBarn={true} key={1} penWidth={(1 / 2) * componentWidth} penHeight={(componentHeight)} updateInventory={updateInventory} updateXP={updateXP} getXP={getXP} /></div></>)}
          {renderPens && (<><div className="coop-container"><CompPen passedUpgrades={upgrades} getUpgrades={getUpgrades} className='coopPen' importedAnimals={coop} setCoop={setCoop} isBarn={false} key={2} penWidth={(1 / 2) * componentWidth} penHeight={(componentHeight)} updateInventory={updateInventory} updateXP={updateXP} getXP={getXP} /></div></>)}
        </div>
        <div className='other-screensAn'><CompOtherScreens current={'animals'} /></div>

      </div>
      <div className='right-column'>
        <div className="userProfile"><CompProfile type={'tall'} setLoginBox={setLoginBox} getBal={getBal} updateBalance={updateBalance} getUser={getUser} getXP={getXP} /></div>
        <div className="inventory"><CompInventory items={items} updateInventory={updateInventory} /></div>
        <div className="settings">SETTINGS</div>
      </div>
      <div className="login-GUI">
        {loginBox && <Complogin close={() => setLoginBox(false)} />}
      </div>
    </div>

  );
}

export default AnimalScreen;