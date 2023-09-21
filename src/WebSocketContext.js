import React, { createContext, useContext, useState, useEffect } from "react";

const WebSocketContext = createContext(null);

export function useWebSocket() {
    return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
    const [ws, setWs] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    
    // We need to re-call the initial GameContainer mount functions after receiving guest auth, force a remount by changing the key
    const [auth, setAuth] = useState(1)

    const connectToWebSocketServer = () => {
        let useLocal = true;

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
                console.log("triggering remount due to auth init")
                setAuth(2)
            }
        });

        wsInstance.addEventListener('close', (event) => {
            alert('Connection to game server closed due to idle. Press OK to reconnect.');
            setIsConnected(false);
            connectToWebSocketServer();
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

            const timer = setTimeout(() => {
                ws.removeEventListener('message', listener);
                reject(new Error('Timed out'));
            }, timeout);
        });
    };

    const contextValue = {
        ws,
        isConnected,
        waitForServerResponse
    };

    return (
        <WebSocketContext.Provider value={contextValue} key={auth}>
            {isConnected ? children : null}
        </WebSocketContext.Provider>
    );
}
