import React, { useEffect, useState } from 'react';
import './CSS/MachinesScreen.css'

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
                    <div className='machineUnit'>1</div>
                    <div className='machineUnit'>2</div>
                    <div className='machineUnit'>3</div>
                    <div className='machineUnit'>4</div>
                    <div className='machineUnit'>5</div>
                    <div className='machineUnit'>6</div>
                </div>

            </div>
        </div>
    )

}

export default MachinesScreen;