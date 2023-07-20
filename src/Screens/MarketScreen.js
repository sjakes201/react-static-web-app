import './CSS/MarketScreen.css'
import CompProfile from '../Components/GUI/CompProfile';
import CompMarket from '../Components/Market/CompMarket';
import CompOtherScreen from '../Components/GUI/CompOtherScreens'
import CompInventory from '../Components/GUI/CompInventory';
import CompMarketSelection from '../Components/Market/CompMarketSelection';

import React, { useEffect, useState } from 'react'

function MarketScreen({ items, getPrices, getBal, getUser, getXP, switchScreen, updateInventory, updateBalance }) {

    const [selected, setSelected] = useState({
        name: "",
        newPrice: 0,
        oldPrice: 0,
        imgURL: ""
    });

    const [prices, setPrices] = useState(null);
    const [marketItems, setMarketItems] = useState([]);

    useEffect(() => {
        setPrices(getPrices());
        getMarketItems()
    }, [])

    useEffect( () => {
        if(prices) getMarketItems();
    },[prices])

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

    const onSell = async(itemName, quantity) => {
        console.log(`request to sell ${quantity} ${itemName}`)
        if(itemName in items && itemName in prices.newPrices) {
            if(items[itemName] >= quantity) {
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
                }).then((x)=>x.json())
                if(result.message !== 'SUCCESS') {
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
                <div id="market-other-screens"><CompOtherScreen switchScreen={switchScreen} current={'MarketScreen'} /></div>
                <div id="CompMarket-container"><CompMarket marketItems={marketItems ? marketItems : []} setSelected={setSelected} /></div>
            </div>

            <div className='market-right'>
                <div className='market-profile'><CompProfile type="wide" getBal={getBal} getUser={getUser} getXP={getXP} /></div>
                <div className='market-select-info'><CompMarketSelection onSell={onSell} name={selected.name} newPrice={selected.newPrice} oldPrice={selected.oldPrice} imgURL={selected.imgURL}/></div>
                <div className='market-inventory'><CompInventory items={items} displayOnly={true}/></div>
                <div className='market-other'></div>
            </div>


        </div>
    )
}
export default MarketScreen;