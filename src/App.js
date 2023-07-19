import logo from './homie.png';
import './App.css';
import React, { useState } from 'react'

function App() {

  const [response, setResponse] = useState("");
  const [num, setNum] = useState(0);

  let go = async () => {
    let res;

    const token = localStorage.getItem('token');

      try {
        res = await fetch('https://farm-api.azurewebsites.net/api/buyAnimal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }, 
          body: {
            type: 'chicken',
          }
        });
        if (res.ok) {
          const data = await res.json();
          console.log(data)
          setResponse(`data: ${data}`);
        } else {
          console.log("oops")
          setResponse("Error occurred: res not .ok");
        }
        setNum(oldNum => oldNum + 1);
      } catch (error) {
        console.log(error);
        setResponse("Error occurred in try catch");
      }
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
    </div>
  );
}

export default App;
