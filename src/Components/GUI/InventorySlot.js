import React from 'react'
import ANIMALINFO from '../../ANIMALINFO'
import CONSTANTS from '../../CONSTANTS'
import "../CSS/CompInventory.css";

function InventorySlot({
    handleClick,
    item,
    itemCount,
    isAnimalScreen,
    passedID,
    tooltipHandleMouseEnter,
    tooltipHandleMouseLeave,
    activeTooltip,
    setMouseCoords,
    setContextMenuItem
}) {

    const handleContextMenu = (event) => {
        event.preventDefault();
        if (itemCount > 0) {
            const coords = { x: event.pageX, y: event.pageY };
            setMouseCoords(coords); // Pass coordinates up to the parent
            setContextMenuItem(item)
        }
    };

    return (<button
        className={
            isAnimalScreen
                ? item in ANIMALINFO.FoodHappinessYields && itemCount !== 0
                    ? "item-slot is-feed"
                    : "item-slot"
                : "item-slot"
        }
        id={passedID}
        onClick={() => handleClick(item)}
        style={{ backgroundColor: 'transparent' }}
        onMouseEnter={() => tooltipHandleMouseEnter(passedID)}
        onMouseLeave={() => tooltipHandleMouseLeave()}
        onContextMenu={handleContextMenu}
    >
        {((activeTooltip === passedID) && itemCount > 0) && <div className='toolTipText'>
            {CONSTANTS.InventoryDescriptions[item]?.[0]}
        </div>}
        {itemCount ? (
            <>
                <img
                    draggable={false}
                    src={`${process.env.PUBLIC_URL}/assets/images/${item}.png`}
                    alt={item}
                />
                <ins className="count">{itemCount?.toLocaleString()}</ins>
            </>
        ) : (
            <img
                src={`${process.env.PUBLIC_URL}/assets/images/EMPTY.png`}
                alt={"No item"}
            />
        )}
    </button>)
}

export default InventorySlot