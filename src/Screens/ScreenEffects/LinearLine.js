import React, { useEffect, useState } from 'react';
import './LinearLine.css';

/* 
    This component is a line that moves from one point to another in a straight line.
    The coordinates are (x,y) from (0 vw,0 vh) in the lower left to (100 vw, 100 vh) in the upper right.
    The start and end are offsets from (0,0), as positive axis 
    (ex: 40vw is 40% along the bottom from the left, 70vh is 70% up from the bottom)
*/
function LinearLine({ startX, startY, endX, endY, time, graphic }) {

    const [x, setX] = useState(startX);
    const [y, setY] = useState(startY);
    const [done, setDone] = useState(false);

    useEffect(() => {
        setX(startX);
        setY(startY);

        const timeout = setTimeout(() => {
            setX(endX);
            setY(endY);
        }, 100); // Delay for a smooth transition

        return () => clearTimeout(timeout);
    }, [startX, startY, endX, endY]);

    useEffect(() => {
        let doneTimeout = setTimeout(() => {
            setDone(true)
        }, [time + 100])
        return () => clearTimeout(doneTimeout)
    }, [time])

    return (
        <div
            className='linear-line'
            style={{
                bottom: `${y}vh`,
                left: `${x}vw`,
                transition: `left ${time}ms linear, bottom ${time}ms linear`,
                display: done ? 'none' : 'block'
            }}
        >
            {graphic}
        </div>
    );
}

export default LinearLine;
