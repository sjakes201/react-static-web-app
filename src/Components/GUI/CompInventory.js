import React, { useEffect, useState } from 'react';
import '../CSS/CompInventory.css'
import CONSTANTS from '../../CONSTANTS';

function CompInventory({ items, displayOnly, setMarketSelected }) {
    const [selectedItem, setSelectedItem] = useState({
        name: '',
        quantity: 0,
        description: '',
        image: `${process.env.PUBLIC_URL}/assets/images/EMPTY.png`
    });

    useEffect(() => {
        if (items[selectedItem.name] === 0) {
            setSelectedItem({
                name: '',
                quantity: 0,
                description: '',
                image: ''
            })
            sessionStorage.setItem('equipped', '')
        }
    })

    const handleClick = (itemName) => {
        if (items[itemName]) {
            sessionStorage.setItem("equipped", itemName);
            if(setMarketSelected) setMarketSelected(itemName);
            setSelectedItem({
                name: itemName,
                quantity: items[itemName],
                description: CONSTANTS.InventoryDescriptions[itemName],
                image: `${process.env.PUBLIC_URL}/assets/images/${itemName}.png`
            });
        } else {
            sessionStorage.setItem("equipped", '');
            setSelectedItem({
                name: '',
                quantity: 0,
                description: '',
                image: `${process.env.PUBLIC_URL}/assets/images/EMPTY.png`
            });
        }
    }

    const toLoad = () => {
        let invItems = { ...items };
        if (displayOnly) {
            const keys = Object.keys(invItems);
            for (let i = 0; i < keys.length; ++i) {
                if (keys[i].includes("_seeds")) delete invItems[keys[i]];
            }
        }
        const sortedKeys = Object.keys(invItems).sort((a, b) => invItems[b] - invItems[a]);
        const sortedObject = {};

        sortedKeys.forEach(key => {
            sortedObject[key] = invItems[key];
        });

        return Object.keys(sortedObject).flatMap((item, index) => {
            let totalSlots = [];
            let itemCount = sortedObject[item];
            while (itemCount > 1000) {
                totalSlots.push(
                    <div className="item-slot" id={item.concat(itemCount)} key={`${item}+${itemCount}`} onClick={() => handleClick(item)}>
                        {itemCount ? (
                            <>
                                <img src={`${process.env.PUBLIC_URL}/assets/images/${item}.png`} alt={item} />
                                <ins className='count'>1000</ins>
                            </>
                        ) : (
                            <img src={`${process.env.PUBLIC_URL}/assets/images/EMPTY.png`} alt={"No item"} />
                        )}
                    </div>
                )
                itemCount -= 1000;
            }
            totalSlots.push(
                <div className="item-slot" id={item} key={item} onClick={() => handleClick(item)}>
                    {itemCount ? (
                        <>
                            <img src={`${process.env.PUBLIC_URL}/assets/images/${item}.png`} alt={item} />
                            <ins className='count'>{itemCount}</ins>
                        </>
                    ) : (
                        <img src={`${process.env.PUBLIC_URL}/assets/images/EMPTY.png`} alt={"No item"} />
                    )}
                </div>
            )
            return totalSlots;
        });



    }
    if (displayOnly) {
        return (
            <div className='inventory-container'>
                <div className='inventorySlots'>
                    {
                        items && (<div id="display" className="items-grid">{toLoad()}</div>)
                    }
                </div>
            </div>
        )
    }
    if (!displayOnly) {
        return (
            <div className='inventory-container'>
                <div className="inventorySlots">
                    <div className="selected-item-info">
                        <img src={selectedItem.image} alt={selectedItem.name} />
                        <summary>
                            <p>{selectedItem.description[0]}</p>
                            <small>{selectedItem.description[1]}</small>
                        </summary>
                    </div>
                    {
                        items && (<div className="items-grid">{toLoad()}</div>)
                    }
                </div>
            </div>

        );

    }
}

export default CompInventory;
