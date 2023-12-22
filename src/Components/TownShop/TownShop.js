import React, { useContext, useState } from 'react'
import TownPerkRow from './TownPerkRow'
import TownHeader from './TownHeader'
import { useWebSocket } from '../../WebSocketContext'
import { GameContext } from '../../GameContainer'
import TOWNSINFO from '../../TOWNSINFO'
import TownItemsShop from './TownItemsShop'
import './TownShop.css'

function TownShop({ townShopInfo, setTownShopInfo, menuBack, myRoleID, townInfo, setTownInfo, setRefreshData }) {
    const { waitForServerResponse } = useWebSocket();
    const { setTownPerks } = useContext(GameContext)

    const [shopScreen, setShopScreen] = useState("PERKS")

    const buyPerk = async (perkName) => {
        if (waitForServerResponse) {
            let res = await waitForServerResponse("buyTownPerk", { targetPerk: perkName })
            if (res?.body?.success) {
                setTownShopInfo((old) => {
                    let newInfo = { ...old };
                    newInfo.townFunds -= TOWNSINFO.perkCosts[perkName][newInfo[perkName]];
                    newInfo[perkName] += 1;
                    return newInfo;
                })
                setTownPerks((old) => {
                    let newPerks = { ...old };
                    newPerks[perkName] += 1;
                    return newPerks;
                })
            }
        }
    }

    const getPerkRows = () => {
        return (
            <>
                <TownPerkRow perkName="cropTimeLevel" currentLevel={townShopInfo.cropTimeLevel} buyPerk={buyPerk} myRoleID={myRoleID} />
                <TownPerkRow perkName="animalTimeLevel" currentLevel={townShopInfo.animalTimeLevel} buyPerk={buyPerk} myRoleID={myRoleID} />
                <TownPerkRow perkName="partsChanceLevel" currentLevel={townShopInfo.partsChanceLevel} buyPerk={buyPerk} myRoleID={myRoleID} />
                <TownPerkRow perkName="orderRefreshLevel" currentLevel={townShopInfo.orderRefreshLevel} buyPerk={buyPerk} myRoleID={myRoleID} />
                <TownPerkRow perkName="happinessMultiplierLevel" currentLevel={townShopInfo.happinessMultiplierLevel} buyPerk={buyPerk} myRoleID={myRoleID} />
            </>
        )
    }

    const getItemShop = () => {
        return (
            <TownItemsShop myRoleID={myRoleID} townShopInfo={townShopInfo} setTownShopInfo={setTownShopInfo} townInfo={townInfo} setTownInfo={setTownInfo} setRefreshData={setRefreshData} />
        )
    }

    return (
        <div className='townShopParent'>
            <div
                className='town-shop-back-arrow clickable'>
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_dark.png`}
                    onClick={menuBack}
                />
            </div>
            <div className='townHeaderContainer'>
                <TownHeader />
            </div>
            <div className='townPerkRows woodBackground brown-border-small'>
                <div className='town-shop-top-bar'>
                    <p className='townFunds basic-center brown-border-small'>Town Funds: ${townShopInfo.townFunds?.toLocaleString()}</p>
                    <button className={`${shopScreen === 'PERKS' ? 'active-shop-tab' : ''} `} onClick={() => setShopScreen("PERKS")}>Perks</button>
                    <button className={`${shopScreen === 'ITEMS' ? 'active-shop-tab' : ''} `} onClick={() => setShopScreen("ITEMS")}>Boosts</button>
                </div>
                {shopScreen === "ITEMS" && getItemShop()}
                {shopScreen === "PERKS" && getPerkRows()}
            </div>
        </div>
    )
}

export default TownShop