import React, { useEffect, useState, useMemo } from 'react'


function CompAnimal({ type, onCollect, sizeWidth, sizeHeight, walkingInfo, collectible, Animal_ID }) {

    const handleClick = () => {
        onCollect(Animal_ID, type);
    }


    const imgURL = () => {
        if (collectible) {
            if (walkingInfo.walking) {
                // left animation is just right animation but mirrored
                return `${process.env.PUBLIC_URL}/assets/images/${type}_collectible_walking_${walkingInfo.direction === 'left' ? 'right' : walkingInfo.direction}.gif`
            }
            return `${process.env.PUBLIC_URL}/assets/images/${type}_collectible_standing_${walkingInfo.direction === 'left' ? 'right' : walkingInfo.direction}.png`
        } else {
            if (walkingInfo.walking) {
                return `${process.env.PUBLIC_URL}/assets/images/${type}_walking_${walkingInfo.direction === 'left' ? 'right' : walkingInfo.direction}.gif`
            }
            return `${process.env.PUBLIC_URL}/assets/images/${type}_standing_${walkingInfo.direction === 'left' ? 'right' : walkingInfo.direction}.png`
        }
    };


    const left = (walkingInfo?.coordinates[0] ? walkingInfo.coordinates[0] : 0);
    const top = (walkingInfo?.coordinates[1] ? walkingInfo.coordinates[1] : 0);

    return (
        <div style={{
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 3s',
            transitionTimingFunction: 'linear',
            // border: '1px solid red',
            width: `${sizeWidth}`,
            height: `${sizeHeight}`,
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            userSelect: "none",
        }} onMouseDown={handleClick}
            draggable={false}
        >
            <img
                src={imgURL()}
                alt={type}
                style={{
                    height: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    // border: '1px dotted purple',
                    transform: walkingInfo.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    userSelect: "none",
                    cursor: collectible ? 'grab' : 'default'
                }}
                draggable={false} />
        </div>
    )
}

export default CompAnimal;