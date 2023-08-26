import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './reset.css'
import GameContainer from './GameContainer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <div id='root' style={{ height: '100vh', width: '100vw' }}>
            <GameContainer />
            {/* <div style={{ background: 'var(--menu_light)', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Temporary down time for a<a target='_blank' href="/updateNotes.html" style={{marginLeft:'4px'}}> big update</a>!
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/chicken_collectible_walking_right.gif`}
                    alt={'loading chicken'}
                    style={{
                        width: '5vw'
                    }}
                    draggable={false} />

            </div> */}
        </div>
    </Router>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
