import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './reset.css'
import GameContainer from './GameContainer';
import Complogin from './Components/GUI/CompLogin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <div id='root' style={{ height: '100vh', width: '100vw' }}>
            <GameContainer />
            {/* <Complogin /> */}
        </div>
    </Router>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
