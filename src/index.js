import ReactDOM from "react-dom/client";
import ReactGA from "react-ga";
import { BrowserRouter as Router } from "react-router-dom";
import "./reset.css";
import { CreateGameContainer } from "./GameContainer";
import { WebSocketProvider } from "./WebSocketContext"; // Make sure the path is correct
import React from "react";

ReactGA.initialize("G-SW9XV2PGLR");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <WebSocketProvider>
    <Router>
      <div id="root" style={{ height: "100vh", width: "100vw" }}>
        {CreateGameContainer()}
      </div>
    </Router>
  </WebSocketProvider>,
  // <div
  //     style={{
  //         width: '100vw',
  //         height: '100vh',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         backgroundColor: 'beige'
  //     }}>
  //     <img
  //         src={`${process.env.PUBLIC_URL}/assets/images/chicken_collectible_walking_right.gif`}
  //         alt={'loading chicken'}
  //         style={{
  //             width: '5vw'
  //         }}
  //         draggable={false} />
  //     <p>(10:50PM EST) Downtime for towns update! Estimated: 20 minutes</p>
  // </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
