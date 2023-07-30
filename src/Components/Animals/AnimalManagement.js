import CONSTANTS from '../../CONSTANTS';
import UPGRADES from '../../UPGRADES';
import React, { useState } from 'react';

function AnimalManagement({ coop, setCoop, barn, setBarn, setManager, capacities }) {

    const deleteAnimal = async (AnimalID) => {
        let location;
        if (coop.filter((a) => a.Animal_ID === AnimalID).length > 0) {
            location = 'coop';
            setCoop((old) => {
                return old.filter((animal) => animal.Animal_ID !== AnimalID)
            })
        } else {
            location = 'barn';
            setBarn((old) => {
                return old.filter((animal) => animal.Animal_ID !== AnimalID)
            })
        }
        const token = localStorage.getItem('token');
        await fetch('https://farm-api.azurewebsites.net/api/deleteAnimal', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                AnimalID: AnimalID,
                location: location
            })
        }).then((x) => x.json());
    }

    const createCard = (type, Animal_ID, name) => {
        return (
            <div style={{
                border: '1px solid black',
                width: 'calc(100% - 14px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2%',
                boxSizing: 'border-box',
                margin: '7px',
                boxShadow: '0 0 0 1px var(--black),0 0 0 3px var(--border_yellow),0 0 0 5px var(--border_shadow_yellow),0 0 0 7px var(--black)',
                fontSize: '2vh',
                position: 'relative'
            }}>
                {/* <div style={{
                    position: 'absolute',
                    textAlign: 'center'
                }}>
                    <input
                        style={{
                            width: '80%',
                            border: '1px solid black',
                            borderRadius: '5%',
                        }}>
                    </input>
                </div> */}
                <p style={{ textTransform: 'capitalize' }}>
                    {name === '' ? type : name}
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/change_name.png`}
                        style={{
                            height: '1.2vh',
                            marginLeft: '.2vw',
                            cursor: 'pointer'
                        }}
                        onClick={() => {

                        }}
                    />
                </p>
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/${type}_standing_right.png`}
                    style={{
                        width: '80%',
                    }}
                />
                {/* <p style={{ textAlign: 'center' }}>Makes {produce}</p> */}
                <button style={{ margin: '3%', background: "var(--menu_lighter)", padding: '1.6%', borderRadius: '10%', fontSize: '1.8vh' }} onClick={() => deleteAnimal(Animal_ID)}>Release</button>
            </div>
        )
    }

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
                        return createCard(animal.Animal_type, animal.Animal_ID, animal.Name)
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
                        return createCard(animal.Animal_type, animal.Animal_ID, animal.Name)
                    })}
                </div>
            </div>
        </div>
    )
}

export default AnimalManagement;