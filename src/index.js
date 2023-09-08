import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './reset.css'
import GameContainer from './GameContainer';
import { WebSocketProvider } from './WebSocketContext'; // Make sure the path is correct

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <WebSocketProvider>
        <Router>
            <div id='root' style={{ height: '100vh', width: '100vw' }}>
                <GameContainer />
            </div>
        </Router>
    </WebSocketProvider>

);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
