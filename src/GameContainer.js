import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AnimalScreen from './Screens/AnimalScreen';
import PlantScreen from './Screens/PlantScreen';
import ShopScreen from './Screens/ShopScreen';
import MarketScreen from './Screens/MarketScreen';
import LeaderboardScreen from './Screens/LeaderboardScreen'

function GameContainer() {
    return (
        <Routes>
            <Route path="/" element={<PlantScreen />} />
            <Route path="/plants" element={<PlantScreen />} />
            <Route path="/animals" element={<AnimalScreen />} />
            <Route path="/shop" element={<ShopScreen />} />
            <Route path="/market" element={<MarketScreen />} />
            <Route path="/leaderboard" element={<LeaderboardScreen />} />
        </Routes>
    )
}

export default GameContainer;
