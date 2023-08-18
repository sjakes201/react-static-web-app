import React, { useEffect, useState } from 'react';
import './CSS/MachinesScreen.css'
import MachineUnit from '../Components/Machines/MachineUnit';
import { useNavigate } from 'react-router-dom';

function MachinesScreen() {
    const navigate = useNavigate();

    const [machines, setMachines] = useState({})
    const [parts, setParts] = useState({})
    const [artisanGoods, setArtisanGoods] = useState({})

    useEffect(() => {
        async function fetchProfile() {
            const token = localStorage.getItem('token');
            sessionStorage.setItem('equipped', '')

            try {
                let data;
                const result = await fetch('http://localhost:7071/api/getAllMachines', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({})
                });
                if (!result.ok) {
                    throw new Error(`HTTP error! status: ${result.status}`);
                } else {
                    data = await result.json();
                    setMachines(data.machinesData)
                    setParts(data.partsData)
                    setArtisanGoods(data.artisanData)
                }
            } catch (error) {
                if (error.message.includes('401')) {
                    console.log("AUTH EXPIRED")
                    localStorage.removeItem('token');
                    navigate('/');
                } else {
                    console.log(error)
                }
            }
        }
        fetchProfile();
    }, [])

    // useEffect(() => {
    //     console.log(machines)
    //     console.log(parts)
    //     console.log(artisanGoods)
    // }, [artisanGoods, machines, parts])


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

                { Object.keys(machines).length !== 0 &&
                    <div id='machineArea'>
                        <div className='machineUnit'> <MachineUnit machineNum={1} machineInfo={{ID: machines.Slot1, level: machines.Slot1Level, produceReceived: machines.Slot1ProduceReceived, startTime: machines.Slot1StartTime}}/></div>
                        <div className='machineUnit'> <MachineUnit machineNum={2} machineInfo={{ID: machines.Slot2, level: machines.Slot2Level, produceReceived: machines.Slot2ProduceReceived, startTime: machines.Slot2StartTime}}/></div>
                        <div className='machineUnit'> <MachineUnit machineNum={3} machineInfo={{ID: machines.Slot3, level: machines.Slot3Level, produceReceived: machines.Slot3ProduceReceived, startTime: machines.Slot3StartTime}}/></div>
                        <div className='machineUnit'> <MachineUnit machineNum={4} machineInfo={{ID: machines.Slot4, level: machines.Slot4Level, produceReceived: machines.Slot4ProduceReceived, startTime: machines.Slot4StartTime}}/></div>
                        <div className='machineUnit'> <MachineUnit machineNum={5} machineInfo={{ID: machines.Slot5, level: machines.Slot5Level, produceReceived: machines.Slot5ProduceReceived, startTime: machines.Slot5StartTime}}/></div>
                        <div className='machineUnit'> <MachineUnit machineNum={6} machineInfo={{ID: machines.Slot6, level: machines.Slot6Level, produceReceived: machines.Slot6ProduceReceived, startTime: machines.Slot6StartTime}}/></div>
                    </div>
                }

            </div>
        </div>
    )

}

export default MachinesScreen;