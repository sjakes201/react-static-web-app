import './CSS/ShopScreen.css'
import CompShop from '../Components/Shop/CompShop'
import CompProfile from '../Components/GUI/CompProfile'
import CompOtherScreens from '../Components/GUI/CompOtherScreens'

function ShopScreen({ updateAnimals, getAnimals, updateUpgrades, getUpgrades, switchScreen, getXP, getUser, getBal, permits, updateBalance, updateInventory, items }) {


    return (
        <div>
            <div style={{
                height: '14vh',
                backgroundColor: 'rgb(188, 147, 255)',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
            }}>
                <div style={{ width: '70vw' }}>
                    <CompOtherScreens switchScreen={switchScreen} current={'ShopScreen'} />
                </div>
                <div style={{ width: '30vw' }}>
                    <CompProfile type={'short'} getBal={getBal} getUser={getUser} getXP={getXP} />
                </div>


            </div>
            <CompShop getXP={getXP} getAnimals={getAnimals} updateUpgrades={updateUpgrades}
                getUpgrades={getUpgrades} updateInventory={updateInventory} permits={permits}
                updateBalance={updateBalance} getBal={getBal} updateAnimals={updateAnimals} 
                items={items} />
        </div>
    )

}

export default ShopScreen