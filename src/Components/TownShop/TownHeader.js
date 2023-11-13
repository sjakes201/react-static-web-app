import React from 'react'

function TownHeader() {

    return (
        <div style={{
            width: '100%',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <img
                style={{
                    height: '100%',
                    objectFit: 'fill',
                    marginRight: '-5px'
                }}
                src={`${process.env.PUBLIC_URL}/assets/images/towns/shopHeaderEdge.png`} />
            <div
                style={{
                    flex: '1',
                    position: 'relative',
                    height: '100%'
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
                    fontSize: '2vw'
                }}>
                    TOWN SHOP
                </p>

            </div>
            <img
                style={{
                    height: '100%',
                    objectFit: 'fill',
                    marginLeft: '-5px',
                    transform: 'scaleX(-1)'
                }}
                src={`${process.env.PUBLIC_URL}/assets/images/towns/shopHeaderEdge.png`} />

        </div>
    )
}

export default TownHeader