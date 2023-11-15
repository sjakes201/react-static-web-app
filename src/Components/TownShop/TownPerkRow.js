import React, { useState } from 'react'
import './TownPerkRow.css'
import TOWNSINFO from '../../TOWNSINFO'

function TownPerkRow({ perkName, currentLevel, buyPerk, myRoleID }) {

    const [iconTip, setIconTip] = useState(false);
    const [tipTimer, setTipTimer] = useState(null);
    const [buyBuffer, setBuyBuffer] = useState(false)

    const [cellTip, setCellTip] = useState(null);

    const callBuy = async (level) => {
        if(myRoleID < 3) return
        if ((level === currentLevel + 1) && !buyBuffer) {
            setBuyBuffer(true)
            await buyPerk(perkName);
            setTimeout(() => {
                setBuyBuffer(false)
            }, 100)
        }
    }

    const levelCell = (level) => {
        const getCellStyle = () => {
            if (level <= currentLevel) return "boughtCell"
            if (level === currentLevel + 1) return `nextCell ${myRoleID >= 3 ? 'clickable' : ''}`
            return "unavailableCell"
        }

        return (
            <div
                className={`rowCell ${getCellStyle()} basicCenter`}
                onClick={() => callBuy(level)}
                onMouseEnter={() => setCellTip(level)}
                onMouseLeave={() => setCellTip(null)}
            >
                {cellTip === level &&
                    <div className='levelInfoTip light-border-small'>
                        Level {level}: {getBoostPercent(level)}%
                    </div>
                }
                {level === currentLevel + 1 &&
                    <div className="nextHighlight">
                    </div>
                }
                {level === currentLevel + 1 &&
                    <p>${TOWNSINFO.perkCosts[perkName][level - 1]?.toLocaleString()}</p>
                }
            </div >
        )
    }

    const getBoostPercent = (level) => {
        if (level === 0 || level > 15) return 0
        return (TOWNSINFO.perkBoosts[perkName][level - 1] * 100).toLocaleString()
    }

    return (
        <div className='rowContainer'>
            {iconTip && <p className='toolTipText'>{TOWNSINFO.perkNames[perkName]}</p>}
            <img
                className='perkIcon light-border-small basic-center'
                src={`${process.env.PUBLIC_URL}/assets/images/GUI/${perkName}.png`}
                onMouseEnter={() => {
                    setTipTimer(setTimeout(() => setIconTip(true), 600))
                }}
                onMouseLeave={() => { clearTimeout(tipTimer); setIconTip(false) }}

            />
            <div className={`levelContainer ${currentLevel === 15 ? 'thick-gold-border' : 'thick-white-border'}`}>
                {levelCell(1)}
                {levelCell(2)}
                {levelCell(3)}
                {levelCell(4)}
                {levelCell(5)}
                {levelCell(6)}
                {levelCell(7)}
                {levelCell(8)}
                {levelCell(9)}
                {levelCell(10)}
                {levelCell(11)}
                {levelCell(12)}
                {levelCell(13)}
                {levelCell(14)}
                {levelCell(15)}
            </div>
            <p className={`perkLevelInfo ${currentLevel === 15 ? 'gold-border-small' : 'light-border-small'}`}>
                <p>Bonus: <span className='perkBonusPercent'>{getBoostPercent(currentLevel)}%</span></p>
                {getBoostPercent(currentLevel + 1) !== 0 && <p>Next: <span className='perkBonusPercent'>{getBoostPercent(currentLevel + 1)}%</span></p>}

            </p>
        </div>

    )
}

export default TownPerkRow