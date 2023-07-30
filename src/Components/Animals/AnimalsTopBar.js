

function AnimalsTopBar({ setManager }) {

    return (
        <div style={{
            width: '80vw',
            height: '10vh',
            background: 'grey',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
        }}>
            <div>AD1</div>
            <div style={{
                width: '30%',
                border: '1px solid black',
                objectFit: 'contain'
            }}>
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/animal_manage.png`}
                    style={{
                        width: '100%',
                        cursor: 'pointer'
                    }}
                    onClick={() => setManager(true)}
                />

            </div>
            <div>AD2</div>
        </div>
    )

}

export default AnimalsTopBar;