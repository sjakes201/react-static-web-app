import React from 'react';
import ReactDOM from 'react-dom/client';
import Test from './Test';
import './reset.css'
import GameContainer from './GameContainer';

import CompLogin from './Components/GUI/CompLogin';


/*
 Limited initialization
*/
sessionStorage.setItem("equipped", "");


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <div id='root' style={{height: '100vh', width: '100vw'}}>
        {/* <LoginForm />
        <RegistrationForm />
        <Show_id /> 
        <Test />  */}
        <GameContainer/>
        <CompLogin />
      </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
