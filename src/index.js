import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './reset.css'
import GameContainer from './GameContainer';
import CompLogin from './Components/GUI/CompLogin';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <div id='root' style={{ height: '100vh', width: '100vw' }}>
            <GameContainer />
            {/* <CompLogin /> */}
            {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ backgroundColor: '#FFFACD', width: '100px', height: '100px' }}>#FFFACD</div>
                <div style={{ backgroundColor: '#D2B48C', width: '100px', height: '100px' }}>#D2B48C</div>
                <div style={{ backgroundColor: '#98FB98', width: '100px', height: '100px' }}>#98FB98</div>
                <div style={{ backgroundColor: '#A67C52', width: '100px', height: '100px' }}>#A67C52</div>
                <div style={{ backgroundColor: '#8B4513', width: '100px', height: '100px' }}>#8B4513</div>
                <div style={{ backgroundColor: '#228B22', width: '100px', height: '100px' }}>#228B22</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ backgroundColor: '#B0E0E6', width: '100px', height: '100px' }}>#B0E0E6</div>
                <div style={{ backgroundColor: '#5F9EA0', width: '100px', height: '100px' }}>#5F9EA0</div>
                <div style={{ backgroundColor: '#2F4F4F', width: '100px', height: '100px' }}>#2F4F4F</div>
                <div style={{ backgroundColor: '#CD5C5C', width: '100px', height: '100px' }}>#CD5C5C</div>
                <div style={{ backgroundColor: '#BC8F8F', width: '100px', height: '100px' }}>#BC8F8F</div>
                <div style={{ backgroundColor: '#B0C4DE', width: '100px', height: '100px' }}>#B0C4DE</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ backgroundColor: '#98FF98', width: '100px', height: '100px' }}>#98FF98</div>
                <div style={{ backgroundColor: '#8FBC8F', width: '100px', height: '100px' }}>#8FBC8F</div>
            </div> */}




        </div>
    </Router>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
