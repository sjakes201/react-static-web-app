import React, { useEffect, useState } from 'react'

function RisingAnimation(
    { imgSrc = `${process.env.PUBLIC_URL}/assets/images/EMPTY.png`,
        msTime = 1500,
        refresh,
        slideUp = true,
        fadeOut = true,
        startingScale = 1.1,
        endingScale = 1.2,
    }) {

    const [go, setGo] = useState(false)
    const [previous, setPrevious] = useState(null)

    const [useAnimationStyle, setUseAnimationStyle] = useState(false)

    useEffect(() => {
        if (previous === null) {
            setPrevious(refresh)
        } else if (previous !== refresh) {
            setPrevious(refresh)
            setGo(true)
        }
    }, [refresh])

    useEffect(() => {
        if (go) {
            setUseAnimationStyle(true)
            setTimeout(() => {
                setGo(false)
                setUseAnimationStyle(false)
            }, msTime)
        }
    }, [go])

    const defaultStyle = {
        transition: `all 1.5s ease-out`,
        opacity: 1,
        transform: `translateY(0) scale(${endingScale})`,
        position: "absolute",
        top: "0",
        zIndex: "10",
        width: "50%",
        pointerEvents: "none",
        right: "25%",
        border: "none"
    };

    
    const animatedStyle = {
        ...defaultStyle,
        opacity: `${fadeOut ? 0 : 1}`,
        transform: `${slideUp ? 'translateY(-3vh)' : 'translateY(0)'} scale(${startingScale})`,
    };

    return (
        <img
            style={useAnimationStyle ? animatedStyle : defaultStyle}
            src={go ? imgSrc : `${process.env.PUBLIC_URL}/assets/images/EMPTY.png`}
            alt="collect gif"
        />)

}

export default RisingAnimation