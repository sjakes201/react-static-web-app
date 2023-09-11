import './TownGoals.css'
import GoalCard from './GoalCard';

function TownGoals({ goals,townName }) {
    townName='BestTownEver'
    goals = [
        { good: 'corn', numNeeded: '200', numHave: 0 },
        { good: 'carrot', numNeeded: '100', numHave: 0 },
        { good: 'sheep_wool', numNeeded: '25', numHave: 0 },
        { good: 'cow_milk', numNeeded: '50', numHave: 0 },
        { good: 'ostrich_egg', numNeeded: '5', numHave: 0 },
        { good: 'hops', numNeeded: '500', numHave: 0 },
        { good: 'melon', numNeeded: '20', numHave: 0 },
        { good: 'oats', numNeeded: '500', numHave: 0 }
    ];

    return (
        <div className='townGoalsContainer'>
            <div className='goalsTopBar'>
                <img id='goalsBackArrow' src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_dark.png`} />
                <p className='goalsTownName'>{townName} town goals</p>
            </div>
            <div className='goalsListContainer'>
                {goals.map((goal, index) => {
                    return <GoalCard key={index} good={goal.good} numNeeded={goal.numNeeded} numHave={goal.numHave}/>
                })}
            </div>
        </div>
    )
}

export default TownGoals;