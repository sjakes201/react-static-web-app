import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CSS/NotFound.css"

const NotFound = () => {

    const navigate = useNavigate();
    const [redirectTimer, setRedirectTimer] = useState(5)

    useEffect(() => {
        let intervalID = setInterval(() => {
            setRedirectTimer((prev) => {
                console.log(prev);
                if (prev <= 1) {
                    console.log('nav', prev);
                    navigate('/plants');
                    clearInterval(intervalID);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    
        return () => clearInterval(intervalID);
    }, [navigate]);

    return (
        <div className='basic-center not-found-page'>
            <img
                src={`${process.env.PUBLIC_URL}/assets/images/kiwi_standing_right.png`}
                alt={"404 not found kiwi"}
                className='not-found-kiwi'
                draggable={false}
            />
            <div className='not-found-info'>
                <h2>404 not found :{"("}</h2>
                <h3>Redirecting in {redirectTimer}{redirectTimer < 0 ? "?" : ""} seconds...</h3>
            </div>
        </div>
    );
};

export default NotFound;
