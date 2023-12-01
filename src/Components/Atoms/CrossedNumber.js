import React from 'react'
import './CrossedNumber.css'


function CrossedNumber({ belowText, aboveText }) {
    return (
        <div className='cross-num-parent'>
            <div className='below-text-size'>
                {belowText}
                <div className='below-text'>{belowText}</div>
            </div>
            <div className='above-text'>{aboveText}</div>
        </div>
    )
}

export default CrossedNumber;