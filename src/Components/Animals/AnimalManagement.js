import CONSTANTS from '../../CONSTANTS';
import UPGRADES from '../../UPGRADES';
import React, { useState } from 'react';
import AnimalCard from './AnimalCard';

function AnimalManagement({ coop, setCoop, barn, setBarn, setManager, capacities }) {

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            background: 'var(--menu_light)',
            boxSizing: 'border-box',
            boxShadow: '0 0 0 3px var(--black),0 0 0 6px var(--border_yellow),0 0 0 8px var(--border_shadow_yellow),0 0 0 11px var(--black)',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: '2.2%',
                right: '2.2%',
                cursor: 'pointer',
            }}
                onClick={
                    () => setManager(false)
                }
            >
                X
            </div>
            <div style={{
                width: '50%',
                borderRight: '1px solid black',
                overflowY: 'auto',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gridAutoRows: 'auto',
                    columnGap: '5%',
                    rowGap: '20px',  // or use any other fixed size as per your requirement
                    padding: '2.5%',
                }}>
                    <div style={{
                        gridColumn: '1 / 4',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid black',
                        margin: '0.5%'
                    }}>
                        <h4>Barn Management</h4>
                        <p>Capacity: {barn.length} / {capacities.barnCapacity}</p>
                    </div>

                    {barn.map((animal) => {
                        return <AnimalCard key={animal.Animal_ID} animal={animal} coop={coop} setCoop={setCoop} setBarn={setBarn} />
                    })}
                </div>
            </div>

            <div style={{
                width: '50%',
                borderRight: '1px solid black',
                overflowY: 'auto',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gridAutoRows: 'auto',
                    columnGap: '5%',
                    rowGap: '20px',  // or use any other fixed size as per your requirement
                    padding: '2.5%',
                }}>
                    <div style={{
                        gridColumn: '1 / 4',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid black',
                        margin: '0.5%'
                    }}>
                        <h4>Coop Management</h4>
                        <p>Capacity: {coop.length} / {capacities.coopCapacity}</p>
                    </div>

                    {coop.map((animal) => {
                        return <AnimalCard key={animal.Animal_ID} animal={animal} coop={coop} setCoop={setCoop} setBarn={setBarn} />
                    })}
                </div>
            </div>
        </div>
    )
}

export default AnimalManagement;