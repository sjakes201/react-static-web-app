import React from 'react'

function TownHeader() {

    return (
        <div style={{
            width: '100%',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                width: 'calc(100% - 8px)',
                height: '95%',
                left: '4px',
                top: '2.5%',
                zIndex: '2'
            }}
                className='woodBackground'
            >

            </div>
            <img
                style={{
                    height: '100%',
                    objectFit: 'fill',
                    zIndex: '3'
                    // marginRight: '-5px'
                }}
                src={`${process.env.PUBLIC_URL}/assets/images/towns/shopHeaderEdge.png`} />
            <div
                style={{
                    flex: '1',
                    position: 'relative',
                    height: '100%',
                    zIndex: '3'
                }}>
                <img
                    style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'fill',
                    }}
                    src={`${process.env.PUBLIC_URL}/assets/images/towns/shopHeaderInner.png`} />
                <p style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: '0',
                    left: '0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <span
                        className='brown-border-small'
                        style={{
                            padding: '0 0.55vw',
                            backgroundColor: 'var(--menu_light)',
                            fontSize: '1.7vw'
                        }}
                    >
                        TOWN SHOP
                    </span>
                </p>

            </div>
            <img
                style={{
                    height: '100%',
                    objectFit: 'fill',
                    // marginLeft: '-5px',
                    transform: 'scaleX(-1)',
                    zIndex: '3'
                }}
                src={`${process.env.PUBLIC_URL}/assets/images/towns/shopHeaderEdge.png`} />

        </div>
    )
}

export default TownHeader