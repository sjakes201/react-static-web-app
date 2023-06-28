import logo from './homie.png';
import './App.css';
import React, { useState } from 'react'

function App() {

  const [response, setResponse] = useState("")
  const [num, setNum] = useState(0)

  let go = async () => {
    let ressy = await fetch('https://farm-api.azurewebsites.net/api/greetme', {
      method: 'GET', // or 'POST', 'PUT', etc. depending on your function
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // If your function needs a request body, include it here
    }).then((x) => x.text());
    setResponse(ressy)
    setNum( (oldNum) => oldNum + 1);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>{response}</p>
        <p>calls: {num}</p>
        <button onClick={go}>API CALL</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div >
  );
}

export default App;
