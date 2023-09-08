import React, { createContext, useContext, useState, useEffect } from "react";

const WebSocketContext = createContext(null);

export function useWebSocket() {
    return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
    const [ws, setWs] = useState(null);
    const [isConnected, setIsConnected] = useState(false); // Track connection status

    // Connect to server
    useEffect(() => {
 
        let useLocal = false;

        const wsInstance = new WebSocket(useLocal ?
            `ws://localhost:8080?token=${localStorage.getItem('token')}`
            :
            `wss://farmgameserver.azurewebsites.net?token=${localStorage.getItem('token')}`
        );


        wsInstance.addEventListener("open", () => {
            console.log("Connected to server");
            setWs(wsInstance);  // Move this line inside the 'open' event callback
            setIsConnected(true); // Update connection status

        });

        wsInstance.addEventListener("message", (event) => {
            const parsedMessage = JSON.parse(event.data);
            if (parsedMessage.type === 'guest_auth' && parsedMessage.token) {
                // Save the new guest token into local storage
                localStorage.setItem('token', parsedMessage.token);

                // Optionally, update your WebSocket connection here to use the new token,
                // depending on how your server and client are configured.
            }
        });


        return () => {
            wsInstance.close();
        };
    }, []);

    const waitForServerResponse = async (action, params = {}, timeout = 10000) => {
        return new Promise((resolve, reject) => {
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                return reject(new Error('WebSocket is not open'));
            }

            // Send the action to the server
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

    // Pass websocket and action functions to children
    const contextValue = {
        ws,
        isConnected,
        waitForServerResponse // you can use this now to wait for server responses
    };

    return (
        <WebSocketContext.Provider value={contextValue}>
            {isConnected ? children : null}
        </WebSocketContext.Provider>
    );
}
