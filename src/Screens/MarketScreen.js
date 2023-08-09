
import './CSS/MarketScreen.css'
import CompProfile from '../Components/GUI/CompProfile';
import CompMarket from '../Components/Market/CompMarket';
import CompOtherScreen from '../Components/GUI/CompOtherScreens'
import CompInventory from '../Components/GUI/CompInventory';
import CompMarketSelection from '../Components/Market/CompMarketSelection';
import Complogin from '../Components/GUI/CompLogin';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


function MarketScreen({ }) {

    const navigate = useNavigate();
    if (localStorage.getItem('token') === null) {
        // no auth token present
        navigate('/');
    }
    // Functions

    // profile info
    const [items, setItems] = useState({});
    const [Balance, setBalance] = useState(0);
    const [XP, setXP] = useState(0);
    const [Username, setUsername] = useState("");
    const [loginBox, setLoginBox] = useState(false);
    const [prices, setPrices] = useState(null);
    const [marketItems, setMarketItems] = useState([]);
    const [selected, setSelected] = useState({
        name: "",
        newPrice: 0,
        oldPrice: 0,
        imgURL: "EMPTY.png"
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
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
                } else {
                    const data = await result.json();
                    setBalance(data.Balance);
                    setXP(data.XP);
                    setUsername(data.Username);

                }

                const prices = await fetch('https://farm-api.azurewebsites.net/api/prices', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({})
                });
                if (!prices.ok) {
                    throw new Error(`HTTP error! status: ${prices.status}`);
                } else {
                    const pricesData = await prices.json()
                    setPrices(pricesData);
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
        fetchProfile();
    }, []);

    useEffect(() => {
        getMarketItems()
    }, [])

    useEffect(() => {
        if (prices) getMarketItems();
    }, [prices])

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

    // set market select item by name, used to permit selection in inventory
    const setMarketSelected = (name) => {
        if (marketItems) {
            let targetItem = marketItems.filter((item) => item.name === name);
            if (targetItem.length !== 1) {
                return;
            }
            console.log(targetItem[0])
            setSelected(targetItem[0])
        }
    }

    const getMarketItems = () => {
        if (!prices) return null;
        let keys = Object.keys(prices.newPrices).sort();
        let items = [];
        for (let i = 0; i < Object.keys(prices.newPrices).length; ++i) {
            items.push({
                name: keys[i],
                newPrice: prices.newPrices[keys[i]],
                oldPrice: prices.oldPrices[keys[i]],
                imgURL: `${keys[i]}.png`
            })
        }
        setMarketItems(items);

    }

    const onSell = async (itemName, quantity) => {
        console.log(`request to sell ${quantity} ${itemName}`)
        if (itemName in items && itemName in prices.newPrices) {
            if (items[itemName] >= quantity) {
                console.log("CAN SELL");
                updateInventory(itemName, -1 * quantity, false);
                updateBalance(prices.newPrices[itemName] * quantity);
                const token = localStorage.getItem('token');
                let result = await fetch('https://farm-api.azurewebsites.net/api/marketSell', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        item: itemName,
                        count: parseInt(quantity),
                    })
                }).then((x) => x.json())
                if (result.message !== 'SUCCESS') {
                    // out of sync splash
                    console.log("OUT OF SYNC MARKET SELL")
                }

            } else {
                console.log("DOES NOT HAVE QUANTITY");
            }
        } else {
            console.log("INVALID ITEM");
        }
    }


    return (
        <div className='market-container'>

            <div className='market-left'>
                <div id="market-other-screens"><CompOtherScreen current={'market'} /></div>
                <div id="CompMarket-container"><CompMarket marketItems={marketItems ? marketItems : []} setSelected={setSelected} /></div>
            </div>

            <div className='market-right'>
                <div className='market-profile'><CompProfile setLoginBox={setLoginBox} type="wide" getBal={getBal} getUser={getUser} getXP={getXP} /></div>
                <div className='market-select-info'><CompMarketSelection onSell={onSell} name={selected.name} newPrice={selected.newPrice} oldPrice={selected.oldPrice} imgURL={selected.imgURL} /></div>
                <div className='market-inventory'><CompInventory items={items} displayOnly={true} setMarketSelected={setMarketSelected} /></div>
                <div className='market-other'></div>
            </div>
            <div className="login-GUI">
                {loginBox && <Complogin close={() => setLoginBox(false)} />}
            </div>


        </div>
    )
}
export default MarketScreen;