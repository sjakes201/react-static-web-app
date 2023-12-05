import React, { useState, useEffect } from 'react'
import './ShopUpgrade.css'
import CONSTANTS from '../../CONSTANTS'
import UPGRADES from '../../UPGRADES';

function ShopUpgrade({ upgradeName, currentTier, buyUpgrade, maxTier }) {

    const price = UPGRADES.UpgradeCosts[upgradeName]?.[currentTier];
    const maxed = currentTier === maxTier;

    /* Shop item buy success and fail gif handlers */
    const [gif, setGif] = useState(null);
    const [gifKey, setGifKey] = useState(0);
    const [itemInfo, setItemInfo] = useState(false);

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
        let buySuccess = await buyUpgrade(upgradeName, currentTier);

        setGif(buySuccess ? "success" : "fail");
        setGifKey((prevKey) => prevKey + 1);
    }

    return (
        <div className='shop-upgrade basic-center'>
            <div className='shop-upgrade-contents yellow-border-thin'>
                {maxed &&
                    <div className={`item-locked-message basic-center gray-out`}>
                        <div className='locked-text'>
                            {upgradeName?.includes("Permit") ? "BOUGHT" : "MAXED"}
                        </div>
                    </div>
                }

                <img
                    className='shop-upgrade-image'
                    src={`${process.env.PUBLIC_URL}/assets/images/${upgradeName}.png`}
                    alt={`${upgradeName} image`}
                />
                <div className='shop-upgrade-info'>
                    <div className='upgrade-name basic-center'>
                        <p>{UPGRADES.UpgradeDescriptions[upgradeName]?.[0]}</p>
                        <div className='upgrade-more-info'>
                            {itemInfo && (
                                <p className="toolTipText">
                                    {UPGRADES.UpgradeDescriptions[upgradeName]?.[1]}
                                </p>
                            )}
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/images/info.png`}
                                onMouseEnter={() => setItemInfo(true)}
                                onMouseLeave={() => setItemInfo(false)}
                            />
                        </div>
                    </div>
                    <div className={maxed ? 'basic-center' : 'upgrade-info'}>
                        {!maxed && <p>${price?.toLocaleString()}</p>}
                        <p>{upgradeName?.includes("Permit") ? 'PERMIT' : 'UPGRADE'}</p>
                    </div>
                </div>
                <div className='upgrade-buy-button basic-center'>
                    <button onClick={buy}>
                        {upgradeName?.includes("Permit") ? maxed ? 'OWNED' : 'BUY' : maxed ? `TIER ${currentTier}` : `TIER ${currentTier + 1}`}
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

export default ShopUpgrade