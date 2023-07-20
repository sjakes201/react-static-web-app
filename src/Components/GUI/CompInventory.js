import React, { useEffect, useState } from 'react';
import '../CSS/CompInventory.css'
import CONSTANTS from '../../CONSTANTS';

function CompInventory({ items, displayOnly, updateInventory }) {
    const [selectedItem, setSelectedItem] = useState({
        name: '',
        quantity: 0,
        description: '',
        image: ''
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
            setSelectedItem({
                name: itemName,
                quantity: items[itemName],
                description: CONSTANTS.InventoryDescriptions[itemName],
                image: `/${itemName}.png`
            });
        } else {
            sessionStorage.setItem("equipped", '');
            setSelectedItem({
                name: '',
                quantity: 0,
                description: '',
                image: ''
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
                            <p>Empty</p>
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
                        <p>Empty</p>
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
                        <p>{selectedItem.description}</p>
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
