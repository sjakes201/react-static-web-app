function AnimalsTopBar({ setManager }) {

    return (
        <div style={{
            width: '80vw',
            height: '10vh',
            background: 'var(--menu_light)',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
        }}>
            <div style={{
                width: '40%',
                backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/grass1.png), url(${process.env.PUBLIC_URL}/assets/images/grass2.png)`,
                backgroundRepeat: 'repeat, repeat',
                height: '100%'
            }}></div>
            <div style={{
                height: 'calc(100% - 7px)',
                width: '20%',
                objectFit: 'contain',
                boxSizing: 'border-box',
                margin: '0 7px 7px 7px',
                boxShadow: '0 0 0 1px var(--black), 0 0 0 3px var(--border_orange), 0 0 0 5px var(--border_shadow_orange), 0 0 0 7px var(--black)',
                zIndex: '3',
                background: 'var(--menu_light)'
            }}>
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/animal_manage.png`}
                    style={{
                        height: '100%',
                        width: '100%',
                        cursor: 'pointer',
                        objectFit: 'contain'
                    }}
                    onClick={() => setManager(true)}
                />

            </div>
            <div style={{
                width: '40%',
                backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/grass1.png), url(${process.env.PUBLIC_URL}/assets/images/grass2.png)`,
                backgroundRepeat: 'repeat, repeat',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}>
                <div style={{
                    width: '40%', 
                    height: '70%',
                    background: 'var(--menu_light)',
                    border: '2px solid var(--menu_dark)',
                    boxSizing: 'border-box',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    Machines (coming soon)
                </div>

            </div>
        </div>
    )

}

export default AnimalsTopBar;