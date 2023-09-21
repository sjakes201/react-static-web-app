import CONSTANTS from '../../CONSTANTS';
import '../CSS/NotificationBox.css'

function NotificationBox({ close, contents }) {

    const unlocks = (unlocksArray) => {
        return (
            <div className='unlocksNotification'>
                <img id='shower1' className='xpShower' src={`${process.env.PUBLIC_URL}/assets/images/xpShower.gif`}/>
                <img id='shower2' className='xpShower' src={`${process.env.PUBLIC_URL}/assets/images/xpShower.gif`}/>
                <img id='shower3' className='xpShower' src={`${process.env.PUBLIC_URL}/assets/images/xpShower.gif`}/>
                <img id='shower4' className='xpShower' src={`${process.env.PUBLIC_URL}/assets/images/xpShower.gif`}/>
                <p className='unlockTitle'>
                    New unlocks!
                </p>
                <div className='unlocksRow'>
                    {unlocksArray.map((unlock) => {
                        let imgLink;
                        if (unlock in CONSTANTS.AnimalTypes) {
                            imgLink = `${unlock}_standing_right.png`
                        } else {
                            imgLink = `${unlock}.png`
                        }

                        return (
                            <div className='unlockedItemCard'>
                                <img draggable={false} className='unlockImage' src={`${process.env.PUBLIC_URL}/assets/images/${imgLink}`} />
                                <p className='unlockName'>{CONSTANTS.InventoryDescriptionsPlural[unlock][0]}</p>
                            </div>
                        )


                    })}
                </div>

            </div>
        )
    }

    return (
        <div className='notificationBox'>
            <span className='closeNotification' onClick={close}>X</span>
            {unlocks(contents)}
        </div>
    )

}

export default NotificationBox