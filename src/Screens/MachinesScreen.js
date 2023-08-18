import React, { useEffect, useState } from 'react';
import './CSS/MachinesScreen.css'
import MachineUnit from '../Components/Machines/MachineUnit';

function MachinesScreen() {


    return (
        <div className='machineScreen'>
            <div className='machineGrid'>
                <div id='backArrow'>
                    ARROW
                </div>

                <div id='placeholderMachine'>
                    PLACEHOLDER
                </div>

                <div id='machineShop'>
                    MACHINE SHOP
                </div>

                <div id='machineInventory'>

                </div>

                <div id='machineArea'>
                    <div className='machineUnit'> <MachineUnit /></div>
                    <div className='machineUnit'> <MachineUnit /></div>
                    <div className='machineUnit'> <MachineUnit /></div>
                    <div className='machineUnit'> <MachineUnit /></div>
                    <div className='machineUnit'> <MachineUnit /></div>
                    <div className='machineUnit'> <MachineUnit /></div>
                </div>

            </div>
        </div>
    )

}

export default MachinesScreen;