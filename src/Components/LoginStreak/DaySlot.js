import React from 'react'
import "./LoginStreak.css"


function DaySlot({ dayNum, reward, pendingReward }) {

    const rewardObj = JSON.parse(reward)
    // console.log(rewardObj)

    const getPfpNameByID = (pfpID) => {
        switch (pfpID) {
            case 25:
                return 'farmer_hoe'
            case 26:
                return 'cowboy'
            case 27:
                return 'chicken_emperor'
            case 28:
                return 'grateful_farmer'
        }
    }

    const fertilizerIcon = (timeCount, yieldsCount, harvestsCount) => {
        return <div className='fertilizer-icon-container basic-center'>
            <div className='fert-core'>
                <div className='fertilizer-icon fert-icon-t'>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/TimeFertilizer.png`} />
                    <p className={`fert-reward-count ${timeCount >= 100 ? 'big-fert-count' : ''}`}>{timeCount}</p>
                </div>
                <div className='fertilizer-icon fert-icon-y'>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/YieldsFertilizer.png`} />
                    <p className={`fert-reward-count ${yieldsCount >= 100 ? 'big-fert-count' : ''}`}>{yieldsCount}</p>
                </div>
                <div className='fertilizer-icon fert-icon-h'>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/HarvestsFertilizer.png`} />
                    <p className={`fert-reward-count ${harvestsCount >= 100 ? 'big-fert-count' : ''}`}>{harvestsCount}</p>
                </div>
            </div>

        </div>
    }

    const premiumCurrency = (count) => {
        return <div className='premium-currency-container basic-center'>
            <img className='prem-reward-icon' src={`${process.env.PUBLIC_URL}/assets/images/PremiumCurrency.png`} />
            <p className={`premium-currency-count`}>{count}</p>

        </div>
    }

    const pfpUnlock = (pfpID) => {
        const pfpName = getPfpNameByID(pfpID)
        return <div className='pfp-reward-container basic-center'>
            <img className='unlocked-pfp' src={`${process.env.PUBLIC_URL}/assets/images/profilePics/${pfpName}.png`} />
        </div>
    }

    const partsUnlock = (gearsCount, boltsCount, metalSheetsCount) => {
        return <div className='fertilizer-icon-container basic-center'>
            <div className='fert-core'>
                <div className='fertilizer-icon fert-icon-t'>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/Gears.png`} />
                    <p className={`fert-reward-count ${gearsCount >= 100 ? 'big-fert-count' : ''}`}>{gearsCount}</p>
                </div>
                <div className='fertilizer-icon fert-icon-y'>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/Bolts.png`} />
                    <p className={`fert-reward-count ${boltsCount >= 100 ? 'big-fert-count' : ''}`}>{boltsCount}</p>
                </div>
                <div className='fertilizer-icon fert-icon-h'>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/MetalSheets.png`} />
                    <p className={`fert-reward-count ${metalSheetsCount >= 100 ? 'big-fert-count' : ''}`}>{metalSheetsCount}</p>
                </div>
            </div>

        </div>
    }

    return (<div className='login-day-slot'>
        <p className='login-day-num'>Day {dayNum}</p>
        {rewardObj.hasOwnProperty("TimeFertilizer") && fertilizerIcon(rewardObj.TimeFertilizer, rewardObj.YieldsFertilizer, rewardObj.HarvestsFertilizer)}
        {rewardObj.hasOwnProperty("PremiumCurrency") && premiumCurrency(rewardObj.PremiumCurrency)}
        {rewardObj.hasOwnProperty("pfpUnlockID") && pfpUnlock(rewardObj.pfpUnlockID)}
        {rewardObj.hasOwnProperty("Gears") && partsUnlock(rewardObj.Gears, rewardObj.Bolts, rewardObj.MetalSheets)}
    </div>)
}

export default DaySlot