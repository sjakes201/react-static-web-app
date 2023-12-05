import ReactDOM from "react-dom/client";
import ReactGA from "react-ga";
import { BrowserRouter as Router } from "react-router-dom";
import "./reset.css";
import "./common.css"
import { CreateGameContainer } from "./GameContainer";
import { WebSocketProvider } from "./WebSocketContext"; // Make sure the path is correct
import React from "react";
import { Ramp } from "@playwire/pw-react-component";


ReactGA.initialize("G-SW9XV2PGLR");

const root = ReactDOM.createRoot(document.getElementById("root"));

// Check if the current path is the Playwire test path
if (window.location.pathname === '/playwiretest') {
  window.loadedTestPageScripts = true;
  window.history.pushState({}, '', '/');
  root.render(
    <WebSocketProvider>
      <Ramp
        publisherId="1025126"
        id="74677"
      />
      <Router>
        <div id="root" style={{ height: "100vh", width: "100vw" }}>
          {CreateGameContainer()}
        </div>
      </Router>
    </WebSocketProvider>
  );
} else {
  root.render(
    <WebSocketProvider>
      <Router>
        <div id="root" style={{ height: "100vh", width: "100vw" }}>
          {CreateGameContainer()}
        </div>
      </Router>
    </WebSocketProvider>
  );
}




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
