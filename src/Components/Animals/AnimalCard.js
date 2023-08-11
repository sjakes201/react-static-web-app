import React, { useState } from 'react'

function AnimalCard({ animal, coop, setCoop, setBarn }) {

    const type = animal.Animal_type;
    const Animal_ID = animal.Animal_ID;
    const name = animal.Name;

    const [newName, setNewName] = useState('');
    const [renameAppear, setRenameAppear] = useState(false);

    const handleRename = async (e) => {
        e.preventDefault();
        setRenameAppear(false);

        const token = localStorage.getItem('token');
        if (coop.filter((a) => a.Animal_ID === Animal_ID).length > 0) {
            // is coop animal
            setCoop((old) => {
                return old.map((animal) => {
                    if (animal.Animal_ID === Animal_ID) {
                        let newAnimal = { ...animal };
                        newAnimal.Name = newName;
                        return newAnimal;
                    } else {
                        return animal;
                    }
                })
            })
        } else {
            // is barn animal
            setBarn((old) => {
                return old.map((animal) => {
                    if (animal.Animal_ID === Animal_ID) {
                        let newAnimal = { ...animal };
                        newAnimal.Name = newName;
                        return newAnimal;
                    } else {
                        return animal;
                    }
                })
            })
        }
        await fetch('https://farm-api.azurewebsites.net/api/nameAnimal', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: newName,
                Animal_ID: Animal_ID
            })
        })
        // call rename
        console.log(`New name: ${newName}`)
        setNewName('')
    }

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
        await fetch('http://localhost:7071/api/deleteAnimal', {
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
            {renameAppear &&
                <div style={{
                    position: 'absolute',
                    textAlign: 'center',
                    top: '20%',
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <form
                        onSubmit={handleRename}
                        style={{
                            border: '2px solid black',
                            background: 'var(--menu_lighter)',
                        }}
                    >
                        <label>
                            New Name:
                            <input
                                style={{
                                    width: '80%',
                                    border: '1px solid black',
                                    borderRadius: '5%',
                                }}
                                maxLength={10}
                                type='text'
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            >
                            </input>
                        </label>
                        <button
                            type='submit'
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer'
                            }}>
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/images/write.png`}
                                style={{
                                    width: '16px'
                                }}
                                alt={'submit'}
                            />
                        </button>
                    </form>
                </div>
            }
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
                        setRenameAppear((old) => !old)
                    }}
                    alt={'animal rename prompt button'}
                />
            </p>
            <img
                src={`${process.env.PUBLIC_URL}/assets/images/${type}_standing_right.png`}
                style={{
                    width: '80%',
                }}
                alt={'animal icon'}
            />
            {/* <p style={{ textAlign: 'center' }}>Makes {produce}</p> */}
            <button style={{ margin: '3%', background: "var(--menu_lighter)", padding: '1.6%', borderRadius: '10%', fontSize: '1.8vh' }} onClick={() => deleteAnimal(Animal_ID)}>Release</button>
        </div>
    )
}

export default AnimalCard;