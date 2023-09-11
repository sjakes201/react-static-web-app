import './TownGoals.css'
import CONSTANTS from '../../CONSTANTS'

// Good is string for good name, numNeeded and numHave are int for goal quantities, leaderChooses is boolean for whether this is one the four chosen by town leader
function GoalCard({ good, numNeeded, numHave, leaderChooses }) {
    numHave = 50;

    let percentCompletion = numHave >= numNeeded ? 100 : Math.floor((numHave/numNeeded) * 100);

    return (
        <div className='goalCardContainer'>
            <img className='goalCardIcon' src={`${process.env.PUBLIC_URL}/assets/images/${good}.png`} />
            <div className='goalCardInfo'>
                <div className='infoTopHalf'>
                    <p>{CONSTANTS.InventoryDescriptionsPlural[good][0]}</p>
                    <p>{numHave}/{numNeeded}</p>
                </div>
                <div className='cardProgressBarShell'>
                    <div 
                    style={{ 
                        backgroundColor: 'lightblue',
                        position: 'absolute',
                        left: `-${100 - percentCompletion}%`,
                        width: '100%',
                        height: '100%'
                     }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default GoalCard;