import React, { useState, useEffect } from 'react'
import './ShopAnimal.css'
import CONSTANTS from '../../CONSTANTS'

function ShopAnimal({ animalType, buyAnimal, lockedInfoComponents, maxCapacity }) {

    const location = CONSTANTS.AnimalTypes[animalType]?.[0];
    const price = CONSTANTS.AnimalTypes[animalType]?.[1];

    /* Shop item buy success and fail gif handlers */
    const [gif, setGif] = useState(null);
    const [gifKey, setGifKey] = useState(0);

    useEffect(() => {
        let resetGiftTimer = null;
        if (gif !== null) {
            resetGiftTimer = setTimeout(() => {
                setGif(null);
            }, 447)
        }
        return () => clearTimeout(resetGiftTimer); // Clean up on unmount
    }, [gif, gifKey]);

    /* Component functions */
    const buy = async () => {
        let buySuccess = await buyAnimal(animalType);

        setGif(buySuccess ? "success" : "fail");
        setGifKey((prevKey) => prevKey + 1);
    }

    return (
        <div className='shop-animal basic-center'>
            <div className='shop-animal-contents yellow-border-thin'>
                {lockedInfoComponents &&
                    <div className={`item-locked-message basic-center black-out`}>
                        <div className='locked-text'>
                            {lockedInfoComponents}
                        </div>
                    </div>
                }
                {(!lockedInfoComponents && maxCapacity) &&
                    <div className={`item-locked-message basic-center gray-out`}>
                        <div className='locked-text'>
                            {maxCapacity}
                        </div>
                    </div>
                }

                <img
                    className='shop-animal-image'
                    src={`${process.env.PUBLIC_URL}/assets/images/${animalType}_standing_right.png`}
                    alt={`${animalType} image`}
                />
                <div className='shop-animal-info'>
                    <div>
                        <p>{CONSTANTS.InventoryDescriptions[animalType][0]}</p>
                        <p>${price?.toLocaleString()}</p>
                    </div>
                    <div className='animal-info-stack'>
                        <p className={`${location}-label`}>{location?.toUpperCase()}</p>
                        {CONSTANTS.Permits.exoticAnimals.includes(animalType) && <p className='exotic-label'>EXOTIC</p>}

                    </div>
                </div>
                <div className='animal-buy-button basic-center'>
                    <button onClick={buy}>
                        BUY
                        {gif && (
                            <img
                                key={gifKey}
                                src={`${process.env.PUBLIC_URL}/assets/images/${gif}.gif`}
                                className="gif"
                            />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ShopAnimal