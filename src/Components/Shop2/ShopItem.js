import React, { useState, useEffect } from 'react'
import './ShopItem.css'
import CONSTANTS from '../../CONSTANTS'

function ShopItem({ seedName, buySeeds, lockedInfoComponents, isPinned, changePin }) {

    const produceName = CONSTANTS.InventoryDescriptions[CONSTANTS.SeedCropMap[seedName]?.[0]]?.[0]
    if(seedName === 'special1_seeds') console.log(CONSTANTS.InventoryDescriptions[CONSTANTS.SeedCropMap[seedName]?.[0]]?.[0])
    const itemCost = CONSTANTS.Fixed_Prices[seedName]

    const [itemInfo, setItemInfo] = useState(false);

    /* Shop item buy success and fail gif handlers */
    const [gif, setGif] = useState({ 1: null, 5: null, 30: null });
    const [gifKey, setGifKey] = useState(0);

    useEffect(() => {
        let timeouts = [];
        Object.keys(gif).forEach((key) => {
            if (gif[key] !== null) {
                timeouts.push(
                    setTimeout(() => {
                        setGif((prevGif) => ({ ...prevGif, [key]: null }));
                    }, 447),
                );
            }
        });
        return () => timeouts.forEach(clearTimeout); // Clean up on unmount
    }, [gif, gifKey]);

    /* Component functions */
    const buyItem = async (qty) => {
        let buySuccess = await buySeeds(seedName, qty);
        if(!buySuccess) console.log(`failed to buy ${qty} ${seedName} seeds`)
        let gifCopy = { ...gif };
        gifCopy[qty] = buySuccess ? "success" : "fail";

        setGif(gifCopy);
        setGifKey((prevKey) => prevKey + 1);

    }

    /* Main component */
    return (
        <div className='shop-item basic-center'>
            <div className='shop-item-contents yellow-border-thin'>
                {lockedInfoComponents &&
                    <div className='item-locked-message basic-center black-out'>
                        <div className='locked-text'>
                            {lockedInfoComponents}
                        </div>
                    </div>
                }

                <button
                    className={`seed-pin ${isPinned ? "seed-pinned" : ""}`}
                    onClick={() => changePin(seedName)}
                >
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/GUI/pinned.png`}
                        draggable={false}
                    />
                </button>

                <img
                    className='item-slot-img'
                    src={`${process.env.PUBLIC_URL}/assets/images/seeds/${seedName}.png`}
                />


                <div className='slot-item-info'>
                    <p className='produce_name'>{produceName}</p>
                    <p className='slot-item-price'>${itemCost}<small>/each</small></p>
                    {CONSTANTS.Permits.deluxeCrops.includes(seedName) && <p className='deluxe-label'>DELUXE</p>}
                    {seedName.includes('special') && <p className='special-label'>EVENT</p>}

                </div>


                <div className='item-more-info'>
                    {itemInfo && (
                        <p className="toolTipText">
                            {CONSTANTS.InventoryDescriptions[seedName][1]}
                        </p>
                    )}
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/info.png`}
                        onMouseEnter={() => setItemInfo(true)}
                        onMouseLeave={() => setItemInfo(false)}
                    />
                </div>

                <div className='item-buy-buttons'>
                    <button onClick={() => buyItem(1)}>
                        x1
                        {gif[1] && (
                            <img
                                key={gifKey}
                                src={`${process.env.PUBLIC_URL}/assets/images/${gif[1]}.gif`}
                                className="gif"
                            />
                        )}
                    </button>
                    <button onClick={() => buyItem(5)}>
                        x5
                        {gif[5] && (
                            <img
                                key={gifKey}
                                src={`${process.env.PUBLIC_URL}/assets/images/${gif[5]}.gif`}
                                className="gif"
                            />
                        )}
                    </button>
                    <button onClick={() => buyItem(30)}>
                        x30
                        {gif[30] && (
                            <img
                                key={gifKey}
                                src={`${process.env.PUBLIC_URL}/assets/images/${gif[30]}.gif`}
                                className="gif"
                            />
                        )}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ShopItem