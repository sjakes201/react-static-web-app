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
import MachinesScreen from './Screens/MachinesScreen';
import GoogleAnalyticsReporter from './GoogleAnalyticsReporter';


function GameContainer() {
    return (
        <div style={{width: '100vw', height: '100vh'}}>
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
                {/* <Route path="/machines" element={<MachinesScreen />} /> */}
            </Routes>
        </div>
    );
}


export default GameContainer;
