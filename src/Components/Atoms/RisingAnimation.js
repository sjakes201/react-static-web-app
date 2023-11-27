import React, { useEffect, useState } from 'react'


function RisingAnimation({ imgSrc, msTime = 1500, refresh }) {

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
        transform: "translateY(0) scale(1.2)",
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
        opacity: 0,
        transform: "translateY(-3vh) scale(1.1)",
    };

    return (
        <img
            style={useAnimationStyle ? animatedStyle : defaultStyle}
            src={go ? imgSrc : `${process.env.PUBLIC_URL}/assets/images/EMPTY.png`}
            alt="collect gif"
        />)

}

export default RisingAnimation