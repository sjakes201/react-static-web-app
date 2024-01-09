import react, { useState } from 'react';
import CONSTANTS from '../../CONSTANTS';
import './FavoriteGood.css'

function FavoriteGood({ profileData, type }) {

    const calcFavorite = () => {
        let allGoods = Object.keys(profileData).filter((good) =>
            (good in CONSTANTS.Init_Market_Prices) &&
            (type === "crop" ? !good.includes("_") : good.includes("_")));

        let totalXP = -1;
        let currentCrop = allGoods[0];
        for (let i = 0; i < allGoods.length; i++) {
            let good = allGoods[i];
            let qty = profileData[good]
            let contributedXP = CONSTANTS.XP[good] * qty;
            if (contributedXP > totalXP) {
                totalXP = contributedXP;
                currentCrop = good;
            }
        }
        return currentCrop;
    }

    const favGood = calcFavorite();

    return (
        <div className='favorite-good-container'>

            <p
                className='favorite-good-name basic-center'
            >
                Favorite {type === "crop" ? "crop" : "produce"}:
            </p>
            <div className='favorite-info'>
                <img
                    className='favorite-good-img'
                    alt={favGood}
                    src={`${process.env.PUBLIC_URL}/assets/images/${favGood}.png`}
                />
                <div className='fav-good-right-column'>
                    <p>{CONSTANTS.InventoryDescriptionsPlural[favGood]?.[0]}</p>
                    <p>Qty: {profileData[favGood]?.toLocaleString()}</p>
                    {/* <p>Total XP: {(profileData[favGood] * CONSTANTS.XP[favGood])?.toLocaleString()}</p> */}
                </div>
            </div>
        </div>)
}

export default FavoriteGood