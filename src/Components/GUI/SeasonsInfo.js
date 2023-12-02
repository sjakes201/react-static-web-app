import React, { useContext } from 'react'
import { GameContext } from '../../GameContainer'
import './SeasonsInfo.css'

function SeasonsInfo() {
    const { getCurrentSeason, setSeasonsInfoBox } = useContext(GameContext)
    return (
        <div
            className='basic-center seasons-info'

            onClick={(event) => {
                event.preventDefault();
                if (event.target === event.currentTarget) {
                    setSeasonsInfoBox(false)
                }
            }}
        >
            <div
                className='yellow-border relative seasons-container'
            >
                <span
                    className='closing-x'
                    onClick={() => setSeasonsInfoBox(false)}
                >X</span>
                <p className='seasons-explanation'>
                    <u>Seasons</u>
                    <p style={{ fontSize: '0.89vw', maxWidth: '50vw' }}>
                        Crops that are in-season grow <span className='boost-percent'>15% faster</span>, while 
                        animals in-season produce <span className='boost-percent'>10% faster</span> and have a <span className='boost-percent'>10% higher</span> chance of 
                        producing extra produce. Being out of season does not cause any debuffs.
                        Winter does not provide any bonuses, and instead gives a higher machines parts chance for all crop harvests. 
                        Each season lasts one real-life day, and changes at midnight UTC.
                        </p>
                </p>
                <div className='seasons-list'>
                    <div className='season-row'>
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/images/springIcon.png`}
                            className={getCurrentSeason() === 'spring' ? 'yellow-border-thin-marginless' : ''}

                        />
                        <div>
                            <u style={{color: 'green'}}>Spring</u>
                            <p><span className='crops-label'>Crops:</span> parsnips, melons, carrots, bamboo, hops</p>
                            <p><span className='animals-label'>Animals:</span> all coop animals</p>
                        </div>

                    </div>
                    <div className='season-row'>
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/images/summerIcon.png`}
                            className={getCurrentSeason() === 'summer' ? 'yellow-border-thin-marginless' : ''}
                        />
                        <div>
                            <u style={{color: 'orange'}}>Summer</u>
                            <p><span className='crops-label'>Crops:</span> blueberries, strawberries, potatoes, oats, cauliflower</p>
                        </div>
                    </div>
                    <div className='season-row'>
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/images/fallIcon.png`}
                            className={getCurrentSeason() === 'fall' ? 'yellow-border-thin-marginless' : ''}

                        />
                        <div>
                            <u style={{color: 'maroon'}}>Fall</u>
                            <p><span className='crops-label'>Crops:</span> yam, grape, beet, pumpkin, corn</p>
                            <p><span className='animals-label'>Animals:</span> all barn animals</p>
                        </div>
                    </div>
                    <div className='season-row'>
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/images/winterIcon.png`}
                            className={getCurrentSeason() === 'winter' ? 'yellow-border-thin-marginless' : ''}

                        />
                        <div>
                            <u style={{color: 'gray'}}>Winter</u>
                            <p>Higher machine parts chance</p>
                            <p><i id='no-crop-bonuses'>No crop or animal bonuses</i></p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SeasonsInfo