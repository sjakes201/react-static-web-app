import React from 'react'
import './ShopTab.css'

function ShopTab({ title, setCurrentTab, currentTab, position }) {

    /* 
        When the tab is selected, the edges cover the main shop interface border, creating
        overlapping lines. This when called returns multiple small components that surgically
        fix this. 
        Update: inconsistent for different screen resolutions :(
    */
    const fixBorder = () => {
        if (position !== 'leftmost') {
            return (
                <>
                    {/* border-shadow-orange color on left top */}
                    <div className='border-fix-1 border-fix-left'></div>
                    {/* border-shadow-orange color on right top */}
                    <div className='border-fix-2 border-fix-right'></div>
                    {/* border-orange color on left bottom */}
                    <div className='border-fix-1 border-fix-right'></div>
                    {/* border-orange color on right bottom */}
                    <div className='border-fix-2 border-fix-left'></div>
                </>
            )
        } else {
            return (
                <>
                    <div className='border-fix-3'></div>
                    <div className='border-fix-4'></div>
                    <div className='border-fix-1 border-fix-right'></div>
                    <div className='border-fix-2 border-fix-right'></div>
                </>
            )
        }

    }

    return (
        <button
            className={`
                shop-tab
                basic-center
                ${currentTab === title ? 'selected orange-border' : 'not-selected orange-border-thin'}
                ${currentTab !== title && position ? `${position}-tab` : ''}    
            `}
            onClick={() => setCurrentTab(title)}
        >
            {/* {currentTab === title && fixBorder()} */}
            {title?.toUpperCase()}
        </button>
    )
}

export default ShopTab