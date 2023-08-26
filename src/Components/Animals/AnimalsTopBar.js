import { useNavigate } from 'react-router-dom';

function AnimalsTopBar({ setManager }) {
    const navigate = useNavigate();


    return (
        <div style={{
            width: '80vw',
            height: '10vh',
            background: 'var(--menu_light)',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            borderBottom: '1px solid black'
        }}>
            <div style={{
                width: '75%',
                backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/grass1.png), url(${process.env.PUBLIC_URL}/assets/images/grass2.png)`,
                backgroundRepeat: 'repeat, repeat',
                height: '100%'
            }}>
                {/* <div style={{ position: 'relative', background: 'orange', width: '970px', height: '90px', zIndex: '20000' }}>
                   728px x 90px
                </div> */}
            </div>
            <div style={{
                height: 'calc(100% - 7px)',
                objectFit: 'contain',
                boxSizing: 'border-box',
                boxShadow: '0 0 0 1px var(--black), 0 0 0 3px var(--border_orange), 0 0 0 5px var(--border_shadow_orange), 0 0 0 7px var(--black)',
                zIndex: '3',
                background: 'var(--menu_light)',
                padding: '0 1%',
                width: '15%',
                display: 'flex',
                alignItems: 'flex-end'
            }}>
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/animal_manage.png`}
                    style={{
                        width: '100%',
                        maxHeight: '100%',
                        cursor: 'pointer',
                        objectFit: 'contain'
                    }}
                    onClick={() => setManager(true)}
                />

            </div>
            <div style={{
                width: '10%',
                backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/grass1.png), url(${process.env.PUBLIC_URL}/assets/images/grass2.png)`,
                backgroundRepeat: 'repeat, repeat',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}>
                <div style={{
                    height: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    width: '20%'
                }}
                    onClick={() => navigate('/machines')}
                >
                    <img src={`${process.env.PUBLIC_URL}/assets/images/machines/deskClickable.png`} style={{ height: '100%', objectFit: 'contain' }} />
                </div>

            </div>
        </div>
    )

}

export default AnimalsTopBar;