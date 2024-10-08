import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import InitLoading from "./Screens/InitLoading";

const WebSocketContext = createContext(null);

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [banScreen, setBanScreen] = useState(false);

  const [doneLoading, setDoneLoading] = useState(false);

  const listenersRef = useRef([]);
  // We need to re-call the initial GameContainer mount functions after receiving guest auth, force a remount by changing the value
  const [auth, setAuth] = useState(1);

  const connectToWebSocketServer = () => {
    let useLocal = false;
    if (process.env.NODE_ENV !== 'development') {
      useLocal = false;
    }

    const wsInstance = new WebSocket(
      useLocal
        ? `ws://localhost:8080?token=${localStorage.getItem("token")}`
        : `wss://farmgameserver.azurewebsites.net?token=${localStorage.getItem(
          "token",
        )}`,
    );

    wsInstance.addEventListener("open", () => {
      console.log("Connected to server");
      setWs(wsInstance);
      setIsConnected(true);
    });

    wsInstance.addEventListener("message", (event) => {
      const parsedMessage = JSON.parse(event.data);
      if (parsedMessage.type === "guest_auth" && parsedMessage.token) {
        localStorage.setItem("token", parsedMessage.token);
        setAuth(2);
      } else if (parsedMessage.type === "town_message") {
        const msgInfo = parsedMessage.newMessageInfo;
        listenersRef.current.forEach((listener) => {
          if (listener[0] === 'town_message') {
            const func = listener[1];
            func(
              msgInfo.content,
              msgInfo.timestamp,
              msgInfo.username,
              msgInfo.messageID,
              msgInfo.Type,
              msgInfo.requestID,
            );
          }
        }

        );
      } else if (parsedMessage.type === 'data_update') {
        switch (parsedMessage.dataType) {
          case 'animal_was_fed':
            listenersRef.current.forEach((listener) => {
              if (listener[0] === 'animal_happiness') {
                const func = listener[1];
                func(
                  parsedMessage.data.Animal_ID,
                  parsedMessage.data.Happiness
                );
              }
            })
            break;
          case 'TOWN_JOIN_RESOLVE':
            listenersRef.current.forEach((listener) => {
              if (listener[0] === 'TOWN_JOIN_RESOLVE') {
                const func = listener[1];
                func(
                  parsedMessage.data.requestID,
                  parsedMessage.data.isAccepted
                );
              }
            })
            break;
          case 'TOWN_CHANGE':
            listenersRef.current.forEach((listener) => {
              if (listener[0] === 'TOWN_CHANGE') {
                const func = listener[1];
                func();
              }
            })
            break;
          case 'NEW_BOOST':
            listenersRef.current.forEach((listener) => {
              if (listener[0] === 'NEW_BOOST') {
                const func = listener[1];
                func();
              }
            })
            break;
          default:
            break;
        }
      }
    });

    wsInstance.addEventListener("close", (event) => {
      console.log(event);
      setIsConnected(false);
      // Assuming 4001 is the close code for 'Banned IP'
      if (event.code === 4001) {
        setBanScreen(true)
        alert("You have been disconnected due to an IP ban. Please contact support if you believe this is an error.");
        localStorage.setItem("b", Date.now())
        // Optionally, disable the reconnect function or redirect the user
      } else {
        alert("Connection to game server closed. Refresh the page to reconnect.");
        window.location.reload();
      }
    });


  };

  const closeWebSocket = () => {
    if (ws) {
      ws.close();
      setWs(null);
      setIsConnected(false)
    }
  };

  useEffect(() => {
    connectToWebSocketServer();
  }, []);

  const waitForServerResponse = async (
    action,
    params = {},
    timeout = 10000,
  ) => {
    return new Promise((resolve, reject) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return reject(new Error("WebSocket is not open"));
      }
      const MESSAGE_ID = Math.floor(Math.random() * 1000000000);

      const timer = setTimeout(() => {
        ws.removeEventListener("message", listener);
        reject(new Error(`Timed out ${action}`));
        // console.log("TIMED OUT. CLOSING")
        // closeWebSocket();
        // console.log("TIMED OUT. CONNECTING")
        // setTimeout(() => connectToWebSocketServer(), 1000)
      }, timeout);

      ws.send(JSON.stringify({ action, MESSAGE_ID, ...params }));

      const listener = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.action === action && parsedData.MESSAGE_ID === MESSAGE_ID) {
          ws.removeEventListener("message", listener);
          clearTimeout(timer);
          resolve(parsedData);
        }
      };
      ws.addEventListener("message", listener);
    });
  };

  const addListener = (callback) => {
    listenersRef.current = [...listenersRef.current, callback];
  };

  const removeListener = (name) => {
    listenersRef.current = listenersRef.current.filter(
      (listener) => listener[0] !== name,
    );
  };

  const contextValue = {
    ws,
    isConnected,
    waitForServerResponse,
    addListener,
    removeListener,

  };

  if (banScreen) { return (<InitLoading banScreen={true} />) }

  return (
    <WebSocketContext.Provider value={contextValue} key={auth}>
      {isConnected && doneLoading ? (
        children
      ) : (
        <InitLoading setDoneLoading={setDoneLoading} />
      )}
    </WebSocketContext.Provider>
  );
}
