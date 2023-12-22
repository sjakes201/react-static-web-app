import React from 'react'
import "./LoginStreak.css"
import TownBoostSlot from '../TownShop/TownBoostSlot'

function DaySlot({ dayNum, reward, pendingReward, playerLastClaimed }) {
    // console.log(pendingReward)
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

    const getBoostNameByID = (boostID) => {
        switch (boostID) {
            case 1:
                return 'ALL_CROPS_QTY_1'
            case 2:
                return 'ALL_CROPS_QTY_2'
            case 3:
                return 'ALL_CROPS_QTY_3'
            case 4:
                return 'ALL_ANIMALS_QTY_1'
            case 5:
                return 'ALL_ANIMALS_QTY_2'
            case 6:
                return 'ALL_ANIMALS_QTY_3'
            case 35:
                return 'ALL_CROPS_TIME_1'
            case 36:
                return 'ALL_CROPS_TIME_2'
            case 37:
                return 'ALL_CROPS_TIME_3'
            case 38:
                return 'ALL_ANIMALS_TIME_1'
            case 39:
                return 'ALL_ANIMALS_TIME_2'
            case 40:
                return 'ALL_ANIMALS_TIME_3'

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

    const boostUnlock = (boostArray) => {

        const createBoostComponent = (boost, fontSize) => {
            let boostName = getBoostNameByID(boost)
            return (
                <TownBoostSlot
                    boostName={boostName}
                    active="false"
                    boostContext='player'
                    width="calc(100% - 6px)"
                    height="calc(100% - 10px)"
                    fontSize={fontSize}
                    display={true}
                />
            )
        }

        const oneBoost = () => {
            return <div style={{ position: 'absolute', left: '10%', bottom: '20%', width: '80%', height: '65%' }}>
                {createBoostComponent(boostArray[0], '0.6vw')}
            </div>
        }

        const twoBoosts = () => {
            return <>
                <div style={{ position: 'absolute', left: '5%', bottom: '20%', width: '70%', height: '55%', zIndex: '105' }}>
                    {createBoostComponent(boostArray[0], '0.5vw')}
                </div>
                <div style={{ position: 'absolute', left: '26%', bottom: '30%', width: '70%', height: '55%', zIndex: '115' }}>
                    {createBoostComponent(boostArray[1], '0.5vw')}
                </div>
            </>
        }

        const fourBoosts = () => {
            return <>
                <div style={{ position: 'absolute', left: '1%', bottom: '20%', width: '65%', height: '50%', zIndex: '105' }}>
                    {createBoostComponent(boostArray[0], '0.4vw')}
                </div>
                <div style={{ position: 'absolute', left: '6%', bottom: '35%', width: '65%', height: '50%', zIndex: '115' }}>
                    {createBoostComponent(boostArray[1], '0.4vw')}
                </div>
                <div style={{ position: 'absolute', left: '29%', bottom: '20%', width: '65%', height: '50%', zIndex: '105' }}>
                    {createBoostComponent(boostArray[2], '0.4vw')}
                </div>
                <div style={{ position: 'absolute', left: '34%', bottom: '35%', width: '65%', height: '50%', zIndex: '115' }}>
                    {createBoostComponent(boostArray[3], '0.4vw')}
                </div>
            </>
        }

        return (<div className='boost-reward-container'>
            {boostArray.length === 1 && oneBoost()}
            {boostArray.length === 2 && twoBoosts()}
            {boostArray.length === 4 && fourBoosts()}
        </div>)
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

    return (
        <div className={`login-day-slot ${pendingReward ? 'pending-login-reward light-throbbing clickable' : dayNum > playerLastClaimed ? 'future-login-day' : 'past-login-day'}`}>
            <p className='login-day-num'>Day {dayNum}</p>
            {rewardObj.hasOwnProperty("TimeFertilizer") && fertilizerIcon(rewardObj.TimeFertilizer, rewardObj.YieldsFertilizer, rewardObj.HarvestsFertilizer)}
            {rewardObj.hasOwnProperty("PremiumCurrency") && premiumCurrency(rewardObj.PremiumCurrency)}
            {rewardObj.hasOwnProperty("pfpUnlockID") && pfpUnlock(rewardObj.pfpUnlockID)}
            {rewardObj.hasOwnProperty("Gears") && partsUnlock(rewardObj.Gears, rewardObj.Bolts, rewardObj.MetalSheets)}
            {rewardObj.hasOwnProperty("Boost") && boostUnlock(rewardObj.Boost)}
            {(dayNum === playerLastClaimed + 1) && <div className='login-reward-today basic-center'><p>TODAY</p></div>}
        </div>
    )
}

export default DaySlot