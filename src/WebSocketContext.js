import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import InitLoading from "./Screens/InitLoading";

const WebSocketContext = createContext(null);

export function useWebSocket() {
    return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
    const [ws, setWs] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const [doneLoading, setDoneLoading] = useState(false)

    const listenersRef = useRef([]);

    // We need to re-call the initial GameContainer mount functions after receiving guest auth, force a remount by changing the key
    const [auth, setAuth] = useState(1)

    const connectToWebSocketServer = () => {
        let useLocal = false;

        const wsInstance = new WebSocket(useLocal ?
            `ws://localhost:8080?token=${localStorage.getItem('token')}`
            :
            `wss://farmgameserver.azurewebsites.net?token=${localStorage.getItem('token')}`
        );

        wsInstance.addEventListener("open", () => {
            console.log("Connected to server");
            setWs(wsInstance);
            setIsConnected(true);
        });

        wsInstance.addEventListener("message", (event) => {
            const parsedMessage = JSON.parse(event.data);
            if (parsedMessage.type === 'guest_auth' && parsedMessage.token) {
                localStorage.setItem('token', parsedMessage.token);
                setAuth(2)
            } else if (parsedMessage.type === 'town_message') {
                const msgInfo = parsedMessage.newMessageInfo;
                console.log(msgInfo)
                listenersRef.current.forEach(listenerFunc => listenerFunc(msgInfo.content, msgInfo.timestamp, msgInfo.username, msgInfo.messageID));
            }
        });

        wsInstance.addEventListener('close', (event) => {
            console.log(event)
            setIsConnected(false);
            alert('Connection to game server closed. Press OK or refresh reconnect.');
            // connectToWebSocketServer();
            window.location.reload(false);


        });
    };

    useEffect(() => {
        connectToWebSocketServer();
    }, []);

    const waitForServerResponse = async (action, params = {}, timeout = 10000) => {
        return new Promise((resolve, reject) => {
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                return reject(new Error('WebSocket is not open'));
            }

            const timer = setTimeout(() => {
                ws.removeEventListener('message', listener);
                reject(new Error(`Timed out ${action}`));
            }, timeout);

            ws.send(JSON.stringify({ action, ...params }));

            const listener = (event) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData.action === action) {
                    ws.removeEventListener('message', listener);
                    clearTimeout(timer);
                    resolve(parsedData);
                }
            };
            ws.addEventListener('message', listener);
        });
    };

    const addListener = (callback) => {
        listenersRef.current = [...listenersRef.current, callback];
    };
    
    const removeListener = (callback) => {
        listenersRef.current = listenersRef.current.filter(listener => listener !== callback);
    };
    

    const contextValue = {
        ws,
        isConnected,
        waitForServerResponse,
        addListener,
        removeListener
    };

    return (
        <WebSocketContext.Provider value={contextValue} key={auth}>
            {isConnected && doneLoading ? children : <InitLoading setDoneLoading={setDoneLoading} />}
        </WebSocketContext.Provider>
    );
}
