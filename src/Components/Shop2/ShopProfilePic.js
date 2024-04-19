import st from './ShopProfilePic.module.css';
import CONSTANTS from '../../CONSTANTS';

function ShopProfilePic({ pfpName, buyPfp, owned }) {


    return (
        <div
            className={`${st.shopTile} basic-center`}
        >
            <div className={`${st.contents} yellow-border-thin`}>
                {owned && <div className={`black-out item-locked-message basic-center`}>
                    <div className='locked-text'>
                        OWNED
                    </div>
                </div>}
                <img
                    className={st.pfpImg}
                    src={`${process.env.PUBLIC_URL}/assets/images/profilePics/${pfpName}.png`}
                />
                <p>{CONSTANTS.pfpInfo[pfpName]?.name}</p>
                <button className={st.buyButton} onClick={() => buyPfp(pfpName)}>
                    {CONSTANTS.pfpInfo[pfpName]?.cost}
                    <img src={`${process.env.PUBLIC_URL}/assets/images/premiumCurrency.png`} />
                </button>
            </div>
        </div>
    )
}

export default ShopProfilePic;