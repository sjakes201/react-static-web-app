
import './CSS/MarketScreen.css'
import CompProfile from '../Components/GUI/CompProfile';
import CompMarket from '../Components/Market/CompMarket';
import CompOtherScreen from '../Components/GUI/CompOtherScreens'
import CompInventory from '../Components/GUI/CompInventory';
import CompMarketSelection from '../Components/Market/CompMarketSelection';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { useWebSocket } from "../WebSocketContext";


function MarketScreen({ itemsData, setItemsData, prices, getUser, getBal, updateBalance, getXP, setLoginBox }) {
    const { waitForServerResponse } = useWebSocket();

    const navigate = useNavigate();
    if (localStorage.getItem('token') === null) {
        // no auth token present
        navigate('/');
    }

    const [items, setItems] = useState({});
    const [marketItems, setMarketItems] = useState([]);
    const [selected, setSelected] = useState({
        name: "",
        newPrice: 0,
        oldPrice: 0,
        imgURL: "EMPTY.png"
    });

    useEffect(() => {
        let items = { ...itemsData };
        delete items.HarvestsFertilizer; delete items.TimeFertilizer; delete items.YieldsFertilizer;
        setItems(items)
    }, [itemsData])

    useEffect(() => {
        getMarketItems()
    }, [])

    useEffect(() => {
        if (prices) getMarketItems();
    }, [prices])

    const updateInventory = (itemName, quantity, preventAnimate) => {
        setItemsData((prevItems) => {
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
        if (itemName in items && itemName in prices.newPrices) {
            if (items[itemName] >= quantity) {
                updateInventory(itemName, -1 * quantity, false);
                updateBalance(prices.newPrices[itemName] * quantity);
                if (waitForServerResponse) {
                    await waitForServerResponse('marketSell', { item: itemName, count: parseInt(quantity) });
                }
            }
        } else {
            console.log("INVALID ITEM");
        }
    }
    
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//api.adinplay.com/libs/aiptag/pub/FRM/farmgame.live/tag.min.js";
        script.async = true;

        script.onload = () => {
            if (window.aiptag && window.aiptag.cmd && window.aiptag.cmd.display) {
                window.aiptag.cmd.display.push(function () {
                    if (typeof window.aipDisplayTag.display === 'function') {
                        window.aipDisplayTag.display('farmgame-live_120x60');
                    }
                });
            }
        };

        document.body.appendChild(script);

        if (window.aiptag && window.aiptag.cmd && window.aiptag.cmd.display) {
            window.aiptag.cmd.display.push(function () {
                if (typeof window.aipDisplayTag.display === 'function') {
                    window.aipDisplayTag.display('farmgame-live_120x60');
                }
            });
        }

        return () => {
            document.body.removeChild(script);
        };
    }, []);


    return (
        <div className='market-container'>

            <div className='market-left'>
                <div id="market-other-screens"><CompOtherScreen current={'market'} /></div>
                <div id="CompMarket-container"><CompMarket marketItems={marketItems ? marketItems : []} setSelected={setSelected} /></div>
            </div>

            <div className='market-right'>
                <div className='market-profile'><CompProfile setLoginBox={setLoginBox} type="wide" getBal={getBal} getUser={getUser} getXP={getXP} /></div>
                <div className='market-select-info'><CompMarketSelection items={items} onSell={onSell} name={selected.name} newPrice={selected.newPrice} oldPrice={selected.oldPrice} imgURL={selected.imgURL} /></div>
                <div className='market-inventory'><CompInventory items={items} displayOnly={true} setMarketSelected={setMarketSelected} /></div>
                <div className='market-other'>
                    <div style={{ position: 'relative', width: '120px', height: '60px', zIndex: '2000', border: '1px solid black' }}>
                        <div id="farmgame-live_120x60"></div>
                    </div>
                    {/* <div style={{ position: 'relative', background: 'orange', width: '120px', height: '60px', zIndex: '2000', border: '2px solid purple' }}>
                        AD 120px x 60px
                    </div> */}
                </div>
            </div>


        </div>
    )
}
export default MarketScreen;