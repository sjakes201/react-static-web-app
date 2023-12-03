import React, { useState, useEffect, useRef } from 'react'
import './AnimationParent.css'
import LinearLine from './LinearLine'


const randomInt = (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function AnimationParent({ currentSeason }) {

    /* 
        All animation graphics for easy access
    */
    const leaf_1 = <img
        src={`${process.env.PUBLIC_URL}/assets/animations/leaf_1_${currentSeason}.gif`}
        style={{ width: '1.2vw' }}
    />
    const leaf_2 = <img
        src={`${process.env.PUBLIC_URL}/assets/animations/leaf_2_${currentSeason}.gif`}
        style={{ width: '1vw' }}
    />
    const leaf_3 = <img
        src={`${process.env.PUBLIC_URL}/assets/animations/leaf_3_${currentSeason}.gif`}
        style={{ width: '1vw' }}
    />

    /* 
        All animation bundles
    */
    const allLeaves = [leaf_1, leaf_2, leaf_3]
    const randomLeaf = () => allLeaves[Math.floor(Math.random() * allLeaves.length)]

    /* 
        Currently running animations and animation generation
    */
    const [animations, setAnimations] = useState([])

    const currentKey = useRef(1)
    const animationKey = () => currentKey.current++

    const startAnimation = (animation) => {
        setAnimations((old) => [...old, animation])
        setTimeout(() => {
            setAnimations((old) => old.filter((a) => a !== animation))
        }, [animation.props.time + 100])
    }

    const startMultipleAnimations = (animations) => {
        setAnimations((old) => [...old, ...animations])
        let longestTime = animations.reduce((acc, curr) => Math.max(acc, curr.props.time), 0);
        setTimeout(() => {
            setAnimations((old) => old.filter((a) => !animations.includes(a)))
        }, [longestTime + 100])
    }

    /* 
        Individual animation creation functions
    */
    const spawnRandomLeaf = () => {
        let start = randomInt(-15, 95);
        let end = start + randomInt(20, 30);
        let newLeaf = <LinearLine startX={start} startY={100} endX={end} endY={-10} time={10000} graphic={leaf_1} key={currentKey.current++} />
        startAnimation(newLeaf)
    }

    const spawnLeafBundle = (count = 2 + Math.floor(Math.random() * 3)) => {
        let newLeaves = []
        let start = randomInt(10, 80);
        let xChange = randomInt(5, 30);
        for (let i = 0; i < count; ++i) {
            let newLeaf = <LinearLine startX={start + randomInt(0, 7)} endX={start + xChange + randomInt(0, 5)} startY={100 + randomInt(0, 10)} endY={-10} time={10000 + randomInt(0, 200)} graphic={randomLeaf()} key={animationKey()} />
            newLeaves.push(newLeaf)
        }
        newLeaves.forEach((leaf) => startAnimation(leaf))
    }

    const spawnLeafStorm = () => {
        const createLeafRow = () => {
            let newLeaves = []
            let distance = randomInt(5, 8);
            let totalLeaves = Math.floor(130 / distance);
            for(let i = -2; i < totalLeaves; ++i) {
                let newLeaf = <LinearLine startX={i * distance} startY={100 + randomInt(0,10)} endX={i * distance + randomInt(10,15)} endY={-10} time={10000 + randomInt(0, 500)} graphic={randomLeaf()} key={animationKey()} />
                newLeaves.push(newLeaf)
            }
            startMultipleAnimations(newLeaves)
        }
        let rows = 20;
        let interval = setInterval(() => {
            if(rows <= 0) {
                clearInterval(interval)
            } else {
                createLeafRow()
                rows--
            }
        },  1000)
    }

    /* 
        Events to create animations
    */
    useEffect(() => {
        let randomLeafTimeout;
        const randomLeafTimer = () => {
            let nextTime = randomInt(8, 12) * 1000;
            randomLeafTimeout = setTimeout(() => {
                spawnRandomLeaf()
                randomLeafTimer()
            }, [nextTime])
        }
        randomLeafTimer()

        const randomLeafBundles = setInterval(() => {
            spawnLeafBundle()
        }, 30000)
        // spawnLeafStorm()
        return () => {
            clearTimeout(randomLeafTimeout)
            clearInterval(randomLeafBundles)
        }
    }, [])

    return (
        <div className='animation-parent'>
            {animations?.map((animation) => animation)}
        </div>
    )
}

export default AnimationParent