import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InitLoading from './Screens/InitLoading';
import AnimalScreen from './Screens/AnimalScreen';
import PlantScreen from './Screens/PlantScreen';
import ShopScreen from './Screens/ShopScreen';
import MarketScreen from './Screens/MarketScreen';
import LeaderboardScreen from './Screens/LeaderboardScreen';
import AccountScreen from './Screens/AccountScreen';
import PasswordReset from './Screens/PasswordReset';
import HowToPlay from './Screens/HowToPlay';
import MachinesScreen from './Screens/MachinesScreen';
import GoogleAnalyticsReporter from './GoogleAnalyticsReporter';

import { WebSocketProvider, useWebSocket } from './WebSocketContext'; // Replace with your actual import path

function GameContainer() {
    const { isConnected } = useWebSocket();

    if (!isConnected) {
        // If not connected yet, return a loading or connecting message
        return (
            <div>
                BRO
            </div>
        );
    }

    // If connected, render the main game content
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <GoogleAnalyticsReporter />
            <Routes>
                <Route path="/" element={<InitLoading />} />
                <Route path="/plants" element={<PlantScreen />} />
                <Route path="/animals" element={<AnimalScreen />} />
                <Route path="/shop" element={<ShopScreen />} />
                <Route path="/market" element={<MarketScreen />} />
                <Route path="/leaderboard" element={<LeaderboardScreen />} />
                <Route path="/account" element={<AccountScreen />} />
                <Route path="/passwordReset" element={<PasswordReset />} />
                <Route path="/howtoplay" element={<HowToPlay />} />
                <Route path="/machines" element={<MachinesScreen />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <WebSocketProvider>
            <GameContainer />
        </WebSocketProvider>
    );
}

export default App;
