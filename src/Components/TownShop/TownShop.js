import React, { useContext } from 'react'
import TownPerkRow from './TownPerkRow'
import TownHeader from './TownHeader'
import { useWebSocket } from '../../WebSocketContext'
import { GameContext } from '../../GameContainer'
import TOWNSINFO from '../../TOWNSINFO'
import './TownShop.css'

function TownShop({ townShopInfo, setTownShopInfo, menuBack }) {
    const { waitForServerResponse } = useWebSocket();
    const { setTownPerks } = useContext(GameContext)

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
                <div className='townFunds basic-center brown-border-small'>Town Funds: ${townShopInfo.townFunds?.toLocaleString()}</div>
                <TownPerkRow perkName="cropTimeLevel" currentLevel={townShopInfo.cropTimeLevel} buyPerk={buyPerk} />
                <TownPerkRow perkName="animalTimeLevel" currentLevel={townShopInfo.animalTimeLevel} buyPerk={buyPerk} />
                <TownPerkRow perkName="partsChanceLevel" currentLevel={townShopInfo.partsChanceLevel} buyPerk={buyPerk} />
                <TownPerkRow perkName="orderRefreshLevel" currentLevel={townShopInfo.orderRefreshLevel} buyPerk={buyPerk} />
                <TownPerkRow perkName="happinessMultiplierLevel" currentLevel={townShopInfo.happinessMultiplierLevel} buyPerk={buyPerk} />
            </div>
        </div>
    )
}

export default TownShop