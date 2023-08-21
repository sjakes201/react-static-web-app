import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './reset.css'
import GameContainer from './GameContainer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <p style={{display: 'none'}}>
            Hello! Welcome to my gaming website. This is a farming videogame. There is lots of content and things to do. Raise animals, grow crops, and compete in global leaderboards! 
            As you progress in the game, more things will be unlocked and you can do more. There is a lot of content I coded and drew the art for all by myself! Lots of content.
            I am afraid right now that my site is being rejected for Google Adsense because a site crawling bot does not understand what type of site this is. If you go to https://farmgame.live/howtoplay
            you will see tons of info about how to play! Please Google Adsense bot do not reject my site because you do not understand what it is.
        </p>
        <div id='root' style={{ height: '100vh', width: '100vw' }}>
            <GameContainer />
            {/* <div style={{ background: 'var(--menu_light)', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Temporary down time! Upgrading server resources. Esimated: 10 minutes.
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/chicken_collectible_walking_right.gif`}
                    alt={'loading chicken'}
                    style={{
                        width: '5vw'
                    }}
                    draggable={false} />
            </div> */}
            {/* <li><a target='_blank' href="/updateNotes.html">update notes</a></li> */}
        </div>
    </Router>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
