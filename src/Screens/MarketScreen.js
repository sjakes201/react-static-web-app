
import './CSS/MarketScreen.css'
import CompProfile from '../Components/GUI/CompProfile';
import CompMarket from '../Components/Market/CompMarket';
import CompOtherScreen from '../Components/GUI/CompOtherScreens'
import CompInventory from '../Components/GUI/CompInventory';
import CompMarketSelection from '../Components/Market/CompMarketSelection';
import React, { useEffect, useState } from 'react'

function MarketScreen({ }) {
    sessionStorage.setItem("equipped", '');

    // Functions
    const [items, setItems] = useState({});

    // profile info
    const [Balance, setBalance] = useState(0);
    const [XP, setXP] = useState(0);
    const [Username, setUsername] = useState("");


    useEffect(() => {
        const token = localStorage.getItem('token');
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

            const prices = await fetch('https://farm-api.azurewebsites.net/api/prices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({})
            });
            const pricesData = await prices.json()

            setBalance(data.Balance);
            setXP(data.XP);
            setUsername(data.Username);
            setPrices(pricesData);
        }
        fetchProfile();

    }, []);

    const getXP = () => {
        return XP;
    }

    const getBal = () => {
        return Balance;
    }

    const getUser = () => {
        if (Username) return Username
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


    const [selected, setSelected] = useState({
        name: "",
        newPrice: 0,
        oldPrice: 0,
        imgURL: "EMPTY.png"
    });

    // set market select item by name, used to permit selection in inventory
    const setMarketSelected = (name) => {
        if (marketItems) {
            let targetItem = marketItems.filter((item) => item.name === name);
            if(targetItem.length !== 1) {
                return;
            }
            console.log(targetItem[0])
            setSelected(targetItem[0])
        }
    }

    const [prices, setPrices] = useState(null);
    const [marketItems, setMarketItems] = useState([]);

    useEffect(() => {
        getMarketItems()
    }, [])

    useEffect(() => {
        if (prices) getMarketItems();
    }, [prices])

    const getMarketItems = () => {
        if (!prices) return null;
        let keys = Object.keys(prices.newPrices).sort();
        let items = [];
        for (let i = 0; i < Object.keys(prices.newPrices).length; ++i) {
            items.push({
                name: keys[i],
                newPrice: prices.newPrices[keys[i]][0],
                oldPrice: prices.oldPrices[keys[i]][0],
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
                updateBalance(prices.newPrices[itemName][0] * quantity);
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
                <div className='market-profile'><CompProfile type="wide" getBal={getBal} getUser={getUser} getXP={getXP} /></div>
                <div className='market-select-info'><CompMarketSelection onSell={onSell} name={selected.name} newPrice={selected.newPrice} oldPrice={selected.oldPrice} imgURL={selected.imgURL} /></div>
                <div className='market-inventory'><CompInventory items={items} displayOnly={true} setMarketSelected={setMarketSelected} /></div>
                <div className='market-other'>AD</div>
            </div>


        </div>
    )
}
export default MarketScreen;