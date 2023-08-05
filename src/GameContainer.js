import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InitLoading from './Screens/InitLoading';
import AnimalScreen from './Screens/AnimalScreen';
import PlantScreen from './Screens/PlantScreen';
import ShopScreen from './Screens/ShopScreen';
import MarketScreen from './Screens/MarketScreen';
import LeaderboardScreen from './Screens/LeaderboardScreen'
import AccountScreen from './Screens/AccountScreen';
import PasswordReset from './Screens/PasswordReset';
import HowToPlay from './Screens/HowToPlay';

function GameContainer() {
    return (
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
        </Routes>
    )
}

export default GameContainer;
